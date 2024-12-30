import React, { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSelector } from "react-redux";

export default function DiscoveryScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [games, setGames] = useState([]);
  const [name, setName] = useState("");
  const [friends, setFriends] = useState([]);
  // const [pageContent, setPageContent]= useState('')
  const user = useSelector((state) => state.user.value);

  const newsApiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;
  
  /* Pour les articles */
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=jeux%20vid%C3%A9o&from=2024-12-10&to=2024-12-11&sortBy=popularity&apiKey=${newsApiKey}&language=fr&pageSize=5`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(
          data.articles?.map((article) => ({
            ...article,
            title:
              article.title.slice(0, 15) +
              (article.title.length > 15 ? "..." : ""),
          }))
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  /* Pour les jeux */
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${process.env.EXPO_PUBLIC_API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        const data = await response.json();
        // Mélange les jeux et sélectionne les 10 premiers
        const shuffledGames = data.results
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        setGames(shuffledGames);
        for (let game of shuffledGames) {
          const gamesinDB = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/games/byname`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: game.name,
              }),
            }
          );
          const result = await gamesinDB.json();

          if (!result.result) {
            await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/games/newgames`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  img: game.background_image,
                  description: game.description,
                  release: game.released,
                  genre: game.genres.name,
                  name: game.name,
                }),
              }
            );
          }
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  /* Pour I can know them (a continuer)*/

  const addFriend = (userId) => {
    // Logique pour ajouter un ami
  };

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const handlePressGame = async (gameName) => {
    navigation.navigate("Games", { gameName: gameName });
  };

  let pageContent;
  if (user.username) {
    pageContent = (
      <ImageBackground
        style={styles.image}
        source={require("../assets/background-blur.png")}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            vertical
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.pageTitle}>Discovery</Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Section Articles */}
            <View>
              <Text style={styles.title}>This week's news</Text>
              <View style={styles.encadrer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.listContent}
                  showsHorizontalScrollIndicator={false}
                >
                  {articles.map((article, index) => (
                    <View key={index} style={styles.articleItemHorizontal}>
                      <View style={styles.articleTextContainer}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleDescription}>
                          {article.description}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handlePress(article.url)}
                      >
                        <Image
                          style={styles.articleImage}
                          source={{ uri: article.urlToImage }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Section Jeux */}
            <View>
              <Text style={styles.title}>Our recommandations</Text>
              <View style={styles.encadrer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.listContent}
                  showsHorizontalScrollIndicator={false}
                >
                  {games.map((game) => {
                    let gamename = game.name;
                    if (game.name.length > 15) {
                      gamename = game.name.slice(0, 15) + "...";
                    }

                    return (
                      <View key={game.id} style={styles.gameItemHorizontal}>
                        {game.background_image && (
                          <TouchableOpacity
                            onPress={() => handlePressGame(game.name)}
                          >
                            <Image
                              style={styles.jaquette}
                              source={{ uri: game.background_image }}
                            />
                          </TouchableOpacity>
                        )}
                        <Text style={styles.gameTitle}>{gamename}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  } else {
    pageContent = (
      <ImageBackground
        style={styles.image}
        source={require("../assets/background-blur.png")}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            vertical
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.pageTitle}>Discovery</Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Section Articles */}
            <View>
              <Text style={styles.title}>This week's news</Text>
              <View style={styles.encadrer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.listContent}
                  showsHorizontalScrollIndicator={false}
                >
                  {articles.map((article, index) => (
                    <View key={index} style={styles.articleItemHorizontal}>
                      <View style={styles.articleTextContainer}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleDescription}>
                          {article.description}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handlePress(article.url)}
                      >
                        <Image
                          style={styles.articleImage}
                          source={{ uri: article.urlToImage }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Section Jeux */}
            <View>
              <Text style={styles.title}>Our recommandations</Text>
              <View style={styles.encadrer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.listContent}
                  showsHorizontalScrollIndicator={false}
                >
                  {games.map((game) => (
                    <View key={game.id} style={styles.gameItemHorizontal}>
                      {game.background_image && (
                        <TouchableOpacity
                          onPress={() => handlePressGame(game.name)}
                        >
                          <Image
                            style={styles.jaquette}
                            source={{ uri: game.background_image }}
                          />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7A28CB",
  },
  titleUnderline: {
    width: "50%",
    height: 2,
    backgroundColor: "#7A28CB",
    marginTop: 5,
  },
  encadrer: {
    margin: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#7A28CB",
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 0,
  },

  articleItemHorizontal: {
    flexDirection: "row",
    alignItems: "left",
  },
  articleTextContainer: {
    flex: 1,
    alignItems: "left",
    width: 190,
    height: 158,
  },
  articleTitle: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    worldWrap: "break-word",
    flexWrap: "wrap",
    width: "100%",
  },
  articleDescription: {
    fontSize: 14,
    color: "#D6CBFD",
    textAlign: "center",
    worldWrap: "break-word",
    flexWrap: "wrap",
    width: "100%",
  },
  articleImage: {
    width: 105,
    height: 158,
    borderRadius: 5,
  },

  gameItemHorizontal: {
    padding: 5,
    alignItems: "center",
  },
  jaquette: {
    borderRadius: 5,
    width: 105,
    height: 158,
    marginBottom: 5,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#D6CBFD",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 20,
    color: "#7A28CB",
  },
  friendsAvatars: {
    borderRadius: 50,
    height: 50,
    width: 50,
    marginBottom: 5,
  },
  friendsPseudo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#7A28CB",
  },
  friendItem: {
    alignItems: "center",
    margin: 10,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: "#D6CBFD",
    borderRadius: 5,
    padding: 5,
  },
});
