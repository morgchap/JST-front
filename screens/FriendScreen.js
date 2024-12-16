import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { clickedFriend } from '../reducers/friend';



export default function FriendScreen({ navigation }) {
    
    const user = useSelector((state) => state.user.value)
    const friend = useSelector((state) => state.friend.value)
    const [defaultFriends, setDefaultFriends] = useState(true);
    const [numberOfFriends, setNumberOfFriends] = useState(123);
    const [numberOfGames, setNumberOfGames] = useState(123);
    const [myId, setMyId] = useState("");
    const [friendId, setFriendId] = useState("");
    const [gameList, setGameList] = useState([]);


    const dispatch = useDispatch();
    const selectFriend = (friendUsername) => {
      dispatch(clickedFriend(friendUsername));
    };


  
  useEffect(() => {

    console.log("ça marche");

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/${friend}`)
    .then(result => result.json())
    .then(data => {
      console.log("c'est le front!", data.infos)

      setNumberOfFriends(data.infos.friendsList.length)

      console.log("number of friends ", numberOfFriends);
      console.log("Id de list", data.infos.lists[0])

    
  

      return data
     
  })
  .then(data => {
    console.log("deuxième data", data);
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/id/${data.infos.lists[0]}`)
    .then(result => result.json())
    .then(data => {
      console.log("data du fetch des listes de jeux", data);
      setNumberOfGames(data.data.gameList.length)
      console.log("number of games", numberOfGames);
      setGameList(data.data.gameList)
    })
  })



}, []);



const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="yellow" />);
}



  //fonction pour ajouter un ami - pas terminée - je dois générer des vrais demandes d'ami avant (et des vraies page profil d'ami).
  // je dois donc revenir sur la partie ProfilScreen avant pour mapper la liste des demandes d'amis (envoyées et reçues)

  function addAFriend() {



    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/${user.username}`)
    .then(result => result.json())
    .then(data => {
        console.log("fetch myId", data.infos._id);
        setMyId(data.infos._id)
        

    }).then(() => {

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/${friend}`)
    .then(result => result.json())
    .then(data => {
        console.log("fetch myFriendId", data.infos._id);
        setFriendId(data.infos._id)
        

    })
}).then(() => {


    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/addFriend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: myId, receiver: friendId}),
    })
    .then(result => result.json())
    .then(data => {
      console.log("data du dernier fetch", data);
      
    })
})
    
  }

  console.log("my Id", myId)
  console.log("friend Id", friendId)

  let pluralFriends = "";
if (numberOfFriends >1) {
  pluralFriends = "s"
}

let pluralGames = "";
if (numberOfGames >1) {
  pluralGames = "x"
}

const games = gameList.map((data, i) => {

  const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="yellow" />);
}

let name = data.name[0].toUpperCase() + data.name.slice(1);

if (name.length >= 15) {
  name = name[0].toUpperCase() + name.slice(1, 10) + "..."
}

  return (
    <View key={i} style={styles.gameContainer}>
      <Text style={styles.gameTitle}>{name}</Text>
      <Image style={styles.jacket} source={{uri: `${data.cover}`, height:100,
      width: 75 }}/>
      <View style={styles.starsContainer}>
        {stars}
      </View>
    </View>
  )
})



  return (
    <View style={styles.centered}>
      <View style={styles.headIcons}>
      <FontAwesome name="chevron-left" color="green" size={25} onPress={() => {
        navigation.goBack();
        selectFriend("");
      
      }}/>
      </View>
      <View style={styles.me}>
        <Image style={styles.avatar} source={require("../assets/nathanael.png")} />
        <Text style={styles.pseudo}>@{friend}</Text>
      </View>
      <View style={styles.stats}>
          <Text style={styles.statsText}>{numberOfGames} jeu{pluralGames}</Text>
          <Text style={styles.statsText}>{numberOfFriends} ami{pluralFriends}</Text>
      </View>
      <View style={styles.logoutView}>
            <TouchableOpacity style={styles.logoutButton} onPress={() => addAFriend()}>
                <Text style={styles.logoutText}>Ask as a friend</Text>
            </TouchableOpacity>
      </View>
      <View style={styles.gameDiv}>
        <View style={styles.games}>
            <Text style={styles.secondTitles}>Ses jeux préférés ({numberOfGames})</Text>
            <ScrollView horizontal={true} style={styles.listGame}> 
              {games}
            </ScrollView>
        </View>
      </View>
      
          
    </View>
      
  );
}

const styles = StyleSheet.create({

  centered: {
        flex: 1,
        alignItems: 'start',
        justifyContent: 'start'
    },

    headIcons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 70,
      color: "black",
      marginLeft: 20,
      marginRight: 20,
    },

    me: {
      display: "flex",
      width: "100%",
      height: "20%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,

    },

    avatar: {
      borderRadius: 50,
      height: 100,
      width: 100,
      paddingBottom: 1
    },

    pseudo: {
      fontSize: 20,
      paddingTop: 10,
      color: "green",
      paddingBottom: 10,
      fontWeight: "bold",

    },

    stats: {
      display: "flex",
      width: "100%",
      height: "5%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      

    },

    gameDiv: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      
    },

    games: {
      width: "95%",
      height: "auto",
      backgroundColor: "green",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: 'green',
      paddingBottom: 10,
      borderRadius: 10,

    
    },

    secondTitles: {
      fontSize: 16,
      fontFamily:'OpenSans_600SemiBold',
      color : 'white',
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 15,
      paddingBottom: 10,
    },

    gameContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 7,
      paddingVertical: 10,
      
    },

    jacket: {
      borderRadius: 5,
      height: 100,
      width: 75,
      marginTop: 10,
  
    },

    listGame: {
      display: "flex",
      flexDirection: "row",
      marginHorizontal: 10,
     
    },

    starsContainer: {
      display: "flex",
      flexDirection: "row",
      paddingTop: 5,
    },

    gameTitle: {
      fontStyle: "italic",
      color: "white",
      
    },

    friendsView: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      backgroundColor: "white",
      paddingHorizontal: 10,
      marginLeft: 8,
      marginRight: 8,
    },

    friendsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      paddingVertical: 10,
      paddingLeft: 10,
    },

    friendsAvatars: {
      borderRadius: 50,
      height: 50,
      width: 50,
      paddingBottom: 1
    },

    friendsPseudo: {
      paddingHorizontal: 10,
      fontSize: 16,
      color: "green",
    },

    friendsPseudoBis: {
      paddingHorizontal: 10,
      fontSize: 16,
      color: "white",
    },

    friendsReceived: {
      fontSize: 14,
      fontWeight: "bold",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      fontFamily:'OpenSans_600SemiBold',
      color : 'green',
    },

    friendsSent: {
      fontSize: 14,
      fontWeight: "bold",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      fontFamily:'OpenSans_600SemiBold',
      color : "white",
    },

    myFriendTitleDiv: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 10,
    },

    leftButton: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: 'white',
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    rightButton: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: 'green',
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      
    },

    iconStyle: {
      paddingRight: 10,
    },

    iconContainer: {
      display: "flex",
      flexDirection: "row",
      
    },

    statsText: {
      color : 'green',
    },

    scrollViewBis: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      backgroundColor: "green",
      paddingHorizontal: 10,
      marginLeft: 8,
      marginRight: 8,
    },

    logoutView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: 10,
    
      },

    logoutButton: {
        borderRadius: 10,
        height: 50,
        width: 100,
        backgroundColor: 'green',
        justifyContent: "center",
        alignItems: "center",
    
      },
    
      logoutText: {
        color: "white",
        fontWeight: "bold",
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }
    
    
  });
  