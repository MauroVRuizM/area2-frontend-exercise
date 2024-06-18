const firebaseConfig = {
    apiKey: "AIzaSyDWfrB_TzRjnQuHI-OkJyX4vpVsElPHgjw",
    authDomain: "a2-frontend-exercise-code.firebaseapp.com",
    projectId: "a2-frontend-exercise-code",
    storageBucket: "a2-frontend-exercise-code.appspot.com",
    messagingSenderId: "391448152596",
    appId: "1:391448152596:web:b499b79eb08828481bb501"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
console.log("Initialized Firebase!", JSON.stringify(app));


const signIn = async (email, password) => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const parsed = JSON.parse(JSON.stringify(user));
        const token = parsed.stsTokenManager.accessToken;
        console.log("Signed Up! ", token);
        return token;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
    }
};

const signUp = async (email, password) => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const parsed = JSON.parse(JSON.stringify(user));
        const token = parsed.stsTokenManager.accessToken;
        console.log("Signed Up! ", token);
        return token;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
    }
}

const logout = async() => {
    try {
        await auth.signOut();
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
    }
}

window.addEventListener("message", (event) => {
    console.log(event);

    if (event.data === "sign_up") {
        signUp('user@test.com', '123456').then(data => {
            event.source.postMessage({
                type: 'signIn',
                token: data
            }, event.origin);
        });
    }
    if (event.data === "sign_in") {
        signIn('user@test.com', '123456').then(data => {
            event.source.postMessage({
                type: 'signIn',
                token: data
            }, event.origin);
        });
    }
    if (event.data === "sign_out") {
        logout().then(() => {
            event.source.postMessage({
                type: 'signOut',
            }, event.origin);
        });
    }
});
