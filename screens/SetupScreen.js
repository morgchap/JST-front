import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { updateUsername } from "../reducers/user";

const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="yellow" />);
}

// page qui permet de consulter et modifier les informations liées à son profil


export default function SetupScreen({ navigation }) {
  const dispatch = useDispatch();
  const updateUser = (newUsername) => {
    dispatch(updateUsername(newUsername));
  };

  const user = useSelector((state) => state.user.value);

  const [newPseudo, setNewPseudo] = useState("");
  const [changedUsername, setChangedUsername] = useState(user.username);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gotPP, setGotPP] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  // fonction qui permet de modifier son username en appelant une route qui vient modifier l'information en BDD 
    // et en appelant une fonction qui le modifie également dans le reducer


  function updateMyUsername(myNewUsername) {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/updateUsername`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUsername: user.username,
        newUsername: myNewUsername,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.result) {
          setChangedUsername(data.updatedProfile.username);
          updateUser(data.updatedProfile.username);
        } else {
          setError(data.error);
        }
      });
  }

   // même principe pour l'email à part qu'il n'est pas stocké dans le reducer
  function updateMyEmail(myNewEmail) {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/updateEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentEmail: email, newEmail: myNewEmail }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.result) {
          setEmail(data.updatedProfile.email);
        } else {
          setError(data.error);
        }
      });
  }


  // même principe avec le password, en réutilisant la mécanique de cryptage
  function updateMyPassword(myNewPassword) {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/updatePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: changedUsername,
        newPassword: myNewPassword,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (!data.result) {
          setError(data.error);
        }
      });
  }

   //dans le useEffect on va récupérer les quelques infos mofifiables qu'on n'a pas déjà dans le reducer : photo de profil & email

  useEffect(() => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${user.username}`
    )
      .then((result) => result.json())
      .then((data) => {
        setEmail(data.infos.email);
        if (data.infos.profilePicture) {
          setProfilePicture(data.infos.profilePicture);
          setGotPP(true);
        }
        return data;
      });
  }, []);

  return (
    <View style={styles.centered}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headIcons}>
          <FontAwesome
            name="chevron-left"
            color="#7A28CB"
            size={25}
            onPress={() => navigation.goBack()}
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
          <Text style={styles.pseudo}>@{changedUsername}</Text>
        </View>
        <View style={styles.logoutView}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              updateUser({ username: "", token: "", userId: "" });
              navigation.navigate("Profil");
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              navigation.navigate("ProfilePicture2");
            }}
          >
            <Text style={styles.logoutText}>Update my profile picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoDiv}>
          <View style={styles.myInformations}>
            <Text style={styles.secondTitles}>My personal information</Text>
            <View style={styles.randomView}>
              <View style={styles.inputView}>
                <Text style={styles.infoText}>
                  {" "}
                  Username : @{changedUsername}
                </Text>
                <View style={styles.inputSaved}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Type your new pseudo here"
                    onChangeText={(text) => setNewPseudo(text)}
                    value={newPseudo}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => updateMyUsername(newPseudo)}
                  >
                    <Text style={styles.textButton}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputView}>
                <Text style={styles.infoText}> Email : {email}</Text>
                <View style={styles.inputSaved}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Type your new email here"
                    onChangeText={(text) => setNewEmail(text)}
                    value={newEmail}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => updateMyEmail(newEmail)}
                  >
                    <Text style={styles.textButton}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputView}>
                <Text style={styles.infoText}>Change my password</Text>
                <View style={styles.inputSaved}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Type your new password here"
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => updateMyPassword(newPassword)}
                  >
                    <Text style={styles.textButton}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 30,
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
  infoDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  myInformations: {
    width: "100%",
    height: "auto",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    borderRadius: 5,
    marginBottom: 200,
  },
  secondTitles: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    color: "#7A28CB",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 20,
  },

  inputStyle: {
    height: 40,
    width: 200,
    borderColor: "green",
    borderWidth: 1,
    placeholderTextColor: "black",
    borderColor: "green",
    borderRadius: 5,
    marginVertical: 20,
    color: "black",
    backgroundColor: "white",
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
  infoText: {
    fontSize: 16,
    color: "white",
  },

  iconStyle: {
    paddingRight: 10,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
  },

  button: {
    borderRadius: 5,
    height: 35,
    width: 55,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },

  textButton: {
    color: "black",
    fontWeight: "bold",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  inputView: {
    display: "flex",
    width: "100%",
    height: "25%",
    backgroundColor: "#7A28CB",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 5,
    margin: 10,
  },
  inputSaved: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutButton: {
    borderRadius: 5,
    height: 50,
    width: 150,
    backgroundColor: "#7A28CB",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
  },
  scrollContainer: {},
  randomView: {},
});
