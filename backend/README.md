# Django Backend

Django REST API backend for PUXA AI Browser.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Structure

```
backend/
├── browser_app/          # Main Django app
│   ├── api/             # REST API views
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   │   ├── puxa_client.py
│   │   ├── content_analyzer.py
│   │   ├── fact_checker.py
│   │   └── defluff_scorer.py
│   └── native_messaging/ # Native messaging host
└── manage.py
```

## API Endpoints

- `POST /api/content/analyze/` - Analyze web content
- `POST /api/content/fact-check/` - Fact-check content
- `GET /api/content/defluff-score/` - Get defluff score
- `GET /api/user/profile/` - Get user profile

