from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import SessionLocal
from .auth import get_current_user

router = APIRouter(prefix="/animals", tags=["animals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.AnimalOut)
def create_animal(payload: schemas.AnimalCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    a = models.Animal(**payload.model_dump())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a

@router.get("/", response_model=List[schemas.AnimalOut])
def list_animals(db: Session = Depends(get_db)):
    return db.query(models.Animal).order_by(models.Animal.created_at.desc()).all()

@router.get("/{animal_id}", response_model=schemas.AnimalOut)
def get_animal(animal_id: int, db: Session = Depends(get_db)):
    a = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not a:
        raise HTTPException(404, "Animal not found")
    return a

@router.put("/{animal_id}", response_model=schemas.AnimalOut)
def update_animal(animal_id: int, payload: schemas.AnimalCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    a = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not a:
        raise HTTPException(404, "Animal not found")
    for k, v in payload.model_dump().items():
        setattr(a, k, v)
    db.commit()
    db.refresh(a)
    return a

@router.delete("/{animal_id}")
def delete_animal(animal_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    a = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not a:
        raise HTTPException(404, "Animal not found")
    db.delete(a)
    db.commit()
    return {"ok": True}
