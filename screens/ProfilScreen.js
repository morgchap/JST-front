import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function ProfilScreen() {

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
          <Text>7 jeux</Text>
          <Text>12 amis</Text>
      </View>
      <View style={styles.games}>
          <Text style={styles.secondTitles}>Mes jeux préférés</Text>
          <View style={styles.listGame}> 
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
        </View>
      </View>
      <View style={styles.myFriendTitleDiv}>
          <Text style={styles.myFriendsTitle}>Mes amis </Text>
          <Text>(12)</Text>
        </View>
        <ScrollView style={styles.friendsView}>
        
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
            </View>
        </View>
        <View style={styles.friendsContainer}>
            <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
            <Text style={styles.friendsPseudo}>@ami1</Text>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color="purple" size="20" style={styles.iconStyle}/>
              <FontAwesome name="trash" color="purple" size="20"/>
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
      color: "purple",
      paddingBottom: 10,

    },
    stats: {
      display: "flex",
      width: "100%",
      height: "5%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderBottomWidth: 1,

    },
    games: {
      display: "flex",
      width: "100%",
      height: "30%",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      borderBottomWidth: 1,
      paddingBottom: 10,
    },
    secondTitles: {
      fontSize: 16,
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 10,
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
     
    },
    starsContainer: {
      display: "flex",
      flexDirection: "row",
      paddingTop: 5,
    },
    gameTitle: {
      fontStyle: "italic"
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
    },
    myFriendsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
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
      
    }
    
    
  });
  