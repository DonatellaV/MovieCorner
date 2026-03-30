from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Cseréld ki a saját adataidra:
# 'root' = felhasználónév
# 'JELSZOD' = a te MySQL jelszavad
# 'localhost' = ahol fut a MySQL
# 'adatbazis_neve' = amit a MySQL Workbenchben adtál neki
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:JELSZOD@localhost/adatbazis_neve"

# Létrehozzuk a motort
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Létrehozunk egy munkamenet-gyárat
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Ebből származtatjuk majd a modelljeinket
Base = declarative_base()