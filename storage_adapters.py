from models import TripModel  # SQLAlchemy ORM model
from sqlalchemy.exc import NoResultFound
from storage import StorageAdapter
from pathlib import Path
from clean import clean_data
import json
from sqlalchemy import delete


class FileStorage(StorageAdapter):
    def __init__(self, file_path: str, input_file=None):
        # print(file_path)
        self.file_path = Path(file_path)
        self.file_path.touch(exist_ok=True)
        if input_file != None:
            clean_data(input_csv=input_file, output_json=self.file_path)
            print(self.file_path.stat().st_size)
        else:
            self.file_path.write_text("[]")

    def _load(self):
        with open(self.file_path, "r") as f:
            return json.load(f)

    def _save(self, trips):
        with open(self.file_path, "w") as f:
            json.dump(trips, f, indent=4)

    def save_trip(self, trip: dict):
        trips = self._load()
        trips.append(trip)
        self._save(trips)

    def get_trip(self, trip_id: str) -> dict:
        trips = self._load()
        return next((t for t in trips if t["id"] == trip_id), None)

    def list_trips(self):
        return self._load()

    def delete_trip(self, trip_id: str):
        trips = self._load()
        trips = [t for t in trips if t["id"] != trip_id]
        self._save(trips)


class DBStorage(StorageAdapter):
    def __init__(self, db_session, input_file=None):
        self.db = db_session
        if input_file != None:
            clean_data(input_csv=input_file, session=self.db)

    def save_trip(self, trip: dict):
        """
        Save a new trip to the database. If trip.id already exists, overwrite.
        """
        # Check if trip already exists
        existing = self.db.query(TripModel).filter_by(id=trip["id"]).first()
        if existing:
            # Update existing fields
            for key, value in trip.items():
                if hasattr(existing, key):
                    setattr(existing, key, value)
        else:
            # Create new TripModel instance
            new_trip = TripModel(**trip)
            self.db.add(new_trip)

        self.db.commit()

    def get_trip(self, trip_id: str) -> dict | None:
        """
        Retrieve a trip by ID.
        """
        trip = self.db.query(TripModel).filter_by(id=trip_id).first()
        if trip:
            return trip.to_dict()
        return None

    def list_trips(self) -> list[dict]:
        """
        List all trips in the database.
        """
        trips = self.db.query(TripModel).all()
        return [trip.to_dict() for trip in trips]

    def delete_trip(self, trip_id: str):
        """
        Delete a trip by ID.
        """
        trip = self.db.query(TripModel).filter_by(id=trip_id).first()
        if trip:
            self.db.delete(trip)
            self.db.commit()

    def delete_many_trips(self):
        query = delete(TripModel)
        self.db.execute(query)
        self.db.commit()
