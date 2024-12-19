import { 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    ImageBackground,
    Modal,
    TextInput,
    Switch, 
    SafeAreaView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGame, addListGames, deleteGame } from '../reducers/user';
import { useIsFocused } from '@react-navigation/native';

export default function ListsScreen({ navigation }) {
    // Hook pour savoir si l'écran est actuellement actif
    const isFocused = useIsFocused();

    // Hook de dispatch pour les actions redux
    const dispatch = useDispatch();

    // Sélectionner l'utilisateur actuel à partir de l'état global (redux)
    const user = useSelector((state) => state.user.value);

    // États pour gérer l'affichage du modal et la gestion des données du jeu
    const [modal, setModal] = useState(false);
    const [game, setGame] = useState("");

    // États pour gérer le modal de création de liste
    const [modalVisible, setModalVisible] = useState(false);
    const [listName, setListName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState('');

    // Fonction pour récupérer les listes de jeux de l'utilisateur
    const fetchGameLists = () => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${user.username}`)
            .then(response => response.json())
            .then(data => {
                dispatch(addListGames(data.lists)); // Mise à jour des listes dans le store
            });
    };

    // Utilisation de useEffect pour récupérer les listes lorsque l'écran est focalisé
    useEffect(() => {
        setGame("");  // Réinitialise l'état du jeu lorsqu'on revient sur l'écran
        fetchGameLists();  // Récupère les listes de jeux
    }, [isFocused]);

    // Fonction pour supprimer une liste de jeux
    const handleDeleteList = (listName) => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/${listName}/${user.username}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(() => dispatch(deleteGame(listName))) // Mise à jour du store pour retirer la liste
        .then(() => fetchGameLists()) // Récupérer les listes mises à jour
        .then(() => setModalVisible(false)); // Ferme le modal
    };

    // Fonction pour afficher les jeux d'une liste spécifique
    const handleSeeList = (listName) => {
        listName = listName.replaceAll(" ", "_");  // Remplace les espaces par des underscores
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/getGames/${listName}/${user.username}`)
            .then(response => response.json())
            .then(data => {
                let gamesList;
                if (data.error === "Your list is empty.") {
                    gamesList = [
                        <View key={0}>
                            <Text>Votre List est vide</Text>  {/* Affiche un message si la liste est vide */}
                        </View>
                    ];
                } else {
                    // Si la liste contient des jeux, on les affiche
                    gamesList = data.list.map((data, i) => {
                        let title = data[0].length >= 12 ? data[0].slice(0, 9) + "..." : data[0]; // Truncate the title if too long
                        return (
                            <View key={i} style={styles.game}>
                                <TouchableOpacity onPress={() => handleNavigation(data[0])}>
                                    <Image style={styles.jaquette} source={{uri: `${data[1]}`}} />  {/* Affiche l'image du jeu */}
                                </TouchableOpacity>
                                <Text>{title}</Text> {/* Affiche le titre du jeu */}
                                <TouchableOpacity onPress={() => handleDeleteGame(listName, data[0])} style={styles.button} >
                                    <Text style={styles.textButton}>Delete</Text>  {/* Bouton pour supprimer le jeu */}
                                </TouchableOpacity>
                            </View>
                        );
                    });
                }
                setModal(true);  // Ouvre le modal avec la liste des jeux
                setGame(gamesList);  // Définit les jeux à afficher dans le modal
            });
    };

    // Fonction pour naviguer vers l'écran de détails du jeu
    const handleNavigation = (gameName) => {
        setModal(false);  // Ferme le modal
        navigation.navigate("Games", { gameName });  // Navigation vers l'écran "Games"
    };

    // Fonction pour supprimer un jeu de la liste
    const handleDeleteGame = (listName, gameName) => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/games/${listName}/${gameName}/${user.username}`, {
            method: 'DELETE',
        })
        .then(() => fetchGameLists())  // Met à jour la liste des jeux après la suppression
        .then(() => setModal(false));  // Ferme le modal
    };

    // Fonction pour afficher le modal d'ajout de liste
    const handleAddListButton = () => {
        setModalVisible(true);  // Ouvre le modal pour ajouter une nouvelle liste
    };

    // Fonction pour ajouter une nouvelle liste
    const handleAddList = async () => {
        // Validation du nom de la liste
        if (!listName.trim()) {
            setError('Please enter a name for your list.');
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/lists/addList`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listName, username: user.username, isPublic }),
            });

            const data = await response.json();

            if (data.result) {
                dispatch(addGame(data.list));  // Ajoute la nouvelle liste au store
                setListName('');  // Réinitialise le nom de la liste
                setIsPublic(false);  // Réinitialise l'état public/privé
                setError('');  // Réinitialise l'erreur
                navigation.navigate('Lists');  // Retourne à l'écran des listes
                setModalVisible(false);  // Ferme le modal
            } else {
                setError(data.error || 'An error occurred while creating the list.');  // Affiche une erreur si la création échoue
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');  // Affiche une erreur en cas d'exception
        }
    };

    // Affichage des jeux dans les listes de l'utilisateur
    const games = user.lists.map((data, i) => {
        let trash_bin = i < 1 ? "" : <FontAwesome name="trash" color="#ffffff" size={16} onPress={() => handleDeleteList(data.listName)} />;  // Affiche l'icône de suppression (sauf pour la première liste)
        let plural = data.gameList.length < 2 ? "jeu" : "jeux";  // Pluriel pour le nombre de jeux
        return (
            <View key={i} style={styles.gameOfList}>
                <Image style={styles.jaquetteOfList} source={require("../assets/mario.png")} />  {/* Affiche une image de jeu */}
                <View style={styles.textOfList}>
                    <View style={styles.textOfListTop}>
                        <Text style={styles.listName}>{data.listName}</Text>  {/* Nom de la liste */}
                        {trash_bin}  {/* Icône de suppression */}
                    </View>
                    <View style={styles.textOfListBottom}>
                        <Text style={styles.listLength}>{data.gameList.length} {plural}</Text>  {/* Nombre de jeux dans la liste */}
                        <TouchableOpacity style={styles.buttonOfList} onPress={() => handleSeeList(data.listName)} activeOpacity={0.8}>
                            <Text style={styles.textButtonOfList}>See</Text>  {/* Bouton pour voir les jeux de la liste */}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    });

    // Contenu de la page en fonction de l'état de connexion de l'utilisateur
    let pageContent = (
        <ImageBackground style={styles.image} source={require('../assets/background-blur.png')}>
            <SafeAreaView style={styles.centered}>
                <View style={styles.headIcons}>
                    <FontAwesome name="chevron-left" color="#7A28CB" size={25} onPress={() => navigation.goBack()} />  {/* Bouton retour */}
                </View>
                <View style={styles.body}>
                    <View style={styles.lists}>
                        <ScrollView>
                            {games}  {/* Affichage des jeux */}
                        </ScrollView>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={handleAddListButton} activeOpacity={0.8}>
                            <Text style={styles.textButton}>Add list</Text>  {/* Bouton pour ajouter une liste */}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Modal pour afficher les jeux de la liste */}
                <Modal transparent={true} visible={modal} onRequestClose={() => setModal(false)}>
                    <View style={styles.modalBackgroundList}>
                        <ImageBackground source={require('../assets/background-blur.png')} style={styles.backgroundImageList}>
                            <View style={styles.modalContainerList}>
                                <View style={styles.backbutton}>
                                    <FontAwesome name="times" color="#7A28CB" size={25} onPress={() => setModal(false)} />
                                </View>
                                <View style={styles.gameContainer}>
                                    <ScrollView horizontal={true}>
                                        {game}  {/* Affichage des jeux dans le modal */}
                                    </ScrollView>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </Modal>

                {/* Modal pour ajouter une nouvelle liste */}
                <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
                    <View style={styles.modalBackground}>
                        <ImageBackground source={require('../assets/background-blur.png')} style={styles.backgroundImage}>
                            <View style={styles.backbutton}>
                                <FontAwesome name="times" color="#7A28CB" size={25} onPress={() => setModalVisible(false)} />
                            </View>
                            <View style={styles.modalContainer}>
                                <TextInput
                                    placeholder="List Name"
                                    placeholderTextColor="#7A28CB"
                                    autoCapitalize="none"
                                    onChangeText={setListName}
                                    value={listName}
                                    style={styles.input}
                                />

                                {error && <Text style={styles.errorText}>{error}</Text>}  {/* Affichage des erreurs */}

                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchLabel}>Private</Text>
                                    <Switch
                                        trackColor={{ false: '#7A28CB', true: '#33CA7F' }}
                                        thumbColor={isPublic ? '#ffffff' : '#ffffff'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={setIsPublic}
                                        value={isPublic}
                                    />
                                    <Text style={styles.switchLabel}>Public</Text>
                                </View>
                                {/* Bouton pour ajouter la liste */}
                                <TouchableOpacity style={styles.modalButton} onPress={handleAddList}>
                                    <Text style={styles.modalButtonText}>Add List</Text> 
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                </Modal>
            </SafeAreaView>
        </ImageBackground>
    );

    // Si l'utilisateur n'est pas connecté, affiche un message de connexion
    if (!user.username) {
        pageContent = (
            <View style={styles.divLoggedout}>
                <Text>Create an account or log in to access the list</Text>
                <TouchableOpacity style={styles.buttonloggedout} onPress={() => navigation.navigate('Login')}>
                    <Text>Take me to login</Text>  {/* Redirection vers la page de connexion */}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            {pageContent}
        </>
    );
}

