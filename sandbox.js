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
    let token;
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const parsed = JSON.parse(JSON.stringify(user));
        token = parsed.stsTokenManager.accessToken;
        console.log("Signed Up! ", token);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
        token = 'Error: Invalid e-mail or password';
    }
    return token;
};

const signUp = async (email, password) => {
    let token;
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const parsed = JSON.parse(JSON.stringify(user));
        token = parsed.stsTokenManager.accessToken;
        console.log("Signed Up! ", token);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: ${errorMessage} - ${errorCode}`);
        token = 'Error: This e-mail is already registered';
    }
    return token;
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
    try {
        const message = JSON.parse(event.data);

        if (message.action === "sign_up") {
            const email = message.email;
            const password = message.password;
            signUp(email, password).then(data => {
                event.source.postMessage({
                    type: 'signIn',
                    token: data
                }, event.origin);
            });
        }

        if (message.action === "sign_in") {
            const email = message.email;
            const password = message.password;
            signIn(email, password).then(data => {
                event.source.postMessage({
                    type: 'signIn',
                    token: data
                }, event.origin);
            });
        }

        if (message.action === "sign_out") {
            logout().then(() => {
                event.source.postMessage({
                    type: 'signOut',
                }, event.origin);
            });
        }
    } catch (error) {
        console.error("Error parsing message data:", error);
    }
});
