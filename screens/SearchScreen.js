import { Text, View, StyleSheet } from 'react-native';

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
  