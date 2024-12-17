import { Text, View, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { OpenSans_300Light_Italic, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { Collapsible } from 'react-native-fast-collapsible';
import { useDispatch, useSelector } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import { addListGames } from '../reducers/user';

export default function GamesScreen({navigation, route}) {

    //const gamedata = useSelector((state) => state.game.value);
    //console.log(`reducer : ${gamedata}`)a
    const dispatch = useDispatch();
    const {gameName} = route.params;
    const user = useSelector((state) => state.user.value)
    const currentUser = user.username

    const [isVisible, setVisibility] = useState(false);
    const [icon, setIcon]= useState('caret-down')
    const [isVisible2, setVisibility2] = useState(false);
    const [icon2, setIcon2]= useState('caret-down')
    const [gamesinfo, setGamesInfo]=useState([])
    const [summary, setsummary] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setmessage] = useState(false);
    const [review, setReview] = useState(false)
    const [personalNote, setPersonalNote] = useState(0);
    const [writtencontent, setWrittentContent]= useState('')
    const [gamereview, setGameReview] = useState([])
    const [heartLiked, setHeartLiked] = useState(false);
    //console.log(`game : ${gameName}`)

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
      
    const handleAddGameToList = ( listName ) => {
      setModalVisible(false)
      setmessage(true)
      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/addToList`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: user.username, listName, gameName }),
          }).then(response => response.json())
            .then(data => {
//console.log("test", data)
              if(!data.result){
                console.log(data.error)
              } else {
                console.log(data.message)
                dispatch(updateChange())
              }
            });
    }
      
   const  handlesubmit = () => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/newreview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name : gameName, username: user.username, reviewcontent: writtencontent, note: personalNote,
      })
  }).then(response => response.json()).then(doc=> {
    if(doc.result){
      //console.log(doc.ratings)
      setGameReview( [... gamereview, doc.ratings] );
      setReview(false)
    }
  }
  )}

  function likeAComment() {
    setHeartLiked(!heartLiked);
    console.log("changement de like")
    /*
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/ratings/likeAReview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ratingId : gameName, 
        userId: user.username
      })
    })
      */

  }


   const myreview = gamereview.map((data, i)=> {

    const mynotestars = []; 

    let isLiked = "heart-o"

    if (heartLiked == true) {
      isLiked = "heart"
    }

for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < data.note+1) {
      style =  style = "star";
    }
    mynotestars.push(<FontAwesome key={i} name={style} color="#f1c40f" size={15}/>);
  }

    return(
      <View key={i} style = {styles.friendsReviews}>
      <View style={styles.picanduseandreview}> 
      <Image source={require("../assets/avatar.png")} style={styles.friendsAvatars} />
      <View style={styles.useandreview}>
        <View style={styles.userandlike}>
          <Text style={styles.friendsPseudo}>@{user.username}</Text>
          <FontAwesome name={isLiked} style={styles.heartIcon} size={15} onPress={() => likeAComment()} />
        </View>
      <View style={styles.starsContainer2}>
           {mynotestars}
          <Text style ={styles.votecount2}>{data.note}</Text>
      </View> 
      </View>
      </View>   
      <View style={styles.comment}>
          <Text>{data.writtenOpinion}</Text>
      </View>
      </View>
    )
   })

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
            //console.log(data)
            setGamesInfo(data.game);
            if (summary.length > 100){
            setsummary(summary.slice(100))}
          })
      }, []);
     
    const summaryToHTML = gamesinfo.summary
   // console.log(gamesinfo.summary)
    const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="#f1c40f" size={20}/>);
}
const stars2 = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars2.push(<FontAwesome key={i} name={style} color="#f1c40f" size={15} />);
}

  const lists = user.lists.map((data, i) => {
    return (
      <TouchableOpacity key={i} onPress={() => handleAddGameToList(data.listName)} style={styles.listcont}>
        <Text style={styles.modalText}>{data.listName}</Text>
      </TouchableOpacity>
    )
    
  })
//handle personnal note
  const personalStars = [];
  for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < personalNote) {
      style =  style = "star";
    }
    personalStars.push(<FontAwesome key={i} name={style} color="#f1c40f" size={40} onPress={()=> setPersonalNote(i+1)}/>);
  }

const mynotestars = []; 
for (let i = 0; i < 5; i++) {
    let style = "star-o";
    if (i < personalNote) {
      style =  style = "star";
    }
    mynotestars.push(<FontAwesome key={i} name={style} color="#f1c40f" size={40}/>);
  }

  let pageContent= <View style={styles.centered}>
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
  <ScrollView style= {styles.scroll} 
  //</View>onContentSizeChange={(1000, 1000)}
  >
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
      <TouchableOpacity style={styles.greenbutton}
      onPress={()=> setReview(true)}
      >
          <Text style={styles.buttontext}>Write a review</Text>
      </TouchableOpacity>
   </View>
   <Text style ={styles.summary}>
          Summary
  </Text>
   <ScrollView style={styles.resumebox}>
      <HTMLView
      value={summaryToHTML}
      stylesheet={styles.resume}
  />
   </ScrollView>
    <SafeAreaView style={styles.container}>
    <Text style ={styles.summary}>
          Reviews
  </Text>
  <Text style ={styles.summary}>
         My review
  </Text>
      {myreview}
<TouchableOpacity onPress={toggleVisibility} style={styles.container2}>
  <Text>My friend's reviews</Text>
  <FontAwesome name='caret-down' color="black" size={20}/>
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
  <FontAwesome name={icon2} color="black" size={20}/>
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
        <View style={styles.modalContainer}>
        <View style={styles.backbutton}>
        <FontAwesome 
          name="times"
          color="#7A28CB" 
          size={25} 
          onPress={() => setModalVisible(false)} 
        />
      </View> 
          <ScrollView style={styles.scroll2}>
            {lists}  
          </ScrollView>  
        </View>
    </View> 
    </Modal>

    <Modal
      transparent={true}
      visible={message}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
        <View style={styles.backbutton}>
        <FontAwesome 
          name="times"
          color="#7A28CB" 
          size={25} 
          onPress={() => setmessage(false)} 
        />
      </View> 
         <Text>Votre jeux a bien été ajoutéé</Text>
        </View>
    </View> 
    </Modal>

    <Modal
      transparent={true}
      visible={review}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setReview(!review);
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer3}>
        <View style={styles.backbutton}>
        <FontAwesome 
          name="times"
          color="#7A28CB" 
          size={25} 
          onPress={() => setReview(false)} 
        />
      </View> 
        <View style ={styles.scrollcont}>
         <ScrollView style={styles.reviewcont}>
           <View style={styles.starsContainer}>
             {personalStars}
          </View>
          <View style={styles.reviewinputcont}>
          <TextInput style={styles.reviewinput}
            placeholder='my review'
            enterKeyHint='send'
            onChangeText={(value) => setWrittentContent(value)}
            value={writtencontent}
            onSubmitEditing={()=> handlesubmit()}   
            >
            </TextInput>
          </View>
         </ScrollView>
         </View>
         <View>

         </View>
        </View>
    </View> 
    </Modal>
</View>



// if user is not logged in : 

  if (!user.username){
    pageContent = <View style={styles.centered}>
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
    <ScrollView style= {styles.scroll} 
    //</View>onContentSizeChange={(1000, 1000)}
    >
     <View style ={styles.downside}>
    <Text style={styles.title}>{gamesinfo.name}</Text>
    <Text style={styles.date}>{gamesinfo.releaseDate}</Text>
    <View style={styles.line}></View>
    <View style={styles.starsContainer}>
         {stars}
         <Text style ={styles.votecount}>3,5</Text>
     </View>

     <Text style ={styles.summary}>
            Summary
    </Text>
     <ScrollView style={styles.resumebox}>
        <HTMLView
        value={summaryToHTML}
        stylesheet={styles.resume}
    />
     </ScrollView>
      <SafeAreaView style={styles.container}>
      <Text style ={styles.summary}>
            Reviews
    </Text>

  <TouchableOpacity onPress={toggleVisibility2} style={styles.container2}>
    <Text style = {styles.collapsedname}>Most liked reviews</Text>
    <FontAwesome name={icon2} color="black" size={20}/>
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
    </View>
  }

  return (
    <>
    {pageContent}
    </>
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
        width:'40%', 
        borderRadius: 10,
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
        // borderColor:'black', 
        // borderWidth:1,
        width:'100%',
        justifyContent:'center', 
        alignItems:'center',
        zIndex:100,
        // backgroundColor:'white',
        height:'80%'
      },

      title:{
        marginTop:10,
        fontFamily:'OpenSans_600SemiBold', 
        fontSize: 20,
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
        fontSize: 20, 
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
        maxHeight:50, 
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
        marginTop:10,
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
        //gap:10,
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
        alignItems:'center', 
        //justifyContent:'center',
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
        marginBottom:1,
      }, 
      footer:{
        position:'absolute',
        height:400,
        //backgroundColor:'red', 
        width:'100%'
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
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      scroll2:{
        width:'100%'
      },
      modalText: {
        fontSize: 18,
        marginBottom: 10,
      },
      listcont:{
        backgroundColor:'#D4FDC6', 
        padding:'4%',
        marginTop: 10,
        width:'100%',
        alignContent:'center',
      }, 
      reviewcont:{
        borderColor:'#7A28CB', 
        borderWidth:1,
        width:'100%',
        height:'90%',
      }, 
      modalContainer3:{
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        maxHeight:300

      }, 
      reviewinput:{
        backgroundColor:'#F0F0F0',
        height:'80%',
        padding:5,
      }, 
      reviewinputcont:{
        marginHorizontal:5,
      }, 
      greenbutton2:{
        borderColor:'#33CA7F', 
        borderWidth:1,
        backgroundColor:'white',
        height:50,
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
        width:'60%'
      }, 
      scrollcont:{
        width:'100%', 
        alignItems:'center', 
        justifyContent:'center',
      },
      heartIcon: {
        color: "red",
      },
      userandlike: {
        width: 250,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }
  });
