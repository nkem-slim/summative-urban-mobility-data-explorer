import unittest
from app import app
from storage.storage_adapters import FileStorage
from tempfile import NamedTemporaryFile
import os


class FlaskE2ETestCaseWithFileStorage(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

        # Temp storage
        self.temp_file = NamedTemporaryFile(delete=False)
        self.storage = FileStorage(
            self.temp_file.name, f"{os.getcwd()}/train.csv")
        app.config["STORAGE"] = self.storage

    def tearDown(self):
        self.temp_file.close()

    def test_home(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Trip Data Validator API is running",
                      response.get_data(as_text=True))

    def test_list_trips(self):
        response = self.client.get("/trips")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 10000)

    def test_add_and_list_trip(self):
        # Add a trip
        trip = {
            "id": "id1",
            "vendor_id": 1,
            "pickup_datetime": "2025-01-01T10:00:00",
            "dropoff_datetime": "2025-01-01T10:30:00",
            "passenger_count": 2,
            "pickup_longitude": 10.0,
            "pickup_latitude": 20.0,
            "dropoff_longitude": 15.0,
            "dropoff_latitude": 25.0,
            "store_and_fwd_flag": "N",
            "trip_duration": 30
        }
        response = self.client.post("/trips", json=trip)
        self.assertEqual(response.status_code, 201)

        # List trips
        # response = self.client.get("/trips")
        # trips = response.get_json()
        # self.assertEqual(len(trips),)
        # self.assertEqual(trips[0]["id"], "id1")
