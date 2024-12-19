import { 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    ImageBackground,
    Modal,
    TextInput,
    Switch, 
    Pressable,
    SafeAreaView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGame, addListGames, deleteGame } from '../reducers/user';
import { useIsFocused } from '@react-navigation/native';

export default function ListsScreen({ navigation }) {
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value)
    //const [update, setUpdate] = useState(false)
    const [modal, setModal] = useState(false)
    const [game, setGame] = useState("")

    /* Pour le modal */
    const [modalVisible, setModalVisible] = useState(false);
    const [listName, setListName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState('');

    const fetchGameLists = () => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${user.username}`)
            .then(response => response.json())
            .then(data => {
            dispatch(addListGames(data.lists))
            });
    }

    // receive the list of the user when loading the page
    useEffect(() => {
        setGame("")
        fetchGameLists()
      }, [isFocused]);

    const handleDeleteList = (listName) => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${listName}/${user.username}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(() => dispatch(deleteGame(listName)))
        .then(() => fetchGameLists())
        .then(() => setModalVisible(false))
    }

    const handleSeeList = (listName) => {
        listName = listName.replaceAll(" ", "_")
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/getGames/${listName}/${user.username}`)
            .then(response => response.json())
            .then(data => {
                let gamesList
                if(data.error === "Your list is empty."){
                    gamesList = [
                        <View key={0}>
                            <Text>Votre List est vide</Text>
                        </View>
                    ]
                } else {
                    gamesList = data.list.map((data, i) => {
                        // data[0] is the title of the game, data[1] is the uri link to the cover of the game
                        let title
                        if(data[0].length >= 12){
                            title = data[0].slice(0, 9) + "..."
                        } else {
                            title = data[0]
                        }
                        return (
                            <View key={i} style={styles.game}>
                                <TouchableOpacity onPress={() => handleNavigation(data[0]) }>
                                    <Image style={styles.jaquette} source={{uri: `${data[1]}`}} />
                                </TouchableOpacity>
                                <Text styles>{title}</Text>
                                <TouchableOpacity onPress={() => handleDeleteGame(listName, data[0])} style={styles.button} >
                                    <Text style={styles.textButton} >Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
                setModal(true)
                setGame(gamesList)
        });
    }

    const handleNavigation = (gameName) => {
        setModal(false)
        navigation.navigate("Games", { gameName })
    }

    const handleDeleteGame = (listName, gameName) => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/${listName}/${gameName}/${user.username}`, {
            method: 'DELETE',
        })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .then(() => fetchGameLists())
        .then(() => setModal(false))
    }

    //const list = user.lists.map((data, i) => {})
    
    /* Pour le modal */
    const handleAddListButton = () => {
        setModalVisible(true);
    }

    const handleAddList = async () => {
        if (!listName.trim()) {
          setError('Please enter a name for your list.');
          return;
        }
    
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/addList`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listName, username: user.username, isPublic }),
            }
          );
    
          const data = await response.json();
    
          if (data.result) {
            dispatch(addGame(data.list));
            setListName('');
            setIsPublic(false);
            setError('');
            navigation.navigate('Lists');
            setModalVisible(false);
          } else {
            setError(data.error || 'An error occurred while creating the list.');
          }
        } catch (err) {
          setError('An error occurred. Please try again later.');
        }
      };


    const games = user.lists.map((data, i) => {
        let trash_bin = i < 1 ? "" : <FontAwesome name="trash" color="#ffffff" size={16} onPress={() => handleDeleteList(data.listName)}/>
        let plural = data.gameList.length < 2 ? "jeu" : "jeux"
        return (
            <View key={i} style={styles.gameOfList}>
                <Image style={styles.jaquetteOfList} source={require("../assets/mario.png")} />
                <View style={styles.textOfList}>
                    <View style={styles.textOfListTop}>
                        <Text style={styles.listName}>{data.listName}</Text>
                        {trash_bin}
                    </View>
                    <View style={styles.textOfListBottom}>
                        <Text style={styles.listLength}>{data.gameList.length} {plural}</Text>
                        <TouchableOpacity style={styles.buttonOfList} onPress={() => handleSeeList(data.listName)} activeOpacity={0.8}>
                            <Text style={styles.textButtonOfList} >See</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    })

    let pageContent =   <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
    <SafeAreaView style={styles.centered}>
        <View style={styles.headIcons}>
            <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
        </View>
        <View style={styles.body}>
            <View style={styles.lists}>
                <ScrollView>
                    {games}
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={() => handleAddListButton()} activeOpacity={0.8}>
                    <Text style={styles.textButton} >Add list</Text>
                </TouchableOpacity>
            </View>
        </View>

        <Modal
            transparent={true}
            visible={modal}
            onRequestClose={() => {
                /* Alert.alert('Modal has been closed.'); */
                setModal(true);
            }}
        >
            <View style={styles.modalBackgroundList}>
                <ImageBackground 
                    source={require('../assets/background-blur.png')} 
                    style={styles.backgroundImageList}
                >
                    <View style={styles.modalContainerList}>
                        <View style={styles.backbutton}>
                            <FontAwesome 
                                name="times"
                                color="#7A28CB" 
                                size={25} 
                                onPress={() => setModal(false)} 
                            />
                        </View>
                        <View style={styles.gameContainer}>
                            <ScrollView horizontal={true}>
                                {game}
                            </ScrollView>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </Modal>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    /* Alert.alert('Modal has been closed.'); */
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalBackground}>
                    <ImageBackground 
                        source={require('../assets/background-blur.png')} 
                        style={styles.backgroundImage}
                    >
                            <View style={styles.backbutton}>
                                <FontAwesome 
                                name="times"
                                color="#7A28CB" 
                                size={25} 
                                onPress={() => setModalVisible(false)} 
                            />
                            </View>
                        <View style={styles.modalContainer}>
                            <TextInput 
                                placeholder="List Name" 
                                placeholderTextColor="#7A28CB" 
                                autoCapitalize="none" 
                                onChangeText={setListName} 
                                value={listName} 
                                style={styles.input} 
                            />

                            {error && <Text style={styles.errorText}>{error}</Text>}
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Private</Text>
                                <Switch 
                                    trackColor={{ false: '#7A28CB', true: '#33CA7F' }}
                                    thumbColor={isPublic ? '#ffffff' : '#ffffff'} 
                                    ios_backgroundColor="#3e3e3e" 
                                    onValueChange={setIsPublic} 
                                    value={isPublic} 
                                    style={styles.switch}
                                />
                                <Text style={styles.switchLabel}>Public</Text>
                            </View>
                            <TouchableOpacity style={styles.modalButton} onPress={handleAddList}>
                                <Text style={styles.modalButtonText}>Add List</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
    </SafeAreaView>
    </ImageBackground>

