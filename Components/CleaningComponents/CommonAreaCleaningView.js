import {Image, StyleSheet, Text, View, SectionList, Platform, Alert, FlatList, TouchableOpacity} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";
import AsyncStorage from '@react-native-community/async-storage';
import GroceryShoppingView from "./GroceryShoppingView";
import firebase from "firebase";
import ListsItems from "./ListsItems";


export default class CommonAreaCleaningView extends React.Component {
    _isMounted = false;

    //Her instantieres state variabler
    state = {
        groceryLists: [],
        routename: null,
        checkList: [],
        identifiers: [],
        stateKeys: []
    };

    //Når komponenten mounter, skal en array med alle lister hentes
    componentDidMount() {
        this._isMounted = true;

        firebase
                .database()
                .ref('/groceryLists/')
                .on('value', snapshot => {
                    this.setState({ groceryLists: snapshot.val() });
                   // this.setState({ keys: Object.keys(this.state.groceryLists) });
                    //console.log(this.state.groceryLists);
                }
                );

        /*firebase
            .database()
            .ref(`groceryLists/${keys[0]}/list`)
            .on('value', snapshot => {
                    var s = snapshot.val();
                    console.log(s[0]);
                }
            );*/
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSelectedList = (email, id) => {
        this.props.navigation.navigate('Indkøb', { id, email });
    };



render(){
    const { groceryLists } = this.state;
    //console.log(groceryLists);
    // Vi viser ingenting hvis der ikke er data
    //Udover headeren naturligvis
    if (!groceryLists) {
        return <View>
            <HeaderClass navigation={this.props.navigation} title='Overblikket'/>
        </View>;
    }
    // Flatlist forventer et array. Derfor tager vi alle values fra vores liste objekt, og bruger som array til listen
    const listArray = Object.values(groceryLists);
    const listKeys = Object.keys(groceryLists);
    // Vi skal også bruge alle IDer, så vi tager alle keys også.
    return(
<View>
<HeaderClass navigation={this.props.navigation} title='Overblikket'/>
    <SectionList
        sections={[
            { title: 'Indkøbsliste', data: listArray },
            { title: 'Vaskeplan', data: this.state.checkList },
        ]}
        renderSectionHeader={({ section }) => (
            <Text style={styles.SectionHeaderStyle}> {section.title} </Text>
        )}
        // Vi bruger Keys til at finde ID på den aktuelle liste og returnerer dette som key, og giver det med som ID til ListItems
        renderItem={({ item, index }) => (
            <ListsItems
                list={item}
                id={listKeys[index]}
                mail={item.email}
                onSelect={() => this.handleSelectedList(item.email, listKeys[index])}
            />
        )}
        keyExtractor={(item, index) => listKeys[index]}
    />
</View>
)
}

}
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'center',
},
SectionHeaderStyle: {
    marginTop: '5%',
backgroundColor: '#376B73',
fontSize: 20,
padding: 5,
color: '#fff',

},
SectionListItemStyle: {
fontSize: 15,
padding: 15,
color: '#000',
backgroundColor: '#F5F5F5',
},
});
