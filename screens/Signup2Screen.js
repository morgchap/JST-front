import {
  Text,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup2Screen({ navigation }) {
  //api url https://api.rawg.io/api/games/superman?key=
  return (
    <ImageBackground
      style={styles.image}
      source={require("../assets/Background-gradient.png")}
    >
      <SafeAreaView style={styles.centered}>
        <SafeAreaView style={styles.backbutton}>
          <FontAwesome
            name="chevron-left"
            color="#7A28CB"
            size={25}
            onPress={() => navigation.goBack()}
          />
        </SafeAreaView>
        <KeyboardAvoidingView style={styles.buttondiv}>
          <Text style={styles.title}>
            Welcome to JST, now time to import your games
          </Text>
          <TouchableOpacity
            style={styles.button}
            title="import"
            onPress={() => navigation.navigate("Signup3")}
          >
            <Text style={styles.buttonText}>import manually</Text>
          </TouchableOpacity>
          <View>
            <Text
              style={styles.buttonText2}
              onPress={() => navigation.navigate("TabNavigator")}
            >
              I'll do it later
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "OpenSans_700Bold",
    color: "#7A28CB",
    margin: "2%",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#7A28CB",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    height: "7%",
    width: "80%",
    margin: "2%",
  },
  buttondiv: {
    height: "90%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "25%",
  },
  buttonText2: {
    fontFamily: "OpenSans_600SemiBold",
    color: "#7A28CB",
    textDecorationLine: "underline",
    marginTop: "2%",
  },
  title: {
    color: "white",
    fontFamily: "OpenSans_700Bold",
    marginBottom: "5%",
  },
  image: {
    flex: 1,
  },
  line: {
    borderBottomWidth: 2,
    height: 0.5,
    width: "35%",
    borderColor: "#7A28CB",
    marginTop: "2%",
  },
  middlepart: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 5,
  },
  backbutton: {
    width: "90%",
    marginLeft: "5%",
  },
});
