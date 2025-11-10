# StreetCare Backend (FastAPI)

## Setup
```bash
cd backend
python -m venv .venv
# activate venv (Windows: .venv\Scripts\activate, Linux/Mac: source .venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://127.0.0.1:8000
# Docs at http://127.0.0.1:8000/docs
```

## Auth
- Register: `POST /auth/register` (json: email, password, name)
- Token: `POST /auth/token` (form: username=email, password)
- Use `Authorization: Bearer <token>` for protected endpoints

## Entities
- Animals: CRUD (`/animals`) — create requires auth
- Reports: public create/list/update (`/reports`)
