import * as React from 'react';
import {Button,Text,
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import firebase from "firebase";
import MainNavigator from "../UserComponent/UserMainViewNavigation";


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

export default class MakeHouseHold extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            householdLink: "Changes Link"
        };
        this.state ={
            isApartOfHouseHold: false
        }
    }
    state = {
        email: '',
        password: '',
        isLoading: false,
        isCompleted: false,
        errorMessage: null,
        houseHoldName: '',
        allUsers: [],
        userFound: null,
        allHouseHolds: [],

    };

    initialRetrival = async () => {
        firebase.database().ref('/allUsers/').on('value', snapshot => {
            this._isMounted && this.setState({ allUsers: snapshot.val() });
            }
        );
        firebase.database().ref('/households/').on('value', snapshot => {
               this._isMounted && this.setState({ allHouseHolds: snapshot.val() });
            }
        );
    };

    componentDidMount() {
        this._isMounted = true;
        // this.updateList();
       this._isMounted && this.initialRetrival();
        this.authStateChangeUnsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
            this._isMounted && this.setState({currentUser});
        });


    }
    componentWillUnmount() {
        this.authStateChangeUnsubscribe && this.authStateChangeUnsubscribe();
        this._isMounted = false;
    }
    authStateChangeUnsubscribe = null;


    handleLogOut = () => {
         firebase.auth().signOut();
    };
// EStår for at opdatere værdierne af vores inputfields, når der bliver skrevet i disse.
    handleChangehouseHoldName = houseHoldName => this._isMounted && this.setState({ houseHoldName });

    checkHouseHolds = () =>{
        console.log("run")
        console.log(this.state.allHouseHolds)
        const allHouseHolds = Object.values(this.state.allHouseHolds);
        const { houseHoldName} = this.state;

        let run = true;
        allHouseHolds.map((item, index) => {
            if (houseHoldName.toUpperCase() === item.houseHoldName.toUpperCase()){
                run = false
            }
        });
        console.log(run)

        return run;
    };
    handleSubmit = async () => {
        console.log("Ramt")
        const items = ["No items added"];
        let isUnique = this.checkHouseHolds();
        if (isUnique){
            let keyFound = null;
            let userToFind = null;
            var users = [];
            const {allUsers} = this.state;
            const listOfUsers = Object.values(allUsers);
            const listKeys = Object.keys(allUsers);
            listOfUsers.map((item, index) => {
                if (item.email === this.props.screenProps.currentUser.email){
                    keyFound= listKeys[index];
                    userToFind = item;
                    users.push(item.email);
                }
            });
            const { houseHoldName} = this.state;
            try {
                const reference = firebase.database().ref(`/households/`).push({houseHoldName, users });
                const houseHoldId = reference.toString().replace("https://reactnativedbtrial.firebaseio.com/households/", "");
                console.log("Dette er householdId");
                console.log(houseHoldId);
                firebase.database().ref(`/households/${houseHoldId}/groceryList/`).push({items});
                const status = true;
                console.log("Så langt så godt")
                firebase.database().ref(`/allUsers/${keyFound}`).update({houseHoldId, status});
               this._isMounted && this.setState({isApartOfHouseHold: true})
            } catch (error) {
                // Vi sender `message` feltet fra den error der modtages, videre.
                this.setError(error.message);
            }
        }
        else {
            Alert.alert("Navnet er allerede taget, prøv et nyt");
        }

    };

    render()  {
        console.log("Vi er i createUSer");
        const { errorMessage, houseHoldName, isCompleted } = this.state;
        return (
            <View>
                <Text style={styles.header}>Her oprettet vi et nyt kollektiv</Text>
                <TextInput placeholder="Navngiv jeres kollektiv" value={houseHoldName} onChangeText={this.handleChangehouseHoldName} style={styles.inputField}/>
                <Button onPress={this.handleSubmit} title="Opret jeres hus"/>
                <Button onPress={this.handleLogOut} title="Log ud"/>
            </View>
        );
    };


}
