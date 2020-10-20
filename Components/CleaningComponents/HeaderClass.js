import React,{Component} from 'react'
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Header} from "react-native-elements";


//Denne klasse skal være en konstant header i alle de komponenter,
//Som er tilstede i drawernavigatoren.
export default class HeaderClass extends Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    //Åbner vores draweavigator, baseret på den screen, som brugeren befidner sig på.
    handleNavigation = () =>{
        this.props.navigation.openDrawer()
    };

    //Der anvendes igen en Headerkomponent, som er hentet fra react-native-elements,

    render() {
        const {title}= this.props;
        return(
            <View style={{width: '100%'}}>
            <Header
                leftComponent={<TouchableOpacity style={styles.icon} onPress={this.handleNavigation}>
                    <MaterialCommunityIcons name="forwardburger" size={30} color="black" />
                    </TouchableOpacity>}
                centerComponent={{ text: this.props.title, style: { color: 'black', fontSize: 25 } }}
                containerStyle={{
                    backgroundColor: '#e3e3df',
                    justifyContent: 'space-around',}}
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
    icon:{
        width:'45%',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    txt:{
        width: '85%',
        textAlign:'center',
        fontSize:30,
        paddingRight:66
    }
})
