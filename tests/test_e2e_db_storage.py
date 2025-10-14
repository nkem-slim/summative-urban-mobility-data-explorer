import unittest
from server import app
from storage_adapters import DBStorage
from db_setup import setup_db_session


class FlaskE2ETestCaseWithDBStorage(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()
        Session = setup_db_session()
        self.db_instance = Session()
        self.storage = DBStorage(
            db_session=self.db_instance, input_file="train.csv")
        app.config["STORAGE"] = self.storage

    def tearDown(self):
        self.storage.delete_many_trips()
        self.db_instance.close()

    def test_home(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Trip Data Validator API is running",
                      response.get_data(as_text=True))

    def test_list_trips(self):
        response = self.client.get("/trips")
        self.assertEqual(response.status_code, 200)
        print(len(response.json))
        # self.assertEqual(len(response.json), 10000)
