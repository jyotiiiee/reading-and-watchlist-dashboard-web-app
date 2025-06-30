await chrome.offscreen.createDocument({
  url: 'offscreen.html',
  reasons: ['IFRAME_SCRIPTING'],  // or 'DOM_PARSER' if that's what you're doing
  justification: 'To handle Firebase authentication.'
});
