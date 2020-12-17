//Imports
import * as React from 'react';
import {Button,Text, View, TextInput, ActivityIndicator, StyleSheet, Alert, ActivityIndicatorComponent
} from 'react-native';
import firebase from "firebase";

//Oprettelse af klasse
export default class CreateHouseHold extends React.Component {

    //operettelse af relevate state variabler
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

    //Her henter vi alle brugere
    initialRetrival = async () => {
     await firebase.database().ref('/allUsers/').on('value', snapshot => {
                this._isMounted && this.setState({ allUsers: snapshot.val() });
            }
        );
        //Her henter vi alle households
      await firebase.database().ref('/households/').on('value', snapshot => {
                this._isMounted && this.setState({ allHouseHolds: snapshot.val() });
            }
        );
    };

    //I componentDidmount aktiveres relevante metoder
    componentDidMount() {
        this._isMounted = true;
        // this.updateList();
        this._isMounted && this.initialRetrival();

        //Vi observerer den validerede brugers status
        this.authStateChangeUnsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
            this._isMounted && this.setState({currentUser});
        });

    }

    //Vi nuælstiller subscirbe, når vi unmounter
    componentWillUnmount() {
        this.authStateChangeUnsubscribe && this.authStateChangeUnsubscribe();
        this._isMounted = false;
    }
    //Initialisering af subscirbe
    authStateChangeUnsubscribe = null;


    //Håndtering af logout
    handleLogOut = () => {
        firebase.auth().signOut();
    };

// EStår for at opdatere værdierne af vores inputfields, når der bliver skrevet i disse.
    handleChangehouseHoldName = houseHoldName => this._isMounted && this.setState({ houseHoldName });

    //Metoden her anvendes til at tjekke om det valgte navn, ikke allerede er anvedt af at et andet household
    checkHouseHolds = () =>{
        const allHouseHolds = Object.values(this.state.allHouseHolds);
        const { houseHoldName} = this.state;

        let run = true;
        allHouseHolds.map((item, index) => {
            if (houseHoldName.toUpperCase() === item.houseHoldName.toUpperCase()){
                run = false
            }
        });

        //Her retunreres run. Hvisnavnet er taget, vil værdien af denne være false, ellers er den true
        return run;
    };

    //MEtoden her står for at oprette kollektivet.
    //MEtoden er asynkron
    handleSubmit = async () => {
       //Oprettelse af relevante variabler
        const items = ["No items added"];

       //HHer hentes resultatet af vores tjek på kollektiv nanvet
        let isUnique = this.checkHouseHolds();

        //Her ser vi på om navnet er taget eller ej
        if (isUnique){
           //Er navnet unikt, initialiseres relevante variabler
            let keyFound = null;
            let userToFind = null;
            var users = [];
            const {allUsers} = this.state;
            const listOfUsers = Object.values(allUsers);
            const listKeys = Object.keys(allUsers);

            //Vi lopper igennem alle brugere
            listOfUsers.map((item, index) => {
                //Hvis en brugers email i lsiten er ligmed den nuværende brugers email, skal vi hente brugeren
                //Vi skal hente brugerens nøgle og placerer brugerens email i en liste over alle der indeholders
                //lle emials for de beboere, der er i kollektivet.
                if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                    keyFound= listKeys[index];
                    userToFind = item;
                    users.push(item.email);
                }
            });
            //Vi henter householdname
            const { houseHoldName} = this.state;
            try {
               // Vi opretter et householdi firebase
                const reference = firebase.database().ref(`/households/`).push({houseHoldName });
              //Vi henter id'et for kollektivet
                const houseHoldId = reference.toString().replace("https://reactnativedbtrial.firebaseio.com/households/", "");
               //Her pushes en lste af brugere i kollektivet
                firebase.database().ref(`/households/${houseHoldId}/users`).push({users});
            //Her pushes en liste over alle items i kollektivet. Denne er natulivis tom til at starte med.
                firebase.database().ref(`/households/${houseHoldId}/groceryList/`).push({items});
             //Vi sætte en status variabel til at være true
                const status = true;
              try {
               //Vi sørger for at opdaterer den pågældende bruger, således at vedkommende nu er en del
                  //af et kollektiv samt har et household id forbundet til sin householdid attribut.
                  await firebase.database().ref(`/allUsers/${keyFound}`).update({houseHoldId, status});
              }catch (e) {
                  console.log(e.message)
              }
                var newHouseHold = true;

              //Nu er kollektivet oprettet og brugerens profil er opdateret
                //Derfor skal brugeren nu sendes ind i den side, der er målrettet for brugere,  der er en
                //del af et kollektiv
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
    //Metode til at føre brugere tilbage udganspunkts siden, hvor man kan vælge at oprette et kollektiv eller se sine invitationer
    profile = () => {
        this.props.navigation.navigate('InitialViewNewUsers');
    }


    //I render opbygges siden med relevante komponenter til at håndtere de funktionaliteter, som en bruger vil bruge
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


//Orpettelse af stylingkomponenter, som brugeren kan anvend
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
