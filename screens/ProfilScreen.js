import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clickedFriend } from "../reducers/friend";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

export default function ProfilScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const friend = useSelector((state) => state.friend.value);
  const [defaultFriends, setDefaultFriends] = useState(true);
  const [numberOfFriends, setNumberOfFriends] = useState(123);
  const [numberOfGames, setNumberOfGames] = useState(123);
  const [receivedFriendRequestList, setReceivedFriendRequestList] = useState([]);
  const [sentFriendRequestList, setSentFriendRequestList] = useState([]);
  const [gameList, setGameList] = useState([]);
  const [myId, setMyId] = useState("");
  const [actionOnFriends, setActionOnFriends] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [gotPP, setGotPP] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const dispatch = useDispatch();
  const selectFriend = (friendUsername) => {
    dispatch(clickedFriend(friendUsername));
  };

  useEffect(() => {
    if (!refreshing) {

      // fetch des informations de l'utilisateur connecté pour les afficher sur la page
      fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${user.username}`
      )
        .then((result) => result.json())
        .then((data) => {

          // on enregistre le nombre d'amis (friendsList.length) dans un useState pour rendre l'info dynamique
          setNumberOfFriends(data.infos.friendsList.length);

          // on enregistre également l'ID qui sera utilisé dans une autre route
          setMyId(data.infos._id);

          //instruction qui permet d'enregistrer dans un useState l'existence ou non d'une photo de profil personnalisée (true/false dans gotPP) pour gérer l'affichage conditionnel et dans un autre useState l'url de la photo de profil (profilePicture)

          if (data.infos.profilePicture) {
            setProfilePicture(data.infos.profilePicture);
            setGotPP(true);
          }

          // ici on fetch les demandes d'ami reçues et on les stock dans le useState receivedFriendRequest

          fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/receivedFriendRequests/${data.infos._id}`
          )
            .then((result) => result.json())
            .then((databis) => {
              setReceivedFriendRequestList(databis.data);
            });

            // même chose pour les demandes envoyées stockées dans le useState sentFriendRequestlList
          fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/sentFriendRequests/${data.infos._id}`
          )
            .then((result) => result.json())
            .then((dataTer) => {
              setSentFriendRequestList(dataTer.data);
            });

          return data;
        })
        .then((data) => {

           // ici on fa fetcher la liste "all my games" de l'utilisateur connecté, qui regroupe l'ensemble des jeux ajoutés en favoris par celui-ci.
        // on stocke le nombre (gameList.length dans numberOfGames) et la liste en détail (data.gameList dans le useState gameList)
          fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/id/${data.infos.lists[0]}`
          )
            .then((result) => result.json())
            .then((data) => {
              setNumberOfGames(data.data.gameList.length);
              setGameList(data.data.gameList);
            });
        });
    }
  }, [actionOnFriends, refreshing, isFocused]);

  // on met à jour le useEffect dès qu'on rafraichit la page, dès qu'on ajoute un ami ou lorsqu'on réactive l'écran

  function acceptFriendRequest(senderId, senderUsername) {
    //fetch 1 pour changer le statut pending en accepted dans la collection friend

    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/acceptFriendRequest/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: senderId, receiver: myId }),
      }
    )
      .then((result) => result.json())
      .then((data) => {
        setActionOnFriends(!actionOnFriends);
      });

    //fetch 2 pour push l'ID du friend dans la FriendList de la collection de myUser

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/addFriend/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, id: senderId }),
    }).then((result) => result.json());

    //fetch 3 pour push mon ID dans la friendList du friend

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/addFriend/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: senderUsername, id: myId }),
    }).then((result) => result.json());
  }

  //on map les infos des demandes d'ami reçues pour les afficher sous forme de liste


  const myReceivedFriendRequests = receivedFriendRequestList.map((data, i) => {
    return (
      <View style={styles.headScrollView} key={i}>
        <TouchableOpacity
          style={styles.friendsContainer}
          onPress={() => {
            navigation.navigate("Friend", { friendName: data.sender.username });
            //{ gameName: gameName }('Games',{ gameName: gameName })
            selectFriend(data.sender.username);
          }}
        >
          {data.sender.profilePicture ? (
            <Image
              style={styles.friendsAvatars}
              source={{ uri: data.sender.profilePicture }}
            />
          ) : (
            <Image
              style={styles.friendsAvatars}
              source={require("../assets/avatar.png")}
            />
          )}
          <Text style={styles.friendsPseudo}>@{data.sender.username}</Text>
        </TouchableOpacity>
        <View style={styles.icons}>
          <FontAwesome
            name="plus-circle"
            color="green"
            size={25}
            style={styles.iconStyle}
            onPress={() => {
              selectFriend(data.sender.username);
              acceptFriendRequest(data.sender._id, data.sender.username);
            }}
          />
        </View>
      </View>
    );
  });

  // même chose pour les demandes envoyées

  const mySentFriendRequests = sentFriendRequestList.map((data, i) => {
    console.log(data.receiver.profilePicture);

    // ajouter le if pour la pp de l'amis
    return (
      <TouchableOpacity
        key={i}
        style={styles.friendsContainer}
        onPress={() => {
          navigation.navigate("Friend", { friendName: data.receiver.username });
          selectFriend(data.receiver.username);
        }}
      >
        {data.receiver.profilePicture ? (
          <Image
            style={styles.friendsAvatars}
            source={{ uri: data.receiver.profilePicture }}
          />
        ) : (
          <Image
            style={styles.friendsAvatars}
            source={require("../assets/avatar.png")}
          />
        )}
        <Text style={styles.friendsPseudoBis}>@{data.receiver.username}</Text>
        <View style={styles.iconContainer}></View>
      </TouchableOpacity>
    );
  });

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
      name = name[0].toUpperCase() + name.slice(1, 10) + "...";
    }

    return (
      <TouchableOpacity
        key={i}
        style={styles.gameContainer}
        onPress={() => {
          //navigation.navigate("FriendList", {userFriendList: user.username})
          navigation.navigate("Games", { gameName: data.name });
        }}
      >
        <Text style={styles.gameTitle}>{name}</Text>
        <Image
          style={styles.jacket}
          source={{ uri: `${data.cover}`, height: 100, width: 75 }}
        />
        <View style={styles.starsContainer}>{stars}</View>
      </TouchableOpacity>
    );
  });

  // les deux fonctions suivantes permettent de changer l'affichage lorqu'on clique sur les demandes reçues ou envoyées pour afficher la liste correspondante et le css qui convient

  function sendRequest() {
    setDefaultFriends(false);
  }

  function receivedRequest() {
    setDefaultFriends(true);
  }

  // variable de type tableau qui permet d'afficher le bon nombre d'étoiles brillantes et vides en fonction des notes  const stars = [];
  const stars = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < 4 - 1) {
      style = "star";
    }
    stars.push(<FontAwesome key={i} name={style} color="yellow" />);
  }


  // les deux variables suivantes permettent d'ajuster l'utilisation du pluriel pour le nomlbre d'amis et de jeux affichés sur la page profil
  let pluralFriends = "";
  if (numberOfFriends > 1) {
    pluralFriends = "s";
  }

  let pluralGames = "";
  if (numberOfGames > 1) {
    pluralGames = "x";
  }

  // const isConnected = true;

  // if (!user.token) {
  //   isConnected = false;
  // };

  // <SafeAreaProvider>
  let pageContent = (
    <View style={styles.centered}>
      <LinearGradient
        // Background Linear Gradient
        colors={["74deg, rgba(214,203,253,1) 0%", "rgba(212,253,198,1) 100%"]}
        style={styles.gradient}
      >
        <ScrollView
          Style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headIcons}>
            <FontAwesome
              name="chevron-left"
              color="white"
              size={25}
              onPress={() => navigation.goBack()}
            />
            <FontAwesome
              name="cog"
              color="white"
              size={25}
              onPress={() => navigation.navigate("Setup")}
            />
          </View>
          <View style={styles.me}>
            {gotPP ? (
              <Image style={styles.avatar} source={{ uri: profilePicture }} />
            ) : (
              <Image
                style={styles.avatar}
                source={require("../assets/avatar.png")}
              />
            )}
            <Text style={styles.pseudo}>@{user.username}</Text>
          </View>
          <View style={styles.stats}>
            <Text style={styles.gameStatsText}>
              {numberOfGames} jeu{pluralGames}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("FriendList", {
                  userFriendList: user.username,
                });
                selectFriend(user.username);
              }}
            >
              <Text style={styles.friendStatsText}>
                {numberOfFriends} ami{pluralFriends}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameDiv}>
            <View style={styles.games}>
              <Text style={styles.secondTitles}>
                My favorite games ({numberOfGames})
              </Text>
              <ScrollView horizontal={true} style={styles.listGame}>
                {games}
              </ScrollView>
            </View>
          </View>
          <View style={styles.myFriendTitleDiv}>
            <TouchableOpacity
              style={styles.leftButton}
              onPress={() => receivedRequest()}
            >
              <Text style={styles.friendsReceived}>
                Received ({receivedFriendRequestList.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightButton}
              onPress={() => sendRequest()}
            >
              <Text style={styles.friendsSent}>
                Sent ({sentFriendRequestList.length})
              </Text>
            </TouchableOpacity>
          </View>
          {defaultFriends ? (
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
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // ici on prévoit le scénario d'affichage de cette page si l'utilisateur n'est pas connecté (aucun username stocké dans le reducer)


  if (!user.username) {
    pageContent = (
      <View style={styles.divLoggedout}>
        <Text>Create an account or log in to access your profile</Text>
        <TouchableOpacity
          style={styles.buttonloggedout}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Take me to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{pageContent}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "start",
    justifyContent: "start",
    //backgroundColor:'#F0F0F0'
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
    marginBottom: 30,
  },

  avatar: {
    borderRadius: 50,
    height: 100,
    aspectRatio: 1,
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
    borderBottomColor: "#7A28CB",
    paddingBottom: 10,
    borderRadius: 5,
  },

  secondTitles: {
    fontSize: 16,
    fontFamily: "OpenSans_600SemiBold",
    color: "white",
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
    marginLeft: 30,
    marginright: 30,
    width: "85%",
    borderRadius: 20,
    marginTop: 10,
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
    paddingBottom: 1,
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
    fontFamily: "OpenSans_600SemiBold",
    color: "#7A28CB",
  },

  friendsSent: {
    fontSize: 14,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    fontFamily: "OpenSans_600SemiBold",
    color: "white",
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
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  rightButton: {
    borderRadius: 10,
    backgroundColor: "#33CA7F",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  iconStyle: {
    paddingRight: 40,
  },

  iconContainer: {
    display: "flex",
    flexDirection: "row",
  },

  friendStatsText: {
    color: "#7A28CB",
    textDecorationLine: "underline",
  },

  gameStatsText: {
    color: "#7A28CB",
  },

  scrollViewBis: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#33CA7F",
    paddingHorizontal: 10,
    marginLeft: 30,
    marginright: 30,
    width: "85%",
    borderRadius: 20,
    marginTop: 10,
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headScrollView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "350",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    // flex: 1,
    // backgroundColor: 'pink',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  gradient: {
    height: "100%",
  },
  divLoggedout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6CBFD",
  },
  buttonloggedout: {
    // borderColor:'black',
    // borderWidth:1,
    padding: "2%",
    marginTop: "3%",
    backgroundColor: "white",
    borderRadius: 5,
  },
});
