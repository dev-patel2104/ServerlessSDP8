import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBi0miAkHOiItf8AmOCoh-Ud7r-vowKXK0",
  authDomain: "serverless-sdp8.firebaseapp.com",
  projectId: "serverless-sdp8",
  storageBucket: "serverless-sdp8.appspot.com",
  messagingSenderId: "658090104413",
  appId: "1:658090104413:web:3ee0e8634a2e3c8fc65fb4",
};

const firebasePartnerConfig = {
  apiKey: "AIzaSyBumEnv4dt4ZJYD-NBI5giH3piJ8jWgv7o",
  authDomain: "sdp8partnerdata.firebaseapp.com",
  projectId: "sdp8partnerdata",
  storageBucket: "sdp8partnerdata.appspot.com",
  messagingSenderId: "483061325656",
  appId: "1:483061325656:web:165f3a1e10005026534f2d"
};

const app = initializeApp(firebaseConfig, 'UserApp');
export const auth = getAuth(app);
const partnerApp = initializeApp(firebasePartnerConfig, 'PartnerApp');
export const partnerAuth = getAuth(partnerApp);
export const googleProvider = new GoogleAuthProvider();