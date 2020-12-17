//Her oprettes alle nødvendige imports
import React from 'react';
import {Image, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, DeviceEventEmitter} from 'react-native';
import SignInView from "./Components/SignInView";
import * as firebase from 'firebase';
import MainNavigator from "./Components/UserComponent/UserMainViewNavigation";
import CreateUser from "./Components/GuestComponent/CreateUser";
import ModalView from "./Components/ModalView";
import globalStyles from "./Components/GlobalStyles";
import {AntDesign, Entypo} from "@expo/vector-icons";
import InitialView from "./Components/UserComponent/NewUsersNavigation";
//Oprettelse af konfiguration til firebase
const fireBaseConfig = {
  apiKey: "AIzaSyAhRw12K9lOP1p72bY_Pqpol5VjohVULAM",
  authDomain: "reactnativedbtrial.firebaseapp.com",
  databaseURL: "https://reactnativedbtrial.firebaseio.com",
  projectId: "reactnativedbtrial",
  storageBucket: "reactnativedbtrial.appspot.com",
  messagingSenderId: "747875825609",
  appId: "1:747875825609:web:6fb0e13809e67b47151a18",
  measurementId: "G-DBNS46ZC4T"
};
// Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
// Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
if (!firebase.apps.length) {
  firebase.initializeApp(fireBaseConfig);
}

//Oprettelse af App klasssen
export default class App extends React.Component {

  //Vi opretter en constructor. Her initialiseres vi en række state variabler
  constructor(props) {
    super(props);
    this.state = {image: null};
    this.state = {allUsers: null};
    this.state = {currentUser: null};
    this.state = {isNewUser: null};
    this.state = {allHouseHolds: null};
    this.state = {isInHouseHold: "no a memeber in houseHold"};
  this._isMounted = false;

  }

  state = {
    email: '',
    password: '',
    isLoggedIn: false,
    image: null,
    allUsers: [],
    stateOfUser: null,
    currentUser: null,
    allUsersInHouseHolds: [],
    years: [],
    allHouseHolds: []
  };



  //Vi kaleder componentDidmound metodenn. I metoden kaldes de metoder, som bør kaldes, når komponenten monteres i DOM'en
  componentDidMount() {
    //This.isMount skal være et virkemiddel til at kontrollere  livscyklusser for komponenterne
    this._isMounted = true;

    //SigOut metoden kaldes blot for at sikre at vi ikke logger ind aututomatisk. Dette kan være smart i DEV-mode
    //SignOut behøves ikke at blive kaldt.
    firebase.auth().signOut();

    //Vi fjerner gule advarsler fra klientens skræm. Disse kan findes i konsollen i stedet for.
    LogBox.ignoreAllLogs();

    //this._isMounted testes før alle metoder bliver kaldt.
    this._isMounted && this.getUsers();
    this._isMounted && this.stateChange();
    this._isMounted && this.getYears();
    this._isMounted && this.getHouseholds();


  }


  //Dette er metoder, som skal observerer ændringer i statussen for vores nuværende bruger.
  //Dette er vigtigt, når vi logger ind og ud.
  stateChange = () => {
     this.authStateChangeUnsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
      this._isMounted && this.setState({currentUser});
    });
  };

  //MEtoden henter alle applikationens brugere og placerer dem i et state array.
  getUsers = async ()=>{
    await firebase.database().ref('allUsers').on('value', snapshot => {
          this._isMounted &&  this.setState({ allUsers: snapshot.val()});
        }
    );
  };

  //Metoden henter alle applikationens kollektiver og placerer dem i et state array.
  getHouseholds = async ()=>{
    await firebase.database().ref('households').on('value', snapshot => {
          this._isMounted &&  this.setState({ allHouseHolds: snapshot.val()});
        }
    );
  };

