// Q&A  -- SEPT 2019 firebase init settings

import * as firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyA9mRdZjrZgOXq6H6zrFoKP-u_IsIrUxZ4",
  authDomain: "school-21d3e.firebaseapp.com",
  databaseURL: "https://school-21d3e.firebaseio.com",
  projectId: "school-21d3e",
  storageBucket: "school-21d3e.appspot.com",
  messagingSenderId: "922903254435",
  appId: "1:922903254435:web:460ec1c108326111fcf616",
  measurementId: "G-S0N4WEHDX4"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
