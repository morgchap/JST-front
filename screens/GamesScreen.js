import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  OpenSans_300Light_Italic,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import { Collapsible } from "react-native-fast-collapsible";
import { useDispatch, useSelector } from "react-redux";
import HTMLView from "react-native-htmlview";
import { addListGames } from "../reducers/user";

export default function GamesScreen({ navigation, route }) {
  //const gamedata = useSelector((state) => state.game.value);
  const dispatch = useDispatch();
  const { gameName } = route.params;
  const user = useSelector((state) => state.user.value);
  //const currentUser = user.username

  const [isVisible, setVisibility] = useState(false);
  const [icon, setIcon] = useState("caret-down");
  const [isVisible2, setVisibility2] = useState(false);
  const [icon2, setIcon2] = useState("caret-down");
  const [gamesinfo, setGamesInfo] = useState([]);
  const [summary, setsummary] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setmessage] = useState(false);
  const [review, setReview] = useState(false);
  const [personalNote, setPersonalNote] = useState(0);
  const [writtencontent, setWrittentContent] = useState("");
  const [gamereview, setGameReview] = useState([]);
  const [friendsGR, setFriendsGR] = useState([]);
  const [heartLiked, setHeartLiked] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [likedMyReviews, setLikedMyReviews] = useState({});
  const [likedReviews, setLikedReviews] = useState({});
  const [profilePic, setProfilePic] = useState("");

  function fetchMyReview() {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/byuser/${user.username}`
    )
      .then((result) => result.json())
      .then((data) => {
        const theGameReview = data.ratings.ratingsID.filter(
          (e) => e.game.name == gameName
        );

        setMyReviews(theGameReview);
        setProfilePic(data.ratings.profilePicture);

        const liked = {};
        data.ratings.forEach((review) => {
          liked[review._id] = review.likesNumber.includes(user.userId);
        });

        setLikedMyReviews(liked);
      });
  }

  function fetchMyFriendsReviews() {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/friendsreview/bygame`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, name: gameName }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setFriendsGR(data.ratings);
        const liked = {};
        data.ratings.forEach((review) => {
          liked[review._id] = review.likesCounter.includes(user.userId);
        });
        setLikedReviews(liked);
      });
  }

  const toggleVisibility = () => {
    setVisibility((previous) => !previous);
    if (isVisible) {
      setIcon("caret-down");
    } else {
      setIcon("caret-right");
    }
  };
  const toggleVisibility2 = () => {
    setVisibility2((previous) => !previous);
    if (isVisible2) {
      setIcon2("caret-down");
    } else {
      setIcon2("caret-right");
    }
  };

  const handleAddGameToList = (listName) => {
    setModalVisible(false);
    setmessage(true);
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/addToList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, listName, gameName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateChange());
        }
      });
  };

  const handlesubmit = () => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/newreview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: gameName,
        username: user.username,
        reviewcontent: writtencontent,
        note: personalNote,
      }),
    })
      .then((response) => response.json())
      .then((doc) => {
        if (doc.result) {
          setGameReview([...gamereview, doc.ratings]);
          setReview(false);
          fetchMyReview();
        }
      });
  };

  function likeOrDislikeAReview(reviewId) {
    setHeartLiked(!heartLiked);

    setLikedMyReviews((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId], // Toggle l'état du like pour cette revue
    }));

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
    ).then(() => {
      fetchMyReview();
      fetchMyFriendsReviews();
    });
  }

  const myreview = myReviews.map((data, i) => {
    const mynotestars = [];

    const isLiked = likedMyReviews[data._id] ? "heart" : "heart-o";

    for (let i = 0; i < 5; i++) {
      let style = "star-o";
      if (i < data.note) {
        style = style = "star";
      }
      mynotestars.push(
        <FontAwesome key={i} name={style} color="#f1c40f" size={15} />
      );
    }

    return (
      <View key={i} style={styles.friendsReviews}>
        <View style={styles.picanduseandreview}>
          <Image source={{ uri: profilePic }} style={styles.friendsAvatars} />
          <View style={styles.useandreview}>
            <View style={styles.userandlike}>
              <Text style={styles.friendsPseudo}>@{user.username}</Text>
              <View style={styles.heartAndlikeCounter}>
                <FontAwesome
                  key={i}
                  name={isLiked}
                  style={styles.heartIcon}
                  size={15}
                  onPress={() => likeOrDislikeAReview(data._id)}
                />
                <Text>({data.likesNumber.length})</Text>
              </View>
            </View>
            <View style={styles.starsContainer2}>
              {mynotestars}
              <Text style={styles.votecount2}>{data.note}</Text>
            </View>
          </View>
        </View>
        <View style={styles.comment}>
          <Text>{data.writtenOpinion}</Text>
        </View>
      </View>
    );
  });

  const slicedarr = friendsGR.slice(-2);
  const myFriendsreviews = slicedarr.map((data, i) => {
    const mynotestars = [];

    const isLiked = likedReviews[data._id] ? "heart" : "heart-o";

    for (let i = 0; i < 5; i++) {
      let style = "star-o";
      if (i < data.note) {
        style = style = "star";
      }
      mynotestars.push(
        <FontAwesome key={i} name={style} color="#f1c40f" size={15} />
      );
    }

    return (
      <View key={i} style={styles.friendsReviews}>
        <View style={styles.picanduseandreview}>
          <Image
            source={{ uri: data.profilePicture }}
            style={styles.friendsAvatars}
          />
          <View style={styles.useandreview}>
            <View style={styles.userandlike}>
              <Text style={styles.friendsPseudo}>@{data.username}</Text>
              <View style={styles.heartAndlikeCounter}>
                <FontAwesome
                  key={i}
                  name={isLiked}
                  style={styles.heartIcon}
                  size={15}
                  onPress={() => likeOrDislikeAReview(data._id)}
                />
                <Text>({data.likesCounter.length})</Text>
              </View>
            </View>
            <View style={styles.starsContainer2}>
              {mynotestars}
              <Text style={styles.votecount2}>{data.note}</Text>
            </View>
          </View>
        </View>
        <View style={styles.comment}>
          <Text>{data.writtenOpinion}</Text>
        </View>
      </View>
    );
  });

  useEffect(() => {
    // fetch the lists if it isn't already done elswhere
    if (user.lists.length === 0) {
      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${user.username}`)
        .then((response) => response.json())
        .then((data) => {
          dispatch(addListGames(data.lists));
        });
    }
    //fetch le jeu
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/byname`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: gameName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGamesInfo(data.game);
        if (summary.length > 100) {
          setsummary(summary.slice(100));
        }
      });

    //fetch mes reviews

    fetchMyReview();

    // fetch les reviews de mes amis

    fetchMyFriendsReviews();
  }, []);

  let summaryToHTML;

  if (gamesinfo.summary === undefined || summary === undefined) {
    summaryToHTML =
      "there's no description yet for this game, try to come back later to learn more about it ";
    summaryToHTML = summaryToHTML.padEnd(1000, "");
  } else {
    summaryToHTML = gamesinfo.summary;
  }
  const stars = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < 4 - 1) {
      style = "star";
    }
    stars.push(<FontAwesome key={i} name={style} color="#f1c40f" size={20} />);
  }
  const stars2 = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < 4 - 1) {
      style = "star";
    }
    stars2.push(<FontAwesome key={i} name={style} color="#f1c40f" size={15} />);
  }

  const lists = user.lists.map((data, i) => {
    return (
      <TouchableOpacity
        key={i}
        onPress={() => handleAddGameToList(data.listName)}
        style={styles.listcont}
      >
        <Text style={styles.modalText}>{data.listName}</Text>
      </TouchableOpacity>
    );
  });
  //handle personnal note
  const personalStars = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < personalNote) {
      style = style = "star";
    }
    personalStars.push(
      <FontAwesome
        key={i}
        name={style}
        color="#f1c40f"
        size={40}
        onPress={() => setPersonalNote(i + 1)}
      />
    );
  }

  const mynotestars = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < personalNote) {
      style = style = "star";
    }
    mynotestars.push(
      <FontAwesome key={i} name={style} color="#f1c40f" size={40} />
    );
  }

  let pageContent = (
    <View style={styles.centered}>
      <View style={styles.bgpicture}>
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(122,40,203,1)", "rgba(51,202,127,0.4)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.Imgview}>
            <View style={styles.backbutton}>
              <FontAwesome
                name="chevron-left"
                color="white"
                size={25}
                style={styles.icon}
                onPress={() => navigation.goBack()}
              />
            </View>
            <Image style={styles.jaquette} source={{ uri: gamesinfo.cover }} />
            <View style={styles.backbutton}>
              <FontAwesome
                name="ellipsis-h"
                color="white"
                style={styles.icon}
                size={25}
                // onPress={() => navigation.goBack()}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
      <View style={styles.general}>
        <ScrollView
          style={styles.scroll}
          //</View>onContentSizeChange={(1000, 1000)}
        >
          <View style={styles.downside}>
            <Text style={styles.title}>{gamesinfo.name}</Text>
            <Text style={styles.date}>{gamesinfo.releaseDate}</Text>
            <View style={styles.line}></View>
            <View style={styles.starsContainer}>
              {stars}
              <Text style={styles.votecount}>3,5</Text>
            </View>
            <View style={styles.topbutton}>
              <TouchableOpacity
                style={styles.greenbutton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttontext}>add to list</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.greenbutton}
                onPress={() => setReview(true)}
              >
                <Text style={styles.buttontext}>Write a review</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.summary}>Summary</Text>
            <ScrollView style={styles.resumebox}>
              <HTMLView value={summaryToHTML} stylesheet={styles.resume} />
            </ScrollView>
            <SafeAreaView style={styles.container}>
              <Text style={styles.summary}>Reviews</Text>
              <Text style={styles.summary}>My review</Text>
              {myreview}
              <TouchableOpacity
                onPress={toggleVisibility}
                style={styles.container2}
              >
                <Text>My friend's reviews</Text>
                <FontAwesome name="caret-down" color="black" size={20} />
              </TouchableOpacity>

              <Collapsible isVisible={isVisible}>
                {myFriendsreviews}
              </Collapsible>

              <TouchableOpacity
                onPress={toggleVisibility2}
                style={styles.container2}
              >
                <Text style={styles.collapsedname}>Most liked reviews</Text>
                <FontAwesome name={icon2} color="black" size={20} />
              </TouchableOpacity>
              <Collapsible isVisible={isVisible2}>
                <View style={styles.friendsReviews}>
                  <View style={styles.picanduseandreview}>
                    <Image
                      source={require("../assets/avatar.png")}
                      style={styles.friendsAvatars}
                    />
                    <View style={styles.useandreview}>
                      <Text style={styles.friendsPseudo}>@monami</Text>
                      <View style={styles.starsContainer2}>
                        {stars2}
                        <Text style={styles.votecount2}>3,5</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.comment}>
                    <Text>
                      That is my favorite game i would 100% recommend it
                    </Text>
                  </View>
                </View>

                <View style={styles.friendsReviews}>
                  <View style={styles.picanduseandreview}>
                    <Image
                      source={require("../assets/avatar.png")}
                      style={styles.friendsAvatars}
                    />
                    <View style={styles.useandreview}>
                      <Text style={styles.friendsPseudo}>@monami</Text>
                      <View style={styles.starsContainer2}>
                        {stars2}
                        <Text style={styles.votecount2}>3,5</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.comment}>
                    <Text>
                      That is my favorite game i would 100% recommend it
                    </Text>
                  </View>
                </View>
              </Collapsible>
            </SafeAreaView>
          </View>
          <View style={styles.footer}></View>
        </ScrollView>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.backbutton}>
              <FontAwesome
                name="times"
                color="#7A28CB"
                size={25}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <ScrollView style={styles.scroll2}>{lists}</ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={message}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.backbutton}>
              <FontAwesome
                name="times"
                color="#7A28CB"
                size={25}
                onPress={() => setmessage(false)}
              />
            </View>
            <Text>your game has been added to the list</Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={review}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setReview(!review);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackground}
        >
          <View style={styles.modalContainer3}>
            <View style={styles.backbutton}>
              <FontAwesome
                name="times"
                color="#7A28CB"
                size={25}
                onPress={() => setReview(false)}
              />
            </View>
            <View style={styles.scrollcont}>
              <ScrollView style={styles.reviewcont}>
                <Text>My note</Text>
                <View style={styles.starsContainer}>{personalStars}</View>
                <View style={styles.reviewinputcont}>
                  <TextInput
                    style={styles.reviewinput}
                    placeholder="my review"
                    placeholderTextColor={"grey"}
                    maxLength={100}
                    multiline={true}
                    enterKeyHint="return"
                    onChangeText={(value) => setWrittentContent(value)}
                    value={writtencontent}
                    //onSubmitEditing={()=> handlesubmit()}
                  ></TextInput>
                </View>
              </ScrollView>
              <View style={styles.scrollcont}>
                <TouchableOpacity
                  style={styles.submitbutton}
                  onPress={() => handlesubmit()}
                >
                  <Text style={styles.buttontext2}>Submit my review</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View></View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );

  // if user is not logged in :

  if (!user.username) {
    pageContent = (
      <View style={styles.centered}>
        <View style={styles.bgpicture}>
          <LinearGradient
            // Background Linear Gradient
            colors={["rgba(122,40,203,1)", "rgba(51,202,127,0.4)"]}
            style={styles.gradient}
          >
            <SafeAreaView style={styles.Imgview}>
              <View style={styles.backbutton}>
                <FontAwesome
                  name="chevron-left"
                  color="white"
                  size={25}
                  style={styles.icon}
                  onPress={() => navigation.goBack()}
                />
              </View>
              <Image
                style={styles.jaquette}
                source={{ uri: gamesinfo.cover }}
              />
              <View style={styles.backbutton}>
                <FontAwesome
                  name="ellipsis-h"
                  color="white"
                  style={styles.icon}
                  size={25}
                  // onPress={() => navigation.goBack()}
                />
              </View>
            </SafeAreaView>
          </LinearGradient>
        </View>
        <View style={styles.general}>
          <ScrollView
            style={styles.scroll}
            //</View>onContentSizeChange={(1000, 1000)}
          >
            <View style={styles.downside}>
              <Text style={styles.title}>{gamesinfo.name}</Text>
              <Text style={styles.date}>{gamesinfo.releaseDate}</Text>
              <View style={styles.line}></View>
              <View style={styles.starsContainer}>
                {stars}
                <Text style={styles.votecount}>3,5</Text>
              </View>

              <Text style={styles.summary}>Summary</Text>
              <ScrollView style={styles.resumebox}>
                <HTMLView value={summaryToHTML} stylesheet={styles.resume} />
              </ScrollView>
              <SafeAreaView style={styles.container}>
                <Text style={styles.summary}>Reviews</Text>

                <TouchableOpacity
                  onPress={toggleVisibility2}
                  style={styles.container2}
                >
                  <Text style={styles.collapsedname}>Most liked reviews</Text>
                  <FontAwesome name={icon2} color="black" size={20} />
                </TouchableOpacity>
                <Collapsible isVisible={isVisible2}>
                  <View style={styles.friendsReviews}>
                    <View style={styles.picanduseandreview}>
                      <Image
                        source={require("../assets/avatar.png")}
                        style={styles.friendsAvatars}
                      />
                      <View style={styles.useandreview}>
                        <Text style={styles.friendsPseudo}>@monami</Text>
                        <View style={styles.starsContainer2}>
                          {stars2}
                          <Text style={styles.votecount2}>3,5</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.comment}>
                      <Text>
                        That is my favorite game i would 100% recommend it
                      </Text>
                    </View>
                  </View>

                  <View style={styles.friendsReviews}>
                    <View style={styles.picanduseandreview}>
                      <Image
                        source={require("../assets/avatar.png")}
                        style={styles.friendsAvatars}
                      />
                      <View style={styles.useandreview}>
                        <Text style={styles.friendsPseudo}>@monami</Text>
                        <View style={styles.starsContainer2}>
                          {stars2}
                          <Text style={styles.votecount2}>3,5</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.comment}>
                      <Text>
                        That is my favorite game i would 100% recommend it
                      </Text>
                    </View>
                  </View>
                </Collapsible>
              </SafeAreaView>
            </View>
            <View style={styles.footer}></View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return <>{pageContent}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  bgpicture: {
    position: "relative",
    height: "30%",
    width: "100%",
  },
  gradient: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  jaquette: {
    height: "95%",
    width: "40%",
    borderRadius: 5,
  },
  Imgview: {
    width: "100%",
    height: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backbutton: {
    width: "10%",
    marginLeft: "5%",
  },
  general: {
    // borderColor:'black',
    // borderWidth:1,
    width: "100%",
    justifyContent: "center",
    alignItems: "cefnter",
    alignContent: "flex-start",
    zIndex: 100,
    // backgroundColor:'white',
    height: "80%",
  },

  title: {
    marginTop: 10,
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 20,
  },
  line: {
    borderBottomWidth: 2,
    height: 0.5,
    width: "95%",
    borderColor: "#7A28CB",
    marginTop: "2%",
  },
  starsContainer: {
    // borderColor:'black',
    // borderWidth:1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 10,
  },
  starsContainer2: {
    // borderColor:'black',
    // borderWidth:1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 5,
    marginLeft: "4%",
  },
  votecount: {
    marginLeft: "2%",
    fontSize: 20,
    fontFamily: "OpenSans_300Light_Italic",
  },
  votecount2: {
    marginLeft: "2%",
    fontSize: 12,
    fontFamily: "OpenSans_300Light_Italic",
  },
  greenbutton: {
    borderColor: "#33CA7F",
    borderWidth: 1,
    backgroundColor: "white",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  topbutton: {
    marginTop: "3%",
    flexDirection: "row",
    // borderColor:'black',
    // borderWidth:1,
    width: "100%",
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    gap: "10%",
  },
  buttontext: {
    paddingHorizontal: "5%",
  },
  resume: {
    padding: "5%",
  },
  resumebox: {
    width: "85%",
    borderColor: "#33CA7F",
    borderRadius: 5,
    borderWidth: 3,
    height: 70,
  },
  icon: {
    position: "static",
  },
  downside: {
    marginTop: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    Height: 700,
  },
  summary: {
    marginTop: 10,
    fontFamily: "OpenSans_600SemiBold",
    color: "#7A28CB",
    width: "80%",
  },
  container: {
    height: "20%",
    marginTop: "10%",
    marginBottom: 100,
    // borderColor:'black',
    // borderWidth:1,
    width: "100%",
  },
  container2: {
    flexDirection: "row",
    //gap:10,
    backgroundColor: "#EEEEEE",
    // borderBottomWidth:1,
    // borderBottomColor:'#7A28CB',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: "20%",
    alignItems: "center",
    //justifyContent:'center',
    borderRadius: 5,
    margin: "3%",
    minHeight: "7%",
  },
  friendsReviews: {
    backgroundColor: "#EEEEEE",
    padding: "2%",
    margin: "2%",
    borderRadius: 5,
  },
  friendsAvatars: {
    borderRadius: 50,
    height: 50,
    width: 50,
    paddingBottom: 1,
  },

  friendsPseudo: {
    fontSize: 16,
    color: "#7A28CB",
  },
  comment: {
    marginTop: "2%",
  },
  picanduseandreview: {
    flexDirection: "row",
  },
  useandreview: {
    // borderColor:'black',
    // borderWidth:1,
    alignItems: "flex-start",
    marginLeft: "2%",
  },
  collapsedname: {
    fontSize: 15,
  },
  scroll: {
    width: "100%",
    paddingHorizontal: "5%",
    marginBottom: 1,
  },
  footer: {
    minHeight: 300,
  },
  modal: {
    backgroundColor: "red",
    height: "50%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  modalbox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  scroll2: {
    width: "100%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  listcont: {
    backgroundColor: "#D4FDC6",
    padding: "4%",
    marginTop: 10,
    width: "100%",
    alignContent: "center",
  },
  reviewcont: {
    // borderColor:'#7A28CB',
    // borderWidth:1,
    width: "100%",
    height: "70%",
    padding: 4,
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
  reviewinput: {
    backgroundColor: "#F0F0F0",
    height: "80%",
    padding: 5,
    margintop: 10,
  },
  reviewinputcont: {
    marginHorizontal: 5,
    // borderWidth:1,
    // borderColor:'black,'
  },
  greenbutton2: {
    borderColor: "#33CA7F",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "60%",
  },
  scrollcont: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    color: "red",
    paddingRight: 2,
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
  },
  submitbutton: {
    borderWidth: 1,
    borderColor: "#33CA7F",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    borderRadius: 5,
    backgroundColor: "#D4FDC6",
  },
  buttontext2: {
    padding: 6,
  },
});
