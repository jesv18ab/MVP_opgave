import * as React from 'react';
import {Button,Text, View, TextInput, ActivityIndicator, StyleSheet, Alert,} from 'react-native';
import firebase from "firebase";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createAppContainer} from "react-navigation";
import MakeHouseHold from "./MakeHouseHold";
import MyInvites from "./MyInvites";
import {Entypo, FontAwesome, Fontisto, MaterialIcons} from "@expo/vector-icons";
import newUsers from "./Stack";
const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    inputField: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
    },
    header: {
        fontSize: 40,
    },
});


const TabNavigator = createBottomTabNavigator(
    {
        MakeHouseHold: {
            screen: MakeHouseHold, navigationOptions: {
                tabBarLabel:"Opret kollektiv", tabBarIcon: ({ tintColor }) => (
                    <Entypo name="home" size={24} color={tintColor} />
                )
            },
        },
        /*Navn på Route*/
        MyInvites: {
            screen: MyInvites,
            navigationOptions: {
                tabBarLabel:"Invitationer",
                tabBarIcon: ({ tintColor }) => (
                    <Entypo name="wallet" size={24} color={tintColor} />
                )
            },
        },
    },
    /*Generelle label indstillinger. Blot en design metode*/
    {
        tabBarOptions: {
            showIcon: true,
            labelStyle: {
                fontSize: 15,
            },
            activeTintColor: 'blue',
            inactiveTintColor: 'gray',
            size: 40
        }, initialRouteName: "MakeHouseHold",
    },
);

const AppBottomNav = createAppContainer(TabNavigator);


export default class CreateUser extends React.Component {


    state = {
        email: '',
        password: '',
        isLoading: false,
        isCompleted: false,
        errorMessage: null,
        houseHoldName: '',
        users: [],
        routename: null,
        isAuthenticated: false,
        allUsers: null
    };

    componentDidMount() {
        /* firebase.database().ref('/usersNotApartOFAHousehold/').on('value', snapshot => {
             this.setState({ users: snapshot.val() });
     });*/
        firebase.database().ref('/allUsers/').on('value', snapshot => {
            this.setState({allUsers: snapshot.val()})
        });
       /* firebase.auth().onAuthStateChanged(currentUser => {
            this.setState({currentUser: currentUser});
        });*/
    }

    componentWillUnmount() {
    }

// Dene fremviser at vi loader. Når en operation idriftsættes, skal der vises en spinner
    startLoading = () => this.setState({ isLoading: true });
    // Når vores loading er færdig, kaldes denne metode til at fjerne spinneren
    endLoading = () => this.setState({ isLoading: false });
// Denne vises, når vi skal præsentere en fejlsbesked
    setError = errorMessage => this.setState({ errorMessage });
// Denne kaldes, når vi afprøver en operation igen og skal fjerne fejlbeskeden.
    clearError = () => this.setState({ errorMessage: null });

// EStår for at opdatere værdierne af vores inputfields, når der bliver skrevet i disse.
    handleChangeHouseHold = houseHoldName => this.setState({ houseHoldName });
    //   handleChangePassword = password => this.setState({ password });

    handleChangeEmail = email => this.setState({ email });
    handleChangePassword = password => this.setState({ password });


    handleSubmit = async () => {
        const { email, password } = this.state;
        const status = false;
        const houseHoldId = "none";
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const reference = firebase.database().ref(`/allUsers/`).push({ email, status, houseHoldId });

         //   this.setState({isAuthenticated: true});
           // this.setState({currentUser: true})
            // const reference = firebase.database().ref(`/households/`).push({houseHoldName});
            // const updateReference = reference.toString().replace("https://reactnativedbtrial.firebaseio.com", "");
        } catch (error) {
            // Vi sender `message` feltet fra den error der modtages, videre.
            this.setError(error.message);
            console.log(error.message)
        }
    };

    render () {
        const { email, password } = this.state;
        return (
            <View>
                <Text style={styles.header}>Her opretter vi en bruger</Text>
                <TextInput
                    placeholder="email"
                    value={email}
                    onChangeText={this.handleChangeEmail}
                    style={styles.inputField}
                />
                <TextInput
                    placeholder="password"
                    value={password}
                    onChangeText={this.handleChangePassword}
                    secureTextEntry
                    style={styles.inputField}
                />
                <Button onPress={this.handleSubmit} title="Opret en bruger"/>
            </View>
        );
    };


}
