chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_page_text") {
        // Simple logic to get text: find article tag, or just all paragraphs
        let content = '';
        const article = document.querySelector('article');
        if (article) {
            content = article.innerText;
        } else {
            const paragraphs = Array.from(document.querySelectorAll('p'));
            content = paragraphs.map(p => p.innerText).join('\n');
        }
        sendResponse({ text: content });
    }
});

