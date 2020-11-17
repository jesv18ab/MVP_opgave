import * as React from 'react';
import {Button,Text, View, TextInput, ActivityIndicator, StyleSheet, Alert, ActivityIndicatorComponent
} from 'react-native';
import firebase from "firebase";

export default class CreateHouseHold extends React.Component {

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
        houseHoldIsCreated: false
    };

    initialRetrival = async () => {
     await firebase.database().ref('/allUsers/').on('value', snapshot => {
                this._isMounted && this.setState({ allUsers: snapshot.val() });
            }
        );
      await firebase.database().ref('/households/').on('value', snapshot => {
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
        const allHouseHolds = Object.values(this.state.allHouseHolds);
        const { houseHoldName} = this.state;

        let run = true;
        allHouseHolds.map((item, index) => {
            if (houseHoldName.toUpperCase() === item.houseHoldName.toUpperCase()){
                run = false
            }
        });

        return run;
    };
    handleSubmit = async () => {
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
                console.log("item")
                console.log(item)
                if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                    keyFound= listKeys[index];
                    userToFind = item;
                    users.push(item.email);
                }
            });
            const { houseHoldName} = this.state;
            try {
                const reference = firebase.database().ref(`/households/`).push({houseHoldName });
                const houseHoldId = reference.toString().replace("https://reactnativedbtrial.firebaseio.com/households/", "");
                firebase.database().ref(`/households/${houseHoldId}/users`).push({users});
                firebase.database().ref(`/households/${houseHoldId}/groceryList/`).push({items});
                const status = true;
              try {
                  await firebase.database().ref(`/allUsers/${keyFound}`).update({houseHoldId, status});
              }catch (e) {
                  console.log(e.message)
              }
                var newHouseHold = true;
                this.props.navigation.navigate('Profile');
            } catch (error) {
                // Vi sender `message` feltet fra den error der modtages, videre.
                this.setError(error.message);
            }
        }
        else {
            Alert.alert("Navnet er allerede taget, prøv et nyt");
        }

    };

    profile = () => {
        this.props.navigation.navigate('InitialViewNewUsers');
    }

    render()  {
        const { errorMessage, houseHoldName, isCompleted } = this.state;
        return (
            <View>
                <Text style={styles.header}>Her oprettet vi et nyt kollektiv</Text>
                <TextInput placeholder="Navngiv jeres kollektiv" value={houseHoldName} onChangeText={this.handleChangehouseHoldName} style={styles.inputField}/>
                <Button onPress={this.handleSubmit} title="Opret jeres hus"/>
                <Button onPress={this.handleLogOut} title="Log ud"/>
                <Button onPress={this.profile} title="profile"/>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
    },
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
