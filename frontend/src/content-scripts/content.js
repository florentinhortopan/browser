// Content script
console.log('PUXA Browser content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYSIS_RESULT') {
    console.log('Analysis result:', message.data);
    // Display results in page
    displayResults(message.data);
  }
});

function displayResults(data) {
  // Simple display for testing
  const badge = document.createElement('div');
  badge.style.cssText = 'position:fixed;top:10px;right:10px;background:#007bff;color:white;padding:10px;border-radius:4px;z-index:99999;font-family:sans-serif;';
  badge.textContent = `PUXA: ${data.status || 'Analyzed'}`;
  document.body.appendChild(badge);
  
  setTimeout(() => badge.remove(), 3000);
}

// Auto-analyze on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', analyzePage);
} else {
  analyzePage();
}

function analyzePage() {
  const content = {
    url: window.location.href,
    title: document.title,
    text: document.body.innerText.substring(0, 1000) // Limit text
  };
  
  chrome.runtime.sendMessage({
    type: 'ANALYZE_CONTENT',
    data: content
  });
}

