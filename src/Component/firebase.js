import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCi0-AfHEmehCSMEqsXJGB2D8YUusCqdXg",
    authDomain: "expensesheetproject.firebaseapp.com",
    databaseURL: "https://expensesheetproject.firebaseio.com",
    projectId: "expensesheetproject",
    storageBucket: "expensesheetproject.appspot.com",
    messagingSenderId: "157163520429",
    appId: "1:157163520429:web:a96d419cd979c829a66124",
    measurementId: "G-2NN29S98BG"
  };
  


const fire = firebase.initializeApp(firebaseConfig)
export default fire