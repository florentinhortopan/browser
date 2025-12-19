# AI-Powered Mobile Browser Strategy Document

## Project Overview

A mobile-first browser application that leverages AI and puxa.ai to analyze, fact-check, and personalize web content in real-time. The browser will provide users with filtered, verified, and age-appropriate content based on their goals, settings, age, and intent.

## Core Features & Requirements

### 1. Content Analysis & Rendering
- **Real-time AI Analysis**: Analyze all content (text, images, videos) as pages load
- **Dynamic Rendering**: Modify content presentation based on user profile
- **Multi-modal Analysis**: Process text, images, videos, and structured data

### 2. Fact-Checking System
- **On-the-fly Verification**: Check claims against verified sources
- **Source Credibility Scoring**: Rate information sources
- **Visual Indicators**: Highlight verified/unverified content
- **Confidence Levels**: Display fact-check confidence scores

### 3. Defluff Scoring
- **Content Quality Metrics**: 
  - Information density
  - Ad-to-content ratio
  - Clickbait detection
  - Redundancy analysis
  - Value-to-noise ratio
- **Score Display**: Visual defluff score (0-100) for each page
- **Filtering Options**: Allow users to filter by minimum defluff score

### 4. User Personalization
- **User Profiles**: Age, goals, preferences, interests
- **Intent Detection**: Understand user browsing intent
- **Adaptive Content**: Adjust complexity, tone, and detail level
- **Privacy-First**: On-device processing where possible

### 5. Mobile-First Design
- **Responsive UI**: Optimized for mobile screens
- **Performance**: Fast page loads despite AI processing
- **Offline Capabilities**: Cache analyzed content
- **Battery Efficiency**: Optimize AI processing for mobile devices

## Architecture & Technology Stack

### Backend Framework
- **Django** (Python)
  - Robust web framework for API backend
  - Django REST Framework for API endpoints
  - Built-in admin interface for content management
  - Excellent for handling AI/ML integrations
  - Secure authentication and session management
  - Database ORM for caching and user data

### Frontend Framework
- **Vue.js 3** (Desktop Application)
  - Excellent reactivity system for data-driven UI updates
  - Clear separation between data layer and UI components
  - Composition API for clean, maintainable code
  - Easy to manipulate and iterate ("vibe coding")
  - Lightweight and performant
  - Perfect for desktop browser application
  
- **Alternative**: **Alpine.js** (if minimal framework preferred)
  - Ultra-lightweight (~15KB)
  - Perfect for simple reactive updates
  - Good for rapid prototyping
  - May need Vue.js for complex features later

- **Why Vue.js over React/Next.js?**
  - More intuitive reactivity model
  - Better separation of concerns out-of-the-box
  - Easier to manipulate DOM/data relationship
  - Less boilerplate for reactive updates
  - Better suited for dynamic, AI-driven content morphing

