// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbFY_zgKl0k0W7rjWYWn_QSvzkDJt7E9c",
    authDomain: "musicappdemo-8435e.firebaseapp.com",
    projectId: "musicappdemo-8435e",
    storageBucket: "musicappdemo-8435e.firebasestorage.app",
    messagingSenderId: "81586625781",
    appId: "1:81586625781:web:d46a0ac113626d198139bc",
    measurementId: "G-T7HLWV1HP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);