import argparse
import os
from app import app
from storage.storage_adapters import FileStorage, DBStorage
from storage.db_setup import setup_db_session

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
        storage = FileStorage(file_path="trips.json",
                              input_file="data/train.csv")
    else:
        Session = setup_db_session()  # your DB setup function
        db_instance = Session()
        print(db_instance)

        # Only load initial data if not in production restart
        input_file = "data/train.csv" if not os.getenv("SKIP_DATA_LOAD") else None
        storage = DBStorage(db_instance, input_file=input_file)
    app.config["STORAGE"] = storage
    not_production = os.getenv("PYTHON_ENV") != "PRODUCTION"
    app.run(debug=not_production, host='0.0.0.0', port=5000)


if __name__ == "__main__":
    main()