### Browser Engine
- **ungoogled-chromium** ([GitHub Repository](https://github.com/ungoogled-software/ungoogled-chromium))
  - Chromium browser engine without Google integration
  - Privacy-focused by design (no Google tracking/services)
  - Open source and highly customizable
  - Native Mac builds available via Homebrew
  - Perfect foundation for AI-powered browser
  - Can embed Django backend and Vue.js frontend as browser features
  - Full control over browser behavior and UI

**Why ungoogled-chromium?**
- **Privacy-First**: No Google services, tracking, or data collection
- **Customizable**: Can modify browser UI and behavior
- **Native Performance**: Real browser engine, not webview wrapper
- **Extensible**: Can add browser extensions or built-in features
- **Mac Support**: Available via Homebrew: `brew install --cask ungoogled-chromium`

### Mac Executable Packaging
- **Primary Approach**: **ungoogled-chromium + Custom Build**
  - Fork/customize ungoogled-chromium source code
  - Embed Django backend as browser service
  - Integrate Vue.js frontend as browser UI components
  - Build custom Mac .app bundle
  - Native browser performance and features
  
- **Alternative Approach**: **ungoogled-chromium + Extension**
  - Use ungoogled-chromium as base browser
  - Create browser extension (Vue.js) for AI features
  - Django backend runs as localhost server
  - Easier to develop and update
  - Less control over core browser behavior
  
- **Recommended**: **Custom ungoogled-chromium Build**
  - Full control over browser features
  - Seamless integration of AI features
  - Better user experience (native feel)
  - Can modify browser UI directly

### Data/UI Separation Architecture

**Core Principle**: Complete separation between server data (AI analysis results) and UI layer that morphs/reacts to that data.

#### Architecture Layers

```
┌─────────────────────────────────────────┐
│  ungoogled-chromium Browser Engine      │
│  - Chromium rendering engine            │
│  - Privacy-focused (no Google)          │
│  - Customizable UI                      │
│  - Browser extension support             │
└─────────────────────────────────────────┘
              ↕ (Browser APIs)
┌─────────────────────────────────────────┐
│    UI Layer (Vue.js Components)         │
│  - Browser UI modifications              │
│  - Content overlay components           │
│  - Reactive templates                   │
│  - Visual morphing based on data        │
│  - Browser extension UI (if using ext)  │
└─────────────────────────────────────────┘
              ↕ (Reactive Binding)
┌─────────────────────────────────────────┐
│      Data Layer (Reactive State)        │
│  - AI analysis results                  │
│  - Fact-check data                      │
│  - Defluff scores                       │
│  - User profile                         │
│  - Content state                        │
└─────────────────────────────────────────┘
              ↕ (REST API Calls)
┌─────────────────────────────────────────┐
│    Django Backend (Local Server)        │
│  - Django REST Framework APIs           │
│  - Content processing                   │
│  - User management                      │
│  - Caching layer                        │
│  - Business logic                       │
└─────────────────────────────────────────┘
              ↕ (HTTP Requests)
┌─────────────────────────────────────────┐
│    External APIs (puxa.ai)              │
│  - Content analysis                     │
│  - Fact-checking                        │
│  - Personalization                      │
└─────────────────────────────────────────┘
```

#### Data Flow Pattern

```javascript
// Data Layer (Reactive Store/State)
const contentState = reactive({
  originalContent: null,
  aiAnalysis: null,
  factChecks: [],
  defluffScore: null,
  personalizedContent: null,
  loading: false,
  error: null
})

// UI Layer (Vue Components)
// Automatically reacts to data changes
<template>
  <div :class="getContentClass()">
    <DefluffScore :score="contentState.defluffScore" />
    <FactCheckIndicators :checks="contentState.factChecks" />
    <PersonalizedContent :content="contentState.personalizedContent" />
  </div>
</template>

// Server Integration (Django REST API)
async function analyzeContent(url) {
  contentState.loading = true
  // Call Django backend (localhost)
  const result = await djangoAPI.analyze(url)
  // Update data layer - UI automatically morphs
  contentState.aiAnalysis = result.analysis
  contentState.factChecks = result.factChecks
  contentState.defluffScore = result.defluffScore
  contentState.loading = false
}

// Django backend handles puxa.ai integration internally
```

#### Key Benefits
- **Decoupled**: UI doesn't know about API structure
- **Reactive**: UI automatically updates when data changes
- **Testable**: Data layer can be tested independently
- **Flexible**: UI can morph/change without touching data logic
- **Maintainable**: Clear boundaries between concerns

### Django Backend Architecture

#### Project Structure
```
browser_app/
├── ungoogled-chromium/     # Forked ungoogled-chromium repo
│   ├── .github/
│   ├── devutils/
│   ├── docs/
│   ├── patches/            # Chromium patches
│   ├── utils/              # Build utilities
│   └── [chromium source]   # Chromium source code
├── custom-patches/         # Our custom patches for AI features
│   ├── content-interceptor.patch
│   ├── ai-overlay-ui.patch
│   └── django-integration.patch
├── backend/                # Django project
│   ├── browser_app/        # Main Django app
│   │   ├── api/            # Django REST Framework views
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   │   ├── puxa_client.py    # puxa.ai API integration
│   │   │   ├── content_analyzer.py
│   │   │   ├── fact_checker.py
│   │   │   └── defluff_scorer.py
│   │   └── utils/          # Helper functions
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # Vue.js browser extension/UI
│   ├── src/
│   │   ├── components/     # Browser UI components
│   │   ├── content-script/ # Content script for page analysis
│   │   ├── background/     # Background service worker
│   │   └── popup/          # Extension popup UI
│   ├── public/
│   ├── manifest.json       # Browser extension manifest
│   └── package.json
└── build/                  # Build outputs
    ├── mac/                # Mac executable (.app)
    └── chromium/           # Built Chromium binaries
```

#### Django REST API Endpoints
```python
# backend/browser_app/api/urls.py
urlpatterns = [
    path('api/auth/', include('auth.urls')),
    path('api/content/analyze/', ContentAnalyzeView.as_view()),
    path('api/content/fact-check/', FactCheckView.as_view()),
    path('api/content/defluff-score/', DefluffScoreView.as_view()),
    path('api/user/profile/', UserProfileView.as_view()),
]
```

### ungoogled-chromium Integration Strategy

#### Repository Study & Setup

**Repository**: [ungoogled-chromium](https://github.com/ungoogled-software/ungoogled-chromium)

**Key Areas to Study**:

1. **Build System** (`utils/` directory)
   - How ungoogled-chromium patches Chromium
   - Build configuration and scripts
   - Platform-specific build processes (macOS focus)

2. **Patches** (`patches/` directory)
   - How patches are applied to Chromium source
   - Patch format and structure
   - Examples of UI/behavior modifications

3. **Documentation** (`docs/` directory)
   - Building instructions (`docs/building.md`)
   - Design documentation (`docs/design.md`)
   - Platform-specific guides (`docs/platforms.md`)

4. **Platform-Specific Repos**
   - macOS-specific repository (if exists)
   - Build configurations for Mac
   - Packaging scripts for .app bundle

**Initial Steps**:

```bash
# 1. Clone the main ungoogled-chromium repo
git clone https://github.com/ungoogled-software/ungoogled-chromium.git

# 2. Study the structure
cd ungoogled-chromium
ls -la  # Review directory structure
cat README.md  # Understand the project

# 3. Review build documentation
cat docs/building.md  # Understand build process
cat docs/design.md    # Understand architecture

# 4. Check for macOS-specific repo
# Look for platform-specific repos mentioned in README
# macOS builds available via Homebrew - study that approach

# 5. Review patches to understand modification patterns
ls patches/  # See what gets patched
cat patches/*.patch | head -50  # Understand patch format
```

#### Integration Approaches

**Approach 1: Custom Build with Patches** (Recommended for full control)
- Fork ungoogled-chromium repository
- Create custom patches for AI features
- Modify browser UI to integrate Vue.js components
- Embed Django backend as browser service
- Build custom Mac .app bundle

**Approach 2: Browser Extension** (Easier to develop)
- Use standard ungoogled-chromium build
- Create browser extension (Vue.js) for AI features
- Extension communicates with Django backend
- Less invasive, easier to update

**Approach 3: Hybrid** (Balanced)
- Custom ungoogled-chromium build with minimal patches
- Browser extension for UI features
- Django backend integrated at browser level
- Best of both worlds

#### Key Integration Points

1. **Content Interception**
   - Hook into Chromium's content loading pipeline
   - Intercept page content before rendering
   - Send to Django backend for analysis
   - Modify DOM based on AI results

2. **UI Modifications**
   - Add AI overlay components to browser UI
   - Integrate defluff score display
   - Add fact-check indicators
   - Customize browser toolbar/UI

3. **Extension API Integration**
   - Use Chromium Extension APIs
   - Content scripts for page analysis
   - Background service worker for Django communication
   - Browser action popup for settings

4. **Native Messaging**
   - Communicate between browser and Django backend
   - Use Chromium's native messaging API
   - Secure communication channel
   - Handle authentication and data flow

### AI Integration Layer
- **Django Backend**: Acts as intermediary between browser and puxa.ai
- **puxa.ai APIs**: Called from Django backend (server-side)
- **Local Processing**: Django can run lightweight ML models locally
- **Caching**: Django caches analysis results to reduce API calls
- **Reactive Updates**: AI results flow from Django → Vue reactive state → Browser UI auto-updates
- **Browser Integration**: Content intercepted at Chromium level, analyzed, then rendered with AI enhancements

### Content Processing Pipeline
```
User Navigates to URL → ungoogled-chromium Browser → 
Content Interception (Chromium Hook) → Content Extraction → 
Django REST API (localhost) → Django Service Layer → puxa.ai API → 
Django Processing → Fact-Checking → Defluff Scoring → 
Personalization Engine → Django REST Response → 
Vue.js Extension/UI Update → Reactive State Update → 
Browser UI Auto-Morphs → Enhanced Content Display
```

### Data Storage
- **Django Database**: SQLite (default) or PostgreSQL for production
  - User profiles and authentication
  - Cached analysis results
  - User preferences and settings
  - Fact-check database
- **Frontend Cache**: IndexedDB for offline content
- **Reactive State**: Pinia store for global reactive state management
- **Local Files**: Django can store cached content in local filesystem

### Mac Executable Packaging Strategy

#### ungoogled-chromium + Django Approach

**Architecture**:
- Custom ungoogled-chromium build with AI features integrated
- Django backend runs as embedded localhost server
- Vue.js extension/UI components bundled with browser
- Single Mac .app bundle contains everything

**Packaging Steps**:
1. **Study ungoogled-chromium Build Process**
   - Review `docs/building.md` for macOS build instructions
   - Understand patch application system
   - Learn Chromium build configuration

2. **Create Custom Patches**
   - Content interception patches
   - UI modification patches
   - Django integration patches
   - Vue.js component integration

3. **Build ungoogled-chromium**
   - Apply ungoogled-chromium patches
   - Apply custom AI feature patches
   - Build Chromium for macOS
   - Package as .app bundle

4. **Bundle Django Backend**
   - Package Django with Python runtime
   - Include in browser .app bundle
   - Create launcher script to start Django server
   - Integrate with browser startup

5. **Bundle Vue.js Extension**
   - Build Vue.js extension for production
   - Include in browser extension directory
   - Configure extension manifest
   - Test extension functionality

**Build Process Example**:
```bash
# Based on ungoogled-chromium build process
cd ungoogled-chromium

# 1. Apply ungoogled-chromium patches
./devutils/apply_patches.sh

# 2. Apply our custom patches
./devutils/apply_patches.sh ../custom-patches/

# 3. Configure build for macOS
./utils/buildkit.py setup mac

# 4. Build Chromium
./utils/buildkit.py build mac

# 5. Package with Django and extensions
./utils/package_mac.sh --include-django --include-extension
```

**Packaging Tools**:
- **ungoogled-chromium buildkit**: Native build system for Chromium
- **PyInstaller**: Package Django as standalone executable
- **py2app**: Mac-specific Python app bundler
- **create-dmg**: Create Mac .dmg installer

**Bundle Structure**:
```
Browser.app/
├── Contents/
│   ├── MacOS/
│   │   └── Chromium (ungoogled-chromium executable)
│   ├── Resources/
│   │   ├── Default/ (Browser resources)
│   │   ├── extensions/ (Vue.js extension)
│   │   ├── backend/ (Django + Python)
│   │   │   ├── manage.py
│   │   │   ├── browser_app/
│   │   │   └── python/ (Embedded Python runtime)
│   │   └── Info.plist
│   └── Frameworks/ (Chromium frameworks)
```

**Size Considerations**:
- ungoogled-chromium base: ~200-300MB (full browser engine)
- Django + Python: ~50-100MB
- Vue.js extension: ~5-10MB
- **Total**: ~300-400MB (acceptable for full-featured browser)

**Alternative: Extension-Only Approach** (Smaller bundle)
- Use pre-built ungoogled-chromium from Homebrew
- Package only Django backend + Vue.js extension
- Bundle size: ~100-150MB
- Easier to develop and update

## Reactive Data Architecture

### Core Concept: Django API → Reactive State → Morphing UI

The application follows a strict separation where:
1. **Django Backend** (calls puxa.ai APIs server-side) returns pure data
2. **Reactive State** (Vue reactive objects) holds the data
3. **UI Layer** (Vue components) automatically morphs based on state changes

### State Management Pattern

#### Using Pinia (Vue 3 State Management)

```javascript
// stores/contentStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { djangoAPI } from '@/services/djangoAPI' // Django REST API client

export const useContentStore = defineStore('content', () => {
  // Raw server data - completely separate from UI
  const rawContent = ref(null)
  const aiAnalysis = ref(null)
  const factChecks = ref([])
  const defluffScore = ref(null)
  const userProfile = ref(null)
  
  // Computed properties - UI can react to these
  const shouldShowFactChecks = computed(() => 
    userProfile.value?.contentPreferences?.showFactChecks
  )
  
  const contentStyle = computed(() => ({
    complexity: aiAnalysis.value?.complexity || 'medium',
    ageAppropriate: aiAnalysis.value?.ageRating <= userProfile.value?.age
  }))
  
  // Actions - update state, UI auto-updates
  async function analyzeContent(url) {
    // Call Django backend (localhost:8000)
    const result = await djangoAPI.post('/api/content/analyze/', {
      url: url,
      user_profile: userProfile.value
    })
    // Django handles puxa.ai integration internally
    rawContent.value = result.data.original
    aiAnalysis.value = result.data.analysis
    factChecks.value = result.data.fact_checks
    defluffScore.value = result.data.defluff_score
    // UI automatically morphs - no manual DOM manipulation needed
  }
  
  return {
    rawContent,
    aiAnalysis,
    factChecks,
    defluffScore,
    shouldShowFactChecks,
    contentStyle,
    analyzeContent
  }
})
```

#### UI Component Example (Auto-Morphing)

```vue
<!-- components/ContentDisplay.vue -->
<template>
  <!-- UI morphs based on reactive state -->
  <div 
    :class="[
      'content-wrapper',
      `complexity-${contentStore.contentStyle.complexity}`,
      `age-${contentStore.contentStyle.ageAppropriate ? 'safe' : 'warning'}`
    ]"
  >
    <!-- Defluff score - appears/disappears reactively -->
    <DefluffBadge 
      v-if="contentStore.defluffScore !== null"
      :score="contentStore.defluffScore"
      :class="getDefluffClass(contentStore.defluffScore)"
    />
    
    <!-- Fact checks - only show if user preference allows -->
    <FactCheckOverlay 
      v-if="contentStore.shouldShowFactChecks"
      :checks="contentStore.factChecks"
    />
    
    <!-- Content morphs based on AI analysis -->
    <div 
      v-html="morphedContent"
      :style="getContentStyles()"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/contentStore'

const contentStore = useContentStore()

// Computed property - automatically updates when data changes
const morphedContent = computed(() => {
  if (!contentStore.aiAnalysis) return contentStore.rawContent
  
  // UI layer transforms data for display
  return transformContent(
    contentStore.rawContent,
    contentStore.aiAnalysis,
    contentStore.userProfile
  )
})

function transformContent(raw, analysis, profile) {
  // Pure transformation logic - no UI concerns
  // Can be easily tested and modified
  let content = raw
  
  if (profile.age < 13) {
    content = simplifyLanguage(content, analysis.complexity)
  }
  
  if (analysis.hasClickbait) {
    content = highlightClickbait(content)
  }
  
  return content
}
</script>
```

### Key Architectural Principles

1. **Single Source of Truth**: All server data flows into reactive state
2. **Unidirectional Data Flow**: Server → State → UI (never UI → Server directly)
3. **Reactive Updates**: UI automatically reflects state changes
4. **Pure Transformations**: Data transformations are pure functions
5. **Component Isolation**: UI components don't know about API structure

### Benefits for AI-Driven Content Morphing

- **Dynamic UI Updates**: As AI analysis completes, UI automatically updates
- **Progressive Enhancement**: Show content immediately, enhance as AI results arrive
- **Easy Testing**: Test data layer independently from UI
- **Flexible Morphing**: Change UI behavior without touching data logic
- **Performance**: Vue's reactivity system optimizes updates efficiently

### Example: Progressive Content Enhancement

```javascript
// As AI results stream in, UI morphs progressively
async function analyzeContentProgressive(url) {
  // 1. Show original content immediately
  contentStore.rawContent = await fetchContent(url)
  
  // 2. Start AI analysis (non-blocking)
  const analysisPromise = puxaAPI.analyze(url)
  
  // 3. As results arrive, UI auto-updates
  analysisPromise.then(result => {
    contentStore.defluffScore = result.score // UI shows score badge
    contentStore.factChecks = result.checks // UI shows fact-check icons
    contentStore.aiAnalysis = result.analysis // UI morphs content display
  })
  
  // UI layer handles all the morphing automatically via reactivity
}
```

## AI Integration Strategy

### Phase 1: Content Extraction
- Extract text, images, metadata from web pages
- Parse HTML structure and semantic elements
- Identify main content vs. ads/navigation/noise

### Phase 2: Django Backend Setup
- **Django Project**: Initialize Django with REST Framework
- **API Endpoints**: Create REST API endpoints for content analysis
- **Service Layer**: Build Django service layer for business logic
- **Database Models**: Create models for users, cache, settings

### Phase 3: puxa.ai API Integration (Django Backend)
- **puxa.ai Client**: Create Django service to call puxa.ai APIs
- **Content Analysis**: Django calls puxa.ai for content analysis
- **Intent Detection**: Django processes intent detection via puxa.ai
- **Personalization**: Django handles personalization logic
- **Authentication**: Secure puxa.ai API access from Django backend

### Phase 3: Multi-Modal Analysis
- Text analysis: sentiment, complexity, topic extraction
- Image analysis: content detection, OCR for text in images
- Video analysis: transcript extraction, frame analysis
- Link analysis: Evaluate outbound link quality

## Fact-Checking System

### Real-Time Verification Pipeline
1. **Claim Extraction**: Identify factual claims in content
2. **Source Verification**: Check against trusted databases
3. **Cross-Reference**: Compare with multiple sources
4. **Confidence Scoring**: Assign verification confidence levels

### Fact-Check Indicators
- ✅ Verified: Green checkmark for verified claims
- ⚠️ Disputed: Yellow warning for disputed claims
- ❌ False: Red X for false claims
- ❓ Unverified: Gray question mark for unverifiable claims

### Trusted Sources Integration
- Academic databases
- Fact-checking organizations (Snopes, PolitiFact, etc.)
- Government sources
- Verified news outlets

## Defluff Scoring Algorithm

### Scoring Components (Weighted)

1. **Information Density** (30%)
   - Words per sentence
   - Unique information vs. repetition
   - Technical depth

2. **Ad-to-Content Ratio** (20%)
   - Advertisement percentage
   - Sponsored content detection
   - Affiliate link density

3. **Clickbait Detection** (15%)
   - Sensational headlines
   - Misleading titles
   - Engagement manipulation

4. **Content Quality** (20%)
   - Grammar and spelling
   - Source citations
   - Author credibility

5. **Value-to-Noise Ratio** (15%)
   - Useful information percentage
   - Filler content detection
   - Redundancy analysis

### Score Calculation
```
Defluff Score = (Information Density × 0.30) + 
                (Ad Ratio Score × 0.20) + 
                (Clickbait Score × 0.15) + 
                (Quality Score × 0.20) + 
                (Value Score × 0.15)
```

### Score Display
- **0-30**: Heavy Fluff (Red)
- **31-60**: Moderate Fluff (Yellow)
- **61-80**: Low Fluff (Light Green)
- **81-100**: Minimal Fluff (Green)

## User Personalization System

### User Profile Structure
```json
{
  "age": number,
  "goals": ["learning", "entertainment", "research", "shopping"],
  "interests": ["technology", "science", "arts"],
  "readingLevel": "beginner" | "intermediate" | "advanced",
  "contentPreferences": {
    "simplifyComplexTopics": boolean,
    "showFactChecks": boolean,
    "minDefluffScore": number,
    "ageAppropriateFilter": boolean
  },
  "intent": "current browsing intent"
}
```

### Personalization Rules
- **Age-Based**: Filter inappropriate content, adjust complexity
- **Goal-Based**: Highlight relevant information, hide distractions
- **Intent-Based**: Show related content, suggest actions
- **Reading Level**: Simplify or expand explanations

### Dynamic Content Modification
- Summarize complex sections for younger users
- Expand technical details for advanced users
- Highlight goal-relevant information
- Hide or minimize irrelevant content

## Implementation Phases

### Phase 1: Foundation & ungoogled-chromium Study (Weeks 1-2)
- [ ] Clone and study ungoogled-chromium repository
- [ ] Review build documentation (`docs/building.md`, `docs/design.md`)
- [ ] Understand patch system and build process
- [ ] Study macOS build configuration
- [ ] Set up Django project with REST Framework
- [ ] Set up Vue.js 3 project with Vite (browser extension)
- [ ] Configure Pinia for reactive state management
- [ ] Set up data/UI separation architecture
- [ ] Create Django API service layer structure
- [ ] Create Vue.js API client for Django
- [ ] Create browser extension manifest and structure
- [ ] Basic content extraction (Django)
- [ ] Establish reactive data flow pattern

### Phase 2: Django Backend & AI Integration (Weeks 3-4)
- [ ] Set up Django REST API endpoints
- [ ] Create Django service layer for puxa.ai integration
- [ ] Connect Django backend to puxa.ai APIs
- [ ] Implement content analysis pipeline (Django)
- [ ] Create user profile system (Django models + API)
- [ ] Basic personalization engine (Django)
- [ ] Django authentication system

### Phase 3: Fact-Checking (Weeks 5-6)
- [ ] Implement fact-checking pipeline
- [ ] Create fact-check indicators UI
- [ ] Integrate fact-check sources
- [ ] Confidence scoring system

### Phase 4: Defluff Scoring (Weeks 7-8)
- [ ] Implement defluff scoring algorithm
- [ ] Create scoring UI components
- [ ] Add filtering by defluff score
- [ ] Score visualization

### Phase 5: Personalization (Weeks 9-10)
- [ ] Advanced personalization engine
- [ ] Dynamic content rendering
- [ ] Intent detection
- [ ] Age-appropriate filtering

### Phase 6: Mac Packaging & Optimization (Weeks 11-12)
- [ ] Create custom patches for ungoogled-chromium
- [ ] Integrate Django backend into browser build
- [ ] Bundle Vue.js extension with browser
- [ ] Configure ungoogled-chromium buildkit for Mac
- [ ] Build custom ungoogled-chromium with AI features
- [ ] Create Mac .app bundle
- [ ] Test Mac executable
- [ ] Performance optimization
- [ ] Caching strategies
- [ ] Battery efficiency improvements
- [ ] User testing and refinement

## API Integration Points

### Required puxa.ai Endpoints (To Be Provided)
1. **Authentication**
   - Login/Register
   - Token refresh
   - User profile management

2. **Content Analysis**
   - Analyze text content
   - Analyze images
   - Analyze videos
   - Multi-modal analysis

3. **Personalization**
   - Get personalized recommendations
   - Intent detection
   - Content filtering

4. **Fact-Checking** (if available)
   - Verify claims
   - Get source credibility
   - Cross-reference information

### API Integration Pattern

**Key Principle**: Frontend calls Django REST API (localhost), Django handles puxa.ai integration server-side. Results flow into reactive state, UI reacts automatically.

#### Frontend API Service (Vue.js)

```typescript
// services/djangoAPI.ts - Pure data layer, calls Django backend
const API_BASE_URL = 'http://localhost:8000'

export const djangoAPI = {
  async analyzeContent(url: string, userProfile: UserProfile): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/api/content/analyze/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({ url, user_profile: userProfile })
    })
    return response.json() // Pure data, no UI manipulation
  },
  
  async factCheck(content: string): Promise<FactCheckResult> {
    const response = await fetch(`${API_BASE_URL}/api/content/fact-check/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    return response.json()
  },
  
  async getDefluffScore(url: string): Promise<DefluffScore> {
    const response = await fetch(`${API_BASE_URL}/api/content/defluff-score/`, {
      method: 'POST',
      body: JSON.stringify({ url })
    })
    return response.json()
  }
}
```

#### Django Backend Service (Python)

```python
# backend/browser_app/services/puxa_client.py
import requests
from django.conf import settings

class PuxaAPIClient:
    def __init__(self):
        self.base_url = settings.PUXA_API_URL
        self.api_key = settings.PUXA_API_KEY
    
    def analyze_content(self, content: str, user_profile: dict) -> dict:
        """Call puxa.ai API - Django handles this server-side"""
        response = requests.post(
            f"{self.base_url}/analyze",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"content": content, "user_profile": user_profile}
        )
        return response.json()

