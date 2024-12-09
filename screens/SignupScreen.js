import { Text, View, StyleSheet } from 'react-native';

export default function SignupScreen() {
  return (
    <View style={styles.centered}>
    <Text>This is the signup page</Text>
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
  