import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtGsaMR6qazWnexuv1PA7-xpGOoh9x4S4",
  authDomain: "moviefinder-b9cab.firebaseapp.com",
  projectId: "moviefinder-b9cab",
  storageBucket: "moviefinder-b9cab.appspot.com",
  messagingSenderId: "772874002972",
  appId: "1:772874002972:web:f8d26d08679c7b37f8f5d9",
  measurementId: "G-3LQ0DFHJLY",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app); 
