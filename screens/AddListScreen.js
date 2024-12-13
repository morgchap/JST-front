import { View, Text, TextInput, Modal, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGame } from '../reducers/user';


export default function AddListScreen({ navigation }) {
  
  const dispatch = useDispatch();
  let [errorInputNameList, setErrorInputNameList] = useState('')
  const [errorFetchNameList, setErrorFetchNameList] = useState('')
  const [listName, setListName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const user = useSelector((state) => state.user.value)
  
  // send userId, listName and ifPublic to the backend to create the list
  const handleAddList = () => {
  // check if listName field is empty
    if(listName === ''){
      setErrorInputNameList(<Text style={styles.errorText}>Enter a name for your list.</Text>)
      return
    }
    const username = user.username
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/addList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName, username, isPublic }),
    }).then(response => response.json())
      .then(data => {
        if(data.result){
          // the list is correctly send to the database
          dispatch(addGame(data.list))
          setListName("")
          setIsPublic(false)
          setErrorInputNameList("")
          navigation.navigate('Lists')
        } else {
          // if there is a probleme while sending the ist in the database (in the back), receive the error response
          setErrorFetchNameList(<Text style={styles.errorText}>{data.error}</Text>)
        }
      });
  }


  return (
    <View style={styles.centered}>
        <TextInput
          placeholder="List name"
          autoCapitalize="none"
          onChangeText={(value) => setListName(value)}
          value={listName}
          style={styles.input}
        />
        {errorInputNameList}
        <View style={styles.publicSwitch}>
          <Text>public list ?   false</Text>
          <Switch
            trackColor={{false: '#0000ff', true: '#ff0000'}}
            thumbColor={isPublic ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => {setIsPublic(value)}}
            value={isPublic}
          />
            <Text>true</Text>
        </View>
        <TouchableOpacity onPress={() => handleAddList()} activeOpacity={0.8}>
            <Text style={styles.button} >Add list</Text>
        </TouchableOpacity>
        {errorFetchNameList}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    input: {
      backgroundColor: "#e0e0e0"
    },
    publicSwitch: {
      flexDirection: "row",
      alignItems: 'center',
    },
    button:  {
      backgroundColor: "#e0a0e0"
    },
    errorText: {
      color: "red",
    },
  });
  