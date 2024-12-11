import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addListGames, deleteGame } from '../reducers/user';

export default function ListsScreen({ navigation }) {

    //const idUser = "426900"
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value)
    //const [lists, setList] = useState([])
    const [update, setUpdate] = useState(false)

    // receive the list of the user when loading the page
    useEffect(() => {
        fetch(`http://192.168.100.165:3000/lists/${user.username}`)
          .then(response => response.json())
          .then(data => {
            dispatch(addListGames(data.lists))
          });
      }, [update]);

    const handleDelete = (listName) => {
        dispatch(deleteGame(listName))
        fetch(`http://192.168.100.165:3000/lists/${listName}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            setUpdate(!update)
        })
    }

    const games = user.lists.map((data, i) => {
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
                        <TouchableOpacity style={styles.buttonOfList} onPress={() => console.log("coucou")} activeOpacity={0.8}>
                            <Text style={styles.textButtonOfList} >Add</Text>
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
                    {games}
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddList')} activeOpacity={0.8}>
                    <Text style={styles.textButton} >Add list</Text>
                </TouchableOpacity>
            </View>
        </View>
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
});
