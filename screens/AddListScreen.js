import { View, Text, TextInput, Modal, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';


// a lié a un bouton et avec les text insert !

export default function AddListScreen({ navigation }) {
  
  //const [visibleModal, setVisibleModal] = useState(false)
  //const [update, setUpdate] = useState(false)
  let [errorInputNameList, setErrorInputNameList] = useState('')
  const [errorFetchNameList, setErrorFetchNameList] = useState('')
  const [listName, setListName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  //const backendUrl = process.env.BACKEND_URL
  const userId = 426900
  
  const handleAddList = () => {
//console.log("test")
    if(listName === ''){
//console.log("2nd test")
      //setErrorText("Enter a name for your list.")
      setErrorInputNameList(<Text style={styles.errorText}>Enter a name for your list.</Text>)
      return
    }
//console.log("3e test")
    fetch(`http://192.168.100.165:3000/lists/addList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName, userId, isPublic }),
    }).then(response => response.json())
      .then(data => {
//console.log("4e test")
        if(data.result){
//console.log("BdD bien remplit")
          setListName("")
          setIsPublic(false)
          setErrorInputNameList("")
          navigation.navigate('Lists')
        } else {
//console.log("BdB non remplit")
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
  