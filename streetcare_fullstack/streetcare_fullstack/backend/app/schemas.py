from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Animals
class AnimalBase(BaseModel):
    species: str
    description: Optional[str] = ""
    status: Optional[str] = "reported"
    lat: Optional[float] = None
    lng: Optional[float] = None
    image_url: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalOut(AnimalBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Reports
class ReportBase(BaseModel):
    reporter_name: Optional[str] = "Anonymous"
    contact: Optional[str] = ""
    species: Optional[str] = "unknown"
    description: Optional[str] = ""
    lat: Optional[float] = None
    lng: Optional[float] = None
    status: Optional[str] = "open"

class ReportCreate(ReportBase):
    pass

class ReportOut(ReportBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
