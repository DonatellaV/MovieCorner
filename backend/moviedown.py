import os
import requests
from sqlalchemy.orm import Session
from database import SessionLocal
import models

def fix_missing_ids():
    db = SessionLocal()
    missing_ids = [1, 3, 5, 8, 9] # Ezeket keressük
    
    # Csak ezeket kérjük le az adatbázisból
    movies = db.query(models.Movie).filter(models.Movie.id.in_(missing_ids)).all()
    
    posters_dir = "static/posters"
    if not os.path.exists(posters_dir):
        os.makedirs(posters_dir)

    for movie in movies:
        file_name = f"movie_{movie.id}.jpg"
        file_path = os.path.join(posters_dir, file_name)
        local_url = f"http://127.0.0.1:8000/static/posters/{file_name}"

        print(f"Próbálkozás: {movie.title} (ID: {movie.id})")
        
        try:
            # Megpróbáljuk letölteni
            response = requests.get(movie.posterURL, stream=True, timeout=15)
            if response.status_code == 200:
                with open(file_path, 'wb') as f:
                    for chunk in response:
                        f.write(chunk)
                movie.posterURL = local_url
                print(f"-> SIKER: {movie.title} mentve.")
            else:
                print(f"-> HIBA: A szerver {response.status_code}-at adott vissza.")
        except Exception as e:
            print(f"-> HIBA: Nem sikerült elérni a linket: {e}")

    db.commit()
    db.close()
    print("A hiányzók javítása befejeződött.")

if __name__ == "__main__":
    fix_missing_ids()