import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView, Modal, ImageBackground, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Space } from 'antd';
import {
  SearchOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

export default function Signup3({ navigation }) {

  const [game, setGame] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [gameName, setGameName] = useState('')
  const [gameImg, setGameImg] = useState('')
  const [gameDate, setGamedate] = useState('')
  const [gameDescription, setGameDescription] = useState('')
  const [gameGenre, setGameGenre] = useState('')
  const [error, setError] = useState('')
  let searchedGame = game.replaceAll(" ", '-')
  const CurrentUsername = useSelector((state) => state.user.value.username);

  const handlesubmit = () => {

    fetch(`https://api.rawg.io/api/games/${searchedGame}?key=${process.env.EXPO_PUBLIC_API_KEY}`).then(response => response.json())
      .then(data => {
        if (data.detail = 'not found.'){
            setError('game not found') 
         } else {
        //console.log(`name : ${data.name} img : ${data.background_image} date : ${data.released}, descr : ${data.description_raw}, genres : ${data.genres[0]?.name}`)
        setGame('')
        setModalVisible(true)
        setGameImg(data.background_image)
        setGameName(data.name)
        setGamedate(data.released)
        setError('')
        setGameDescription(data.description)
        setGameGenre(data.genres.name)

      }
        }
      )
  }

  const handleList = () => {
    console.log('ok')
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/allgames`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ img: gameImg, username: CurrentUsername, summary: gameDescription, release: gameDate, genre: gameGenre, name: gameName}),
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result) {
          console.log(`${data} added`)
          setModalVisible(false)
        } else {
          setError(data.error)
        }
      })
  }

  return (
    <ImageBackground style={styles.image}
      source={require('../assets/background-blur.png')}>
      <SafeAreaView style={styles.backbutton}>
        <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()} />
      </SafeAreaView>
      <SafeAreaView style={styles.centered}>
        <Text style={styles.title}>Import manually</Text>
        <KeyboardAvoidingView style={styles.buttondiv}>
          <TextInput style={styles.input}
            placeholder='Search for a Game'
            returnKeyType='search'
            onSubmitEditing={() => handlesubmit()}
            onChangeText={(value) => setGame(value)}
            value={game} />
          <Text>{error}</Text>
          <View>
            <Text style={styles.buttonText2} onPress={()=> {navigation.navigate('TabNavigator')}}>Take me to JST </Text>
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
              <SafeAreaView style={styles.backbutton}>
                <FontAwesome name="times" color="#7A28CB" size={25} onPress={() => setModalVisible(false)}/>
              </SafeAreaView>   
                <Image style={styles.jaquette} source={{ uri: gameImg }} />
                <Text style={styles.modalText}>{gameName}</Text>
                <Text style={styles.modalText}>{gameDate}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleList()}>
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

  buttondiv: {
    height: '90%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10%',
  },

  title: {
    marginTop: '10%',
    color: 'black',
    fontFamily: 'OpenSans_700Bold',
    marginBottom: '5%'
  },
  image: {
    flex: 1,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "#7A28CB",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    height: '7%',
    width: '80%',
    margin: '2%',
  },
  backbutton: {
    width: '90%'
  },

  input: {
    borderBottomColor: '#7A28CB',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(226, 226, 222, 0.5)',
    //backgroundColor:'white',
    height: '7%',
    width: '80%',
    margin: '2%',
    paddingLeft: 10,
    borderRadius: 10
  },
  camera: {
    height: '40%',
    width: '75%',
    borderColor: 'black',
    borderWidth: 1,
  },
  backbutton: {
    width: '90%',
    marginLeft: '5%'
  },
  jaquette: {

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
  buttonText2:{
    fontFamily:'OpenSans_600SemiBold',
    color : 'balck',
    textDecorationLine: 'underline',
    marginTop:'2%'
},
});

