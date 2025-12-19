// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('PUXA Browser Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_CONTENT') {
    // Forward to Django backend
    fetch('http://localhost:8000/api/content/analyze/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.data)
    })
    .then(response => response.json())
    .then(data => {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'ANALYSIS_RESULT',
        data: data
      });
    })
    .catch(error => {
      console.error('API error:', error);
    });
  }
  return true;
});

