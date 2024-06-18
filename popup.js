document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById("iframe");
  const signUpBtn = document.getElementById("signUp");
  const signInBtn = document.getElementById("signIn");
  const signOutBtn = document.getElementById("signOut");

  chrome.storage.session.get('token').then((result) => {
    console.log("Res? ", JSON.stringify(result));
    if (result.token) {
      chrome.runtime.sendMessage({ type: 'get_last_log' }, (response) => {
        if (response && response.data) {
          document.getElementById('logDisplay').textContent = JSON.stringify(response.data, null, 2);
        } else {
          document.getElementById('logDisplay').textContent = "No logs available.";
        }
      });
    } else {
      document.getElementById('logDisplay').textContent = "No access. Please sign in.";
    }
  });

  signUpBtn.onclick = () => iframe.contentWindow.postMessage("sign_up", "*");
  signInBtn.onclick = () => iframe.contentWindow.postMessage("sign_in", "*");
  signOutBtn.onclick = () => iframe.contentWindow.postMessage("sign_out", "*");
});

function handleMessage(event) {
  const response = event.data;
  console.log("Respuesta recibida:", response);

  // * Sign In - Sign Up
  if(response.type === 'signIn') {
    chrome.storage.session.set({ token: response.token }).then(() => {
      console.log("Value token was set");
      location.reload();
    });
  }

  // * Sign Out
  if(response.type === 'signOut') {
    chrome.storage.session.set({ token: null }).then(() => {
      console.log("Value token was cleared");
      location.reload();
    });
  }
}

window.addEventListener("message", handleMessage, false);