//Her afmonteres relevante komponenter
  componentWillUnmount() {
    this.authStateChangeUnsubscribe && this.authStateChangeUnsubscribe();
    this._isMounted = false;
  }

  //Initial værdi for authStateChangeUnsubscribe
  authStateChangeUnsubscribe = null;



 //Vi henter en masse årstal, som skal parses til et andet komponent
  //Vi henter år fra 1920 til og med det indeværende år, 2020. Disse placeres i en state array
  getYears = () => {
    let years = [];
    let n = 1920;
    var year = new Date().getFullYear();
    while (n <= year){
      n = n+1;
      years.push({label: n.toString(), value: n})
    }
    this.setState({years: years})
  };


  //I render initieres to komponenter. En MAin navigator og et initial view.
  //Denne struktur er en del af den overordnede navigation i systemet.  I render tester vi om der er en aktivt bruger.
  //Er dette ikke tilfældet skal vi vise Initial View
  render() {
    const {currentUser} = this.state;
    if (currentUser ) {
      return (
          <MainNavigator screenProps={{image: this.state.image, currentUser: this.state.currentUser, allUsers: this.state.allUsers, years: this.state.years, houseHolds: this.state.allHouseHolds}} />
      );
    }else {
      return (
          <InitialView  screenProps={{yearsRetrieved: this.state.years}} />
      );
    }
  }
}

//Styling komponenter til design af siden
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBF1EE',
  },

  welcomePic: {
    bottom:50,
    width: 90,
    height: 90,
  },

  titleText:{
    fontSize: 50,
    fontWeight:'bold',
    color:'#5FB8B2',

  },
  input: {
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

  signInButtons: {
    alignItems: 'center',
    backgroundColor: '#47525E',
    width: 280,
    height: 54,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop:7,
  },

  iconButtonsGoogle: {
    alignItems: 'center',
    borderColor:'#47525E',
    width: 125,
    height: 54,
    borderWidth:1,
    borderRadius: 5,
    marginBottom: 10,
    right:80,
    marginTop:7,
    padding:10,

  },

  iconButtonsFacebook: {
    alignItems: 'center',
    borderColor:'#47525E',
    width: 125,
    height: 54,
    borderWidth:1,
    borderRadius: 5,
    marginBottom: 10,
    bottom:65,
    padding:10,
    left:80,
  },

  buttonText:{
    fontSize: 20,
    color:'white',
    fontWeight:'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },


  sigUpButton:{
    alignItems: 'center',
    width: 280,
    height: 54,
    padding: 10,
    borderRadius: 5,
    bottom:60,



  }
});

/*  getHouseHoldId = () => {
    let houseHoldId = null;
    const allUsers = Object.values(this.props.screenProps.allUsers);
    allUsers.map((item, index) => {
      if(item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
        houseHoldId = item.houseHoldId
      }
    });
    this.setState({houseHoldId: houseHoldId })
  };
*/

/*CheckUserStatus =  (user) => {
   var count = 0;
   const currentUser = user;
     var users = Object.values(this.state.allUsersInHouseHolds);
     for (let user of users){
       var email = user.userEmail;
       email = email.toUpperCase();
       if (email === currentUser.email.toUpperCase()) {
         count = count + 1;
       }
     }
     if (count === 0){
       this._isMounted && this.setState({isNewUser: true})
     }else {
       this._isMounted && this.setState({isNewUser: false})
     }
 };*/

/* makeUsersForComparison = async ()  => {
    var usersRetrived = [];
    var allUsersInHouseHolds =[];
    await firebase.database().ref('/households/').on('value', snapshot => {
      usersRetrived = snapshot.val();
      if (usersRetrived) {
        usersRetrived = Object.values(usersRetrived);
        usersRetrived.map((item, index) => {
          var newList = Object.values(item.users);
          newList.map((item, index) => {
           var user = {userEmail: item};
            allUsersInHouseHolds.push(user);
          })
        })
      }
    });
  this._isMounted && this.setState({allUsersInHouseHolds: allUsersInHouseHolds })
  };*/
