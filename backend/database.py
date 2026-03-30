import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Először megnézi, hogy a rendszerben be van-e állítva a DATABASE_URL.
# Ha nincs (pl. a te gépeden), akkor a második, fix címet használja.
SQLALCHEMY_DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "mysql+pymysql://root:@127.0.0.1/moviecorner"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()