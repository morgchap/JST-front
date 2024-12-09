import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, ImageBackground, Pressable } from 'react-native';
import { useState } from 'react';

export default function SigninScreen() {

  const [username, setUsername]= useState('')
  const [password, setpassword]= useState('')
  
  return (
    <ImageBackground style={styles.image}
    source={require('../assets/Background-gradient.png')}>
      <KeyboardAvoidingView  
      behavior={Platform.OS === 'ios' ? 'padding' : '40'}
      style={styles.container}  >
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
        <View style={styles.middlepart}>
          <View style={styles.line}></View>
          <Text style={styles.text}>OU</Text>
          <View style={styles.line}></View>
        </View> 
          <TextInput style={styles.input} placeholder='Username' autoCapitalize='none' onChangeText={(value) => setUsername(value)}
         value={username} />
          <TextInput style={styles.input} placeholder='password'onChangeText={(value) => setpassword(value)}
          value={password} />
          <Pressable
              style={styles.button}
            title="steam"
          // onPress={() => navigation.navigate('Signin')}
            >
              <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>  
          <Pressable
          style={styles.button2}
        title="sign in"
        onPress={() => navigation.navigate('TabNavigator')}
        >
          <Text style={styles.buttonText2}>I forgot my password</Text>
      </Pressable>  
        </KeyboardAvoidingView>
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
      margin:'2%'

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
      margin:'2%',
    },
    line:{
     borderBottomWidth:2, 
     height: 0.5,
     width:'35%', 
     borderColor:'#7A28CB',
     marginTop:'2%'
    }, 
    text:{
      fontFamily:'OpenSans_700Bold',
      fontSize:15,
    },
    middlepart:{
      display:'flex', 
      flexDirection:'row',
      alignContent:'center',
      justifyContent:'center',
      gap:10,
      marginTop:5,
    }, 
    image:{
      height:'100%', 
      width:'100%'
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
    buttonText2:{
      fontFamily:'OpenSans_600SemiBold',
      color : '#7A28CB',
      textDecorationLine: 'underline',
      marginTop:'2%'
    }, 
  });
  