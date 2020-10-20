
import * as React from 'react';
import {View, Text, FlatList, StyleSheet, Button, Alert, TextInput, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import HeaderClass from "./HeaderClass";
import { AntDesign } from '@expo/vector-icons';
import {Header} from "react-native-elements";


//Nedenstående klasse skal på sigt anvendes, men er på nuværende tidspunkt
//Blot en replikationen af carDetials klassen fra Øvelse 6

const indkøbsListe = 'Indkøbslisten';
export default class ListView extends React.Component {
   _isMounted = false;
    //Instantiering af state variabler
    state = {
        list: [],
        id: null,
        newItem: '',
        dataList: [],
        email: null,
        updatedList: [],
    };


    //Der anvendes ComponentDidMount for relevante metoder.
    componentDidMount() {
        this._isMounted = true;
        // Vi udlæser ID fra navgation parametre og loader bilen når komponenten starter
        const id = this.props.navigation.getParam('id');
       // const email = this.props.navigation.getParam('email');
      this.loadList(id);

   //   this.updateList;
        this.removeItem;
    }
   componentWillUnmount() {
        this._isMounted = false;
    }

  loadList = id =>{

        var keys = null;
      this.setState({id : id});
      firebase
          .database().ref(`/groceryLists/${id}/list`).on('value', snapshot => {
          keys = Object.keys(snapshot.val());
          this.setState({ list: snapshot.val() });
      });

     return keys
  };

    removeItem = ( list, item) =>{
        this.setState({list: list});
        var itemIndex = null;
        var key = null;
            const id = this.state.id;
        for (let itemInList of list){
            if (item === itemInList){
              itemIndex = list.indexOf(itemInList)
                key = this.loadList(id)[itemIndex];
            }
        }
           firebase.database().ref(`/groceryLists/${id}/list/${key}`).remove();
    };

    updateArray = (listToUpdate) =>{
        console.log("Her er vi listToUpdate");
        console.log(listToUpdate);
        var array = null;
        const id = this.state.id;
        array = listToUpdate;
        array.push(this.state.newItem);
        return array
    };



    updateList = (listToUpdate) => {
       const list = this.updateArray(listToUpdate);
        // Vi bruger this.props.navigation flere steder så vi pakker den ud én gang for alle
        const id = this.props.navigation.getParam('id');
        const email = this.props.navigation.getParam('email');
           firebase.database().ref(`/groceryLists/${id}`).set({email, list});
            Alert.alert("Din info er nu opdateret");
            this.setState({newItem:''})
    };

    //Denne metode skal loade en liste pba. et ID

//Der oprettes et if-else statement, som skal bruges til at teste,
    //Om der er en liste, som passer med det id, som er parset med props
    //Findes der en liste, printes der data ud fra listen.
    render() {
        const list = Object.values(this.state.list);
        const keys = Object.keys(list);
        if (!this.state.list){
            return (
                <View>
                    <Text>No data </Text>
                </View>
            )
        } else
                return (
            <View style={styles.container}>
                { list.map((item, key)=>(
                    <View key={key} style={styles.listContainer} >
                        <Text style={styles.label}>{item}</Text>
                        <TouchableOpacity style={styles.button} title="Delete" onPress={() => this.removeItem( list, item)}>
                            <AntDesign name="minuscircleo" size={35} color="#CD5C5C" />
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
            </View>
        );
    }
}

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
