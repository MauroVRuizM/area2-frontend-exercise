import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth/web-extension';

const firebaseConfig = {
    apiKey: "AIzaSyDWfrB_TzRjnQuHI-OkJyX4vpVsElPHgjw",
    authDomain: "a2-frontend-exercise-code.firebaseapp.com",
    projectId: "a2-frontend-exercise-code",
    storageBucket: "a2-frontend-exercise-code.appspot.com",
    messagingSenderId: "391448152596",
    appId: "1:391448152596:web:b499b79eb08828481bb501"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth();
console.log("Initialized Firebase!", JSON.stringify(app));

const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
    });
}

const signUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
    });
}
