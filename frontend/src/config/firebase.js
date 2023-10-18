import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBi0miAkHOiItf8AmOCoh-Ud7r-vowKXK0",
  authDomain: "serverless-sdp8.firebaseapp.com",
  projectId: "serverless-sdp8",
  storageBucket: "serverless-sdp8.appspot.com",
  messagingSenderId: "658090104413",
  appId: "1:658090104413:web:3ee0e8634a2e3c8fc65fb4",
};

export const app = initializeApp(firebaseConfig);