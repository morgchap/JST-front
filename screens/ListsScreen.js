import { Text, View, Image, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addListGames, deleteGame } from '../reducers/user';
import { useIsFocused } from '@react-navigation/native';

export default function ListsScreen({ navigation }) {
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value)
    const [update, setUpdate] = useState(false)
    const [modal, setModal] = useState(false)
    const [game, setGame] = useState("")

    // receive the list of the user when loading the page
    useEffect(() => {
        // if(user.lists.length === 0){ // because it can also be used in GameScreen
            fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${user.username}`)
              .then(response => response.json())
              .then(data => {
                dispatch(addListGames(data.lists))
              });
        // }
      }, [isFocused, update]);

    const handleDelete = (listName) => {
        dispatch(deleteGame(listName))
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/getGames/${listName}/${user.username}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            setUpdate(!update)
        })
    }

    const handleSeeList = (listName) => {
        listName = listName.replaceAll(" ", "_")
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/getGames/${listName}/${user.username}`)
            .then(response => response.json())
            .then(data => {
                const games = data.list.map((data, i) => {
                    let titre
                    if(data[0].length >= 12){
                        titre = data[0].slice(0, 9) + "..."
                    } else {
                        titre = data[0]
                    }
                    return (
                        <View key={i} style={styles.game}>
                            <TouchableOpacity onPress={() => handleNavigation() }>
                                <Image style={styles.jaquette} source={{uri: `${data[1]}`}} />
                            </TouchableOpacity>
                            <Text>{titre}</Text>
                        </View>
                    )
                })
                setModal(true)
                setGame(games)
        });
    }

const handleNavigation = () => {
    console.log("navigation")
    //navigation.navigate("Games", { gameName: data[0] }) fait bug la page !
}

    const list = user.lists.map((data, i) => {
        let trash_bin = i < 1 ? "" : <FontAwesome name="trash" color="#ffffff" size={16} onPress={() => handleDelete(data.listName)}/>
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

  return (
    <View style={styles.centered}>
        <View style={styles.headIcons}>
            <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
            <FontAwesome name="cog" color="#7A28CB" size={25} onPress={() => navigation.navigate("Setup")}/>
        </View>
        <View style={styles.body}>
            <Text style={styles.topText}>Your lists</Text>
            <View style={styles.lists}>
                <ScrollView>
                    {list}
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddList')} activeOpacity={0.8}>
                    <Text style={styles.textButton} >Add list</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Modal
            transparent={true}
            visible={modal}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
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
            </View> 
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headIcons: {
        width: "100%",
        height: "10%",
        paddingTop: 35,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "black",
    },
    body: {
        width: "100%",
        height: "90%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    topText: {
        fontSize: 17,
        fontWeight: "bold",
    },
    lists: {
        width: "90%",
        height: "85%",
    },
    gameOfList: {
        paddingHorizontal: 5,
        margin: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderColor: "#7A28CB",
        borderWidth: 3,
        backgroundColor: "#7A28CB",
        opacity: 0.8,
    },
    jaquetteOfList: {
        height: 100,
        width: 75,
        borderRadius: 5,
    },
    textOfList: {
        width: "75%",
        height: 120,
        alignItems: "center",
        justifyContent: "space-around",
    },
    textOfListTop: {
        width: "100%",
        paddingLeft: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    listName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    textOfListBottom: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    listLength: {
        color: "white",
    },
    buttonOfList: {
        backgroundColor: "white",
    },
    textButtonOfList: {
        color: "purple",
    },
    button: {
        width: 100,
        height: 30,
        backgroundColor: "#7A28CB",
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        color: "white",
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
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      backbutton: {
        width: '100%',
      },
});
