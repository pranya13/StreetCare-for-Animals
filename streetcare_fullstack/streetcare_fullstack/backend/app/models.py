from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="volunteer")  # volunteer | admin

class Animal(Base):
    __tablename__ = "animals"
    id = Column(Integer, primary_key=True, index=True)
    species = Column(String, index=True)   # dog, cat, cow, bird, etc.
    description = Column(String, default="")
    status = Column(String, default="reported")  # reported | rescued | adopted
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    reporter_name = Column(String, default="Anonymous")
    contact = Column(String, default="")
    species = Column(String, default="unknown")
    description = Column(String, default="")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    status = Column(String, default="open")  # open | in_progress | closed
    created_at = Column(DateTime, default=datetime.utcnow)
