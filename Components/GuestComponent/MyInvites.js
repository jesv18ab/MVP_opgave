import React from 'react';
import {Button, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import firebase from "firebase";
import { AntDesign, Feather } from '@expo/vector-icons';

var usersFound = ["Test data"];

export default class myInvites extends React.Component{
    _isMounted = false;
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
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getInfo()
    }

    getInfo = async () => {
      await  firebase.database().ref('/allInvitations/').on('value', snapshot => {
                if (snapshot.val() != null){
                    this.findMyInvites(snapshot.val());
                    this._isMounted &&   this.setState({allInvitations: snapshot.val()})
                }
            }
        );
       await firebase.database().ref('/allUsers/').on('value', snapshot => {
           this._isMounted &&   this.setState({allUsers: snapshot.val()})
            }
        );
       await firebase.database().ref(`/households/`).on('value', snapshot => {
           this._isMounted &&   this.setState({houseHolds: snapshot.val()})
            }
        );
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    findMyInvites = invitations =>{
        var arr = [];
        var invitationkeys = [];
        const list = Object.values(invitations);
        const keys = Object.keys(invitations);
        let keyOfUSer = null;
        list.map((item, index) => {
            if (item.receiver.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                arr.push(item);
                invitationkeys.push(keys[index])
            }
        });
        this._isMounted &&  this.setState({userInvites: arr});
        this._isMounted &&  this.setState({invitationKeys: invitationkeys})
    };

    answerInvite = async (key, houseHoldId, houseHoldName) => {
        let keyToUSers = null;
        this._isMounted && await  firebase.database().ref(`/households/${houseHoldId}`).on('value', snapshot => {
            keyToUSers = Object.keys(snapshot.val().users)[0]
            }
        );
      let keyFound = null;
        let userToFind = null;
        const {allUsers} = this.state;
        const listOfUsers = Object.values(allUsers);
        const listKeys = Object.keys(allUsers);
            listOfUsers.map((item, index) => {
            var receiver = item.email;
                receiver = receiver.toUpperCase();
            if (receiver === this.props.screenProps.currentUser.email.toUpperCase()){
                keyFound= listKeys[index];
                userToFind = item;
            }
        });
        try {
            const status = true;
            this._isMounted && await firebase.database().ref(`/allUsers/${keyFound}`).update({houseHoldId, status});
            var users =[];
            const houseHoldsToSearch = Object.values(this.state.houseHolds);
            const houseHoldsKeys = Object.keys(this.state.houseHolds);
            houseHoldsKeys.map((item, index) => {
                if (item === houseHoldId){
                    const houseFound =houseHoldsToSearch[index];
                    users = (houseFound.users)
                }
            });
            users = Object.values(Object.values(users)[0])[0];
            users.push(this.props.screenProps.currentUser.email);
            const reference = this._isMounted && await firebase.database().ref(`/households/${houseHoldId}/users/${keyToUSers}`).set({users});
            this._isMounted && await firebase.database().ref(`/allInvitations/${key}`).remove();
            this.props.navigation.navigate('Profile');
        } catch (error) {
            // Vi sender `message` feltet fra den error der modtages, videre.
            console.log(error.message);
        }
        this._isMounted &&  this.setState({acceptedInHousehold: true})
    };

    handleLogOut = async () => {
        this._isMounted &&  await firebase.auth().signOut();
    };



    render() {
        const list = Object.values(this.state.userInvites);
        const listOfKeys = Object.values(this.state.invitationKeys);
        if (!this.state.acceptedInHousehold){
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