# backend/browser_app/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .services.puxa_client import PuxaAPIClient
from .services.content_analyzer import ContentAnalyzer

class ContentAnalyzeView(APIView):
    def post(self, request):
        url = request.data.get('url')
        user_profile = request.data.get('user_profile')
        
        # Extract content
        analyzer = ContentAnalyzer()
        content = analyzer.extract(url)
        
        # Call puxa.ai via service layer
        puxa_client = PuxaAPIClient()
        analysis = puxa_client.analyze_content(content, user_profile)
        
        # Process and return
        return Response({
            'original': content,
            'analysis': analysis,
            'fact_checks': self._get_fact_checks(content),
            'defluff_score': self._calculate_defluff_score(content)
        })
```

**Architecture Flow**:
```
Vue Frontend → djangoAPI Service (pure data) → 
Django REST API (localhost) → Django Service Layer → 
puxa.ai API (external) → Django Processing → 
Django REST Response → Pinia Store (reactive state) → 
Vue Components (auto-morphing UI)
```

## Technical Considerations

### Performance
- **Lazy Loading**: Process content as user scrolls
- **Caching**: Cache analyzed content to reduce API calls
- **Batch Processing**: Group multiple analysis requests
- **Progressive Enhancement**: Show content first, enhance with AI
- **Reactive Efficiency**: Vue's reactivity system only updates changed UI parts
- **Data Layer Caching**: Cache API responses in reactive state, UI auto-updates from cache

### Privacy & Security
- **On-Device Processing**: Process sensitive content locally when possible
- **Encrypted Storage**: Encrypt user profiles and cached data
- **Minimal Data Collection**: Only collect necessary user data
- **Transparent Processing**: Show users what's being analyzed

### Scalability
- **Rate Limiting**: Implement API rate limiting
- **Queue System**: Queue analysis requests during high load
- **Fallback Mechanisms**: Graceful degradation if APIs unavailable
- **CDN Integration**: Cache static assets

### Django-Specific Considerations
- **Local Server**: Django runs on localhost (127.0.0.1) - no external exposure needed
- **Database**: Use SQLite for simplicity (embedded in app) or PostgreSQL for production
- **CORS**: Configure CORS for Vue.js frontend to access Django API
- **Static Files**: Serve Vue.js built files from Django or Electron
- **Environment Variables**: Store puxa.ai API keys in Django settings (not frontend)
- **Async Processing**: Consider Celery for long-running AI analysis tasks
- **Error Handling**: Proper Django error responses for frontend handling
- **Logging**: Django logging for debugging and monitoring

### Mac Executable Considerations
- **Python Runtime**: Bundle Python runtime with Django (PyInstaller/py2app)
- **Dependencies**: Include all Python packages in executable bundle
- **Startup Time**: Optimize Django server startup time
- **Port Management**: Ensure localhost port (8000) is available
- **App Signing**: Code sign Mac .app for distribution
- **Permissions**: Handle Mac security permissions (network, file access)
- **Auto-Updates**: Consider update mechanism for app distribution

### Mobile Optimization (Desktop App)
- **Battery Efficiency**: Optimize AI processing to minimize battery drain
- **Data Usage**: Compress API requests and responses
- **Offline Mode**: Basic functionality without internet (cached content)
- **Window Management**: Native Mac window controls and behaviors

## UI/UX Considerations

### Browser Interface
- Clean, minimal design
- Prominent defluff score display
- Fact-check indicators inline with content
- Personalization settings easily accessible
- Quick toggle for AI features

### Content Display
- Highlight verified information
- Show warnings for disputed content
- Collapsible sections for detailed fact-checks
- Visual indicators for defluff score
- Age-appropriate content warnings

### Settings & Preferences
- Easy profile management
- Goal and intent selection
- Defluff score threshold
- Fact-check display preferences
- Privacy controls

## Success Metrics

### User Engagement
- Daily active users
- Average session duration
- Pages analyzed per session
- Feature usage rates

### Quality Metrics
- Defluff score accuracy
- Fact-check accuracy
- User satisfaction scores
- Content relevance ratings

### Performance Metrics
- Page load times
- API response times
- Battery usage
- Data consumption

## Next Steps

1. **ungoogled-chromium Repository Study**: 
   - Clone repository: `git clone https://github.com/ungoogled-software/ungoogled-chromium.git`
   - Study build documentation and patch system
   - Understand macOS build process
   - Review existing patches for modification patterns

