from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import SessionLocal
from fastapi import HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
import models
import os
from datetime import datetime
from fastapi.responses import RedirectResponse
import bcrypt
from sqlalchemy import func
import feedparser

#Az alkalmazás létrehozása
app = FastAPI()

script_dir = os.path.dirname(__file__)
static_path = os.path.join(script_dir, "static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=static_path), name="static")
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

def hash_password(password: str):
    salt = bcrypt.gensalt()
    pwd_bytes = password[:72].encode('utf-8')
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8') 

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(
        plain_password[:72].encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

#Adatbázis kapcsolat kezelő
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    #Felhasználó létezésének ellenőrzése
    db_user = db.query(models.User).filter(
        (models.User.username == user_in.username) | 
        (models.User.email == user_in.email)
    ).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    hashed_pwd = hash_password(user_in.password)
    
    #Új felhasználó létrehozása
    new_user = models.User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hashed_pwd,
        created_at=datetime.now()
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "success", "message": "User created successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Adatbázis hiba: {str(e)}")


@app.post("/login")
def login(user_in: UserRegister, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == user_in.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Hibás felhasználónév vagy jelszó")
    if not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Hibás felhasználónév vagy jelszó")

    return {"status": "success", "message": "Sikeresen beléptél!", "username": user.username}
#Főoldal útvonal
@app.get("/")
def home():
    return RedirectResponse(url="/docs")

#Teszt lekéréshez
@app.get("/test-connection")
def test_db(db: Session = Depends(get_db)):
    try:
        movies = db.query(models.Movie).all()
        return movies
    except Exception as e:
        return {
            "status": "error",
            "message": "Sikertelen kapcsolódás az adatbázishoz!",
            "details": str(e)
        }

@app.get("/genres")
def get_genres(db: Session = Depends(get_db)):
    try:
        genres = db.query(models.Genre).all()
        print(f"DEBUG: Talált műfajok száma: {len(genres)}")
        for g in genres:
            print(f"DEBUG: Műfaj: {g.name}")
            
        return genres
    except Exception as e:
        print(f"HIBA TÖRTÉNT: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/latest-directors")
def get_latest_directors(db: Session = Depends(get_db)):
    try:
        directors = db.query(models.Director).limit(10).all()
        
        if not directors:
            print("DEBUG: Üres a directors tábla!")
            return []
            
        return directors
    except Exception as e:
        print(f"HIBA: {str(e)}")
        return []
    
@app.get("/news/{category}")
def get_ign_news(category: str):
    if category == "Reviews":
        url = "https://www.ign.com/rss/articles/feed?tags=review,movies&count=20"
    elif category == "Videos":
        url = "https://www.ign.com/rss/videos/feed?tags=movie,trailer&count=20"
    else:
        url = "https://www.ign.com/rss/articles/feed?tags=movies&count=20"

    feed = feedparser.parse(url)
    news_items = []

    for entry in feed.entries:
        img_url = ""
        if 'media_thumbnail' in entry:
            img_url = entry.media_thumbnail[0]['url']
        elif 'links' in entry:
            for link in entry.links:
                if 'image' in link.get('type', ''):
                    img_url = link.get('href')

        news_items.append({
            "title": entry.title,
            "link": entry.link,
            "date": entry.published,
            "img": img_url
        })

    return news_items
#Indítás
if __name__ == "__main__":
    import uvicorn
    print("Szerver indul...")
    uvicorn.run(app, host="127.0.0.1", port=8001)