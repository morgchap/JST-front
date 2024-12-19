import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSelector } from 'react-redux';

export default function DiscoveryScreen({ navigation }) {
  // Déclare les états pour les articles, les jeux et les amis
  const [articles, setArticles] = useState([]);
  const [games, setGames] = useState([]);
  const [friends, setFriends] = useState([]);

  // Récupère les informations de l'utilisateur depuis le store Redux
  const user = useSelector((state) => state.user.value);

  // Clé API pour les actualités
  const newsApiKey = 'da5844b63702429887c8a0b59db638d2';

  // Récupère les articles à l'aide de l'API NewsAPI
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
        setArticles(data.articles?.map(article => ({
          ...article,
          title: article.title.slice(0, 15) + (article.title.length > 15 ? "..." : "")
        })));
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // Récupère les jeux à l'aide de l'API RAWG
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${process.env.EXPO_PUBLIC_API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();

        // Mélange et sélectionne les 10 premiers jeux
        const shuffledGames = data.results.sort(() => 0.5 - Math.random()).slice(0, 10);
        setGames(shuffledGames.map(game => ({
          ...game,
          name: game.name.slice(0, 15) + (game.name.length > 15 ? "..." : "")
        })));
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);


  // Fonction pour ouvrir un lien dans le navigateur
  const handlePress = (url) => {
    Linking.openURL(url);
  };

  // Navigation vers l'écran des jeux avec le nom du jeu sélectionné
  const handlePressGame = (gameName) => {
    console.log(gameName);
    navigation.navigate('Games', { gameName });
  };

  // Affichage de la page si l'utilisateur est connecte
  let pageContent;
  if (user.username) {
    pageContent = (
      <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {/* En-tête */}
            <View style={styles.headerContainer}>
              <Text style={styles.pageTitle}>Discovery</Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Section Articles */}
            <View>
              <Text style={styles.title}>This week in the geek world</Text>
              <View style={styles.encadrer}>
                <ScrollView horizontal contentContainerStyle={styles.listContent} showsHorizontalScrollIndicator={false}>
                  {articles.map((article, index) => (
                    <View key={index} style={styles.articleItemHorizontal}>
                      <View style={styles.articleTextContainer}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleDescription}>{article.description}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handlePress(article.url)}>
                        <Image style={styles.articleImage} source={{ uri: article.urlToImage }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Section Jeux */}
            <View>
              <Text style={styles.title}>Our recommendations</Text>
              <View style={styles.encadrer}>
                <ScrollView horizontal contentContainerStyle={styles.listContent} showsHorizontalScrollIndicator={false}>
                  {games.map((game) => (
                    <View key={game.id} style={styles.gameItemHorizontal}>
                      {game.background_image && (
                        <TouchableOpacity onPress={() => handlePressGame(game.name)}>
                          <Image style={styles.jaquette} source={{ uri: game.background_image }} />
                        </TouchableOpacity>
                      )}
                      <Text style={styles.gameTitle}>{game.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  } else {
    //Affichage de la page si l'utilisateur n'est pas connecte
    pageContent = (
      <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {/* En-tête */}
            <View style={styles.headerContainer}>
              <Text style={styles.pageTitle}>Discovery</Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Section Articles */}
            <View>
              <Text style={styles.title}>This week in the geek world</Text>
              <View style={styles.encadrer}>
                <ScrollView horizontal contentContainerStyle={styles.listContent} showsHorizontalScrollIndicator={false}>
                  {articles.map((article, index) => (
                    <View key={index} style={styles.articleItemHorizontal}>
                      <View style={styles.articleTextContainer}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleDescription}>{article.description}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handlePress(article.url)}>
                        <Image style={styles.articleImage} source={{ uri: article.urlToImage }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Section Jeux */}
            <View>
              <Text style={styles.title}>Our recommendations</Text>
              <View style={styles.encadrer}>
                <ScrollView horizontal contentContainerStyle={styles.listContent} showsHorizontalScrollIndicator={false}>
                  {games.map((game) => (
                    <View key={game.id} style={styles.gameItemHorizontal}>
                      {game.background_image && (
                        <TouchableOpacity onPress={() => handlePressGame(game.name)}>
                          <Image style={styles.jaquette} source={{ uri: game.background_image }} />
                        </TouchableOpacity>
                      )}
                      <Text style={styles.gameTitle}>{game.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return <>{pageContent}</>;
}

// Styles pour la page
const styles = StyleSheet.create({
  // Pour eviter de deborder de l'ecran
  safeArea: {
    flex: 1,
  },

  // Style de l'arriere plan
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  //Style pour le header
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  // Style du titre principal de la page + trait en dessous
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

  // Style pour les encadrés des articles et des jeux
  encadrer: {
    margin: 15,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#7A28CB',
  },

  //Style contenu des listes
  listContent: {
    paddingVertical: 20,
  },

  /*ARTICLES*/
  //Style pour un article avec titre, description courte et image
  articleItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  //Style pour le texte d'un article
  articleTextContainer: {
    flex: 1,
    width: 190,
    height: 158,
  },
  //Style pour le titre d'un article
  articleTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  //Style pour la description d'un article
  articleDescription: {
    fontSize: 14,
    color: '#D6CBFD',
    textAlign: 'center',
  },
  //Style pour l'image d'un article
  articleImage: {
    width: 105,
    height: 158,
    borderRadius: 15,
  },

  /*GAMES*/
  //Style pour un jeu avec image et nom du jeu
  gameItemHorizontal: {
    alignItems: 'center',
  },
  //Style jaquette du jeu
  jaquette: {
    borderRadius: 15,
    width: 105,
    height: 158,
    marginBottom: 5,
  },
  //Style titre du jeu
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D6CBFD',
  },

  //Style titre des sections
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#7A28CB',
  },
});
