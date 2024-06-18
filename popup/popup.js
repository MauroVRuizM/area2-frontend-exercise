document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById("iframe");
  const signOutBtn = document.getElementById("signOut");

  chrome.storage.session.get('token').then((result) => {
    if (result.token) {
      chrome.runtime.sendMessage({ type: 'get_last_log' }, (response) => {
        if (response && response.data) {
          document.getElementById('logDisplay').textContent = JSON.stringify(response.data, null, 2);
        } else {
          document.getElementById('logDisplay').textContent = "No logs available.";
        }
      });
    } else {
      chrome.action.setPopup({popup: '../login/login_form.html'});
      location.href = '../login/login_form.html';
    }
  });

  function sendMessage(action) {
    const message = { action };
    iframe.contentWindow.postMessage(JSON.stringify(message), "*");
  }

  signOutBtn.onclick = () => sendMessage("sign_out");
});

function handleMessage(event) {
  const response = event.data;
  console.log("Respuesta recibida:", response);

  // * Sign Out
  if(response.type === 'signOut') {
    chrome.storage.session.set({ token: null }).then(() => {
      console.log("Value token was cleared");
      chrome.action.setPopup({popup: '../login/login_form.html'});
      location.href = '../login/login_form.html';
    });
  }
}

window.addEventListener("message", handleMessage, false);