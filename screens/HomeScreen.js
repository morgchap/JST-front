import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function HomeScreen({ navigation }) {
  const [ratings, setRatings] = useState([]); // Pour stocker les avis des amis
  const [publicRating, setPublicRatings] = useState([]); // pour stocker tous les avis
  const user = useSelector((state) => state.user.value); // Récupérer l'utilisateur actuel depuis Redux
  const [refreshing, setRefreshing] = React.useState(false); // rafraichir la page au scroll vers le bas 
  const [search, setSearch] = useState("Friends"); // style conditionnel des boutons
  const [comment, setComment] = useState({}); // 
  const [displayedCommentId, setDisplayedCommentId] = useState(null); // track les commentaires qui sont affichés
  const [ratingsCom, setRatingsCom] = useState({}); // stock les commentaires de chaques ratings avec un key 
  const [commentStyles, setCommentStyle] = useState({}); // style conditionnels de l'icon commentaire

  // fetch everytime the screen is being refreshed
  useEffect(() => {
    if (!refreshing) {
      if (user.username) {
        fetchFriendsReviews();
      }
      fetchAll();

      fetch;
    }
  }, [refreshing]);

  // store comments and what ratings they are linked to
  const handleCommentChange = (reviewId, text) => {
    setComment((prev) => ({ ...prev, [reviewId]: text }));
  };
  // changing the icon depending on if the comment are being displayed or not
  const toggleCommentIcon = (reviewId) => {
    setCommentStyle((prevStyles) => ({
      ...prevStyles,
      [reviewId]:
        prevStyles[reviewId] === "window-close" ? "comment" : "window-close",
    }));
  };

  function likeOrDislikeAReview(reviewId) {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/likeOrDislikeAReview`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratingId: reviewId,
          userId: user.userId,
        }),
      }
    )
      .then((r) => r.json())
      .then((d) => console.log(d))
      .then(() => {
        fetchFriendsReviews();
        fetchAll();
      });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // fetch friends review for the friends newsfeed
  function fetchFriendsReviews() {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/friendsreview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username }),
    })
      .then((response) => response.json())
      .then((data) => setRatings(data.ratings));
  }
  // fetch all reviews for the public newsfeed
  function fetchAll() {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/all`)
      .then((response) => response.json())
      .then((data) => setPublicRatings(data.ratings));
  }

  
  // Fonction pour afficher les étoiles en fonction de la note
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name="star"
          size={20}
          color={i < rating ? "#FFD700" : "#FFFFFF"}
        />
      );
    }
    return stars;
  };
