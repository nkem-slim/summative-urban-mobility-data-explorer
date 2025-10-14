import argparse
from app import app
from storage_adapters import FileStorage, DBStorage
from db_setup import setup_db_session

storage = None


def main():
    parser = argparse.ArgumentParser(description="Flask Trip Server")
    parser.add_argument(
        "--storage",
        choices=["file", "db"],
        default="db",
        help="Choose storage type: file or db",
    )
    args = parser.parse_args()

    # print(args)
    if args.storage == "file":
        from pathlib import Path
        storage = FileStorage(file_path="trips.json")
    else:
        # setup DB session here, e.g., SQLAlchemy
        Session = setup_db_session()  # your DB setup function
        db_instance = Session()
        print(db_instance)
        # storage = DBStorage(db_instance, input_file="train.csv")
        storage = DBStorage(db_instance)
    app.config["STORAGE"] = storage
    app.run(debug=True, port=5000)


if __name__ == "__main__":
    main()
