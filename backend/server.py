import argparse
import os
from app import app
from storage.storage_adapters import FileStorage, DBStorage
from storage.db_setup import setup_db_session


def setup_storage(storage_type=None):
    if storage_type is None:
        # default from env if not provided
        storage_type = os.getenv("STORAGE_TYPE", "db")

    if storage_type == "file":
        storage = FileStorage(file_path="trips.json", input_file="train.csv")
    else:
        Session = setup_db_session()
        db_instance = Session()
        input_file = "train.csv" if not os.getenv("SKIP_DATA_LOAD") else None
        storage = DBStorage(db_instance, input_file=input_file)

    app.config["STORAGE"] = storage


setup_storage()


def main():
    parser = argparse.ArgumentParser(description="Flask Trip Server")
    parser.add_argument("--storage", choices=["file", "db"], default="db")
    args = parser.parse_args()

    setup_storage(args.storage)
    not_production = os.getenv("PYTHON_ENV") != "PRODUCTION"
    app.run(debug=not_production, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
