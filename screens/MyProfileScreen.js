import { Text, View, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';



export default function LoginScreen({ navigation }) {
  
  const handlePress = () => {
      navigation.navigate('TabNavigator')
    }


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
            <Text>This is MyProfile Screen</Text>
            <TouchableOpacity onPress={() => handlePress()} activeOpacity={0.8}>
                <Text>Go to Discovery</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });
  