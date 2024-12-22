import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView, FlatList, Modal, ImageBackground, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
 import { useSelector } from 'react-redux'; 
 import { useDispatch } from 'react-redux';
import ModalGames from '../components/ModalGames';
import {searchedgamevalue} from '../reducers/game'
import { useIsFocused } from '@react-navigation/native'

export default function SearchScreen({navigation}) {
  const isFocused = useIsFocused()
  const dispatch = useDispatch();

  const [game, setGame]=useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [gameName, setGameName]=useState('');
  const [gameImg, setGameImg]=useState('');
  const [gameDate, setGamedate]=useState('');
  const [gameDescription, setGameDescription]=useState('');
  const [gameGenre, setGameGenre]=useState('');
  const [error, setError]= useState('');
  const [consoleGames, setConsoleGames] = useState([]);
  const CurrentUsername = useSelector((state) => state.user.value.username);
  const [suggestionGame, setSuggestionGame] = useState([]);
  const [suggestionUser, setSuggestionUser] = useState([]);
  const [loadingRace, setLoadingRace] = useState(false);
  const [search, setSearch] = useState('game')
  const [searchedUser, setSearchedUser] = useState('')
  
  const gamedata = useSelector((state) => state.game.value);

  useEffect(() => {
    if(!isFocused) {
      setSuggestionUser("")
      setSearchedUser("")
    } 
  }, [isFocused])

const fetchgames = async (query) => {
    if (!query) {
      setSuggestionGame([]);
      return;
    }	
    setLoadingRace(true);
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/fromsearch?search=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        setSuggestionGame(data.data);
      } else {
        setSuggestionGame([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError('Failed to fetch suggestions');
    } finally {
      setLoadingRace(false);
    }
      };

    const fetchUsers = async (query) => {
        if (!query) {
          setSuggestionUser([]);
          return;
        }	
        setLoadingRace(true);
        
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/search?search=${query}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          if (data && Array.isArray(data.data)) {
            setSuggestionUser(data.data);
          } else {
            setSuggestionUser([]);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setError('Failed to fetch suggestions');
        } finally {
          setLoadingRace(false);
        }
          };
  
     const handleinput = (value) => {
      setGameName(value)
      fetchgames(value)
     }


     const handleinputUser = (value) => {
      setSearchedUser(value)
      fetchUsers(value)
     }

     const handleSuggestionGame=(game) => {
      setModalVisible(true)
      let searchedgame = suggestionGame.filter((e)=> e.name === game)
      if(searchedgame[0].cover){
        setGameImg(searchedgame[0].cover);
        setGameName(searchedgame[0].name);
        setGamedate(searchedgame[0].releaseDate);
      }else{
        setGameImg(searchedgame[0].background_image);
        setGameName(searchedgame[0].name);
        setGamedate(searchedgame[0].released);
        setGameDescription(searchedgame[0].description)
        setGameGenre(searchedgame[0].genres.name)
      }
     }

     // affichage conditionnel des boutons
     let searchButton;
     let searchBar;

     if (search === 'game' && CurrentUsername) {
       searchButton = (
         <View style={styles.searchcont}>
           <TouchableOpacity style={styles.searchOn} onPress={() => setSearch('game')}>
             <Text>Game</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.searchOff} onPress={() => setSearch('user')}>
             <Text>User</Text>
           </TouchableOpacity>
         </View>
       );
       searchBar = (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input} 
            onChangeText={(value) => handleinput(value)}
            value={gameName}
            placeholder='Search for a Game'
            returnKeyType='search'
            onSubmitEditing={(gameName) => handlesubmit(gameName)}
            placeholderTextColor="black"
          />
          <View style={styles.suggestiontcontainer}>
          {loadingRace && <Text>Chargement...</Text>}
          {suggestionGame.length > 0 && (
            <FlatList
              data={suggestionGame}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionGame(item.name)}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            /> )}   
            {error && <Text style={styles.errorText}>{error}</Text>}     
            </View> 
            </View>
       )

     } else if (search === 'user' && CurrentUsername) {
       searchButton = (
         <View style={styles.searchcont}>
           <TouchableOpacity style={styles.searchOff} onPress={() => setSearch('game')}>
             <Text>Game</Text> 
           </TouchableOpacity>
           <TouchableOpacity style={styles.searchOn} onPress={() => setSearch('user')}>
             <Text>User</Text>
           </TouchableOpacity>
         </View>
       );
       searchBar=(
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.input} 
          onChangeText={(value) => handleinputUser(value)}
          value={searchedUser}
          placeholder='Search for a User'
          returnKeyType='search'
          placeholderTextColor="black"
        />
        <View style={styles.suggestiontcontainer}>
        {loadingRace && <Text>Chargement...</Text>}
        {suggestionUser.length > 0 && (
          <FlatList
            data={suggestionUser}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchedUser('')
                
                  navigation.navigate('Friend', { friendName : item.username})}}
              >
                <Text style={styles.suggestionText}>@{item.username}</Text>
              </TouchableOpacity>
            )}
          /> )}   
          {error && <Text style={styles.errorText}>{error}</Text>}     
          </View> 
          </View>
       )
     } else {
      searchBar = (
       <View style={styles.searchContainer}>
         <TextInput
           style={styles.input} 
           onChangeText={(value) => handleinput(value)}
           value={gameName}
           placeholder='Search for a Game'
           returnKeyType='search'
           onSubmitEditing={(gameName) => handlesubmit(gameName)}
           placeholderTextColor="black"
         />
         <View style={styles.suggestiontcontainer}>
         {loadingRace && <Text>Chargement...</Text>}
         {suggestionGame.length > 0 && (
           <FlatList
             data={suggestionGame}
             keyExtractor={(item, index) => `${item._id}-${index}`}
             renderItem={({ item }) => (
               <TouchableOpacity
                 style={styles.suggestionItem}
                 onPress={() => handleSuggestionGame(item.name)}
               >
                 <Text style={styles.suggestionText}>{item.name}</Text>
               </TouchableOpacity>
             )}
           /> )}   
           {error && <Text style={styles.errorText}>{error}</Text>}     
           </View> 
           </View>
      )
     }



