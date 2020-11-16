import {StyleSheet} from "react-native";


const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
    },

    inputFields: {
        width: 250,
        fontSize: 15,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,
    },
    buttonText:{
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        alignItems: 'center',
        backgroundColor: '#47525E',
        width: 250,
        height: 54,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginTop:7,
    },


    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
        bottom:100,
    },




});

export default globalStyles