import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//importer les differents ecrans
import LoginScreen from './screens/LoginScreen';
import DiscoveryScreen from "./screens/DiscoveryScreen"
import SearchScreen from "./screens/SearchScreen";

/*import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';*/
// importer les differents reducers

/*const store = configureStore({
  reducer: {  }, // pensez a y mettre les different reducer importer
});*/

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {

          let iconName = '';
          if (route.name === 'Discovery') {
            iconName = 'compass';
          } else if (route.name === 'Search') {
            iconName = 'magnifying-glass';
          } else if (route.name = 'Profile'){
            iconName = 'user';
          }
  
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ec6e5b',
        tabBarInactiveTintColor: '#335561',
        headerShown: false,
      })}>
        <Tab.Screen name="Discovery" component={DiscoveryScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Profile" component={MyProfileScreen}/>
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
          <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="TabNavigator" component={TabNavigator} />
              </Stack.Navigator>
          </NavigationContainer>
  )
}