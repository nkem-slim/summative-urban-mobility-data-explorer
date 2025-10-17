import argparse
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
        storage = FileStorage(file_path="trips.json")
    else:
        Session = setup_db_session()
        db_instance = Session()
        print(db_instance)
        
        # Check if CSV file exists
        csv_file_path = "data/train.csv"
        import os
        if os.path.exists(csv_file_path):
            storage = DBStorage(db_instance, input_file=csv_file_path)
        else:
            print(f"Warning: CSV file {csv_file_path} not found. Starting with empty database.")
            storage = DBStorage(db_instance)
    app.config["STORAGE"] = storage
    app.run(debug=True, port=5000)


if __name__ == "__main__":
    main()
