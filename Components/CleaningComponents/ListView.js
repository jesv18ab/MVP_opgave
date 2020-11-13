
import * as React from 'react';
import {View, Text, FlatList, StyleSheet, Button, Alert, TextInput, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import HeaderClass from "./HeaderClass";
import { AntDesign } from '@expo/vector-icons';
import {Header} from "react-native-elements";

export default class ListView extends React.Component {
    //Oprettelse af boolean til styring af lief cycles
    _isMounted = false;
    //Instantiering af state variabler
    state = {
        list: [""],
        test: [],
        id: null,
        newItem: '',
        dataList: [],
        email: null,
        updatedList: [],
        allUsersFound: [],
        houseHoldId: null,
        key: null
    };


    //Der anvendes ComponentDidMount for relevante metoder. Hvortil boolean variabel sættes true
    componentDidMount() {
        const keyHouseHold = this.props.navigation.getParam('houseHoldKey');
        const keyToList = this.props.navigation.getParam('specificListKey');
        this._isMounted = true;
        firebase.database().ref(`/households/${keyHouseHold}/groceryList/${keyToList}`).on('value', snapshot => {
          if (snapshot.val()){
            this.setState({list: snapshot.val().items})
          }
        });
        //  this.loadList(allUsers);

        // Vi udlæser ID fra navgation parametre og loader bilen når komponenten starter
        // const id = this.props.navigation.getParam('id');
        // const email = this.props.navigation.getParam('email');
        // this.loadList(id);

        //   this.updateList;
        this.removeItem;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleLogOut =  () => {
        firebase.auth().signOut();
    };

    //MEtoden her står for at loade den valgte liste, således vi kan få fat på e varer, der er placeret i listen
    loadList = allUsers =>{
        console.log("He går det godt");
        let houseHoldKey = null;
        allUsers.map((item, index) => {
            if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                this.setState({houseHoldId: item.houseHoldId });
                houseHoldKey = item.houseHoldId;
                this.setState({key: houseHoldKey})
            }
        });

        firebase.database().ref(`/households/${houseHoldKey}/groceryList`).on('value', snapshot => {

            this.setState({list: snapshot.val()})
        });

    };

    //Metoden her tager en lsite og et item med, som skal ferjens fra listen.
    //Der kører et loop, som finder det valgte item i listen, hvorefter den tilknyttede key bestemmes og anvendes
    //Til firebase kaldet, der fjerner produktet fra listen
    removeItem = ( list, itemPicked, keys) =>{
        this.setState({list: list});
        var itemIndex = null;
        var key = null;
        const keyHouseHold = this.props.navigation.getParam('houseHoldKey');
        const keyToList = this.props.navigation.getParam('specificListKey');
        list.map((item, index) => {
            if (itemPicked === item){
                key = keys[index];
            }
        });
        firebase.database().ref(`/households/${keyHouseHold}/groceryList/${keyToList}/items/${key}`).remove();
    };

    //Denne metode opdatere og returnerer vores liste array
    //Metoden tager en liste med som parameter
    updateArray = (listToUpdate) =>{
        var arr = listToUpdate;
        if (arr[0] === "No items added" ){
            arr.splice(arr[0]);
        }
        arr.push(this.state.newItem);
        this.setState({newItem: ""})
        return arr
    };


    //Denne metode Foreatger et firebase kald, som udfører en setter metode, der skal overskrive den gamle list e
    //Med den nye opdaterede liste
    updateList = (listToUpdate) => {
        const items = this.updateArray(listToUpdate);
        const keyHouseHold = this.props.navigation.getParam('houseHoldKey');
        const keyToList = this.props.navigation.getParam('specificListKey');
        firebase.database().ref(`/households/${keyHouseHold}/groceryList/${keyToList}`).set({items});
    };

    //I render opretes to constvariabler, der indeholder en liste og alle
    //Dertilhørende keys.
    //Derueodver udskrives alle produkter i som komponenter og der oprettes et inputfelt
    //Der skal registrere det som brugerne indskriver, når der skal tilføes et produkt til listen
    render() {
        const list = Object.values(this.state.list);
        const keys = Object.keys(this.state.list);

        if (!this.state.list){
            return (
                <View>
                    <Text>No data </Text>
                    <Button title="Log ud" onPress={this.handleLogOut}/>
                </View>
            )
        } else
            return (
                <View style={styles.container}>
                    { list.map((item, key)=>(
                            <View key={key} style={styles.listContainer} >
                                <Text style={styles.label}>{item}</Text>
                                <TouchableOpacity style={styles.button} title="Delete" onPress={() => this.removeItem( list, item, keys)}>
                                    <AntDesign name="minuscircleo" size={35} color="#CD5C5C"/>
                                </TouchableOpacity>
                            </View>
                        )
                    )}
                    <View>
                        <TextInput
                            placeholder="Indsæt varenavn"
                            value={this.state.newItem}
                            onChangeText={newItem => this.setState({ newItem })}
                            style={styles.inputField}                    />
                        <Button title="Tilføj en vare" onPress={() =>this.updateList(list)}/>
                    </View>
                    <Button title="Log ud" onPress={this.handleLogOut}/>
                </View>
            );
    }
}


//Dette er blot styles til der skal anvendes til design
const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 10 },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold', marginLeft: '7%', fontSize: 15 },
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
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.3,
        marginBottom: '2%',
        backgroundColor: 'white',
        marginTop: '1%'
    },
    button: {
        padding: 10,
        width: '20%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: '55%'
    },
});
