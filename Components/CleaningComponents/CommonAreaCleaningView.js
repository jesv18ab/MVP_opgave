import {Image, StyleSheet, Text, View, SectionList, Platform, Alert, FlatList} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";
import AsyncStorage from '@react-native-community/async-storage';
import GroceryShoppingView from "./GroceryShoppingView";
import firebase from "firebase";
import ListItems from "./ListsItems";


export default class CommonAreaCleaningView extends React.Component {
    //Her instantieres state variabler
    state = {
        groceryLists: [],
        routename: null,
        checkList: [],
        identifiers: [],

    };

    //Når komponenten mounter, skal en array med alle lister hentes
    componentDidMount() {
            firebase
                .database()
                .ref('/groceryLists')
                .on('value', snapshot => {
                    this.setState({ groceryLists: snapshot.val() });
                });
    }


render(){
    const { groceryLists } = this.state;
    // Vi viser ingenting hvis der ikke er data
    //Udover headeren naturligvis
    if (!groceryLists) {
        return <HeaderClass navigation={this.props.navigation} title='Common Areas'/>;
    }
    // Flatlist forventer et array. Derfor tager vi alle values fra vores liste objekt, og bruger som array til listen
    const listArray = Object.values(groceryLists);
    // Vi skal også bruge alle IDer, så vi tager alle keys også.
    const listKeys = Object.keys(listArray)
    console.log("Dette er keys");
    console.log(listKeys);
    return(
<View>
<HeaderClass navigation={this.props.navigation} title='Common Areas'/>
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
            <ListItems
                list={item}
                id={listKeys[index]}
                mail={item.mail}
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
    marginTop: 10,
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
