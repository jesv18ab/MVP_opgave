import {Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";

export default class CommonAreaCleaningView extends React.Component {
    render(){
        return(
            <View>
                <HeaderClass navigation={this.props.navigation} title='Common Areas'/>
                <View>
                <Image style={styles.welcomePic} source={require('./assetsCleaningViews/OpgaveOversigt.png')}/>
                </View>
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
});
