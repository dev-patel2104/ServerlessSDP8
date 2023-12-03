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

const firebaseAdminConfig = {
  apiKey: "AIzaSyBMOglRA7JdG3iBefZYC4AT8YzQGG744GU",
  authDomain: "sdp8admindata.firebaseapp.com",
  projectId: "sdp8admindata",
  storageBucket: "sdp8admindata.appspot.com",
  messagingSenderId: "815879189787",
  appId: "1:815879189787:web:757e8460e0167584d84fbe"
};


const app = initializeApp(firebaseConfig, 'UserApp');
export const auth = getAuth(app);
const partnerApp = initializeApp(firebasePartnerConfig, 'PartnerApp');
export const partnerAuth = getAuth(partnerApp);
const adminApp = initializeApp(firebaseAdminConfig, 'AdminApp');
export const adminAuth = getAuth(adminApp);
export const googleProvider = new GoogleAuthProvider();