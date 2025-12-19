# PUXA AI Browser

An AI-powered browser built on ungoogled-chromium that analyzes, fact-checks, and personalizes web content in real-time.

## Features

- 🤖 **AI-Powered Content Analysis**: Real-time analysis of web content using puxa.ai
- ✅ **Fact-Checking**: On-the-fly verification of claims against trusted sources
- 📊 **Defluff Scoring**: Content quality scoring (0-100) based on information density, ads, clickbait, etc.
- 🎯 **Personalization**: Content adapted to user age, goals, and preferences
- 🔒 **Privacy-First**: Built on ungoogled-chromium (no Google tracking)

## Architecture

- **Browser Engine**: ungoogled-chromium (Chromium without Google)
- **Frontend**: Vue.js 3 browser extension
- **Backend**: Django REST API
- **AI Integration**: puxa.ai APIs

## Project Structure

```
Browser/
├── backend/              # Django backend
├── frontend/            # Vue.js browser extension
├── custom-patches/      # Custom Chromium patches
├── build/               # Build scripts
├── docs/                # Documentation
└── ungoogled-chromium/  # Reference (not committed)
```

## Development

See [ROADMAP.md](ROADMAP.md) for development phases and [INTEGRATION_DESIGN.md](INTEGRATION_DESIGN.md) for technical details.

## License

[To be determined]

