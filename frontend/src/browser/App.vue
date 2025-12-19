<template>
  <div class="browser-container">
    <!-- Browser Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button 
          class="nav-btn" 
          @click="goBack" 
          :disabled="!canGoBack"
          :title="canGoBack ? 'Go back' : 'No history'"
        >
          ←
        </button>
        <button 
          class="nav-btn" 
          @click="goForward" 
          :disabled="!canGoForward"
          :title="canGoForward ? 'Go forward' : 'No forward history'"
        >
          →
        </button>
        <button 
          class="nav-btn" 
          @click="reload"
          title="Reload page"
        >
          ↻
        </button>
      </div>
      
      <!-- Address Bar -->
      <div class="address-bar-container">
        <input 
          v-model="currentUrl" 
          @keyup.enter="navigate"
          class="address-bar"
          placeholder="Enter URL or search..."
        />
        <div v-if="defluffScore !== null" class="defluff-badge" :class="getDefluffClass()">
          {{ defluffScore }}
        </div>
      </div>
      
      <div class="toolbar-right">
        <button class="nav-btn" @click="showSettings = !showSettings">⚙️</button>
      </div>
    </div>

    <!-- AI Status Bar -->
    <div v-if="analyzing" class="ai-status">
      <span class="spinner"></span>
      Analyzing content...
    </div>
    
    <div v-if="analysisResult || defluffScore !== null" class="ai-results">
      <div v-if="defluffScore !== null" class="result-item">
        <strong>Defluff Score:</strong> 
        <span :class="getDefluffClass()">{{ defluffScore }}/100</span>
        <div v-if="defluffBreakdown" class="score-breakdown">
          <div class="breakdown-item">
            <span>Info Density:</span> <span>{{ defluffBreakdown.information_density || 'N/A' }}</span>
          </div>
          <div class="breakdown-item">
            <span>Ad Ratio:</span> <span>{{ defluffBreakdown.ad_ratio || 'N/A' }}</span>
          </div>
          <div class="breakdown-item">
            <span>Clickbait:</span> <span>{{ defluffBreakdown.clickbait || 'N/A' }}</span>
          </div>
        </div>
      </div>
      <div v-if="factChecks.length > 0" class="result-item fact-checks">
        <strong>✅ Fact Checks:</strong> {{ factChecks.length }} verified claim(s)
      </div>
    </div>

    <!-- Browser Content Area -->
    <div class="content-area">
      <!-- Welcome Screen -->
      <div v-if="!loadedUrl" class="welcome-screen">
        <h1>PUXA AI Browser</h1>
        <p>AI-powered browser with content analysis and fact-checking</p>
        <div class="welcome-features">
          <div class="feature">
            <strong>🤖 AI Analysis</strong>
            <p>Real-time content analysis</p>
          </div>
          <div class="feature">
            <strong>✅ Fact-Checking</strong>
            <p>Verify claims automatically</p>
          </div>
          <div class="feature">
            <strong>📊 Defluff Score</strong>
            <p>Content quality scoring</p>
          </div>
        </div>
        <input 
          v-model="currentUrl" 
          @keyup.enter="navigate"
          class="welcome-search"
          placeholder="Enter URL to start browsing..."
        />
      </div>
      
      <!-- Content Frame (will be handled by Electron) -->
      <div v-else class="content-frame">
        <iframe 
          v-if="loadedUrl"
          :src="loadedUrl"
          class="content-iframe"
          @load="onLoadStop"
        ></iframe>
        <div v-else class="loading-placeholder">
          <p>Enter a URL and press Enter to navigate</p>
        </div>
      </div>
    </div>

    <!-- Settings Panel -->
    <div v-if="showSettings" class="settings-panel">
      <h3>Settings</h3>
      <div class="setting-item">
        <label>
          <input type="checkbox" v-model="settings.autoAnalyze" />
          Auto-analyze pages
        </label>
      </div>
      <div class="setting-item">
        <label>
          <input type="checkbox" v-model="settings.showFactChecks" />
          Show fact-check indicators
        </label>
      </div>
      <div class="setting-item">
        <label>
          Min Defluff Score:
          <input type="number" v-model.number="settings.minDefluffScore" min="0" max="100" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const currentUrl = ref(''); // Display URL in address bar
const loadedUrl = ref(''); // Actual URL loaded in iframe
const history = ref([]); // Navigation history array
const historyIndex = ref(-1); // Current position in history (-1 = no history)
const canGoBack = computed(() => historyIndex.value > 0);
const canGoForward = computed(() => historyIndex.value >= 0 && historyIndex.value < history.value.length - 1);
const analyzing = ref(false);
const analysisResult = ref(null);
const defluffScore = ref(null);
const defluffBreakdown = ref(null);
const factChecks = ref([]);
const showSettings = ref(false);
const pageError = ref(null);
const isLoading = ref(false);

const settings = ref({
  autoAnalyze: true,
  showFactChecks: true,
  minDefluffScore: 0
});

function isUrl(str) {
  // Check if string looks like a URL
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  const hasProtocol = str.startsWith('http://') || str.startsWith('https://');
  const hasDomain = urlPattern.test(str) || str.includes('.');
  
  // If it has a protocol or looks like a domain, treat as URL
  if (hasProtocol || (hasDomain && !str.includes(' '))) {
    return true;
  }
  return false;
}

