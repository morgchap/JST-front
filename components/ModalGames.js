import { Text, View, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SearchScreen from '../screens/SearchScreen';


export default function ModalGames({navigation, props}) {
  return (
    <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
            <View style={styles.backbutton}>
          <FontAwesome 
            name="times"
            color="#7A28CB" 
            size={25} 
            onPress={() => navigation.navigate(props.screen)} 
          />
        </View>
              <Image style={styles.jaquette} source={{uri : 'https://media.rawg.io/media/screenshots/1d7/1d75b9d60cb5884a0b19d21df8557c0c.jpg'}} />
              <Text style={styles.modalText}>Mario</Text>
              <Text style={styles.modalText}>11/02/1999</Text>
              <TouchableOpacity style={styles.button} 
                onPress={()=> navigation.navigate({Games})}
              >
                  <Text style={styles.buttonText}>See game</Text>
              </TouchableOpacity>
            </View>
          </View>
  );
}

const styles = StyleSheet.create({
    centered: {
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center'
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
      button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#7A28CB',
        height: '7%',
        width: '80%',
        margin: '2%',
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      backbutton: {
        width: '90%',
        marginLeft: '5%'
      },
  });