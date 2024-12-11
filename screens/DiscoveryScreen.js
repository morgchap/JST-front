import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';

export default function DiscoveryScreen() {
  const [game, setGame] = useState(null);

  useEffect(() => {

    const fetchRandomGame = async () => 
    {
      try 
      {
        const response = await fetch(`https://api.rawg.io/api/games?page_size=10&key=${process.env.EXPO_PUBLIC_API_KEY}`);
        if (!response.ok) 
        {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Games data received:', data);
        setGame(data.results); 
      } catch (error) 
      {
        console.error('Error fetching the game data:', error);
      }
    };
    fetchRandomGame();
  }, []); 

  const handleAddToCollection = (game) => 
  {
    console.log(`${game.name} add to collection`);
  };

  if (!game) 
    {
    return <Text>Loading...</Text>;
  }

  const renderGameItem = ({ item }) => {
    const gameName = item.name;
    const gameImage = item.background_image; 
    const gameStudio = item.developers && item.developers[0] ? item.developers[0].name : "Unknown Studio";
    const gameRating = item.rating; 
    return (
      <View style={styles.gameItem}>
        <Image style={styles.jaquette} source={{ uri: gameImage }} />
        <View style={styles.textContainer}>
          <Text style={styles.gameTitle}>{gameName}</Text>
          <Text style={styles.gameStudio}>{gameStudio}</Text>
          <Text style={styles.gameRating}>Rating: {gameRating}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleAddToCollection(item)}>
            <Text style={styles.buttonText}>Add to Collection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (game.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
        <FlatList
          data={game}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      </ImageBackground>
    </SafeAreaView>
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
  listContent: {
    padding: 20,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
    padding: 10,
  },
  jaquette: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameStudio: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  gameRating: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7A28CB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
