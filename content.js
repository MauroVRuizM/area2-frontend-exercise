let typingData = createTypingData();
let keyPressStartTimes = {};
let typingSessionActive = false;

function createTypingData() {
    return {
        user_id: "a1b2c3d4e5f6g7h8i9j0",
        appContext: document.location.href,
        setting: 1,
        sourceId: "demo",
        studyId: "",
        text: [],
        timeZone: new Date().getTimezoneOffset() / -60,
        startUnixTime: Date.now(),
        pressTimes: [],
        releaseTimes: [],
        keyAreas: [],
        keyTypes: [],
        positionX: [],
        positionY: [],
        pressure: [],
        swipe: [],
        autocorrectLengths: [0],
        autocorrectTimes: [],
        autocorrectWords: [],
        predictionLength: null,
        predictionLengths: [],
        predictionTimes: [],
        predictionWords: [],
        textStructure: []
    }
}

function resetTypingData() {
    typingData = createTypingData();
    typingSessionActive = false;
    console.log("Typing data reset");
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

function trimArraysToMatchLength() {
    const minLength = Math.min(
        typingData.pressTimes.length, 
        typingData.releaseTimes.length
    );
    typingData.pressTimes.length = minLength;
    typingData.releaseTimes.length = minLength;
}

const sendTypingData = debounce(() => {
    if (!typingSessionActive) return;

    trimArraysToMatchLength();
    let attempts = 0;
    const maxAttempts = 3;

    function trySendMessage() {
        try {
            console.log('Attempting to send typing data:', JSON.stringify(typingData, null, 2));
            chrome.runtime.sendMessage({ type: 'log_key', data: typingData }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                    if (attempts < maxAttempts) {
                        attempts++;
                        console.log(`Retrying to send typing data (attempt ${attempts})`);
                        trySendMessage();
                    }
                    return;
                }
                console.log('Typing data sent successfully');
                resetTypingData();
            });
        } catch (error) {
            console.error('Error during sendTypingData:', error);
        }
    }

    trySendMessage();
}, 5000);

function handleKeydown(e) {
    if (!typingSessionActive) {
        typingSessionActive = true;
        typingData.startUnixTime = Date.now();
    }

    if (!keyPressStartTimes[e.key]) {
        keyPressStartTimes[e.key] = Date.now();
        typingData.pressTimes.push(keyPressStartTimes[e.key]);
        typingData.keyTypes.push(e.key);
        typingData.text.push(e.key);
    }
}

function handleKeyup(e) {
    if (keyPressStartTimes[e.key]) {
        typingData.releaseTimes.push(Date.now());
        delete keyPressStartTimes[e.key];
    }

    if (e.key === 'Enter') {
        // Explicitly capture Enter key release
        sendTypingData();
        document.activeElement.blur(); // Unfocus the input to ensure session ends
    }
}

function handleFocusOut(e) {
    if (e.target.classList.contains('message_input')) {
        console.log('Focus out detected on message input');
        sendTypingData();
    }

    if (!e.relatedTarget || !e.relatedTarget.closest('.message_input')) {
        console.log('Focus out detected');
        sendTypingData();
    }
}

function handleSendMessage() {
    console.log('sendMessage event detected');
    sendTypingData();
}

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);
document.addEventListener('focusout', handleFocusOut);
window.addEventListener('sendMessage', handleSendMessage);