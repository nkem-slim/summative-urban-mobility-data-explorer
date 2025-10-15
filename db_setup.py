from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os


def setup_db_session():
    """
    Setup and return a SQLAlchemy DB session connected to MySQL.
    Uses environment variables if parameters are not provided:
    MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE
    """

    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    host = os.getenv("MYSQL_HOST")
    port = int(os.getenv("MYSQL_PORT"))
    database = os.getenv("MYSQL_DATABASE")
    # print(user, password, host, port, database)

    db_url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

    engine = create_engine(db_url, echo=False)
    Base.metadata.create_all(engine)  # create tables if they don't exist
    print("DB connected")
    Session = sessionmaker(bind=engine)
    return Session
