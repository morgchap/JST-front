import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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




export default function FriendListScreen({ navigation, route }) {

    const { userFriendList } = route.params;
    const [numberOfFriends, setNumberOfFriends] = useState(123);
    const [friendList, setFriendList] = useState([]);
    const [gotPP, setGotPP] = useState(false) 
    const [profilePicture, setProfilePicture] = useState(null); 
    const [friendPP, setFriendPP] = useState(false);
    const [friendProfilePicture, setFriendProfilePicture] = useState(null);




    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${userFriendList}`)
        .then(result => result.json())
        .then(data => {
    
          setNumberOfFriends(data.infos.friendsList.length);
          setFriendList(data.infos.friendsList);

          if (data.infos.profilePicture) {
            setProfilePicture(data.infos.profilePicture);
            setGotPP(true)
            } 
          return data
        })
      }, [userFriendList])


    const friendListContent = friendList.map((data, i) => {

      let fpp = <Image style={styles.friendsAvatars} source={require("../assets/avatar.png")} />;

      if (data.profilePicture) {
         fpp = <Image style={styles.friendsAvatars} source={{uri: data.profilePicture}}/>
        }

        return (
          <TouchableOpacity key={i} style={styles.friendsContainer} onPress={() => {
            navigation.navigate("Friend", {friendName : data.username});
            
            }}>
            {fpp}
            <Text style={styles.friendsPseudoBis}>@{data.username}</Text>
            <View style={styles.iconContainer}>
            </View>
          </TouchableOpacity>
        );
      })
      
        

    return (
        <View style={styles.centered}>
            <View style={styles.headIcons}>
                <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
            </View>
            <View style={styles.me}>
                 { gotPP ? (
                                <Image style={styles.avatar} source={{uri: profilePicture}}/>) : (
                                  <Image style={styles.avatar} source={require("../assets/avatar.png")} />
                                )}
                <Text style={styles.pseudo}>@{userFriendList}</Text>
            </View>
            <Text style={styles.titleFriendList}>friend's list ({friendList.length})</Text>
            <View style={styles.friendListContainer}>
            <ScrollView>
                  {friendListContent}
                </ScrollView>
            </View>
        </View>
        
    )
}



const styles = StyleSheet.create({

    centered: {
          flex: 1,
          alignItems: 'start',
          justifyContent: 'start',
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

      titleFriendList: {
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#7A28CB",
        paddingBottom: 20,

      },

      friendListContainer: {

          display: "flex",
          width: "95%",
          height: "55%",
          backgroundColor: "#7A28CB",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          borderBottomWidth: 2,
          borderBottomColor: '#7A28CB',
          paddingBottom: 10,
          borderRadius: 5,
          marginLeft: 10,
  

        
        },

        friendsContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          paddingVertical: 10,
          marginLeft: 20,
          marginTop: 10,
          borderBottomColor: "green",
          borderBottomWidth: 1,
          marginRight: 20,
    
          
    
        },

        friendsAvatars: {
          borderRadius: 50,
          height: 50,
          width: 50,
          paddingBottom: 1
        },

        friendsPseudoBis: {
      paddingHorizontal: 10,
      fontSize: 16,
      color: "white",
    },
      

    })
