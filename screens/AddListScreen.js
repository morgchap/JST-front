import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Switch, 
  StyleSheet, 
  ImageBackground, 
  Pressable
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addGame } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AddListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [listName, setListName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user.value);

  //check if user is logged in
  let pageContent =  <View style={styles.container}>
  <ImageBackground 
    source={require('../assets/background-blur.png')} 
    style={styles.backgroundImage}
  >
    <View style={styles.headIcons}>
        <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()}/>
        <Text style={styles.title}>Create New List</Text>
        <FontAwesome name="cog" color="#7A28CB" size={25} onPress={() => navigation.navigate("Setup")}/>
    </View>
    <View style={styles.contentContainer}>
      <TextInput 
        placeholder="List Name" 
        placeholderTextColor="#7A28CB" 
        autoCapitalize="none" 
        onChangeText={setListName} 
        value={listName} 
        style={styles.input} 
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Private</Text>
        <Switch 
          trackColor={{ false: '#7A28CB', true: '#33CA7F' }}
          thumbColor={isPublic ? '#ffffff' : '#ffffff'} 
          ios_backgroundColor="#3e3e3e" 
          onValueChange={setIsPublic} 
          value={isPublic} 
        />
        <Text style={styles.switchLabel}>Public</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddList}>
        <Text style={styles.buttonText}>Add List</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
</View>
 
  if (!user.username){
    pageContent = 
    <View style={styles.divLoggedout}>
    <Text>
      Create an account to access the list
    </Text>
    <TouchableOpacity style={styles.buttonloggedout}>
      <Text>
        Take me to login
      </Text>
    </TouchableOpacity>
  </View>
  
    }
  const handleAddList = async () => {
    if (!listName.trim()) {
      setError('Please enter a name for your list.');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/addList`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listName, username: user.username, isPublic }),
        }
      );

      const data = await response.json();

      if (data.result) {
        dispatch(addGame(data.list));
        setListName('');
        setIsPublic(false);
        setError('');
        navigation.navigate('Lists');
      } else {
        setError(data.error || 'An error occurred while creating the list.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <>
   {pageContent}
   </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A28CB',
  },
  headIcons: {
    width: "100%",
    height: "10%",
    paddingTop: 35,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderColor: "#7A28CB",
  },
  input: {
    borderWidth: 1,
    borderColor: '#7A28CB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    marginRight: 10,
    color: '#7A28CB',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#7A28CB',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divLoggedout:{
    flex:1,
    alignItems:'center', 
    justifyContent:'center',
    backgroundColor:'#D6CBFD'
  }, 
  buttonloggedout:{
    // borderColor:'black', 
    // borderWidth:1,
    padding:'2%',
    marginTop:'3%',
    backgroundColor:'white',
    borderRadius:5
  }
});

export default AddListScreen;