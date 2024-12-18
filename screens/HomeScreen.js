import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, StyleSheet, Image, SafeAreaView, ImageBackground, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  const [ratings, setRatings] = useState([]); // Pour stocker les avis des amis
  const [publicRating, setPublicRatings]= useState([]);
  const user = useSelector((state) => state.user.value); // Récupérer l'utilisateur actuel depuis Redux
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = useState('Friends')
  const [likedReviews, setLikedReviews] = useState({});
  //console.log(ratings);

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
  

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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


 useEffect(() => {
  if (!refreshing) {
    if(user.username){
      fetchFriendsReviews();
   }
   fetchAll()
     
}}, [refreshing]);

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
        <FontAwesome key={i} name="star" size={20} color={i < rating ? '#FFD700' : '#FFFFFF'}/>
      );
    }
    return stars;
  };
//console.log('revew :',ratings);


  let ratingsNewsFeed 
  
  
  if (search === 'Friends' && user.username) {
    
    ratingsNewsFeed = ratings.map((review, i) => {
      console.log("counter likesCounter", review.likesCounter)
      
      let fpp = <TouchableOpacity onPress={() => {
        navigation.navigate("Friend", {friendName : review.username})}}>
        <Image style={styles.avatar} source={require("../assets/avatar.png")}/>
        </TouchableOpacity>;

      if (review.profilePicture) {
        fpp = <TouchableOpacity onPress={() => {
          navigation.navigate("Friend", {friendName : review.username})}}>
            <Image style={styles.avatar} source={{uri: review.profilePicture}}/>;
        </TouchableOpacity>
      }

      const isLiked = likedReviews[review._id] ? "heart" : "heart-o";

    //console.log(review.game.cover)
    return (
      <View key={i}>
       <View style={styles.ratingContainer}>
          <View style={styles.ratingContent}>
            <View style={styles.userInfoContainer}>
             
             {fpp}
              
              <View style={styles.userInfo}>
                <View style={styles.userandlike}>
                  <Text style={styles.userName}>@{review.username}</Text>
                  <View style={styles.heartAndlikeCounter}>
                      <FontAwesome key={i} name={isLiked} style={styles.heartIcon} size={20} onPress={() => likeOrDislikeAReview(review._id)} />
                      <Text>({review.likesCounter.length})</Text>
                  </View>
                </View>
                <View style={styles.starsContainer}>
                  {renderStars(review.note)} {/* Affichage des étoiles */}
                  <Text style={styles.textNote} >{review.note}</Text>
                </View>

              </View>
            </View>

            <View style={styles.gameReviewContainer}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Games", {gameName : review.gameName})}}>
                <Image style={styles.gameCover} source={{ uri: review.gameCover }}/>
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
  })} else {
    ratingsNewsFeed = publicRating.map((review, i)=> {
      const isLiked = likedReviews[review._id] ? "heart" : "heart-o";
      console.log("data", review)
      
      let likable;

      if (user.token) {
        likable = <View style={styles.heartAndlikeCounter}>
        <FontAwesome key={i} name={isLiked} style={styles.heartIcon} size={20} onPress={() => likeOrDislikeAReview(review._id)} />
        <Text>({review.likesCounter.length})</Text>
    </View>
      }


      let fpp = <TouchableOpacity onPress={() => {
        navigation.navigate("Friend", {friendName : review.username})}}>
        <Image style={styles.avatar} source={require("../assets/avatar.png")}/>
        </TouchableOpacity>;

      if (review.profilePicture) {
        fpp = <TouchableOpacity onPress={() => {
                navigation.navigate("Friend", {friendName : review.username})}}>
                  <Image style={styles.avatar} source={{uri: review.profilePicture}}/>;
              </TouchableOpacity>

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
                    {renderStars(review.note)} {/* Affichage des étoiles */}
                    <Text style={styles.textNote} >{review.note}</Text>
                  </View>
  
                </View>
              </View>
  
              <View style={styles.gameReviewContainer}>
              <TouchableOpacity onPress={() => {
                navigation.navigate("Games", {gameName : review.gameName})}}>
                <Image style={styles.gameCover} source={{ uri: review.gameCover }}/>
              </TouchableOpacity>
                <View style={styles.reviewContent} >
                  <Text style={styles.reviewGameTitle}>{review.gameName}</Text>
                  <Text style={styles.reviewText}>{review.writtenOpinion}</Text>
                </View>
              </View>
            </View>
          </View>
      </View>)
    })
  }


  let newsfeed;

     if (search === 'Friends' && user.username) {
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
      
     } 
    
  return (
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
          {ratingsNewsFeed}
          </>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  image: { flex: 1, width: '100%', height: '100%' },
  headerContainer: { alignItems: 'center', marginVertical: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#7A28CB' },
  titleUnderline: { width: '50%', height: 2, backgroundColor: '#7A28CB', marginTop: 5 },
  ratingsContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  ratingContainer: { backgroundColor: '#D6CBFD', borderRadius: 10, padding: 20, margin: 20 },
  timestamp: { fontSize: 12, color: '#888', marginBottom: 10 }, 
  ratingContainerPublic: { backgroundColor: '#D4FDC6', borderRadius: 10, padding: 20, margin: 20 },
  ratingContent: { flexDirection: 'column' },
  userInfoContainer: { flexDirection: 'row', marginBottom: 10 },
  avatar: { width: 60, height: 60, borderRadius: 25, marginRight: 10 },
  userInfo: { flex: 1, justifyContent: 'center' },
  userName: { fontWeight: 'bold' },
  starsContainer: { flexDirection: 'row', marginTop: 5 },
  textNote: { marginLeft: 10, fontWeight: 'bold' },

  gameReviewContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  gameCover: { width: 60, height: 90, borderRadius: 8, marginRight: 10 },
  reviewGameTitle: {fontSize: 15, color: 'black', fontWeight: 'bold'},
  reviewText: { flex: 1, fontSize: 13, color: 'black', marginRight:20 },
  reviewContent:{width: '80%'}, 
  searchOn:{
    backgroundColor: '#D6CBFD',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width:'40%', 
    borderWidth:1, 
    borderColor:'#7A28CB',
    alignItems:'center',
  }, 
  searchOff:{
    backgroundColor: '#F0F0F0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width:'40%', 
    alignItems:'center',
    borderWidth:1, 
    borderColor:'grey',
    opacity:0.5
  }, 
  searchcont:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-around'
  }, 
  searchOnPublic:{
    backgroundColor: '#D4FDC6',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width:'40%', 
    borderWidth:1, 
    borderColor:'#33CA7F',
    alignItems:'center',
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
    marginRight: 20,


  }

});
