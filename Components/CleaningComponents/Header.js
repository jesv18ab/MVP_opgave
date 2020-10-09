import React,{Component} from 'react'
import {Text,View,StyleSheet,TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Header extends Component {

    handleNavigation = () =>{
        this.props.navigation.openDrawer()
    };

    render() {
        const {title}= this.props;
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.icon} onPress={this.handleNavigation}>
                    <MaterialCommunityIcons name="forwardburger" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.txt}>{title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        display:'flex',
        justifyContent:'space-around',
        paddingTop:25,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    icon:{
        width:'15%',
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
