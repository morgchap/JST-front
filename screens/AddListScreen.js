import { Text, View, StyleSheet } from 'react-native';

export default function ProfilScreen() {
  return (
    <View style={styles.centered}>
        <Text>This is the Profil page</Text>
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
  