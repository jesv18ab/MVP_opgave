import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderClass from "./HeaderClass";


export default class App extends React.Component{
    state = {
        listOfGroceries: [],
        newItem: ''
    }
    componentDidMount() {
        this.getData();
        this.storeData();
    }

    /*  const [itemList, setItemList] = React.useState([]);
      const [newItem, setNewItem] = React.useState("");*/

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem("ShoppingList")
            if(value !== null) {
                console.log("Dette er value:" + value);
                console.log("Dette er list:" + this.state.listOfGroceries);
            } else {
                console.log("No data");
            }
        } catch(e) {
            // error reading value
        }
    };

    storeData = async () => {
        const stringifiedList = JSON.stringify(this.state.listOfGroceries);
        await AsyncStorage.setItem('ShoppingList', stringifiedList);
        const value = await AsyncStorage.getItem("ShoppingList");
        this.setState({listOfGroceries: []});
        console.log(JSON.parse(value));
        console.log("list:" + this.state.listOfGroceries);
    };

    render() {
        return (
            <View>
                <HeaderClass navigation={this.props.navigation} title='Indkøbsliste'/>
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
                                this.setState(() => ({ nameError: "First name required." }));
                            } else {
                                this.setState(prevState => {
                                    return{
                                        listOfGroceries: [...prevState.listOfGroceries, this.state.newItem]
                                    }
                                });
                                this.setState({newItem: ''});
                            }
                        }}
                        style={styles.button}>
                        <Text style={{color: '#FFF', textAlign: 'center'}}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.itemList, {marginLeft: '10%'}]}>
                    {this.state.listOfGroceries.map((item, index) => (
                        <TouchableOpacity style={{marginLeft: '20%'}}
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
                <Button title="Tryk for at gemme listen" onPress={this.storeData} />
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
