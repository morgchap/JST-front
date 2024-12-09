<<<<<<< HEAD
import { Text, View, StyleSheet } from 'react-native';
=======
import { Text, StyleSheet, View } from 'react-native';
>>>>>>> 4ffebeb4fa7875ab3255c987c496a884fe808f9e

export default function SearchScreen() {
  return (
    <View style={styles.centered}>
    <Text>This is the Search page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
  });
  