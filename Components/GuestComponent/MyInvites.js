//Import
import React from 'react';
import {Button, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import firebase from "firebase";
import { AntDesign, Feather } from '@expo/vector-icons';

//Oprettelse af klasse
export default class myInvites extends React.Component{
  //Livscykluskontrollær
    _isMounted = false;

    //Initialsiering af relevante state variabler
    state = {
        test: ["æble", "kage", "ris"],
        allInvitations: [],
        invites: ["no data"],
        userInvites: ["no Data"],
        invitationKeys: ["no Data"],
        allUsers: ["No Data"],
        acceptedInHousehold: false,
        houseHolds: ["No Data"]
    };

    //Håndterig af metoder, når komponenten moutes
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getInfo()
    }

    //Denne metode henter alle brugere, alle invittioenr og alle households
    // Dette er alle asynkrone kald
    getInfo = async () => {

      //nedhentning af invitationer
        await  firebase.database().ref('/allInvitations/').on('value', snapshot => {
                if (snapshot.val() != null){
                    this.findMyInvites(snapshot.val());
                    this._isMounted &&   this.setState({allInvitations: snapshot.val()})
                }
            }
        );

        //Nedhentning af alle brugere
       await firebase.database().ref('/allUsers/').on('value', snapshot => {
           this._isMounted &&   this.setState({allUsers: snapshot.val()})
            }
        );

       //Nedhentning af alle households
       await firebase.database().ref(`/households/`).on('value', snapshot => {
           this._isMounted &&   this.setState({houseHolds: snapshot.val()})
            }
        );
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    //Metode til at bestemme den nuværend ebrugeres invitationer
    findMyInvites = invitations =>{
        //Oprettelse af relevante variabler
        var arr = [];
        var invitationkeys = [];
        const list = Object.values(invitations);
        const keys = Object.keys(invitations);
        let keyOfUSer = null;

        //Her looper vi igennem alle invitationer. Hvis den nuvæernde brugers email stemmer overens med email for en invitation
        //Gemmes denne invitation og placeres i en liste over alle invitationer til den nuværende bruger
        list.map((item, index) => {
            if (item.receiver.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                arr.push(item);
                invitationkeys.push(keys[index])
            }
        });

        //Vi placeres alle keys og invitationer i to state arrays
        this._isMounted &&  this.setState({userInvites: arr});
        this._isMounted &&  this.setState({invitationKeys: invitationkeys})
    };

    //Metoden her skal bruges til at besvare invitationer.
    // Metoden har tre parametre, et ID, et household ID og et householdname
    answerInvite = async (key, houseHoldId, houseHoldName) => {
      //Oprettelse af en liste med brugernes nøgler for et en bestemt household
        let keyToUSers = null;
        this._isMounted && await  firebase.database().ref(`/households/${houseHoldId}`).on('value', snapshot => {
            keyToUSers = Object.keys(snapshot.val().users)[0]
            }
        );

        //Orettelse af en række variabler
      let keyFound = null;
        let userToFind = null;
        const {allUsers} = this.state;
        const listOfUsers = Object.values(allUsers);
        const listKeys = Object.keys(allUsers);

        //Vi looper igennem listen med alle brugere
            listOfUsers.map((item, index) => {
            var receiver = item.email;
                receiver = receiver.toUpperCase();

                //Finder vi at modtagerens email stemmer overens med den nuværende brugers email,
                //Gemmer vi nøglen for denne bruger og den pågældende bruger
            if (receiver === this.props.screenProps.currentUser.email.toUpperCase()){
                keyFound= listKeys[index];
                userToFind = item;
            }
        });

            ///Vi henter brugeren ned fra elle bruger ei firebase
        try {
            const status = true;
            this._isMounted && await firebase.database().ref(`/allUsers/${keyFound}`).update({houseHoldId, status});

           //Orettelse af relevante variabler
            var users =[];
            const houseHoldsToSearch = Object.values(this.state.houseHolds);
            const houseHoldsKeys = Object.keys(this.state.houseHolds);

           //Hr looper vi igennem alle households, hvis det pågædlende househouls stemmer overens
            //Med det householdID dder er sendt med i metoden, gemmes det pågældende household
            //Derudover gemmes alle brugerne i det pågældende household.
            houseHoldsKeys.map((item, index) => {
                if (item === houseHoldId){
                    const houseFound =houseHoldsToSearch[index];
                    users = (houseFound.users)
                }
            });
            //Vi henter alle mails fra brugernse o gememr dem i en user liste.
            users = Object.values(Object.values(users)[0])[0];
         //I lsiten sættes den nuværende bruges email
            users.push(this.props.screenProps.currentUser.email);

          //Vi placeres nu den opdaterede liste i kollektivets liste af brugere, hvorved den nye brugere nu er tilstede i kollektivet
            const reference = this._isMounted && await firebase.database().ref(`/households/${houseHoldId}/users/${keyToUSers}`).set({users});

            //Vi husker at fjerne invitationen fra invitationslisten i firebase
            this._isMounted && await firebase.database().ref(`/allInvitations/${key}`).remove();

          //Sker dette med succes, vil brugeren nu være en del af et kollektiv, hvorfor
            //vi skal skifte view til det view, der fremvises for brugere med et kollektiv.
            this.props.navigation.navigate('Profile');
        } catch (error) {
            // Vi sender `message` feltet fra den error der modtages, videre.
            console.log(error.message);
        }
        //Vi sætter accepteres i et household variablen true.
        this._isMounted &&  this.setState({acceptedInHousehold: true})
    };

    //Håndtering af logout metode
    handleLogOut = async () => {
        this._isMounted &&  await firebase.auth().signOut();
    };


// I render opbygges siden
    render() {

        // Initialisering af lsite og keys
        const list = Object.values(this.state.userInvites);
        const listOfKeys = Object.values(this.state.invitationKeys);

        if (!this.state.acceptedInHousehold){

           //Hvis den første værdi i lsiten er NO data, skal vi fremvise eskeden om at
            //At der lige nu ikke er nogle invitationer
            //Ellers fremviser vi alle invitationer
            if(list[0] === "no Data"){
                return (
                    <View>
                        <Text>Du har ingen invitationer på nuværende tidsunkt</Text>
                    </View>
                )
            }else {
            return (
                <View style={styles.container}>
                    <Text style={styles.headerText}>Dine invitationer</Text>
                    <View style={{ flex: 1, flexDirection: 'row', top: '5%'}}>
                        <View style={styles.row} >
                            <Text>AFsender</Text>
                        </View>
                        <View style={styles.row} >
                            <Text>Kollektiv navn</Text>
                        </View>
                        <View style={styles.row}>
                            <Text> Besvar</Text>
                        </View>
                    </View>
                    <View style={{ bottom: '31%', height: '50%' }}>
                        {list.map((item, index) => (
                                <View key={index} style={styles.listContainer}>
                                   <View style={{width: '45%', marginLeft: '40%', height: '100%', justifyContent: 'center', alignItems: 'center', left: 50 }}>
                                    <Text style={styles.label}>{item.sender}</Text>
                                   </View>
                                    <View style={{width: '45%', marginLeft: '40%', height: '100%', justifyContent: 'center', alignItems: 'center', right: 35}}>
                                        <Text style={styles.label}>{item.houseHoldName}</Text>
                                    </View>
                                    <View style={{width: '40%', height: '100%', right: 50, }} >
                                    <TouchableOpacity style={styles.button} title="Accept" onPress={() => this.answerInvite(listOfKeys[index], item.houseHoldId, item.houseHoldName )}>
                                        <Feather name="check" size={38} color='#008000' />
                                    </TouchableOpacity>
                                    </View>
                            </View>
                        ))}
                    </View>
                </View>


            );
            }
        }
        else {
            return(
                <View style={{margin: 50}} >
                    <Text>Tillykke du er et medlem af et kollektiv</Text>
                </View>
            )
        }
    }
}

//Styling af komponenter
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
        width: '100%',
        height: '100%'
    },
    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
    },
    row: {
        width: '30%',
        height: '15%',
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: { width: '100%', fontWeight: 'bold',  fontSize: 15 },
    input: { borderWidth: 1, flex: 1 },
    value: { flex: 1 },
    inputField: {
        width: '80%',
        fontSize: 20,
        height: 44,
        padding: 10,
        borderWidth: 0.3,
        margin: '2%',
        marginLeft: '10%',
        borderRadius: 25,
        backgroundColor: 'white',
    },
    listContainer: {
        height: 55,
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.3,
        marginBottom: '2%',
        marginTop: '1%',
    },
    button: {
        padding: 10,
        width: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: '55%',
        height: '100%'
    },
});