2. **API Documentation Review**: Review provided puxa.ai API endpoints and authentication system

3. **Django Project Setup**: Initialize Django project with REST Framework

4. **Vue.js Browser Extension Setup**: Initialize Vue 3 + Vite + Pinia as browser extension

5. **Reactive Architecture Implementation**: Set up data/UI separation pattern

6. **Django Service Layer**: Create puxa.ai API integration in Django backend

7. **Vue.js API Client**: Create Django REST API client for Vue.js extension

8. **Browser Extension Development**: Build browser extension with Vue.js components

9. **ungoogled-chromium Integration**: Create custom patches for AI features

10. **Prototype Development**: Build MVP with Django backend, Vue.js extension, and ungoogled-chromium

11. **Mac Packaging**: Build custom ungoogled-chromium with integrated features

12. **User Testing**: Test with target users for feedback

13. **Iterative Improvement**: Refine based on user feedback and metrics

## Questions for Clarification

1. What specific puxa.ai endpoints are available for content analysis?
2. What authentication method does puxa.ai use (OAuth, API keys, JWT)?
3. Are there rate limits on puxa.ai APIs?
4. What is the expected user base size (affects caching strategy)?
5. Are there specific fact-checking APIs to integrate, or should we build our own?
6. What age ranges are we targeting?
7. Should the browser support all websites or specific domains?
8. What is the priority order of features?

---

**Document Version**: 2.1  
**Last Updated**: [Current Date]  
**Status**: Ready for Development Planning  
**Key Updates**: 
- Added ungoogled-chromium as browser engine foundation
- Updated architecture to use Chromium browser instead of Electron
- Added ungoogled-chromium repository study and integration strategy
- Updated Mac packaging to use Chromium build system
- Maintained Django backend + Vue.js frontend architecture
- Maintained strict data/UI separation with reactive architecture

