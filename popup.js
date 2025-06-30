// Get all the elements from the HTML
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');
const welcomeMsg = document.getElementById('welcome-msg');
const autofillBtn = document.getElementById('autofill-btn');
const summarizeBtn = document.getElementById('summarize-btn');
const inputText = document.getElementById('input-text');
const outputDiv = document.getElementById('output');

// --- AUTH LOGIC ---

// Sign Up
signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => { authStatus.textContent = "Sign up successful! Please sign in."; })
        .catch((error) => { authStatus.textContent = error.message; });
});

// Sign In
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => { authStatus.textContent = error.message; });
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        authContainer.style.display = 'none';
        mainApp.style.display = 'block';
        welcomeMsg.textContent = `Welcome, ${user.email}`;
    } else {
        authContainer.style.display = 'block';
        mainApp.style.display = 'none';
    }
});

// --- APP LOGIC ---

// Get Text from Page
autofillBtn.addEventListener('click', () => {
    authStatus.textContent = ''; // Clear auth status messages
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getPageContent,
        }, (injectionResults) => {
            if (injectionResults && injectionResults[0] && injectionResults[0].result) {
                inputText.value = injectionResults[0].result.slice(0, 4000);
            }
        });
    });
});

function getPageContent() {
    return document.body.innerText;
}

// Summarize and Save
summarizeBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) { return; }
    const textToSummarize = inputText.value;
    if (!textToSummarize.trim()) { return; }

    welcomeMsg.textContent = 'Sending to local server...';
    try {
        // YEH HAI NAYA, "PERFECT PROMPT"
        const perfectPrompt = `Provide a concise summary of the following text in 4 key bullet points. Do not add any extra notes or introductions.\n\n[START OF TEXT]\n${textToSummarize}\n[END OF TEXT]\n\nSummary in 4 bullet points:`;

        const response = await fetch('http://127.0.0.1:8080/completion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: perfectPrompt, 
                n_predict: 256 
            }),
        });
        const data = await response.json();
        const summary = data.content.trim();
        outputDiv.textContent = summary;

        welcomeMsg.textContent = 'Saving to database...';
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await db.collection("users").doc(user.uid).collection("summaries").add({
            url: tab.url,
            summary: summary,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        welcomeMsg.textContent = 'Summary saved!';
    } catch (error) {
        welcomeMsg.textContent = 'Error! Is llama-server.exe running?';
        console.error('Error:', error);
    }
});
