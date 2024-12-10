import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
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


const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="yellow" />);
}


export default function SetupScreen({ navigation }) {

    const [newPseudo, setNewPseudo] = useState("");
    console.log(newPseudo);


  let [fontsLoaded] = useFonts({
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
  });

  return (
    <View style={styles.centered}>
    <View style={styles.headIcons}>
    <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
    </View>
    <View style={styles.me}>
      <Image style={styles.avatar} source={require("../assets/avatar.png")} />
      <Text style={styles.pseudo}>@TheBestMorg</Text>
    </View>
    
    <View style={styles.infoDiv}>
      <View style={styles.myInformations}>
          <Text style={styles.secondTitles}>Mes informations</Text>
          <View style={styles.infoList}> 
            <Text style={styles.infoText}>Your pseudo : @TheBestMorg</Text>
            <TextInput style={styles.inputStyle} placeholder='Type your new pseudo here' onChangeText={text => setNewPseudo(text)} value={newPseudo}/>
            <Text style={styles.infoText}>Your email : morgane@gmail.com</Text>
            <TextInput style={styles.inputStyle} placeholder='Type your new email here' onChangeText={text => setNewPseudo(text)} value={newPseudo}/>
            <Text style={styles.infoText}>You want to change your password?</Text>
            <TextInput style={styles.inputStyle} placeholder='Type your new password here' onChangeText={text => setNewPseudo(text)} value={newPseudo}/>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.textButton}>Save my changes</Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: 10,

  
  },
  secondTitles: {
    fontSize: 18,
    fontFamily:'OpenSans_600SemiBold',
    color : "#7A28CB",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 20,
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
  infoList: {
    display: "flex",
    flexDirection: "column",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
   
  },
  inputStyle: {
        height: 40, 
        width: 250,
    	borderColor: 'gray', 
    	borderWidth: 1,
    	placeholderTextColor: 'gray',
        borderColor: "black",
        borderRadius: 5,
        marginVertical: 20,
  },
 
  friendsView: {
    display: "flex",
    width: "100%",
    height: "auto",
    flexDirection: "column",
    
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
  infoText: {
    fontSize: 16,
    color: "#7A28CB",
  },
  myFriendsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    fontFamily:'OpenSans_600SemiBold',
    color : '#7A28CB',
  },
  myFriendTitleDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconStyle: {
    paddingRight: 10,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    
  },
  statsText: {
    color : '#7A28CB',
  },
  button: {
    borderRadius: 10,
    height: 40,
    width: 150,
    backgroundColor: '#7A28CB',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  textButton: {
    color: "white",
    fontWeight: "bold",

  }
  
  
});
