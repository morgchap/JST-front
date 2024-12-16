import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clickedFriend } from '../reducers/friend';

import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
  OpenSans_300Light_Italic,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';



export default function ProfilScreen({ navigation }) {


  const user = useSelector((state) => state.user.value)
  const friend = useSelector((state) => state.friend.value)
  const [defaultFriends, setDefaultFriends] = useState(true);
  const [numberOfFriends, setNumberOfFriends] = useState(123);
  const [numberOfGames, setNumberOfGames] = useState(123);
  const [receivedFriendRequestList, setReceivedFriendRequestList] = useState([])
  const [sentFriendRequestList, setSentFriendRequestList] = useState([])
  const [gameList, setGameList] = useState([]);
  const [myId, setMyId] = useState("");
  const [actionOnFriends, setActionOnFriends] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [gotPP, setGotPP] = useState(false) 

  const dispatch = useDispatch();
  const selectFriend = (friendUsername) => {
    dispatch(clickedFriend(friendUsername));
  };

  useEffect(() => {

    console.log("ça marche");

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${user.username}`)
    .then(result => result.json())
    .then(data => {
      console.log("c'est le front!", data.infos)

      setNumberOfFriends(data.infos.friendsList.length);
      setMyId(data.infos._id)

      console.log("adresse de la PP", data.infos.profilePicture)

      if (data.infos.profilePicture) {
      setProfilePicture(data.infos.profilePicture);
      setGotPP(true)
      } 


      console.log("number of friends ", numberOfFriends);
      console.log("Id de list", data.infos.lists[0]);

      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/receivedFriendRequests/${data.infos._id}`)
      .then(result => result.json())
      .then(databis => {
        console.log("fetch de la friendlist received", databis.data)
        setReceivedFriendRequestList(databis.data);
      })

      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/sentFriendRequests/${data.infos._id}`)
      .then(result => result.json())
      .then(dataTer => {
        console.log("fetch de la friend list sent", dataTer.data)
        setSentFriendRequestList(dataTer.data)

      })

      
    
  

      return data
     
  })
  .then(data => {
    console.log("deuxième data", data);
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/id/${data.infos.lists[0]}`)
    .then(result => result.json())
    .then(data => {
      console.log("data du fetch des liste de jeux", data);
      setNumberOfGames(data.data.gameList.length)
      console.log("number of Games", numberOfGames);
      setGameList(data.data.gameList)
      
    })



  })



}, [actionOnFriends]);

//fonctionne mais tourne en boucle... -> à voir comment éviter ça

console.log(gameList);


function acceptFriendRequest(senderId, senderUsername) {
  //fetch 1 pour changer le statut pending en accepted dans la collection friend

  fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/acceptFriendRequest/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: senderId, receiver : myId })
})
    .then(result => result.json())
    .then(data => {
      console.log("data de l'ajout d'ami", data);
      setActionOnFriends(!actionOnFriends);
  
   
      
    })
  


  //fetch 2 pour push l'ID du friend dans la FriendList de la collection de myUser 

  fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/addFriend/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user.username, id: senderId })
})
    .then(result => result.json())
    .then(data => {
      console.log("data de l'ajout d'ami", data);
  
   
      
    })

    //fetch 3 pour push mon ID dans la friendList du friend

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/addFriend/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: senderUsername, id: myId })
  })
      .then(result => result.json())
      .then(data => {
        console.log("data de l'ajout d'ami2", data);
    
     
        
      })
}



const myReceivedFriendRequests = receivedFriendRequestList.map((data, i) => {
  return (
    <View style={styles.headScrollView}>
    <TouchableOpacity key={i} style={styles.friendsContainer} onPress={() => {
      navigation.navigate("Friend", {friendName: data.sender.username});
      //{ gameName: gameName }('Games',{ gameName: gameName })
      selectFriend(data.sender.username);
      console.log(friend);
      
      }}>
      <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
      <Text style={styles.friendsPseudo}>@{data.sender.username}</Text>
      
    </TouchableOpacity>
    <View style={styles.icons}>
    <FontAwesome name="plus-circle" color="green" size={25} style={styles.iconStyle} onPress={() => {
      selectFriend(data.sender.username);
      console.log(friend);
      acceptFriendRequest(data.sender._id, data.sender.username);

      }}/>
      <FontAwesome name="ban" color="red" size={25} style={styles.iconStyle} />
      </View>
    </View>
  );
})

