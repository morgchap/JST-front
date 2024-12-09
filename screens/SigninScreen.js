import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, ImageBackground, Pressable } from 'react-native';
import { useState } from 'react';

export default function SigninScreen() {

  const [username, setUsername]= useState('')
  const [password, setpassword]= useState('')
  
  return (
    <ImageBackground style={styles.container}
    source={require('../assets/Background-gradient.png')}>
    <Pressable
          style={styles.button}
        title="Google"
        //onPress={() => navigation.navigate('Signin')}
        >
          <Text style={styles.buttonText}>Sign in with google</Text>
      </Pressable>  
      <Pressable
          style={styles.button}
        title="steam"
       // onPress={() => navigation.navigate('Signin')}
        >
          <Text style={styles.buttonText}>Sign in with steam</Text>
      </Pressable>   
      <View style={styles.line}>

      </View>
      <TextInput style={styles.input} placeholder='Username'onChangeText={(value) => setUsername(value)}
      value={username} />
      <TextInput style={styles.input} placeholder='password'onChangeText={(value) => setpassword(value)}
      value={password} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
    line:{
      borderTopWidth: 1, 
      borderBottomWidth:1,
      borderColor:'black',
      marginTop:'10%',
    }
  });
  