
  const firebaseConfig = {
    apiKey: "AIzaSyCxUhJr_pJXfm_eWfFuDeKxwm0mIvnWVac",
    authDomain: "local-llm-summarizer.firebaseapp.com",
    projectId: "local-llm-summarizer",
    storageBucket: "local-llm-summarizer.firebasestorage.app",
    messagingSenderId: "487804716389",
    appId: "1:487804716389:web:ce62e24d564f1b69ba8d8c",
    measurementId: "G-996318CLZY"
  };

// Firebase ko initialize karo
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();