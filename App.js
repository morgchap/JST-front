import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//importer les differents ecrans
import LoginScreen from './screens/LoginScreen';
import HomeScreen from "./screens/HomeScreen"
import SearchScreen from "./screens/SearchScreen";
import DiscoveryScreen from "./screens/DiscoveryScreen"
import ProfilScreen from "./screens/ProfilScreen"
import ListsScreen from "./screens/ListsScreen"
import AddListScreen from "./screens/AddListScreen"
import SignupScreen from './screens/SignupScreen';
import SigninScreen from './screens/SigninScreen';
import Signup2Screen from './screens/Signup2Screen';
import SetupScreen from './screens/SetupScreen'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user'

// importer les differents reducers

const store = configureStore({
  reducer: { user }, // pensez a y mettre les different reducer importer
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {

          let iconName = '';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'glass';
          } else if (route.name === 'Discovery') {
            iconName = 'compass';
          } else if (route.name === 'Profil') {
            iconName = 'user';
          } else if (route.name === 'Lists') {
            iconName = 'gamepad';
          }
  
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#33CA7F',
        tabBarInactiveTintColor: '#C29CE7',
        headerShown: false,
        tabBarShowLabel:false,
        tabBarStyle:{backgroundColor: '#7A28CB'},
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Discovery" component={DiscoveryScreen} />
        <Tab.Screen name="Profil" component={ProfilScreen} />
        <Tab.Screen name="Lists" component={ListsScreen} />
      </Tab.Navigator>
    );
  };

  // version avec reducer, ne marche pas
/*export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}*/

export default function App() {
  return (
         <Provider store={store}>
          <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="TabNavigator" component={TabNavigator} />
                  <Stack.Screen name="AddList" component={AddListScreen} />
                  <Stack.Screen name="Signup" component={SignupScreen} />
                  <Stack.Screen name="Signin" component={SigninScreen} />
                  <Stack.Screen name="Setup" component={SetupScreen} />
                  <Stack.Screen name="Signup2" component={Signup2Screen} />
              </Stack.Navigator>
          </NavigationContainer>
          </Provider>
  )
}