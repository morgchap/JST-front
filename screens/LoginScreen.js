import { Text, View, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Link, Image, Style, ImageBackground, Pressable} from 'react-native';
import AppLoading from 'expo-app-loading';
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

    
  export default function LoginScreen({ navigation }) {
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
  
  
  
  const handlePress = () => {
      navigation.navigate('TabNavigator')
    }

  return (
    <ImageBackground
    style={styles.container}
    source={require('../assets/background-blur&logo.png')}>
      <Pressable
          style={styles.button}
        title="sign up"
        onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>   
      <Pressable
          style={styles.button}
        title="sign in"
        onPress={() => navigation.navigate('Signin')}
        >
          <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>  
      <Pressable
          style={styles.button2}
        title="sign in"
        onPress={() => navigation.navigate('TabNavigator')}
        >
          <Text style={styles.buttonText2}>Access JST without an account</Text>
      </Pressable>  
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText:{
      fontFamily:'OpenSans_700Bold',
      color : '#7A28CB',

    },
    button:{
      display:'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: "#7A28CB",
      borderWidth:1, 
      borderRadius:10,
      backgroundColor: 'white',
      height:'7%',
      width:'80%',
      margin:'2%'
    },
    buttonText2:{
      fontFamily:'OpenSans_600SemiBold',
      color : '#7A28CB',
      textDecorationLine: 'underline',
      marginTop:'2%'
    }, 

  });
  