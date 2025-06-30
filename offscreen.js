chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === 'offscreen' && message.type === 'firebase-auth-popup') {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      chrome.runtime.sendMessage({ type: 'auth-success', payload: result.user.toJSON() });
    } catch (error) {
      chrome.runtime.sendMessage({ type: 'auth-error', payload: { code: error.code, message: error.message } });
    }
  }
});
