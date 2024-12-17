import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, View, Text, Image, StyleSheet, ImageBackground, ScrollView, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';

export default function DiscoveryScreen() {
  const [articles, setArticles] = useState([]);
  const [games, setGames] = useState([]);
  const [friends, setFriends] = useState([]);

  const newsApiKey = 'da5844b63702429887c8a0b59db638d2';
  const gamesApiKey = process.env.EXPO_PUBLIC_API_KEY;

  /* Pour les articles */
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=jeux%20vid%C3%A9o&from=2024-12-10&to=2024-12-11&sortBy=popularity&apiKey=${newsApiKey}&language=fr&pageSize=5`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.articles?.map(article => ({ ...article, title: article.title.slice(0, 15) + (article.title.length > 15 ? "..." : "") })));
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  /* Pour les jeux */
  useEffect(() => {
    const fetchGames = async () => 
    {
      try 
      {
        const response = await fetch(
          `https://api.rawg.io/api/games?page_size=10&key=${gamesApiKey}`
        );
        if (!response.ok) 
        {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        // Mélange les jeux et sélectionne les 10 premiers
        const shuffledGames = data.results.sort(() => 0.5 - Math.random()).slice(0, 10);
        setGames(shuffledGames.map(game => ({ ...game, name: game.name.slice(0, 15) + (game.name.length > 15 ? "..." : "") })));
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  /* Pour I can know them (a continuer)*/
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getall`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();

        const shuffledFriends = (data.friends || [])
          .sort(() => 0.5 - Math.random()) 
          .slice(0, 10) 
          .map(friend => ({
            id: friend._id,
            username: friend.username.slice(0, 15) + (friend.username.length > 15 ? "..." : ""),
            profilPicture: friend.profilPicture || require('../assets/avatar.png'),
          }));
        setFriends(shuffledFriends);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchFriends();
  }, []);

  const addFriend = (userId) => {
    console.log(`Add friend with ID: ${userId}`);
    // Logique pour ajouter un ami
  };

  return (
    <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView vertical contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>Discovery</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Section Articles */}
          <View>
            <Text style={styles.title}>Cette semaine chez les geek</Text>
            <View style={styles.encadrer}>
                <ScrollView horizontal contentContainerStyle={styles.listContent} showsHorizontalScrollIndicator={false}>
                  {articles.map((article, index) => (
                    <View key={index} style={styles.articleItemHorizontal}>
                      <View style={styles.articleTextContainer}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleDescription}>{article.description}</Text>
                      </View>
                      <Image style={styles.articleImage} source={{ uri: article.urlToImage }} />
                    </View>
                  ))}
                </ScrollView>
            </View>
          </View>

          {/* Section Jeux */}
          <View>
            <Text style={styles.title}>Les prochaines sorties du mois</Text>
            <View style={styles.encadrer}>
                <ScrollView horizontal contentContainerStyle={styles.listContent} showsHorizontalScrollIndicator={false}>
                  {games.map((game) => (
                    <View key={game.id} style={styles.gameItemHorizontal}>
                      {game.background_image && (
                        <Image style={styles.jaquette} source={{ uri: game.background_image }} />
                      )}
                      <Text style={styles.gameTitle}>{game.name}</Text>
                    </View>
                  ))}
                </ScrollView>
            </View>
          </View>

          {/* Section I can know them*/}
          <View>
            <Text style={styles.title}>Je pourrais connaitre</Text>
            <View style={styles.encadrer}>
              {friends.map((friend) => (
                <View key={friend.id} style={styles.friendItem}>
                  <Image style={styles.friendsAvatars} source={{ uri: friend.profilPicture }} defaultSource={require('../assets/avatar.png')}/>
                  <Text style={styles.friendsPseudo}>{friend.username}</Text>
                  <TouchableOpacity onPress={() => addFriend(friend.id)} style={styles.addButton}>
                    <FontAwesome name="plus" size={20} color="#7A28CB" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A28CB',
  },
  titleUnderline: {
    width: '50%',
    height: 2,
    backgroundColor: '#7A28CB',
    marginTop: 5,
  },
  encadrer: {
    margin: 15,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#7A28CB',
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 0,
  },

  articleItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'left',
  },
  articleTextContainer: {
    flex: 1,
    alignItems: 'left',
    width: 190,
    height: 158,
  },
  articleTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    worldWrap: 'break-word',
    flexWrap: 'wrap',
    width: '100%',
  },
  articleDescription: {
    fontSize: 14,
    color: '#D6CBFD',
    textAlign: 'center',
    worldWrap: 'break-word',
    flexWrap: 'wrap',
    width: '100%',
  },
  articleImage: {
    width: 105,
    height: 158,
    borderRadius: 15,
  },

  gameItemHorizontal: {
    padding: 5,
    alignItems: 'center',
  },
  jaquette: {
    borderRadius: 15,
    width: 105,
    height: 158,
    marginBottom: 5,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D6CBFD',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    color: '#7A28CB',
  },
  friendsAvatars: {
    borderRadius: 50,
    height: 50,
    width: 50,
    marginBottom: 5,
  },
  friendsPseudo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7A28CB',
  },
  friendItem: {
    alignItems: 'center',
    margin: 10,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: '#D6CBFD',
    borderRadius: 25,
    padding: 5,
  },
});
