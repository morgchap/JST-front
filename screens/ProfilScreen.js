import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
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



export default function ProfilScreen() {

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

const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="yellow" />);
}

  return (
    <View style={styles.centered}>
      <View style={styles.me}>
        <Image style={styles.avatar} source={require("../assets/avatar.png")} />
        <Text style={styles.pseudo}>@TheBestMorg</Text>
      </View>
      <View style={styles.stats}>
          <Text style={styles.statsText}>7 jeux</Text>
          <Text style={styles.statsText}>12 amis</Text>
      </View>
      <View style={styles.gameDiv}>
        <View style={styles.games}>
            <Text style={styles.secondTitles}>Mes jeux préférés (5)</Text>
            <ScrollView horizontal={true} style={styles.listGame}> 
              <View style={styles.gameContainer}>
                <Text style={styles.gameTitle}>Mario</Text>
                <Image style={styles.jacket} source={require("../assets/mario.png")}/>
                <View style={styles.starsContainer}>
                {stars}
                </View>
              </View>
              <View style={styles.gameContainer}>
                <Text style={styles.gameTitle}>Mario</Text>
                <Image style={styles.jacket} source={require("../assets/mario.png")}/>
                <View style={styles.starsContainer}>
                {stars}
                </View>
              </View>
              <View style={styles.gameContainer}>
                <Text style={styles.gameTitle}>Mario</Text>
                <Image style={styles.jacket} source={require("../assets/mario.png")}/>
                <View style={styles.starsContainer}>
                {stars}
                </View>
              </View>
              <View style={styles.gameContainer}>
                <Text style={styles.gameTitle}>Mario</Text>
                <Image style={styles.jacket} source={require("../assets/mario.png")}/>
                <View style={styles.starsContainer}>
                {stars}
                </View>
              </View>
              <View style={styles.gameContainer}>
                <Text style={styles.gameTitle}>Mario</Text>
                <Image style={styles.jacket} source={require("../assets/mario.png")}/>
                <View style={styles.starsContainer}>
                {stars}
                </View>
              </View>
            </ScrollView>
        </View>
      </View>
      <View style={styles.myFriendTitleDiv}>
          <Text style={styles.myFriendsTitle}>Mes amis (12)</Text>
        </View>
        <ScrollView style={styles.friendsView}>
        
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="#7A28CB" size={20} style={styles.iconStyle}/>
              <FontAwesome name="trash" color="#7A28CB" size={20}/>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
        flex: 1,
        alignItems: 'start',
        justifyContent: 'start'
    },
    me: {
      display: "flex",
      width: "100%",
      height: "20%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,

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
      //borderBottomWidth: 2,
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
    friendsPseudo: {
      paddingHorizontal: 10,
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
    }
    
    
  });
  