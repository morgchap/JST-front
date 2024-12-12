import { Text, View, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { OpenSans_300Light_Italic, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { Collapsible } from 'react-native-fast-collapsible';

export default function HomeScreen({navigation}) {

    const [isVisible, setVisibility] = useState(false);

    const toggleVisibility = () => {
      setVisibility((previous) => !previous);
    };
    
    
    const stars = [];
for (let i = 0; i < 5; i++) {
  let style = "star-o";
  if (i < 4 - 1) {
    style = "star";
  }
  stars.push(<FontAwesome key={i} name={style} color="#f1c40f" size='20'/>);
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
         <Image style={styles.jaquette} source={{uri : 'https://media.rawg.io/media/screenshots/1d7/1d75b9d60cb5884a0b19d21df8557c0c.jpg'}} />
         <View style={styles.backbutton}>
        <FontAwesome name="ellipsis-h" color="white" style={styles.icon} size={25} 
        // onPress={() => navigation.goBack()} 
        />
        </View>       
        </SafeAreaView>
      </LinearGradient>
        </View>
        <View style={styles.general}>
        <ScrollView>
         <View style ={styles.downside}>
        <Text style={styles.title}>Super Mario</Text>
        <View style={styles.line}></View>
        <View style={styles.starsContainer}>
             {stars}
             <Text style ={styles.votecount}>3,5</Text>
         </View>
         <View style={styles.topbutton}>
            <TouchableOpacity style={styles.greenbutton}>
                <Text style={styles.buttontext}>add to list</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenbutton}>
                <Text style={styles.buttontext}>Write a review</Text>
            </TouchableOpacity>
         </View>
         <Text style ={styles.summary}>
                Summary
        </Text>
         <View style={styles.resumebox}>
            <Text style={styles.resume}>
            Mario, Super Mario atau SMB adalah suatu permainan platform yang dikembangkan dan diterbitkan oleh Nintendo pada akhir 1985 untuk konsol Nintendo Entertainment System. Permainan ini membawa pengaruh yang besar pada perkembangan dunia hiburan rumahan dan merupakan salah satu permainan terlaris dengan penjualan lebih dari 40 juta salinan hingga saat ini. Dengan latar permainan yang cerah dan alur cerita yang berkembang, Super Mario Bros. berhasil mengubah wajah industri permainan video. Meskipun sering disalah persepsikan sebagai permainan platform bergulir
            </Text>
         </View>
          <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={toggleVisibility} style={styles.container2}>
        <Text>My friend's reviews</Text>
        <FontAwesome name='caret-down' color="black" size='20'/>
      </TouchableOpacity>

      <Collapsible isVisible={isVisible}>
        <Text>Lorem ipsum....</Text>
      </Collapsible>
    </SafeAreaView>
         </View>   
        </ScrollView>
        </View>
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
        height:'40%',
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
        height:'60%',
        width:'100%',
        justifyContent:'center', 
        alignItems:'center',
        zIndex:50,
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
      votecount:{
        marginLeft:'2%',
        fontSize:20, 
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
        borderColor:'black', 
        borderWidth:1,
        width:'100%'
      }, 
      container2:{
        flexDirection:'row'
      }
  });