// function called when writing a comment
  const handleCommentSubmit = async (ratingsId) => {
    const commentContent = comment[ratingsId];
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/comments/newCom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        content: commentContent,
        ratings: ratingsId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setComment((prev) => ({ ...prev, [ratingsId]: "" }));
        }
      });
  };

  const handleCommentDisplay = async (reviewId) => {
    setCommentStyle((prevStyles) => ({
      ...prevStyles,
      [reviewId]:
        prevStyles[reviewId] === "window-close" ? "comment" : "window-close",
    }));
    if (displayedCommentId === reviewId) {
      // Hide comments if already displayed
      setDisplayedCommentId(null);
      return;
    }

    // Show comments for the clicked rating
    setDisplayedCommentId(reviewId);
    // Fetch comments only if not already fetched
    if (!ratingsCom[reviewId]) {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/comments/byratings/${reviewId}`
        );
        const data = await response.json();

        if (data && data.comment) {
          setRatingsCom((prev) => ({
            ...prev,
            [reviewId]: data.comment, // Store fetched comments for this rating
          }));
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const renderComments = (reviewId) => {
    const comments = ratingsCom[reviewId] || [];
    return comments.map((e, index) => (
      <View key={index} style={styles.commentContainer}>
        <View style={styles.commentCont}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Friend", { friendName: e.username });
            }}
          >
            <Image style={styles.avatar} source={{ uri: e.profilePic }} />
          </TouchableOpacity>
          <View>
            <Text style={styles.userName}>@{e.username}</Text>
            <Text>{e.content}</Text>
          </View>
        </View>
      </View>
    ));
  };

  let ratingsNewsFeed;
// handling button's style
  if (search === "Friends" && user.username) {
    ratingsNewsFeed = ratings.map((review, i) => {
      let fpp = (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Friend", { friendName: review.username });
          }}
        >
          <Image
            style={styles.avatar}
            source={require("../assets/avatar.png")}
          />
        </TouchableOpacity>
      );

      if (review.profilePicture) {
        fpp = (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Friend", { friendName: review.username });
            }}
          >
            <Image
              style={styles.avatar}
              source={{ uri: review.profilePicture }}
            />
            ;
          </TouchableOpacity>
        );
      }

      const isLiked = review.likesCounter.includes(user.userId)
        ? "heart"
        : "heart-o";

      return (
        <View key={i}>
          <View style={styles.ratingContainerPublic}>
            <View style={styles.ratingContent}>
              <View style={styles.userInfoContainer}>
                <>{fpp}</>
                <View style={styles.userInfo}>
                  <View style={styles.userandlike}>
                    <Text style={styles.userName}>@{review.username}</Text>
                    <View style={styles.heartAndlikeCounter}>
                      <FontAwesome
                        name={commentStyles[review._id] || "comment"}
                        style={styles.comIconPurple}
                        size={20}
                        onPress={() => {
                          toggleCommentIcon(review._id);
                          handleCommentDisplay(review._id);
                        }}
                      />
                      <FontAwesome
                        name={isLiked}
                        style={styles.heartIcon}
                        size={20}
                        onPress={() => likeOrDislikeAReview(review._id)}
                      />
                      <Text>({review.likesCounter.length})</Text>
                    </View>
                  </View>
                  <View style={styles.starsContainer}>
                    <>{renderStars(review.note)}</>
                    <Text style={styles.textNote}>{review.note}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.gameReviewContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Games", { gameName: review.gameName });
                  }}
                >
                  <Image
                    style={styles.gameCover}
                    source={{ uri: review.gameCover }}
                  />
                </TouchableOpacity>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewGameTitle}>{review.gameName}</Text>
                  <Text style={styles.reviewText}>{review.writtenOpinion}</Text>
                </View>
              </View>
            </View>
            <ScrollView style={styles.reviewcont}>
              <View style={styles.reviewinputcont}>
                <TextInput
                  key={i}
                  style={styles.reviewinput}
                  placeholder="Comment"
                  placeholderTextColor={"grey"}
                  maxLength={100}
                  multiline={true}
                  enterKeyHint="return"
                  onChangeText={(value) =>
                    handleCommentChange(review._id, value)
                  }
                  value={comment[review._id] || ""}
                ></TextInput>
                <FontAwesome
                  name="paper-plane"
                  style={styles.sendIcon}
                  size={20}
                  onPress={() => handleCommentSubmit(review._id)}
                />
              </View>
            </ScrollView>
          </View>
          {displayedCommentId === review._id && (
            <View style={styles.commentsSection}>
              {renderComments(review._id)}
            </View>
          )}
        </View>
      );
    });
  } else {
    ratingsNewsFeed = publicRating.map((review, i) => {
      const isLiked = review.likesCounter.includes(user.userId)
        ? "heart"
        : "heart-o";

      let likable;
      let commentable;

      if (user.token) {
        likable = (
          <View style={styles.heartAndlikeCounter}>
            <FontAwesome
              name={commentStyles[review._id] || "comment"}
              style={styles.comIcon}
              size={20}
              onPress={() => {
                toggleCommentIcon(review._id);
                handleCommentDisplay(review._id);
              }}
            />
            <FontAwesome
              key={i}
              name={isLiked}
              style={styles.heartIcon}
              size={20}
              onPress={() => likeOrDislikeAReview(review._id)}
            />
            <Text>({review.likesCounter.length})</Text>
          </View>
        );

        commentable = (
          <View style={styles.reviewinputcont}>
            <TextInput
              key={i}
              style={styles.reviewinput}
              placeholder="Comment"
              placeholderTextColor={"grey"}
              maxLength={100}
              multiline={true}
              enterKeyHint="return"
              onChangeText={(value) => handleCommentChange(review._id, value)}
              value={comment[review._id] || ""}
            ></TextInput>
            <FontAwesome
              name="paper-plane"
              style={styles.sendIcon}
              size={20}
              onPress={() => handleCommentSubmit(review._id)}
            />
          </View>
        );
      }

      let fpp = (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Friend", { friendName: review.username });
          }}
        >
          <Image
            style={styles.avatar}
            source={require("../assets/avatar.png")}
          />
        </TouchableOpacity>
      );

      if (review.profilePicture) {
        fpp = (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Friend", { friendName: review.username });
            }}
          >
            <Image
              style={styles.avatar}
              source={{ uri: review.profilePicture }}
            />
            ;
          </TouchableOpacity>
        );
      }

      return (
        <View key={i}>
          <View style={styles.ratingContainerPublic}>
            <View style={styles.ratingContent}>
              <View style={styles.userInfoContainer}>
                {fpp}

                <View style={styles.userInfo}>
                  <View style={styles.userandlike}>
                    <Text style={styles.userName}>@{review.username}</Text>
                    <View style={styles.heartAndlikeCounter}>
                      <FontAwesome
                        name={commentStyles[review._id] || "comment"}
                        style={styles.comIcon}
                        size={20}
                        onPress={() => {
                          toggleCommentIcon(review._id);
                          handleCommentDisplay(review._id);
                        }}
                      />
                      <FontAwesome
                        key={i}
                        name={isLiked}
                        style={styles.heartIcon}
                        size={20}
                        onPress={() => likeOrDislikeAReview(review._id)}
                      />
                      <Text>({review.likesCounter.length})</Text>
                    </View>
                  </View>
                  <View style={styles.starsContainer}>
                    <>{renderStars(review.note)}</>
                    <Text style={styles.textNote}>{review.note}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.gameReviewContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Games", { gameName: review.gameName });
                  }}
                >
                  <Image
                    style={styles.gameCover}
                    source={{ uri: review.gameCover }}
                  />
                </TouchableOpacity>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewGameTitle}>{review.gameName}</Text>
                  <Text style={styles.reviewText}>{review.writtenOpinion}</Text>
                </View>
              </View>
            </View>
            <ScrollView style={styles.reviewcont}>{commentable}</ScrollView>
          </View>
          {displayedCommentId === review._id && (
            <View style={styles.commentsSection}>
              {renderComments(review._id)}
            </View>
          )}
        </View>
      );
    });
  }

  let newsfeed;
  let bgcolor;

  if (search === "Friends" && user.username) {
    bgcolor = styles.bg2;

    newsfeed = (
      <View style={styles.searchcont}>
        <TouchableOpacity
          style={styles.searchOff}
          onPress={() => setSearch("Public")}
        >
          <Text>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchOn}
          onPress={() => setSearch("Friends")}
        >
          <Text>Friends</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (search === "Public" && user.username) {
    bgcolor = styles.bg;
    newsfeed = (
      <View style={styles.searchcont}>
        <TouchableOpacity
          style={styles.searchOnPublic}
          onPress={() => setSearch("Public")}
        >
          <Text>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchOff}
          onPress={() => setSearch("Friends")}
        >
          <Text>Friends</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    bgcolor = styles.bg;
  }

  return (
    <View style={bgcolor}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            {newsfeed}
            {ratingsNewsFeed.reverse()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  image: { flex: 1, width: "100%", height: "100%" },
  headerContainer: { alignItems: "center", marginVertical: 20 },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#7A28CB" },
  titleUnderline: {
    width: "50%",
    height: 2,
    backgroundColor: "#7A28CB",
    marginTop: 5,
  },
  ratingsContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  ratingContainer: {
    backgroundColor: "#D6CBFD",
    borderRadius: 5,
    padding: 20,
    margin: 20,
  },
  timestamp: { fontSize: 12, color: "#888", marginBottom: 10 },
  ratingContainerPublic: {
    backgroundColor: "rgba(255,255,255,0.5) ",
    borderRadius: 5,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
  },
  ratingContent: { flexDirection: "column" },
  userInfoContainer: { flexDirection: "row", marginBottom: 10 },
  avatar: { width: 60, height: 60, borderRadius: 50, marginRight: 10 },
  userInfo: { flex: 1, justifyContent: "center" },
  userName: { fontWeight: "bold" },
  starsContainer: { flexDirection: "row", marginTop: 5 },
  textNote: { marginLeft: 10, fontWeight: "bold" },

  gameReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  gameCover: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  reviewGameTitle: { fontSize: 15, color: "black", fontWeight: "bold" },
  reviewText: { flex: 1, fontSize: 13, color: "black", marginRight: 20 },
  reviewContent: { width: "80%" },
  searchOn: {
    backgroundColor: "#D6CBFD",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: "40%",
    borderWidth: 1,
    borderColor: "#7A28CB",
    alignItems: "center",
  },
  searchOff: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    opacity: 0.5,
  },
  searchcont: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  searchOnPublic: {
    backgroundColor: "#D4FDC6",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: "40%",
    borderWidth: 1,
    borderColor: "#33CA7F",
    alignItems: "center",
  },
  heartIcon: {
    color: "red",
    paddingRight: 2,
    padding: 3,
  },
  comIcon: {
    color: "#33CA7F",
    paddingRight: 6,
    padding: 3,
  },
  comIconPurple: {
    color: "#7A28CB",
    paddingRight: 6,
    padding: 3,
  },
  sendIcon: {
    color: "black",
    paddingRight: 6,
    padding: 3,
  },
  userandlike: {
    width: 250,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heartAndlikeCounter: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  counter: {
    padding: 3,
  },
  bg: {
    flex: 1,
    backgroundColor: "#ace1af",
  },
  bg2: {
    flex: 1,
    backgroundColor: "#cdc6ff",
  },
  modalContainer3: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "space-between",
    maxHeight: 300,
  },
  backbutton: {
    width: "10%",
    marginLeft: "5%",
  },
  scrollcont: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewcont: {
    // borderColor:'#7A28CB',
    // borderWidth:1,
    width: "100%",
    //height:'70%',
    padding: 4,
  },
  reviewinputcont: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  reviewinput: {
    backgroundColor: "#F0F0F0",
    height: 30,
    padding: 5,
    margintop: 10,
    width: "80%",
  },
  submitbutton: {
    borderWidth: 1,
    borderColor: "#33CA7F",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: 35,
    borderRadius: 5,
    backgroundColor: "#D4FDC6",
    margintop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  commentContainer: {
    // borderWidth:1,
    // borderColor:'#33CA7F',
    alignItems: "center",
    marginBottom: 5,
    margintop: 5,
  },
  commentCont: {
    width: "90%",
    // borderWidth:1,
    // borderColor:'red',
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    padding: 3,
    borderBottomColor: "#D4FDC6",
  },
  commentsSection: {
    margin: 5,
    // borderWidth:1,
    // borderColor:'red',
  },
});
