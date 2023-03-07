import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA5M7rbb9Br-O5qvy7Yc_Oy8d_Uu_D6xsk",
  authDomain: "coderhouse-backend-final.firebaseapp.com",
  projectId: "coderhouse-backend-final",
  storageBucket: "coderhouse-backend-final.appspot.com",
  messagingSenderId: "285064313452",
  appId: "1:285064313452:web:ee848f6819f33806cdf649",
};
const app = initializeApp(firebaseConfig);
const initFirebase = () => app;

export default initFirebase;
