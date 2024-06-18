
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById("iframe");
    const signInBtn = document.getElementById("signIn");
    const signUpBtn = document.getElementById("signUp");

    function sendMessage(action, email = null, password = null) {
        const message = { action };
        if (email) message.email = email;
        if (password) message.password = password;
        iframe.contentWindow.postMessage(JSON.stringify(message), "*");
    }

    signInBtn.onclick = () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if(email === "" || email === undefined || email === null) {
            document.getElementById("msgEmailError").innerText = "Email is required";
            return;
        }

        if(password === "" || password === undefined || password === null) {
            document.getElementById("msgPasswordError").innerText = "Password in required";
            return;
        }

        sendMessage("sign_in", email, password);
    }

    signUpBtn.onclick = () => {
        chrome.action.setPopup({popup: 'register_form.html'});
        location.href = 'register_form.html';
    }
});

function handleMessage(event) {
    const response = event.data;
    console.log("Respuesta recibida:", response);

    if(response.token.startsWith("Error")) {
        const msgError = response.token.substring(7);
        document.getElementById("msgError").innerText = msgError;
        return;
    }
    
    // * Sign In
    if(response.type === 'signIn') {
        chrome.storage.session.set({ token: response.token }).then(() => {
            console.log("Value token was set");
            chrome.action.setPopup({popup: 'popup.html'});
            location.href = 'popup.html';
        });
    }
}
window.addEventListener("message", handleMessage, false);