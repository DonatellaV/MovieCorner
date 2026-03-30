from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    year = Column(String(4))
    runtime = Column(String(10))
    director = Column(String(255))
    actors = Column(Text)
    plot = Column(Text)
    posterURL = Column(String(750))
    genres = Column(String(255))
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    # Figyelj, itt az oszlop neve password_hash, ahogy a képen látni!
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
# models.py-ban kell lennie:
class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    
class Director(Base):
    __tablename__ = "directors" # Vagy amire a MySQL-ben keresztelted a táblát

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    photoURL = Column(String(255))