import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { clickedFriend } from "../reducers/friend";
import { addListGames } from "../reducers/user";
import { LinearGradient } from "expo-linear-gradient";

// page où l'on retrouve les informations du profil d'un ami

export default function FriendScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const [numberOfFriends, setNumberOfFriends] = useState(123);
  const [numberOfGames, setNumberOfGames] = useState(123);
  const [numberOfList, setNumberOfList] = useState(123);
  const [gameList, setGameList] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [game, setGame] = useState("");
  const { friendName } = route.params;
  const [gotPP, setGotPP] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [modal, setModal] = useState(false);
  const [message, setmessage] = useState(false);
  const [addable, setAddable] = useState(false);



  const dispatch = useDispatch();
  const selectFriend = (friendUsername) => {
    dispatch(clickedFriend(friendUsername));
  };

  useEffect(() => {
    // redirection automatique si l'on clique sur son nom dans une liste d'ami

    if (user.username === friendName) {
      navigation.navigate("TabNavigator", { screen: "Profil" });
    }
    // fetch des informations de l'ami en question
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${friendName}`)
      .then((result) => result.json())
      .then((data) => {
        setNumberOfFriends(data.infos.friendsList.length);
        if (data.infos.profilePicture) {
          setProfilePicture(data.infos.profilePicture);
          setGotPP(true);
        }
        const fl = data.infos.friendsList;
        for (let obj of fl) {
          if (obj.username == user.username) {
            setAddable(true);
          }
        }

        return data;
      })
      .then((data) => {
        //fetch de ses collections
        fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/id/${data.infos.lists[0]}`
        )
          .then((result) => result.json())
          .then((data) => {
            setNumberOfGames(data.data.gameList.length);
            setGameList(data.data.gameList);
          });
      });

    // recuperer les lists de l'utilisateur qu'on regarde
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${friendName}`)
      .then((response) => response.json())
      .then((data) => {
        setNumberOfList(data.lists.length);
        setAllLists(data.lists);
      });
  }, [friendName, user.username, navigation]);

  const stars = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < 4 - 1) {
      style = "star";
    }
    stars.push(<FontAwesome key={i} name={style} color="yellow" />);
  }

  // variable permettant de gérer l'ajout de l'utilisateur en ami :
  //  s'il est déjà ami, le bouton sera grisé et indiquera "You are already friends"

  let addButton = (
    <View style={styles.logoutView}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => addAFriend()}
      >
        <Text style={styles.logoutText}>Ask as a friend</Text>
      </TouchableOpacity>
    </View>
  );
  if (addable) {
    addButton = (
      <View style={styles.logoutView}>
        <TouchableOpacity style={styles.noButton}>
          <Text style={styles.logoutText}>You are already friends</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // fonction asyncrhone permettant de gérer l'ajout en ami
  async function addAFriend() {
    try {
      // étape 1 : on récupére notre ID
      const userResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${user.username}`
      );
      const userData = await userResponse.json();

      // étape 2 : on récupére l'ID de l'utilisateur visé par la demande
      const friendResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${friendName}`
      );
      const friendData = await friendResponse.json();

      // étape 3 : on crée une demande d'ami "pending" en BDD
      const addFriendResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/addFriend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: userData.infos._id,
            receiver: friendData.infos._id,
          }),
        }
      );
      const addFriendData = await addFriendResponse.json();
      setmessage(true);
    } catch (error) {
      console.error("Erreur dans addAFriend:", error.message);
    }
  }

  // variables de gestion du pluriel
  let pluralFriends = "";
  if (numberOfFriends > 1) {
    pluralFriends = "s";
  }

  let pluralGames = "";
  if (numberOfGames > 1) {
    pluralGames = "s";
  }

  //mapping de la liste de jeu préférés
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
      <View key={i} style={styles.gameContainer}>
        <Text style={styles.gameTitle}>{name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Games", { gameName: data.name })}
          activeOpacity={0.8}
        >
          <Image
            style={styles.jacket}
            source={{ uri: `${data.cover}`, height: 100, width: 75 }}
          />
        </TouchableOpacity>
        <View style={styles.starsContainer}>{stars}</View>
      </View>
    );
  });

  // mapping des collections du joueur
  const lists = allLists.map((data, i) => {
    let title =
      data.listName.length >= 13
        ? data.listName.slice(0, 10) + "..."
        : data.listName;
    let plural = data.gameList.length < 2 ? "jeu" : "jeux";
    return (
      <View key={i} style={styles.boxOfLists}>
        <Text style={styles.listName}>{title}</Text>
        <TouchableOpacity
          onPress={() => handleSeeList(data.listName)}
          activeOpacity={0.8}
        >
          <Image
            style={styles.jacket}
            source={require("../assets/mario.png")}
          />
        </TouchableOpacity>
        <View style={styles.textOfListBottom}>
          <Text style={styles.listLength}>
            {data.gameList.length} {plural}
          </Text>
        </View>
      </View>
    );
  });

  const handleSeeList = (listName) => {
    listName = listName.replaceAll(" ", "_");
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/getGames/${listName}/${friendName}`
    )
      .then((response) => response.json())
      .then((data) => {
        let gamesList;
        if (data.error === "their list is empty.") {
          gamesList = [
            <View key={0}>
              <Text>their list is empty</Text>
            </View>,
          ];
        } else {
          gamesList = data.list.map((data, i) => {
            // data[0] is the title of the game, data[1] is the uri link to the cover of the game
            let title;
            if (data[0].length >= 12) {
              title = data[0].slice(0, 9) + "...";
            } else {
              title = data[0];
            }
            return (
              <View key={i} style={styles.game}>
                <TouchableOpacity onPress={() => handleNavigation(data[0])}>
                  <Image
                    style={styles.jaquette}
                    source={{ uri: `${data[1]}` }}
                  />
                </TouchableOpacity>
                <Text styles>{title}</Text>
              </View>
            );
          });
        }
        setModal(true);
        setGame(gamesList);
      });
  };

  const handleNavigation = (gameName) => {
    setModal(false);
    navigation.navigate("Games", { gameName });
  };

  return (
    <View style={styles.centered}>
      <View style={styles.headIcons}>
        <FontAwesome
          name="chevron-left"
          color="#00A877"
          size={25}
          onPress={() => {
            navigation.goBack();
            selectFriend("");
          }}
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
        <Text style={styles.pseudo}>@{friendName}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {numberOfGames} Game{pluralGames}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("FriendList", { userFriendList: friendName });
            //selectFriend(user.username)
          }}
        >
          <Text style={styles.friendStatsText}>
            {numberOfFriends} ami{pluralFriends}
          </Text>
        </TouchableOpacity>
      </View>
      {addButton}
      <ScrollView>
        <View style={styles.gameDiv}>
          <View style={styles.games}>
            <Text style={styles.secondTitles}>
              Their favorite games ({numberOfGames})
            </Text>
            <ScrollView horizontal={true} style={styles.listGame}>
              {games}
            </ScrollView>
          </View>
        </View>

        <View style={styles.listDiv}>
          <View style={styles.lists}>
            <Text style={styles.secondTitles}>
              Their lists ({numberOfList})
            </Text>
            <ScrollView horizontal={true} style={styles.listLists}>
              {lists}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <Modal transparent={true} visible={message}>
        <View style={styles.modalBackground2}>
          <View style={styles.modalContainer2}>
            <View style={styles.backbutton}>
              <FontAwesome
                name="times"
                color="#7A28CB"
                size={25}
                onPress={() => setmessage(false)}
              />
            </View>
            <Text>Your friend's request was sent</Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          /* Alert.alert('Modal has been closed.'); */
          setModal(true);
        }}
      >
        <View style={styles.modalBackground}>
          <ImageBackground
            source={require("../assets/background-blur.png")}
            style={styles.backgroundImage}
          >
            <View style={styles.modalContainer}>
              <View style={styles.backbutton}>
                <FontAwesome
                  name="times"
                  color="#7A28CB"
                  size={25}
                  onPress={() => setModal(false)}
                />
              </View>
              <View style={styles.gameContainerList}>
                <ScrollView horizontal={true}>{game}</ScrollView>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "start",
    justifyContent: "start",
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
    borderColor: "#8FBC8B",
    borderWidth: 3,
  },

  pseudo: {
    fontSize: 20,
    paddingTop: 10,
    color: "#00A877",
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
    backgroundColor: "#00A877",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    paddingBottom: 1,
  },

  friendsPseudo: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#00A877",
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
    color: "#00A877",
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  rightButton: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#00A877",
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
    color: "#00A877",
  },

  friendStatsText: {
    color: "#00A877",
    textDecorationLine: "underline",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  scrollViewBis: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#00A877",
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
    borderRadius: 5,
    height: 50,
    width: 100,
    backgroundColor: "#00A877",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  listDiv: {},

  lists: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00A877",
    marginHorizontal: 10,
    borderRadius: 5,
  },

  listLists: {
    display: "flex",
    flexDirection: "row",
  },

  listLists: {
    marginHorizontal: 10,
  },

  boxOfLists: {
    width: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 10,
  },

  listName: {
    color: "white",
  },
  listLength: {
    color: "white",
  },
  noButton: {
    borderRadius: 5,
    height: 60,
    width: 150,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backgroundImage: {
    width: "100%",
  },
  modalContainer: {
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  gameContainerList: {
    flexDirection: "row",
  },
  jaquette: {
    height: 160,
    width: 120,
  },
  game: {
    marginVertical: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backbutton: {
    width: 20,
    alignItems: "flex-end",
  },
  modalBackground2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer2: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
