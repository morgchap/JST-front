import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView, Modal, ImageBackground, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Space } from 'antd';
import {
    SearchOutlined
  } from '@ant-design/icons';

export default function Signup3Screen({navigation}) {
    
    const [game, setGame]=useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [gameName, setGameName]=useState('')
    const [gameImg, setGameImg]=useState('')
    const [gameDate, setGamedate]=useState('')
    const [error, setError]= useState('')

    const handlesubmit = ()=> {
        fetch(`https://api.rawg.io/api/games/${game}?key=${process.env.EXPO_PUBLIC_API_KEY}`).then(response => response.json())
        .then(data => {
            // if (data.detail = 'not found.'){
            //     setError('game not found') 
            //  } else {
                 console.log(`name : ${data.name} img : ${data.background_image} date : ${data.released}`)
                 setGame('')
                 setModalVisible(true)
                 setGameImg(data.background_image)
                 setGameName(data.name)
                 setGamedate(data.released)
                 setError('')
             }     
        //}
    )
}

  return (
     <ImageBackground style={styles.image}
    source={require('../assets/background-blur.png')}> 
    <SafeAreaView style={styles.centered}>
    <Text style={styles.title}>Import manually</Text>
    <KeyboardAvoidingView style={styles.buttondiv}>
    <TextInput style={styles.input} 
    placeholder='Search for a Game' 
    returnKeyType='search'
    onSubmitEditing={() => handlesubmit()}
    onChangeText={(value) => setGame(value)}
    value={game}/>
    <Text>{error}</Text>
     <View style={styles.camera}>
        <Text>Camera area</Text>
     </View>
    <Modal
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
    Alert.alert('Modal has been closed.');
    setModalVisible(!modalVisible);}}
    >
    <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
             <Text style={styles.modalText}>{gameName}</Text>
             <Text style={styles.modalText}>{gameDate}</Text>
             <Image style={styles.jaquette} source={{ uri: gameImg }} />
             <TouchableOpacity>
                <Text>Add to my list</Text>
             </TouchableOpacity>
         </View>
    </View>
    </Modal>
    </KeyboardAvoidingView>
    </SafeAreaView>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    
      buttondiv:{
        height:'90%',
        width:'100%', 
        alignItems:'center',
        justifyContent:'center',
        gap:'10%',
    }, 
        
  title:{
    marginTop:'10%',
    color:'black', 
    fontFamily:'OpenSans_700Bold',
    marginBottom:'5%'
  },
  image:{
    flex:1,
  },  
  input:{
    borderBottomColor:'#7A28CB',
    borderBottomWidth:1,
    backgroundColor:'rgba(226, 226, 222, 0.5)', 
    //backgroundColor:'white',
    height:'7%',
    width:'80%',
    margin:'2%',
    paddingLeft:10,
    borderRadius:10
  },
  camera:{
    height:'40%', 
    width:'75%', 
    borderColor:'black', 
    borderWidth:1, 
  }, 
  backbutton:{
    width:'90%',
  }, 
  jaquette:{

  },
  modal:{
    backgroundColor:'red',
    height:'50%',
    width:'80%',
    alignItems:'center', 
    justifyContent:'center',
    borderColor:'black', 
    borderWidth:1
  }, 
  modalbox:{
    display:'flex',
    alignItems:'center', 
    justifyContent:'center'
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
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  jaquette: {
    width: 200,
    height: 300,
    marginTop: 10,
    borderRadius: 5,
  },
  });
  
