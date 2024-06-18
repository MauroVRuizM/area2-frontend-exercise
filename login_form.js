
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById("iframe");
    const submitBtn = document.getElementById("submit");

    function sendMessage(action, email = null, password = null) {
        const message = { action };
        if (email) message.email = email;
        if (password) message.password = password;
        iframe.contentWindow.postMessage(JSON.stringify(message), "*");
    }

    // signUpBtn.onclick = () => sendMessage("sign_up", "user@test.com", "123456");

    // signInBtn.onclick = () => sendMessage("sign_in", "user@test.com", "123456");
    // TODO: Add Sign Up + Catch No user exists on Sign In

    submitBtn.onclick = () => {
        // TODO: Validate Data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        sendMessage("sign_in", email, password);
    }
});

function handleMessage(event) {
    const response = event.data;
    console.log("Respuesta recibida:", response);
    
    // * Sign In - Sign Up
    if(response.type === 'signIn') {
        chrome.storage.session.set({ token: response.token }).then(() => {
            console.log("Value token was set");
            chrome.action.setPopup({popup: 'popup.html'});
            location.href = 'popup.html';
        });
    }
}
window.addEventListener("message", handleMessage, false);