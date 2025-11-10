from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/reports", tags=["reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ReportOut)
def create_report(payload: schemas.ReportCreate, db: Session = Depends(get_db)):
    r = models.Report(**payload.model_dump())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.get("/", response_model=List[schemas.ReportOut])
def list_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).order_by(models.Report.created_at.desc()).all()

@router.put("/{report_id}", response_model=schemas.ReportOut)
def update_report(report_id: int, payload: schemas.ReportCreate, db: Session = Depends(get_db)):
    r = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not r:
        raise HTTPException(404, "Report not found")
    for k, v in payload.model_dump().items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return r