// create a new game 
  const handlenewgame = async ()  => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/newgames`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        img : gameImg, 
        description : gameDescription, 
        release: gameDate,
        genre:gameGenre, 
        name:gameName,
      }),
    }).then(response => response.json()).then(data => {
      if (data){
        dispatch(searchedgamevalue(gameName))
      } else {
        dispatch(searchedgamevalue(gameName))
      }
    })
    navigation.navigate('Games',{ gameName: gameName })
    setModalVisible(false)
    setGame('')
    setGameName('')
    setSuggestionGame([])
  }


  const handlesubmit = ()=> {
   //search if the game is not already in the db 
   setGame('')
    setGameName('')
    setSuggestionGame([])
   let numberOfSuggestion = suggestionGame.length
    if(numberOfSuggestion === 0){
      let searchedGame = gameName.trim()
      searchedGame = searchedGame.replaceAll(" ", '-');
      fetch(`https://api.rawg.io/api/games/${searchedGame}?key=${process.env.EXPO_PUBLIC_API_KEY}`).then(response => response.json())
      .then(data => {
        setGame('');
        setGameImg(data.background_image);
        setGameName(data.name);
        setGamedate(data.released);
        setError('');
        setGameDescription(data.description);
        setGameGenre(data.genres.name);
        setSuggestionGame(suggestionGame => [...suggestionGame, data])
      })
      .catch((err) => setError('Game not found'));
    }else{
      setSuggestionGame(suggestionGame)
    }
  };

const handleList = ()=> {
  fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/allgames`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      img : gameImg, 
      username : CurrentUsername, 
      summary : gameDescription, 
      release: gameDate,
      genre:gameGenre,
      name:gameName
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.result) {
      setModalVisible(false);
    } else {
      setError(data.error);
    }
  });
}


 const fetchGamesByConsole = (consoleId) => {
  fetch(`https://api.rawg.io/api/games?key=${process.env.EXPO_PUBLIC_API_KEY}&platforms=${consoleId}`)
    .then((response) => response.json())
    .then((data) => {
      setConsoleGames(data.results);
    })
    .catch((err) => setError('Error fetching games for the selected console'));
};