const mySentFriendRequests = sentFriendRequestList.map((data, i) => {
  return (
    <TouchableOpacity key={i} style={styles.friendsContainer} onPress={() => {
      navigation.navigate("Friend");
      selectFriend(data.receiver.username);
      console.log(friend);
      
      }}>
      <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
      <Text style={styles.friendsPseudoBis}>@{data.receiver.username}</Text>
      <View style={styles.iconContainer}>
      </View>
    </TouchableOpacity>
  );
})


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
    <TouchableOpacity key={i} style={styles.gameContainer} onPress={() => {
      //navigation.navigate("FriendList", {userFriendList: user.username})
      navigation.navigate("Games", {gameName: name})
    }}>
      <Text style={styles.gameTitle}>{name}</Text>
      <Image style={styles.jacket} source={{uri: `${data.cover}`, height:100,
      width: 75 }}/>
      <View style={styles.starsContainer}>
        {stars}
      </View>
    </TouchableOpacity>
  )
})




  function sendRequest() {
    setDefaultFriends(false);
    console.log(defaultFriends);

  };

  function receivedRequest() {
    setDefaultFriends(true);
    console.log(defaultFriends);
  }



const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="yellow" />);
}

let pluralFriends = "";
if (numberOfFriends >1) {
  pluralFriends = "s"
}

let pluralGames = "";
if (numberOfGames >1) {
  pluralGames = "x"
}

const isConnected = true;

if (!user.token) {
  isConnected = false;
};


  return (
    
    <View style={styles.centered}>
      <View style={styles.headIcons}>
      <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
      <FontAwesome name="cog" color="#7A28CB" size={25} onPress={() => navigation.navigate("Setup")}/>
      </View>
      <View style={styles.me}>
      { gotPP ? (
        <Image style={styles.avatar} source={{uri: profilePicture}}/>) : (
          <Image style={styles.avatar} source={require("../assets/avatar.png")} />
        )}
        <Text style={styles.pseudo}>@{user.username}</Text>
      </View>
      <View style={styles.stats}>
          <Text style={styles.gameStatsText}>{numberOfGames} jeu{pluralGames}</Text>
          <TouchableOpacity onPress={() => {
            navigation.navigate("FriendList", {userFriendList: user.username})
            selectFriend(user.username)
          }}>
            <Text style={styles.friendStatsText}>{numberOfFriends} ami{pluralFriends}</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.gameDiv}>
        <View style={styles.games}>
            <Text style={styles.secondTitles}>Mes jeux préférés ({numberOfGames})</Text>
            <ScrollView horizontal={true} style={styles.listGame}> 
              {games}
            </ScrollView>
        </View>
      </View>
      <View style={styles.myFriendTitleDiv}>
          <TouchableOpacity style={styles.leftButton} onPress={() => receivedRequest()}>
            <Text style={styles.friendsReceived}>Demandes reçues ({receivedFriendRequestList.length})</Text>               
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightButton} onPress={() => sendRequest()}>
            <Text style={styles.friendsSent}>Demandes envoyées ({sentFriendRequestList.length})</Text>               
          </TouchableOpacity>
          </View>
          { defaultFriends ? (
            <>
        
              <ScrollView style={styles.friendsView}>
              
              {myReceivedFriendRequests}
              
            </ScrollView>
            </> 
            ) : (
              <>
        
              <ScrollView style={styles.scrollViewBis}>
              {mySentFriendRequests}
            </ScrollView>
            </> 
    )}
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
      paddingBottom: 1,
      borderColor: "#7A28CB",
      borderWidth: 3,
    },

    pseudo: {
      fontSize: 20,
      paddingTop: 10,
      color: "#7A28CB",
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
      backgroundColor: "#7A28CB",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: '#7A28CB',
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
      flexDirection: "row",
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
      color: "#7A28CB",
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
      color : '#7A28CB',
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

    friendStatsText: {
      color : '#7A28CB',
      textDecorationLine: "underline",
    },

    gameStatsText: {
      color : '#7A28CB',
      
    },

    scrollViewBis: {
      display: "flex",
      flex: 1,
      flexDirection: "row",
      backgroundColor: "green",
      paddingHorizontal: 10,
      marginLeft: 8,
      marginRight: 8,
    },
    icons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    headScrollView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "350",

    }
   
    
    
  });
  