function navigate() {
  let url = currentUrl.value.trim();
  if (!url) {
    loadedUrl.value = '';
    return;
  }
  
  // Check if it's a search query or URL
  if (!isUrl(url)) {
    // Treat as search query - use DuckDuckGo (privacy-focused)
    url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
  } else {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
  }
  
  // Add to history (remove any forward history if we're not at the end)
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }
  
  history.value.push(url);
  historyIndex.value = history.value.length - 1;
  
  // Update both display and loaded URL
  currentUrl.value = url;
  loadedUrl.value = url; // Only update iframe when we have complete URL
  pageError.value = null; // Clear any previous errors
  isLoading.value = true;
  
  // Auto-analyze if enabled
  if (settings.value.autoAnalyze) {
    analyzeContent(url);
  }
}

function goBack() {
  if (canGoBack.value) {
    historyIndex.value--;
    const url = history.value[historyIndex.value];
    currentUrl.value = url;
    loadedUrl.value = url;
    
    // Auto-analyze if enabled
    if (settings.value.autoAnalyze) {
      analyzeContent(url);
    }
  }
}

function goForward() {
  if (canGoForward.value) {
    historyIndex.value++;
    const url = history.value[historyIndex.value];
    currentUrl.value = url;
    loadedUrl.value = url;
    
    // Auto-analyze if enabled
    if (settings.value.autoAnalyze) {
      analyzeContent(url);
    }
  }
}

function reload() {
  if (loadedUrl.value) {
    // Reload current page
    const url = loadedUrl.value;
    loadedUrl.value = '';
    setTimeout(() => {
      loadedUrl.value = url;
    }, 100);
  } else if (currentUrl.value) {
    navigate();
  }
}

async function analyzeContent(url) {
  analyzing.value = true;
  analysisResult.value = null;
  
  try {
    const response = await fetch('http://localhost:8000/api/content/analyze/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    analysisResult.value = data;
    
    // Get defluff score
    const scoreResponse = await fetch('http://localhost:8000/api/content/defluff-score/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const scoreData = await scoreResponse.json();
    defluffScore.value = scoreData.defluff_score;
    defluffBreakdown.value = scoreData.components || null;
    
  } catch (error) {
    console.error('Analysis error:', error);
    // Don't show error to user, just log it
  } finally {
    analyzing.value = false;
  }
}

function getDefluffClass() {
  if (defluffScore.value === null) return '';
  if (defluffScore.value >= 80) return 'score-high';
  if (defluffScore.value >= 60) return 'score-medium';
  return 'score-low';
}

function onLoadStart() {
  analyzing.value = true;
}

function onLoadStop() {
  isLoading.value = false;
  pageError.value = null;
  analyzing.value = false;
  // Update address bar to match loaded URL (in case of redirects)
  if (loadedUrl.value) {
    // Note: We can't read iframe URL due to cross-origin restrictions
    // So we keep the currentUrl as is
  }
  
  if (settings.value.autoAnalyze && loadedUrl.value) {
    analyzeContent(loadedUrl.value);
  }
}

function onLoadError() {
  isLoading.value = false;
  pageError.value = 'Unable to load this page. It may be blocked or unavailable.';
}

function onLoadError(event) {
  console.error('Load error:', event);
  analyzing.value = false;
}

onMounted(() => {
  // Check if we're in Electron
  if (window.electronAPI) {
    console.log('Running in Electron');
  }
});
</script>

<style scoped>
.browser-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  gap: 8px;
}

.toolbar-left, .toolbar-right {
  display: flex;
  gap: 4px;
}

.address-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-bar {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.address-bar:focus {
  border-color: #007bff;
}

.nav-btn {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.nav-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn:not(:disabled):hover {
  background: #e0e0e0;
}

.defluff-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
}

.score-high {
  background: #4caf50;
  color: white;
}

.score-medium {
  background: #ff9800;
  color: white;
}

.score-low {
  background: #f44336;
  color: white;
}

.ai-status {
  padding: 8px 16px;
  background: #e3f2fd;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #2196f3;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-results {
  padding: 8px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.content-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.content-frame {
  width: 100%;
  height: 100%;
  position: relative;
}

.content-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 16px;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
}

.welcome-screen h1 {
  font-size: 48px;
  margin: 0 0 16px 0;
  color: #333;
}

.welcome-screen > p {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.welcome-features {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.feature {
  flex: 1;
  max-width: 200px;
}

.feature strong {
  display: block;
  font-size: 20px;
  margin-bottom: 8px;
}

.feature p {
  color: #666;
  font-size: 14px;
}

.welcome-search {
  width: 100%;
  max-width: 600px;
  padding: 16px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
}

.welcome-search:focus {
  border-color: #007bff;
}

.settings-panel {
  position: absolute;
  top: 60px;
  right: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  min-width: 250px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
}

.settings-panel h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.setting-item {
  margin-bottom: 12px;
}

.setting-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.setting-item input[type="number"] {
  width: 60px;
  padding: 4px;
  margin-left: 8px;
}
</style>