const consoles = [
  { name: 'PC', id: 4 },
  { name: 'PlayStation', id: 18 },
  { name: 'Xbox', id: 1 },
  { name: 'Nintendo', id: 7 },
  { name: 'Android/iOS', id: 21 },
  { name: 'Other', id: 14 },
];

return (
  <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}> 
    <SafeAreaView style={styles.centered}>
      <KeyboardAvoidingView style={styles.buttondiv}>
        <View style={styles.header}>
          <FontAwesome 
            name="chevron-left"
            color="#7A28CB" 
            size={25} 
            onPress={() => navigation.goBack()} 
          />
        </View>

          {searchBar}
          {searchButton}
        <Text style={styles.subtitle}>
           Search games by game console
          </Text>
        <View style={styles.buttonsContainer}>
          {consoles.map((console, index) => (
            <TouchableOpacity
              key={console.id}
              style={styles.consoleButton}
              onPress={() => fetchGamesByConsole(console.id)}
            >
              <View>
                <Text style={styles.consoleButtonText}>{console.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.gamesList}>
            {(game || consoleGames.length > 0) && (
              <View>
                {game && <Text style={styles.gameTitle}>Game Search Results</Text>}
                {consoleGames.length > 0 && <Text style={styles.gameTitle}>Games for Selected Console</Text>}
                {consoleGames.map((game, index) => (
                  <View key={index} style={styles.gameItem}>
                    <Text style={styles.gameTitle}>{game.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
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
              <Image style={styles.jaquette} source={{ uri: gameImg }} />
              <Text style={styles.modalText}>{gameName}</Text>
              <Text style={styles.modalText}>{gameDate}</Text>
              <TouchableOpacity style={styles.button} onPress={()=> {
                handlenewgame()
              }}>
                  <Text style={styles.buttonText}>See more</Text>
              </TouchableOpacity>
            </View>
          </View> 
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  //Modif
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  consoleButton: {
    backgroundColor: '#7A28CB',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  consoleButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  gameItem: {
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gamesList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  //fin modif
  container: {
      flex: 1,
      backgroundColor: 'white',
  },
  header: {
      width: '100%',
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
  },
  searchContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 20, // Ajout d'un espace entre le header et la barre de recherche
  },
  input: {
      borderBottomColor: '#7A28CB',
      borderBottomWidth: 1,
      backgroundColor: 'rgba(226, 226, 222, 0.5)', 
      height: 50, // Ajuster la hauteur pour la rendre plus esthétique
      width: '90%',
      marginBottom: 10, // Petit espace entre la barre et le texte
      paddingHorizontal: 10,
      borderRadius: 5,
  },
  subtitle: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      marginTop: 10,
  },
  modal: {
    backgroundColor: 'red',
    height: '50%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
  modalbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  jaquette: {
    width: 200,
    height: 300,
    marginTop: 10,
    borderRadius: 5,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#7A28CB',
    height: '7%',
    width: '80%',
    margin: '2%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image:{
    flex:1
  },
  backbutton: {
    width: '90%',
    marginLeft: '5%'
  },
  suggestionItem:{
    backgroundColor:'white',
    justifyContent:'flex-start', 
    alignContent:'flex-start', 
    marginBottom:'2%', 
    borderBottomColor:'#7A28CB',
    borderBottomWidth:1, 
    width:'100%',
    padding:'5%', 
    borderRadius:5
  },
  suggestiontcontainer:{
    width:'90%'
  },
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
  suggestionItem2:{
    backgroundColor:'black',
    justifyContent:'flex-start', 
    alignContent:'flex-start', 
    marginBottom:'2%', 
    borderBottomColor:'#7A28CB',
    borderBottomWidth:1, 
    width:'100%',
    padding:'5%', 
    borderRadius:2
  },
});
