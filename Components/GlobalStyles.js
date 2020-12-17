import {StyleSheet} from "react-native";


//Dette er en global styling side, som skal anvendes til de stylings der går i gen i flere klasser
const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
    },


    titleText:{

        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',

    },
    inputField: {
        width: 280,
        fontSize: 15,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,

    },

    button: {
        alignItems: 'center',
        width: 200,
        height: 44,
        padding: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 25,
        marginBottom: 10,
    },

    buttonText:{
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },



});

//Her eksporteres komponenter, så vi kan hente den i andre klasser.
export default globalStyles
