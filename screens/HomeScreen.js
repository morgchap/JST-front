import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, StyleSheet, Image, SafeAreaView, ImageBackground, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const [ratings, setRatings] = useState([]); // Pour stocker les avis des amis
  const user = useSelector((state) => state.user.value); // Récupérer l'utilisateur actuel depuis Redux
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = useState('Friends')
  //console.log(ratings);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);



 useEffect(() => {
  if (!refreshing) {
   fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/friendsreview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      })
     .then(response => response.json())
     .then(data => {
      console.log(data.ratings)
      setRatings(data.ratings);
     });
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
  const ratingsNewsFeed = ratings.map((review, i) => {

    //console.log(review.game.cover)
    return (
      <View key={i}>
       <View style={styles.ratingContainer}>
          <View style={styles.ratingContent}>
            <View style={styles.userInfoContainer}>
             <Image style={styles.avatar} source={{ uri: review.profilePicture }}  /* source={require('../assets/avatar.png')} *//> 
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>@{review.username}</Text>
                
                <View style={styles.starsContainer}>
                  {renderStars(review.note)} {/* Affichage des étoiles */}
                  <Text style={styles.textNote} >{review.note}</Text>
                </View>

              </View>
            </View>

            <View style={styles.gameReviewContainer}>
              <Image style={styles.gameCover} source={{ uri: review.gameCover }}/>
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
           <TouchableOpacity style={styles.searchOn} onPress={() => setSearch('Public')}>
             <Text>Public</Text> 
           </TouchableOpacity>
           <TouchableOpacity style={styles.searchOff} onPress={() => setSearch('Friends')}>
             <Text>Friends</Text>
           </TouchableOpacity>
         </View>
       );
      
     } else {
    
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

});
