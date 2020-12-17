//Imports
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, Linking} from 'react-native';
import firebase, {initializeApp} from "firebase";
import RNPickerSelect from "react-native-picker-select";
import {WebBrowser} from "expo/build/removed.web";

//Oprettelse af klasse
export default class ProfileView extends React.Component{

    //Oprettelse af livscykluskontrollør
    _isMounted = false;

    //Oprettelse af state variabler
    state = {
    currentUser: this.props.screenProps.currentUser,
    houseHasBeenCreated: null,
    userInfo: '',
    houseHoldName: ''
};

//Denne metode henter den bruger, som er valideret under login
    getUser = () =>{
        var currentUser = null;
        try {
             currentUser =  firebase.auth().currentUser;
        }catch (e) {
            console.log(e.message)
        }
        return currentUser
    };

    //Her initieres metoder, når komponenter monteres
    componentDidMount() {
        //Når komponenten er mountet, skal vores boolean kontrollør være true
        this._isMounted = true;

        //DIsse tre metoder skal kaldes, når komponenten monteres
        this._isMounted && this.checkIfNewUser();
        this._isMounted && this.stateUser();
        this._isMounted && this.getHouseHolds();
    }


    //Her hentes all households fra firebase
    getHouseHolds = () => {
        let houseHoldName = '';


       //Vi laver det der svarer til et foreach loop med værdierne i householdlisten der  er parset fra App.js
        Object.values(this.props.screenProps.houseHolds).map((item, index) => {
            //Vi bruger Objectvalues, når vi vil ind og oprette en array fra en javascript objekt.
            //Grunden til at vi laver den flere gange, er at vi skal ind i stien og hente specifikke oplysninger, som er begravet dybere ind i stien.
            //Vi henter her listen af brugere for et givent household
          let arr = (Object.values(Object.values(Object.values(this.props.screenProps.houseHolds)[index].users))[0]).users;
         //Vi henter index dra det pågældende household i loopet
           let indexOfHouseHold = index;
           //For alle brugerne i den liste, der blev hentet ovenstående, tester vi ders mail.
            //Hvis mailen stemmer overens med den validerede bruger, henter vi navnet på kollektivet - linje 64
            arr.map((item, index) => {
                let userEmail = this.props.screenProps.currentUser.email;
                if (userEmail.toUpperCase() === item.toUpperCase()){
                    houseHoldName = Object.values(this.props.screenProps.houseHolds)[indexOfHouseHold].houseHoldName
                }
            });
        });
        //Vi sætter navnet for kollektivet i en state variabel
        this.setState({houseHoldName: houseHoldName})
    };

    //Her oprettes en asynkron metode til at observerer den nuvlrende bruger tilstand
    //Brugeren bliver gemt i en state variabel.
    stateUser = async() =>{
       await firebase.auth().onAuthStateChanged(currentUser => {
            this.setState({currentUser: currentUser});
        });
    };

    //MEtode til håndtering af logut
    handleLogOut = async () => {
        this._isMounted &&  await firebase.auth().signOut();
    };

    //Denne metode skal teste, hvorvidt en bruger en er en del af et kollektiv eller ej
    //Der er jo brugere, som har en account uden at være en del af et kollektiv. Dette testes i denne metode
    checkIfNewUser = async () => {

        //Initial værdi af status sættes til at være null
        var status = null;

        //Vi henter alle brugere fra firebase og placerer disse i en state variabel
        await firebase.database().ref('allUsers').on('value', snapshot => {
            if (snapshot.val()){

                //Vi looper igennem alle brugere og tester den attibut, der angiver deres nuværende bolig status
                Object.values(snapshot.val()).map((item, index) => {
                    if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                        this._isMounted && this.setState({houseHasBeenCreated: item.status})
                        status = item.status;
                        this.setState({userInfo: item})
                    //Hvis status er false eller null betyder dette at brugere ikke er en del af et kollekt, hvorfor vedkommende bliver vist ind til
                        //Et andet view, der er dedikeret til denne bruger type
                        if (!item.status && item.status != null)
                        {
                            this.props.navigation.navigate('NewUser');
                        }
                    }
                }
            )
            }
        });

};


    //Afmontering af komponenter
componentWillUnmount() {
    this._isMounted = false;
}

//TRe metoder der kaldes, når vi oplever ændringer i email, password eller navmn
    handleChangeEmail = email => this.setState({ email });
    handleChangePassword = password => this.setState({ password });
    handleChangeName = name => this.setState({ name });


    //I render formateres bestemte data, før de printes i profilviewet.
    //Her mere specifikt er der et behov for formateringer, når vi arbjder med datoer.
    //Derudover printes der blot brugerdata i forskellige inputfelter på profilsiden.
    render(){
        const currentUser = this.state.currentUser;
        const {houseHasBeenCreated, userInfo, houseHoldName} = this.state;
        let birthday = null;
        if (userInfo.birthday !=null){
            const arr = Object.values(userInfo.birthday);
             birthday = arr[0] + ' ' + [arr[1] + ' ' + ' ' + arr[2]]
        }
        if (houseHasBeenCreated === true ){
            return (
                <View style={styles.container}>
                    <Text style={styles.headerText}>{userInfo.name}!</Text>
                    <TextInput
                            placeholder={userInfo.name}
                            value={userInfo.name}
                            onChangeText={this.handleChangeName}
                            style={styles.inputField}
                        />
                        <TextInput
                            placeholder="No data"
                            value={houseHoldName}
                            onChangeText={this.handleChangeEmail}
                            style={styles.inputField}
                        />
                    <TextInput
                        placeholder={userInfo.name}
                        value={userInfo.name}
                        onChangeText={this.handleChangeName}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder='No Data'
                        value={birthday}
                        onChangeText={this.handleChangeEmail}
                        style={styles.inputField}
                    />
                        <View style={{bottom: 83, marginRight: '35%'}}>
                            <Text style={{fontSize: 20, color:'#5FB8B9'}}>Fødselsdag</Text>
                        </View>
                    </View>
            )
        }else{
            return (
                <ActivityIndicator/>
            )
        }
        }
}

//Håndtering af styles til komponenterne
const styles = StyleSheet.create({
    container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#DBF1EE',
            width: '100%',
            height: '100%'
    }, inputField: {
        width: 250,
        fontSize: 15,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,
        bottom:80,
    },
    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
        bottom:100,
    },



});