const styles = StyleSheet.create({
    /* Pour le modal */
    modalbox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalBackgroundList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backgroundImage: {
        alignItems: "flex-end",
    },
    backgroundImageList: {
        width: '100%',
    },
    modalContainer: {
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    modalContainerList: {
        padding: 20,
        borderRadius: 10,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    modalButton: {
        width: 100,
        height: 30,
        backgroundColor: "#7A28CB",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    modalButtonText: {
        color: "white",
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#7A28CB',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#000',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        marginRight: 10,
        color: '#7A28CB',
        fontWeight: 'bold',
    },
    
    /* Pour la page de base */
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    headIcons: {
        width: "100%",
        height: "10%",
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    body: {
        width: "100%",
        height: "90%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    topText: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#7A28CB',
    },
    lists: {
        width: "90%",
        height: "85%",
    },
    gameOfList: {
        paddingHorizontal: 10,
        margin: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#7A28CB",
        opacity: 0.8,
        borderRadius: 10,
    },
    jaquetteOfList: {
        height: 100,
        width: 75,
        borderRadius: 10,
    },
    textOfList: {
        width: "75%",
        height: 120,
        alignItems: "center",
        justifyContent: "space-around",
    },
    textOfListTop: {
        width: "100%",
        paddingLeft: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    listName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    textOfListBottom: {
        width: "130%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    listLength: {
        fontWeight: 'bold',
        color: "white",
    },
    buttonOfList: {
        width: 50,
        height: 30,
        backgroundColor: "#D6CBFD",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textButtonOfList: {
        color: '#7A28CB',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        width: 100,
        height: 30,
        backgroundColor: "#7A28CB",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textButton: {
        color: "white",
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameContainer: {
        flexDirection: "row",
    },
    game: {
        marginVertical: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    jaquette: {
        height: 160,
        width: 120,
    },
      backbutton: {
        width: 20,
        alignItems: "flex-end",
      },
      divLoggedout:{
        flex:1,
        alignItems:'center', 
        justifyContent:'center',
        backgroundColor:'#D6CBFD'
      }, 
      buttonloggedout:{
        padding:'2%',
        marginTop:'3%',
        backgroundColor:'white',
        borderRadius:5
      }
});
