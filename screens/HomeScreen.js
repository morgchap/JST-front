import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  const [ratings, setRatings] = useState([]); // Pour stocker les avis des amis
  const [publicRating, setPublicRatings] = useState([]); //avis publics
  const user = useSelector((state) => state.user.value); // Récupérer l'utilisateur actuel depuis Redux
  const [refreshing, setRefreshing] = React.useState(false); // Etats pour le rafraîchissement
  const [search, setSearch] = useState('Friends'); // Etat pour la recherche (amis ou public)
  const [likedReviews, setLikedReviews] = useState({}); // Etat pour stocker les avis likés par l'utilisateur
  const [comment, setComment] = useState({}); // Etat pour stocker les commentaires en cours de saisie (clé par id d'avis)
  const [displayedCommentId, setDisplayedCommentId] = useState(null); // Tracks which rating's comments are displayed
  const [ratingsCom, setRatingsCom] = useState({}); // Stores comments for each rating, keyed by review._id
  const [activeCommentReview, setActiveCommentReview] = useState(null);  // Etat pour suivre l'avis sur lequel l'utilisateur est en train de commenter

  // Fonction pour gérer la saisie de commentaire
  const handleCommentChange = (reviewId, text) => {
    setComment(prev => ({ ...prev, [reviewId]: text }));
  };

  // Fonction pour liker/disliker un avis
  function likeOrDislikeAReview(reviewId) {
    console.log("changement de like");

    setLikedReviews(prevState => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/likeOrDislikeAReview`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ratingId: reviewId,
        userId: user.userId
      })
    }).then(() => {
      fetchFriendsReviews();
      fetchAll();
    });
  }

  // Fonction pour rafraîchir la liste des avis
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

   // Fonction pour récupérer les avis des amis
  function fetchFriendsReviews() {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/friendsreview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username }),
    })
      .then(response => response.json())
      .then(data => {
        setRatings(data.ratings);
        // Met à jour l'état `likedReviews` pour les reviews des amis
        const liked = {};
        data.ratings.forEach(review => {
          liked[review._id] = review.likesCounter.includes(user.userId);
        });
        setLikedReviews(liked);
      });
  }

  // Fonction pour récupérer les avis publics
  function fetchAll() {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/all`)
      .then(response => response.json())
      .then(data => {
        setPublicRatings(data.ratings);
        // Met à jour l'état `likedReviews` pour les reviews publiques
        const liked = {};
        data.ratings.forEach(review => {
          liked[review._id] = review.likesCounter.includes(user.userId);
        });
        setLikedReviews(prevLiked => ({ ...prevLiked, ...liked }));
      });
  }

  // Fonction pour récupérer les avis au chargement du composant
  useEffect(() => {
    if (!refreshing) {
      if (user.username) {
        fetchFriendsReviews();
      }
      fetchAll()
      fetch
    }
  }, [refreshing]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Fonction pour afficher les étoiles en fonction de la note
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome key={i} name="star" size={20} color={i < rating ? '#FFD700' : '#FFFFFF'} />
      );
    }
    return stars;
  };

  // Fonction pour soumettre un commentaire
  const handleCommentSubmit = async (ratingsId) => {
    const commentContent = comment[ratingsId]
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/comments/newCom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, content: commentContent, ratings: ratingsId }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        setComment(prev => ({ ...prev, [ratingsId]: '' }));
      }
    })
  }

  // Fonction pour afficher/masquer les commentaires d'un avis
  const handleCommentDisplay = async (reviewId) => {
    if (displayedCommentId === reviewId) {
      // Masquer les commentaires si déjà affichés
      setDisplayedCommentId(null);
      return;
    }

    // Afficher les commentaires pour l'avis cliqué
    setDisplayedCommentId(reviewId);

    // Récupérer les commentaires si non déjà récupérés
    if (!ratingsCom[reviewId]) {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/comments/byratings/${reviewId}`
        );
        const data = await response.json();

        if (data && data.comment) {
          setRatingsCom((prev) => ({
            ...prev,
            [reviewId]: data.comment, // Stocker les commentaires récupérés
          }));
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  // Fonction pour afficher les commentaires d'un avis
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

  // Affichage des avis en fonction de la recherche
  let ratingsNewsFeed

  if (search === 'Friends' && user.username) {
    // Affichage des avis des amis
    ratingsNewsFeed = ratings.map((review, i) => {

      let fpp = (<TouchableOpacity onPress={() => {
        navigation.navigate("Friend", { friendName: review.username })
      }}>
        <Image style={styles.avatar} source={require("../assets/avatar.png")} />
      </TouchableOpacity>);

      if (review.profilePicture) {
        fpp = (<TouchableOpacity onPress={() => {
          navigation.navigate("Friend", { friendName: review.username })
        }}>
          <Image style={styles.avatar} source={{ uri: review.profilePicture }} />;
        </TouchableOpacity>)
      }

      const isLiked = likedReviews[review._id] ? "heart" : "heart-o";
      return (
        <View key={i}>
          <View style={styles.ratingContainerFriends} >
            <View style={styles.ratingContent}>
              <View style={styles.userInfoContainer}>
                <>
                  {fpp}
                </>
                <View style={styles.userInfo}>
                  <View style={styles.userandlike}>
                    <Text style={styles.userName}>@{review.username}</Text>
                    <View style={styles.heartAndlikeCounter}>
                      <FontAwesome name={isLiked} style={styles.heartIcon} size={20} onPress={() => likeOrDislikeAReview(review._id)} />
                      <Text>({review.likesCounter.length})</Text>
                    </View>
                  </View>
                  <View style={styles.starsContainer}>
                    <>
                      {renderStars(review.note)}
                    </>
                    <Text style={styles.textNote} >{review.note}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.gameReviewContainer}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate("Games", { gameName: review.gameName })
                }}>
                  <Image style={styles.gameCover} source={{ uri: review.gameCover }} />
                </TouchableOpacity>
                <View style={styles.reviewContent} >
                  <Text style={styles.reviewGameTitle}>{review.gameName}</Text>
                  <Text style={styles.reviewText}>{review.writtenOpinion}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

      )
    })
  } else {
    // Affichage des avis publics
    ratingsNewsFeed = publicRating.map((review, i) => {
      const isLiked = likedReviews[review._id] ? "heart" : "heart-o";

      let likable;

      if (user.token) {
        likable = (<View style={styles.heartAndlikeCounter}>
          <FontAwesome name='comment' style={styles.comIcon} size={20} onPress={() => handleCommentDisplay(review._id)} />
          <FontAwesome key={i} name={isLiked} style={styles.heartIcon} size={20} onPress={() => likeOrDislikeAReview(review._id)} />
          <Text>({review.likesCounter.length})</Text>
        </View>)
      }
      
      let fpp = (<TouchableOpacity onPress={() => {
        navigation.navigate("Friend", { friendName: review.username })
      }}>
        <Image style={styles.avatar} source={require("../assets/avatar.png")} />
      </TouchableOpacity>);

      if (review.profilePicture) {
        fpp = (<TouchableOpacity onPress={() => {
          navigation.navigate("Friend", { friendName: review.username })
        }}>
          <Image style={styles.avatar} source={{ uri: review.profilePicture }} />;
        </TouchableOpacity>)

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
                    {likable}
                  </View>
                  <View style={styles.starsContainer}>
                    <>
                      {renderStars(review.note)}
                    </>
                    <Text style={styles.textNote} >{review.note}</Text>
                  </View>

                </View>
              </View>

              <View style={styles.gameReviewContainer}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate("Games", { gameName: review.gameName })
                }}>
                  <Image style={styles.gameCover} source={{ uri: review.gameCover }} />
                </TouchableOpacity>
                <View style={styles.reviewContent} >
                  <Text style={styles.reviewGameTitle}>{review.gameName}</Text>
                  <Text style={styles.reviewText}>{review.writtenOpinion}</Text>
                </View>
              </View>
            </View>
            <ScrollView style={styles.reviewcont}>
              <View style={styles.reviewinputcont}>
                <TextInput key={i} style={styles.reviewinput}
                  placeholder='Comment'
                  placeholderTextColor={'grey'}
                  maxLength= {100}
                  multiline={true}
                  enterKeyHint='return'
                  onChangeText={(value) => handleCommentChange(review._id, value)}
                  value={comment[review._id] || ""}
                  onFocus={() => setActiveCommentReview(review._id)}
                  onBlur={() => setActiveCommentReview(null)}
                >
                </TextInput>
                <FontAwesome name='paper-plane' style={styles.sendIcon} size={20} onPress={() => handleCommentSubmit(review._id)} />
              </View>
            </ScrollView>
          </View>
          {displayedCommentId === review._id && (
            <View style={styles.commentsSection}>{renderComments(review._id)}</View>
          )}
        </View>
      )
    })
  }

  // Affichage du filtre de recherche
  let newsfeed;
  let bgcolor;

  if (search === 'Friends' && user.username) {
    bgcolor = styles.bg2

    newsfeed = (
      <View style={styles.searchcont}>
        <TouchableOpacity style={styles.searchOff} onPress={() => setSearch('Public')}>
          <Text>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchOn} onPress={() => setSearch('Friends')}>
          <Text>Friends</Text>
        </TouchableOpacity>
      </View>
    );

  } else if (search === 'Public' && user.username) {
    bgcolor = styles.bg
    newsfeed = (
      <View style={styles.searchcont}>
        <TouchableOpacity style={styles.searchOnPublic} onPress={() => setSearch('Public')}>
          <Text>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchOff} onPress={() => setSearch('Friends')}>
          <Text>Friends</Text>
        </TouchableOpacity>
      </View>
    );

  } else {
    bgcolor = styles.bg

  }

  return (
    <View style={bgcolor}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          Style={styles.ratingsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <>
            {newsfeed}
          </>
          <>
            {ratingsNewsFeed.reverse()}
          </>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    marginTop: 30,
  }, 
 
  // Style pour le conteneur d'un avis public
  ratingContainerPublic: { 
    backgroundColor: '#D4FDC6', 
    borderRadius: 15, 
    padding: 10, 
    margin: 10,
  }, 
  // Style pour le conteneur d'un avis amis
  ratingContainerFriends: { 
    backgroundColor: '#D6CBFD', 
    borderRadius: 15, 
    padding: 10, 
    margin: 10,
  }, 
  // Style pour le contenu d'un avis
  ratingContent: { 
    flexDirection: 'column',
  }, 
  // Style pour le conteneur des informations utilisateur
  userInfoContainer: { 
    flexDirection: 'row',
    marginBottom: 10,
  }, 
  // Style pour l'avatar de l'utilisateur
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 25, 
    marginRight: 10,
  }, 
  // Style pour les informations de l'utilisateur 
  userInfo: { 
    flex: 1, 
    justifyContent: 'center', 
  }, 
  // Style pour le nom de l'utilisateur
  userName: { 
    fontWeight: 'bold', 
  }, 
  // Style pour les étoiles de notation
  starsContainer: { 
    flexDirection: 'row', 
    marginTop: 5,
  }, 
  // Style pour la note
  textNote: { 
    marginLeft: 10, 
    fontWeight: 'bold', 
  },
  // Style pour le conteneur de l'avis sur le jeu
  gameReviewContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10,
  }, 
  // Style pour la couverture du jeu
  gameCover: { 
    width: 60, 
    height: 90, 
    borderRadius: 5, 
    marginRight: 10, 
    marginBottom: 10, 
  }, 
  // Style pour le titre du jeu
  reviewGameTitle: { 
    fontSize: 15, 
    color: 'black', 
    fontWeight: 'bold', 
  }, 
  // Style pour le texte de l'avis
  reviewText: { 
    flex: 1, 
    fontSize: 13, 
    color: 'black', 
    marginRight: 20, 
  }, 
  // Style pour le conteneur du texte de l'avis
  reviewContent: { 
    width: '80%', 
  }, 
  // Styles pour les boutons de recherche
  searchOn: {
    backgroundColor: '#D6CBFD',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    width: '40%',
    borderWidth: 1,
    borderColor: '#7A28CB',
    alignItems: 'center',
  },
  searchOff: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    width: '40%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    opacity: 0.5
  },
  searchcont: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  searchOnPublic: {
    backgroundColor: '#D4FDC6',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    width: '40%',
    borderWidth: 1,
    borderColor: '#33CA7F',
    alignItems: 'center',
  },
  // Styles pour les icônes
  heartIcon: {
    color: "red",
    paddingRight: 5,
    padding: 3,
  },
  comIcon: {
    color: "#33CA7F",
    paddingRight: 5,
    padding: 3,
  },
  sendIcon: {
    color: "black",
    paddingRight: 5,
    padding: 3,
  },
  // Styles pour l'affichage des informations utilisateur
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
    padding: 3
  },

  // Styles pour les couleurs d'arrière-plan
  bg: {
    flex: 1,
    backgroundColor: 'rgba(51, 202, 127, 0.5)', 
  },
  bg2: {
    flex: 1,
    backgroundColor: 'rgba(122, 40, 203, 0.5)',
  },

  // Styles pour les modales (si utilisées)
  reviewcont: {
    width: '100%',
    padding: 4
  },
  reviewinputcont: {
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  reviewinput: {
    backgroundColor: '#F0F0F0',
    height: 30,
    padding: 5,
    margintop: 10,
    width: '80%'
  },

  // Style pour le conteneur des commentaires
  commentContainer: {
    alignItems: 'center',
    marginBottom: 5,
    margintop: 5
  },

  // Style pour le conteneur d'un commentaire
  commentCont: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 3,
    borderBottomColor: '#D4FDC6'
  },

  // Style pour la section des commentaires
  commentsSection: {
    margin: 5,
  }
});