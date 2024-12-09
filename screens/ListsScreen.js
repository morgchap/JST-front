import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import AddList from "./AddListScreen"

// a lié a un bouton et avec les text insert !
/*fetch(`${BACKEND_DIRECTORY}/lists/addList/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listName, userId, isPublic }),
}).then(response => response.json())
	.then(data => {
		if (data.result && data.canBookmark) {
			if (props.isBookmarked) {
				dispatch(removeBookmark(props));
			} else {
				dispatch(addBookmark(props));
			}
		}
	});*/

export default function ListsScreen({ navigation }) {
  return (
    <View style={styles.centered}>
        <Text>This is the Lists page</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddList')} activeOpacity={0.8}>
            <Text style={styles.button} >Add list</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: "blue",
    },
  });
  