# StreetCare — Full-Stack Platform for Street Animals

A simple, portfolio-ready platform to report, track, and manage street animals (all species).

## Tech
- **Backend:** FastAPI + SQLite (SQLAlchemy), JWT auth
- **Frontend:** Minimal React (CDN) with clean CSS (no build tooling needed)
- **Auth:** Register → token; use Bearer token for protected routes

## Quick Start
### Backend
```bash
cd backend
python -m venv .venv
# activate venv
pip install -r requirements.txt
uvicorn app.main:app --reload
# open http://127.0.0.1:8000/docs
```
Create a user:
- POST `/auth/register` with `{email,password,name}` (via Swagger UI)
- Then POST `/auth/token` with form fields `username=email`, `password`

### Frontend
```bash
cd frontend
python -m http.server 5173
# open http://127.0.0.1:5173
```
- Use **Login** to get a token, then create animals.
- Use **Report** to submit public reports (no login required).

## Suggested Extensions (for resume)
- Map view (Leaflet) to plot reports/animals
- Image upload to S3/Cloudinary
- Role-based admin dashboard (approve/close reports)
- Analytics: species frequency, resolution times
- Dockerization for both services
