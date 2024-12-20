import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
//import ImageViewer from '../components/imageViewer';

//const PlaceholderImage = require('../assets/background-blur.png');

export default function SnapScreen2({navigation}) {

    const isFocused = useIsFocused();
  
    const user = useSelector((state) => state.user.value)

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          const formData = new FormData();
            const photo = result.assets[0]
            if (photo) {
                formData.append('photoFromFront', {
                    uri: photo?.uri,
                    name: 'snapped.jpg',
                    type: 'image/jpeg',
                });
                formData.append('username', user.username); // Append username separately
          
                fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/updateAvatar`, {
                    method: 'POST',
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        navigation.navigate('Profil')  
                    })
                    .catch((err) => console.error('Error:', err));
            }
        } else {
          alert('You did not select any image.');
        }
      };

    // Reference to the camera
    const cameraRef = useRef(null);

    // Permission hooks
    const [hasPermission, setHasPermission] = useState(false);
    const [facing, setFacing] = useState("back");
    const [flashStatus, setFlashStatus] = useState("off");

    // Effect hook to check permission upon each mount
    useEffect(() => {
        (async () => {
            const result = await Camera.requestCameraPermissionsAsync();
            setHasPermission(result && result?.status === "granted");
        })();
    }, []);

    // Conditions to prevent more than 1 camera component to run in the bg
    if (!hasPermission || !isFocused) {
        return <View />;
    }

    // Functions to toggle camera facing and flash status
    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const toggleFlashStatus = () => {
        setFlashStatus((current) => (current === "off" ? "on" : "off"));
    };

    // // Function to take a picture and save it to the reducer store
    const takePicture = async () => {
        const formData = new FormData();
        const photo = await cameraRef?.current?.takePictureAsync({ quality: 0.3 });
        if (photo) {
            formData.append('photoFromFront', {
                uri: photo?.uri,
                name: 'snapped.jpg',
                type: 'image/jpeg',
            });
            formData.append('username', user.username); // Append username separately
            fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/updateAvatar`, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    navigation.navigate('Profil')
                })
                .catch((err) => console.error('Error:', err));
        }
    };


    return (
        <View style={styles.container}>
         <SafeAreaView>
            <Text>Time to pick an avatar</Text>
        </SafeAreaView>   
        <CameraView style={styles.camera} facing={facing} flash={flashStatus} ref={(ref) => (cameraRef.current = ref)}>
            {/* Top container with the setting buttons */}

            <SafeAreaView style={styles.settingContainer}>
                <TouchableOpacity style={styles.settingButton} onPress={toggleFlashStatus}>
                    <FontAwesome name="flash" size={25} color={flashStatus === "on" ? "#e8be4b" : "white"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
                    <FontAwesome name="rotate-right" size={25} color="white" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom container with the snap button */}
            <View style={styles.snapContainer}>
                <TouchableOpacity style={styles.snapButton} 
                 onPress={takePicture}
                >
                    <FontAwesome name="circle-thin" size={95} color="white" />
                </TouchableOpacity>
            </View>
        </CameraView>


        <View style={styles.container2}>
            <View style={styles.footerContainer}>
                <Button theme='primary' label="Choose a photo" onPress={pickImageAsync} />
            </View>
        </View>
        <View>
            <Text style={styles.buttonText2} onPress={()=> navigation.navigate('Profil')}>I'll do it later</Text>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'space-around', 
        alignItems:'center',
    },
    camera: {
        height:300, 
        width:300,
        justifyContent: "space-between",
    },
    settingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
    },
    settingButton: {
        width: 40,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    snapContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    snapButton: {
        width: 100,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText2:{
        fontFamily:'OpenSans_600SemiBold',
        color : '#7A28CB',
        textDecorationLine: 'underline',
        marginTop:'2%'
  }, 
    // container: {
    //     flex: 1,
    //     backgroundColor: '#25292e',
    //     alignItems: 'center',
    //   },
    //   imageContainer: {
    //     flex: 1,
    //   },
    //   footerContainer: {
    //     flex: 1 / 3,
    //     alignItems: 'center',
    //   },
});