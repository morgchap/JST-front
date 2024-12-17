import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, StyleSheet, Image, SafeAreaView, ImageBackground, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const [ratings, setRatings] = useState([]); // Pour stocker les avis des amis
  const user = useSelector((state) => state.user.value); // Récupérer l'utilisateur actuel depuis Redux
  console.log(ratings);

  useEffect(() => {
    const fetchFriendsReviews = async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/friendsreview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      });
  
      const data = await response.json();
      if (data.result) {
        setRatings(data.ratings); 
        console.log('Récupération des avis réussie:', data.ratings);
      } else {
        console.error('Erreur API:', data.message);
      }
    };
  }, []);

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
console.log('revew :',ratings);
  const ratingsNewsFeed = ratings[0].map((index, review) => {
    return (
      <View key={index}>
       <View key={review._id} style={styles.ratingContainer}>
          <Text style={styles.timestamp}>{formatDate(review.createdAt)}</Text>

          <View style={styles.ratingContent}>
            <View style={styles.userInfoContainer}>
              <Image style={styles.avatar} source={{ uri: review.user.profilePicture }}  /* source={require('../assets/avatar.png')} *//>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{/* {review.user.username} */}Username</Text>
                
                <View style={styles.starsContainer}>
                  {renderStars(review.note)} {/* Affichage des étoiles */}
                  <Text style={styles.textNote} >{review.note}</Text>
                </View>

              </View>
            </View>

            <View style={styles.gameReviewContainer}>
              <Image style={styles.gameCover} /* source={{ uri: review.game.cover }}*/ source={require('../assets/mario.png')}/>
              <View style={styles.reviewContent} >
                <Text style={styles.reviewGameTitle}>Mario {/* {review.game.name} */}</Text>
                <Text style={styles.reviewText}>{review.writtenOpinion}</Text>
              </View>
            </View>
          </View>
        </View>
    </View>
    )
  })
    
  return (
    <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Newsfeed</Text>
          <View style={styles.titleUnderline} />
        </View>

        <ScrollView contentContainerStyle={styles.ratingsContainer}>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  image: { flex: 1, width: '100%', height: '100%' },
  headerContainer: { alignItems: 'center', marginVertical: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#7A28CB' },
  titleUnderline: { width: '50%', height: 2, backgroundColor: '#7A28CB', marginTop: 5 },
  ratingsContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  ratingContainer: { backgroundColor: '#D6CBFD', borderRadius: 10, padding: 20, marginBottom: 20 },
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
  reviewText: { flex: 1, fontSize: 13, color: 'black' },
});