if (!user.username){
    pageContent = 
    <View style={styles.divLoggedout}>
      <Text>
        Create an account or log in to access the list
      </Text>
      <TouchableOpacity style={styles.buttonloggedout} onPress={()=> navigation.navigate('Login')}>
        <Text>
          Take me to login
        </Text>
      </TouchableOpacity>
    </View>
  
    }

return (
<>
{pageContent}
</>
  );
}

const styles = StyleSheet.create({
    /* Pour le modal */
    modalbox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding:5
    },
    modalBackgroundList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backgroundImage: {
        alignItems: "flex-end",
        padding:10
    },
    backgroundImageList: {
        width: '100%',
    },
    modalContainer: {
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    modalContainerList: {
        padding: 20,
        borderRadius: 10,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    modalButton: {
        width: 100,
        height: 30,
        backgroundColor: "#7A28CB",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    modalButtonText: {
        color: "white",
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#7A28CB',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#000',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 15,
        // borderWidth:1, 
        // borderColor:'black',
        width:'70%'
    },
    switchLabel: {
        marginRight: 10,
        color: '#7A28CB',
        fontWeight: 'bold',
        
    },
    
    /* Pour la page de base */
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    headIcons: {
        width: "100%",
        height: "10%",
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        // borderBottomWidth: 2,
        // borderColor: "#7A28CB",
    },
    body: {
        width: "100%",
        height: "90%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    topText: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#7A28CB',
    },
    lists: {
        width: "90%",
        height: "85%",
    },
    gameOfList: {
        paddingHorizontal: 10,
        margin: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#7A28CB",
        opacity: 0.8,
        borderRadius: 10,
    },
    jaquetteOfList: {
        height: 100,
        width: 75,
        borderRadius: 10,
    },
    textOfList: {
        width: "75%",
        height: 120,
        alignItems: "center",
        justifyContent: "space-around",
    },
    textOfListTop: {
        width: "100%",
        paddingLeft: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    listName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    textOfListBottom: {
        width: "130%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    listLength: {
        fontWeight: 'bold',
        color: "white",
    },
    buttonOfList: {
        width: 50,
        height: 30,
        backgroundColor: "#D6CBFD",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textButtonOfList: {
        color: '#7A28CB',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        width: 100,
        height: 30,
        backgroundColor: "#7A28CB",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textButton: {
        color: "white",
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameContainer: {
        flexDirection: "row",
    },
    game: {
        marginVertical: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    jaquette: {
        height: 160,
        width: 120,
    },
      backbutton: {
        width: 20,
        alignItems: "flex-end",
      },
      divLoggedout:{
        flex:1,
        alignItems:'center', 
        justifyContent:'center',
        backgroundColor:'#D6CBFD'
      }, 
      buttonloggedout:{
        // borderColor:'black', 
        // borderWidth:1,
        padding:'2%',
        marginTop:'3%',
        backgroundColor:'white',
        borderRadius:5
      }
});
