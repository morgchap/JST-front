import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

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




export default function FriendListScreen({ navigation }) {

    const friend = useSelector((state) => state.friend.value)
    const [numberOfFriends, setNumberOfFriends] = useState(123);
    const [numberOfGames, setNumberOfGames] = useState(123);



    useEffect(() => {

        console.log("ça marche");
    
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/${friend}`)
        .then(result => result.json())
        .then(data => {
          console.log("c'est le front!", data.infos)
    
          setNumberOfFriends(data.infos.friendsList.length);
          setMyId(data.infos._id)
    
          console.log("number of friends ", numberOfFriends);
          console.log("Id de list", data.infos.lists[0]);
    
          fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/receivedFriendRequests/${data.infos._id}`)
          .then(result => result.json())
          .then(databis => {
            console.log("fetch de la friendlist received", databis.data)
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
              
            })
        })
    }, [])

    const friendListContent = "test"

    /*
    const friendListContent = sentFriendRequestList.map((data, i) => {
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
        */

    return (
        <View style={styles.centered}>
            <View style={styles.headIcons}>
                <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
            </View>
            <View style={styles.me}>
                <Image style={styles.avatar} source={require("../assets/avatar.png")} />
                <Text style={styles.pseudo}>@{friend}</Text>
            </View>
            <Text>Les amis de @{friend}</Text>
            
                <View>
                {friendListContent}
                </View>
        </View>
        
    )
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
        color: "#7A28CB",
        paddingBottom: 10,
        fontWeight: "bold",
  
      },

    })
