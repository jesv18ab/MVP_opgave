import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import HeaderClass from "./HeaderClass";
import firebase from "firebase";


export default class App extends React.Component{
    //Her instantieres state variabler for klassen
    state = {
        listOfGroceries: [],
        groceries: [{
            title : "Nytitel",
            items: "new item"
        }],
        newItem: '',
        count: 1,
        listname: 'Indkøbsliste',
        checkList: [],
        item: '',
        inputError: '',
        listRetreived: []
    };

    //Metoden bruges til at hente den bruger, som er valideret ved login
    getUser = () =>{
        var currentUser = null;
        try {
            currentUser =  firebase.auth().currentUser;
        }catch (e) {
            console.log(e.message)
        }
        return currentUser
    };

    setCount = () => this.setState(
        prevState => ({ ...prevState, count: this.state.count + 1 })
    )

    name = () => this.setState(
        prevState => ({ ...prevState, count: this.state.count + 1 })
    )

    //Metoden står for at gemme data fra en array i min firebase DB
    handleSave = () => {
        var id = this.getUser().uid;
        var email = this.getUser().email;
        const list = this.state.listOfGroceries;
       try {
            const reference = firebase
                .database()
                .ref(`/groceryLists/`).push({email, list});
            this.setState({
               listOfGroceries: []
            });
           const updateReference = reference.toString().replace("https://reactnativedbtrial.firebaseio.com", "");
           firebase.database().ref(`${updateReference}/list`).on('value', snapshot => {
                   var liste = snapshot.val();
               });

           //console.log(this.state.listRetreived)


         /*  for (let item of this.state.listOfGroceries) {
               firebase
                   .database()
                   .ref(`${updateReference}`).push({item});
           }
           'Alert.alert("Listen er gemt og kan findes på overblikssiden")'*/
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }

    };



    differentSafeMethod = () => {
        const mail = this.getUser().email;
        const list = this.state.listOfGroceries;
        try {
            const reference = firebase
                .database()
                .ref('/groceryLists')
                .push({list, mail});
            Alert.alert(`Saved`);
            this.setState({
                listOfGroceries: []
            });
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };



    //I render oprettes der et inputfelt, der  indeholder logik, som står for
    //at gemme de data, som brugeren indskriver i feltet.
    render() {
        return (
            <View>
                <HeaderClass navigation={this.props.navigation} title='Indkøbsliste' data="Dette er en tes"/>
                <View style={[styles.inputContainer, {marginTop: 50}]}>
                    <TextInput
                        style={[styles.input, {borderColor: 'black', borderWidth: 0.5}]}
                        onChangeText={text => this.setState({newItem: text})}
                        value={this.state.newItem}
                        placeholder="New Item..."
                        required
                    />

                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.newItem.trim() === "") {
                                this.setState(() => ({ inputError: "Der skal være et data input, før der trykkes add" }));
                            } else {
                                this.setState(prevState => {
                                    //Her bliver en array opdateret med den nye vare, såfremt der er leveret data i inputfeltet.
                                    //Nederst bliver newItem sat tilbage til udganspunktet., efter det er tilføjet til listen
                                    return{
                                        listOfGroceries:  [...prevState.listOfGroceries,  this.state.newItem   ]
                                    }
                                });
                                this.setState({newItem: ''});
                            }
                        }}
                        style={styles.button}>
                        <Text style={{color: '#FFF', textAlign: 'center'}}>Tilføj</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.itemList, {marginLeft: '10%'}]}>
                    {this.state.listOfGroceries.map((item, index) => (
                        //I denne metode, bliver der mappet en knap for hvert item i arrayet
                        //Trykker man på knappen, vil varen blive slettet fra listen.
                        //Der vil løbende blive opdateret en endelig liste
                        //Den nederste button komponent vil aktivere handlesave og gemme listen i firebase DB
                        <TouchableOpacity data="test" style={{marginLeft: '20%'}}
                            key={index}
                            onPress={() => {
                                this.state.listOfGroceries.splice(index, 1);
                                let newList = this.state.listOfGroceries;
                                this.setState({listOfGroceries: newList});
                            }}
                            style={styles.listItem}>
                            <Text style={{fontSize: 16}}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Button title="Tryk for at gemme listen" onPress={this.handleSave} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        height: 40,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%'
    },
    input: {
        backgroundColor: '#FFF',
        padding: 10,
        width: '80%',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#000',
        width: '20%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    itemList: {
        marginTop: 20,
        width: '80%',
    },
    listItem: {
        width: '100%',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginTop: '1%'
    }
});
