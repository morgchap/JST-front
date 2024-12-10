import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, ImageBackground, Pressable, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { updateUsername } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen({navigation}) {
  const [username, setUsername]= useState('')
  const [password, setpassword]= useState('')
  const [error, setError]=useState('')
  const [email, setEmail]=useState('')
  //let backend = process.env.BACKEND_URL


  const dispatch = useDispatch();
  const CurrentUsername = useSelector((state) => state.user.value.username);
  //console.log(`username:${username} and reducers:${CurrentUsername}`)
  console.log(CurrentUsername)

  const handlesignup = () => {
    console.log('ok')
    fetch('http://192.168.100.241:3000/users/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password, email:email}),
  }).then(response => response.json())
  .then(data => {
      console.log(data)
      if (data.result) {
          console.log(data);
          setUsername('')
          setpassword('')
          setEmail('')
          dispatch(updateUsername({username: username, token:data.token}));
          console.log(`username:${username} and reducers:${CurrentUsername}`)
          navigation.navigate('Signup2')
      } else {
        setError(data.error)
      }
  })
  }

  return (
    <ImageBackground style={styles.image}
    source={require('../assets/Background-gradient.png')}>
      <KeyboardAvoidingView  
      behavior={Platform.OS === 'ios' ? 'padding' : '40'}
      style={styles.bigcont}
      >
        <SafeAreaView style={styles.backbutton}>
        <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
        </SafeAreaView>
        <View style={styles.container}>
        <Pressable
              style={styles.button}
            title="Google"
            //onPress={() => navigation.navigate('Signin')}
            >
              <Text style={styles.buttonText}>Sign up with google</Text>
          </Pressable>  
          <Pressable
            style={styles.button}
            title="steam"
          // onPress={() => navigation.navigate('Signin')}
            >
              <Text style={styles.buttonText}>Sign up with steam</Text>
          </Pressable>  
        <View style={styles.middlepart}>
          <View style={styles.line}></View>
          <Text style={styles.text}>OU</Text>
          <View style={styles.line}></View>
        </View> 
          <TextInput style={styles.input} placeholder='Username' autoCapitalize='none' onChangeText={(value) => setUsername(value)}
         value={username} />
          <TextInput style={styles.input} 
          autoComplete='email' 
          keyboardType='email-address'
          placeholder='email'
          autoCapitalize='none'
          onChangeText={(value) => setEmail(value)}
          value={email} />
          <TextInput style={styles.input} 
          placeholder='password'
          secureTextEntry={true}
          onChangeText={(value) => setpassword(value)}
          value={password}
          autoCapitalize='none' />

          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
             style={styles.button}
            title="steam"
            onPress={() => handlesignup()}>
              <Text style={styles.buttonText}>next</Text>
          </TouchableOpacity>  
      </View>  
        </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
        height:'98%', 
        width:'100%',
        alignItems: 'center',
        justifyContent: 'flex-start',

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
      flex:1
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
    error:{
      color:'red'
    }, 
    backbutton:{
      width:'90%',
    }, 
    bigcont:{
      display:'flex', 
      justifyContent:'space-between', 
      alignContent:'flex-start',
      gap:'10%',
      alignItems:'flex-end'
    }
  });
  