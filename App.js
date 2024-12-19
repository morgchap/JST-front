import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TransitionPresets } from '@react-navigation/bottom-tabs';

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
import SetupScreen from './screens/SetupScreen';
import Signup3Screen from './screens/Signup3Screen';
import FriendScreen from './screens/FriendScreen';
import GamesScreen from './screens/GamesScreen';
import ProfilePicture from'./screens/ProfilePicture';
import FriendListScreen from './screens/FriendListScreen';
import ProfilePicture2 from "./screens/ProfilePicture2";
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user'
import friend from "./reducers/friend"
import game from './reducers/game'
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from "redux-persist/es/storage";
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"


// importer les differents reducers

// GoogleSignin.configure({
// 	webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
// 	scopes: ['profile', 'email'],
// });

const reducers = combineReducers({ user, friend, game });

const persistConfig = { 
  key: 'JST', 
  storage: AsyncStorage
}; // pensez a y mettre les different reducer importe

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false })
 });

 const persistor= persistStore(store);



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  const username = useSelector((state) => state.user.value)

  const [profileBadgeCount, setProfileBadgeCount] = useState()
  useEffect(() => {
  
    console.log("ça marche");
  
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/getOne/${username.username}`)
    .then(result => result.json())
    .then(data => {
      //console.log("c'est le front!", data.infos)
  
      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/receivedFriendRequests/${data.infos._id}`)
      .then(result => result.json())
      .then(databis => {
        //console.log("fetch de la friendlist received", databis.data)
        setProfileBadgeCount(databis.data.length)
      })
  })
  },[ProfilScreen])

    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {

          let iconName = '';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
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
        tabBarBadge: route.name === 'Profil' && profileBadgeCount > 0 ? profileBadgeCount : undefined,
        
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Discovery" component={DiscoveryScreen} />
        <Tab.Screen name="Profil" component={ProfilScreen}/>
        <Tab.Screen name="Lists" component={ListsScreen} />
      </Tab.Navigator>
    );
  };



export default function App() {
  return (

        <Provider store={store}>
        <PersistGate persistor={persistor}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                    <Stack.Screen name="AddList" component={AddListScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Signin" component={SigninScreen} />
                    <Stack.Screen name="Setup" component={SetupScreen} />
                    <Stack.Screen name="Signup2" component={Signup2Screen} />
                    <Stack.Screen name="Signup3" component={Signup3Screen} />
                    <Stack.Screen name="Friend" component={FriendScreen} />
                    <Stack.Screen name="Games" component={GamesScreen} />
                    <Stack.Screen name="FriendList" component={FriendListScreen} />
                    <Stack.Screen name="ProfilePicture" component={ProfilePicture} />
                    <Stack.Screen name="ProfilePicture2" component={ProfilePicture2} />
                </Stack.Navigator>
            </NavigationContainer>
          </PersistGate>
        </Provider>

  )
}