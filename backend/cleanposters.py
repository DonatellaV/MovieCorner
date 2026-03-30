import os
import mysql.connector

# Csatlakozás az adatbázishoz
db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    database="moviecorner"
)
cursor = db.cursor(dictionary=True)

# Lekérjük az összes filmet
cursor.execute("SELECT id, title FROM movies")
movies = cursor.fetchall()

folder = "static/posters"

for movie in movies:
    movie_id = movie['id']
    title = movie['title'].lower().replace(" ", "_") # pl. "Beetlejuice" -> "beetlejuice"
    
    # Megkeressük, van-e olyan kép, aminek a nevében benne van a film címe
    for filename in os.listdir(folder):
        if title in filename.lower() and not filename.startswith("movie_"):
            old_path = os.path.join(folder, filename)
            new_path = os.path.join(folder, f"movie_{movie_id}.jpg")
            
            print(f"Javítás: {filename} -> movie_{movie_id}.jpg ({movie['title']})")
            os.rename(old_path, new_path)
            break

db.close()