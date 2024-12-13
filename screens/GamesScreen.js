import { Text, View, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { OpenSans_300Light_Italic, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { Collapsible } from 'react-native-fast-collapsible';
import { useSelector } from 'react-redux';

export default function GamesScreen({navigation, route}) {

    //const gamedata = useSelector((state) => state.game.value);
    //console.log(`reducer : ${gamedata}`)
    const {gameName} = route.params
    const [isVisible, setVisibility] = useState(false);
    const [icon, setIcon]= useState('caret-down')
    const [isVisible2, setVisibility2] = useState(false);
    const [icon2, setIcon2]= useState('caret-down')
    const [gamesinfo, setGamesInfo]=useState([])
    const [summary, setsummary] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    console.log(`game : ${gameName}`)

    const toggleVisibility = () => {
      setVisibility((previous) => !previous);
      if(isVisible){
        setIcon('caret-down')
      }else {
        setIcon('caret-right')
      }
    };
    const toggleVisibility2 = () => {
        setVisibility2((previous) => !previous);
        if(isVisible2){
          setIcon2('caret-down')
        }else {
          setIcon2('caret-right')
        }
      };
   
      
      useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/byname`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              name : gameName, 
            })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setGamesInfo(data.game);
            if (summary.length > 100){
            setsummary(summary.slice(100))}
          })
      }, []);
     
    
    const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="#f1c40f" size='20'/>);
}
const stars2 = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars2.push(<FontAwesome key={i} name={style} color="#f1c40f" size='15'/>);
}
  return (
    <View style={styles.centered}>
        <View style={styles.bgpicture}>
        <LinearGradient
        // Background Linear Gradient
        colors={['rgba(122,40,203,1)', 'rgba(51,202,127,0.4)']}
        style={styles.gradient}
      >
        <SafeAreaView style ={styles.Imgview}> 
        <View style={styles.backbutton}>
        <FontAwesome name="chevron-left" color="white" size={25} style={styles.icon} onPress={() => navigation.goBack()} />
        </View>       
         <Image style={styles.jaquette} source={{uri : gamesinfo.cover}} />
         <View style={styles.backbutton}>
        <FontAwesome name="ellipsis-h" color="white" style={styles.icon} size={25} 
        // onPress={() => navigation.goBack()} 
        />
        </View>       
        </SafeAreaView>
      </LinearGradient>
        </View>
        <View style={styles.general}>
        <ScrollView style= {styles.scroll}>
         <View style ={styles.downside}>
        <Text style={styles.title}>{gamesinfo.name}</Text>
        <Text style={styles.date}>{gamesinfo.releaseDate}</Text>
        <View style={styles.line}></View>
        <View style={styles.starsContainer}>
             {stars}
             <Text style ={styles.votecount}>3,5</Text>
         </View>
         <View style={styles.topbutton}>
            <TouchableOpacity style={styles.greenbutton} 
            onPress={() => setModalVisible(true)}>
                <Text style={styles.buttontext}>add to list</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenbutton}>
                <Text style={styles.buttontext}>Write a review</Text>
            </TouchableOpacity>
         </View>
         <Text style ={styles.summary}>
                Summary
        </Text>
         <ScrollView style={styles.resumebox}>
            <Text style={styles.resume}>
            {summary}
            </Text>
         </ScrollView>
          <SafeAreaView style={styles.container}>
          <Text style ={styles.summary}>
                Reviews
        </Text>   
      <TouchableOpacity onPress={toggleVisibility} style={styles.container2}>
        <Text style = {styles.collapsedname}>My friend's reviews</Text>
        <FontAwesome name={icon} color="black" size='20'/>
      </TouchableOpacity>

      <Collapsible isVisible={isVisible}>
        <View style = {styles.friendsReviews}>
        <View style={styles.picanduseandreview}> 
        <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
        <View style={styles.useandreview}>
        <Text style={styles.friendsPseudo}>@monami</Text>
        <View style={styles.starsContainer2}>
             {stars2}
            <Text style ={styles.votecount2}>3,5</Text>
        </View> 
        </View>
        </View>   
        <View style={styles.comment}>
            <Text>That is my favorite game i would 100% recommend it</Text>
        </View>
        </View>
        <View style = {styles.friendsReviews}>
        <View style={styles.picanduseandreview}> 
        <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
        <View style={styles.useandreview}>
        <Text style={styles.friendsPseudo}>@monami</Text>
        <View style={styles.starsContainer2}>
             {stars2}
            <Text style ={styles.votecount2}>3,5</Text>
        </View> 
        </View>
        </View>   
        <View style={styles.comment}>
            <Text>That is my favorite game i would 100% recommend it</Text>
        </View>
        </View>
      </Collapsible>



      <TouchableOpacity onPress={toggleVisibility2} style={styles.container2}>
        <Text style = {styles.collapsedname}>Most liked reviews</Text>
        <FontAwesome name={icon2} color="black" size='20'/>
      </TouchableOpacity>
      <Collapsible isVisible={isVisible2}>
        <View style = {styles.friendsReviews}>
        <View style={styles.picanduseandreview}> 
        <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
        <View style={styles.useandreview}>
        <Text style={styles.friendsPseudo}>@monami</Text>
        <View style={styles.starsContainer2}>
             {stars2}
            <Text style ={styles.votecount2}>3,5</Text>
        </View> 
        </View>
        </View>   
        <View style={styles.comment}>
            <Text>That is my favorite game i would 100% recommend it</Text>
        </View>
        </View>
        <View style = {styles.friendsReviews}>
        <View style={styles.picanduseandreview}> 
        <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
        <View style={styles.useandreview}>
        <Text style={styles.friendsPseudo}>@monami</Text>
        <View style={styles.starsContainer2}>
             {stars2}
            <Text style ={styles.votecount2}>3,5</Text>
        </View> 
        </View>
        </View>   
        <View style={styles.comment}>
            <Text>That is my favorite game i would 100% recommend it</Text>
        </View>
        </View>
      </Collapsible>
    </SafeAreaView>
         </View> 
         <View style ={styles.footer}>
        </View>  
        </ScrollView>
        </View>
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalBackground}>
            <View style={styles.backbutton}>
          <FontAwesome 
            name="times"
            color="#7A28CB" 
            size={25} 
            onPress={() => setModalVisible(false)} 
          />
            </View> 
            <View style={styles.modalContainer}>
              <ScrollView style={styles.scroll2}>
              <TouchableOpacity>
              <Text style={styles.modalText}>List 1</Text>
              </TouchableOpacity>  
              <TouchableOpacity>
              <Text style={styles.modalText}>List 2</Text>
              </TouchableOpacity>  
              </ScrollView>  
            </View>
          </View> 
          </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor:'white',
    },
    bgpicture:{
        position: 'relative',
        height:'30%',
        width:'100%', 
    }, 
    gradient:{
        height:'100%', 
        width:'100%', 
        alignItems: 'center', 
        justifyContent:'center', 
        zIndex:0,  
    }, 
    jaquette:{
        height:'95%', 
        width:'30%', 
        borderRadius:'5%'
    }, 
    Imgview: {
        width:'100%',
        height:'80%', 
        flexDirection:'row',
        justifyContent:'space-between'
    }, 
    backbutton: {
        width: '10%',
        marginLeft:'5%',
      },
      general:{
        borderColor:'black', 
        // borderWidth:1,
        height:'70%',
        width:'100%',
        justifyContent:'center', 
        alignItems:'center',
        zIndex:100,
        backgroundColor:'white',
        
      },
      title:{
        marginTop:'10%',
        fontFamily:'OpenSans_600SemiBold', 
        fontSize:'20'
      }, 
      line:{
        borderBottomWidth:2, 
        height: 0.5,
        width:'95%', 
        borderColor:'#7A28CB',
        marginTop:'2%'
       }, 
       starsContainer: {
        // borderColor:'black', 
        // borderWidth:1,
        width:'100%',
        display: "flex",
        flexDirection: "row",
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 5,
      },
      starsContainer2: {
        // borderColor:'black', 
        // borderWidth:1,
        width:'100%',
        display: "flex",
        flexDirection: "row",
        alignItems:'flex-start',
        justifyContent:'flex-start',
        paddingTop: 5,
        marginLeft:'4%',
      },
      votecount:{
        marginLeft:'2%',
        fontSize:20, 
        fontFamily:'OpenSans_300Light_Italic'
      }, 
      votecount2:{
        marginLeft:'2%',
        fontSize:12, 
        fontFamily:'OpenSans_300Light_Italic'
      },
      greenbutton:{
        borderColor:'#33CA7F', 
        borderWidth:1,
        backgroundColor:'white',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:25, 
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }, 
      
      topbutton:{
        marginTop:'3%',
        flexDirection:'row',
        // borderColor:'black', 
        // borderWidth:1,
        width:'100%',
        height:'6%', 
        alignItems:'center',
        justifyContent:'center',
        gap:'10%'
      }, 
      buttontext:{
        paddingHorizontal:'5%'
      },
      resume:{
        padding:'5%'
      },
      resumebox:{
        width:'85%',
        borderColor:'#33CA7F', 
        borderRadius:10,
        borderWidth:3,
        minHeight:'30%',
        maxHeight:'30%'
      }, 
      icon:{
        position:'static'
      },
      downside:{
        justifyContent:'center', 
        alignItems:'center'
      }, 
      summary:{
        marginTop:'5%',
        fontFamily:'OpenSans_600SemiBold',
        color:'#7A28CB',
        width:'80%'
      }, 
      container:{
        height:'20%',
        marginTop:'10%',
        marginBottom:100,
        // borderColor:'black', 
        // borderWidth:1,
        width:'100%'
      }, 
      container2:{
        flexDirection:'row',
        gap:10,
        backgroundColor:'#EEEEEE',
        // borderBottomWidth:1, 
        // borderBottomColor:'#7A28CB',
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height:'20%',
        padding:'2%', 
        borderRadius:10, 
        margin:'3%',
        minHeight:'7%'
      }, 
      friendsReviews:{
        backgroundColor:'#EEEEEE',
        padding:'2%',
        margin:'2%', 
        borderRadius:10

      }, 
      friendsAvatars: {
        borderRadius: 50,
        height: 50,
        width: 50,
        paddingBottom: 1
      },
  
      friendsPseudo: {
        fontSize: 16,
        color: "#7A28CB",
      },
      comment:{
        marginTop:'2%'
      }, 
      picanduseandreview:{
        flexDirection:'row'
      }, 
      useandreview:{
        // borderColor:'black', 
        // borderWidth:1,
        alignItems:'flex-start',
        marginLeft:'2%'
      }, 
      collapsedname:{
        fontSize:15
      },
      scroll:{
        width:'100%',
        paddingHorizontal:'5%',
        marginBottom:10
      }, 
      footer:{
        height:300
      }, 
      modal: {
        backgroundColor: 'red',
        height: '50%',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1
      },
      modalbox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
      modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      scroll2:{

      },
      modalText: {
        fontSize: 18,
        marginBottom: 10,
      },
  });