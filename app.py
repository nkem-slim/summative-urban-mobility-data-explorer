from dotenv import load_dotenv
from clean import TripRecord  # or your Trip model
from flask import Flask, jsonify, request, g
from flasgger import Swagger

load_dotenv()


app = Flask(__name__)

# Configure Swagger with custom template and info
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

template = {
    "swagger": "2.0",
    "info": {
        "title": "Urban Mobility Data Explorer API",
        "description": "API for managing and querying urban mobility trip data",
        "contact": {
            "responsibleOrganization": "Urban Mobility Team",
            "responsibleDeveloper": "Developer",
        },
        "version": "1.0.0"
    },
    "host": "localhost:5000",
    "basePath": "/",
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ]
}

swagger = Swagger(app, config=swagger_config, template=template)


@app.before_request
def inject_storage():
    g.storage = app.config.get("STORAGE")


@app.route("/")
def health():
    """Health check endpoint
    ---
    tags:
      - Health
    summary: Check API health status
    description: Returns a simple message to verify that the API is running
    responses:
      200:
        description: API is running successfully
        schema:
          type: string
          example: "Trip Data Validator API is running"
    """
    return "Trip Data Validator API is running", 200


@app.route("/trips", methods=["POST"])
def add_trip():
    """Add a new trip record
    ---
    tags:
      - Trips
    summary: Create a new trip record
    description: Validates and adds a new trip record to the database
    parameters:
      - in: body
        name: trip
        description: Trip data to be added
        required: true
        schema:
          type: object
          required:
            - id
            - vendor_id
            - pickup_datetime
            - dropoff_datetime
            - passenger_count
            - pickup_longitude
            - pickup_latitude
            - dropoff_longitude
            - dropoff_latitude
            - store_and_fwd_flag
            - trip_duration
          properties:
            id:
              type: string
              description: Trip ID (must start with 'id' followed by digits)
              example: "id12345"
            vendor_id:
              type: integer
              description: Vendor identifier
              example: 1
            pickup_datetime:
              type: string
              format: date-time
              description: Pickup timestamp
              example: "2023-01-15T10:30:00"
            dropoff_datetime:
              type: string
              format: date-time
              description: Dropoff timestamp
              example: "2023-01-15T10:45:00"
            passenger_count:
              type: integer
              description: Number of passengers
              example: 2
            pickup_longitude:
              type: number
              format: float
              minimum: -180
              maximum: 180
              description: Pickup location longitude
              example: -73.935242
            pickup_latitude:
              type: number
              format: float
              minimum: -90
              maximum: 90
              description: Pickup location latitude
              example: 40.730610
            dropoff_longitude:
              type: number
              format: float
              minimum: -180
              maximum: 180
              description: Dropoff location longitude
              example: -73.925242
            dropoff_latitude:
              type: number
              format: float
              minimum: -90
              maximum: 90
              description: Dropoff location latitude
              example: 40.740610
            store_and_fwd_flag:
              type: string
              description: Store and forward flag
              example: "N"
            trip_duration:
              type: integer
              description: Trip duration in seconds
              example: 900
    responses:
      201:
        description: Trip successfully created
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Trip added"
      400:
        description: Invalid input data
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Validation error message"
    """
    data = request.get_json()
    try:
        trip = TripRecord.model_validate(data).model_dump(mode="json")
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    g.storage.save_trip(trip)
    return jsonify({"message": "Trip added"}), 201


@app.route("/trips", methods=["GET"])
def list_trips():
    """Get all trip records
    ---
    tags:
      - Trips
    summary: Retrieve all trip records
    description: Returns a list of all trip records in the database
    responses:
      200:
        description: List of trips successfully retrieved
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                description: Trip ID
                example: "id12345"
              vendor_id:
                type: integer
                description: Vendor identifier
                example: 1
              pickup_datetime:
                type: string
                format: date-time
                description: Pickup timestamp
                example: "2023-01-15T10:30:00"
              dropoff_datetime:
                type: string
                format: date-time
                description: Dropoff timestamp
                example: "2023-01-15T10:45:00"
              passenger_count:
                type: integer
                description: Number of passengers
                example: 2
              pickup_longitude:
                type: number
                format: float
                description: Pickup location longitude
                example: -73.935242
              pickup_latitude:
                type: number
                format: float
                description: Pickup location latitude
                example: 40.730610
              dropoff_longitude:
                type: number
                format: float
                description: Dropoff location longitude
                example: -73.925242
              dropoff_latitude:
                type: number
                format: float
                description: Dropoff location latitude
                example: 40.740610
              store_and_fwd_flag:
                type: string
                description: Store and forward flag
                example: "N"
              trip_duration:
                type: integer
                description: Trip duration in seconds
                example: 900
    """
    trips = g.storage.list_trips()
    # for i in range(4):
    # print(trips[i])
    return jsonify(trips)

# Example /trips/<id> endpoint


@app.route("/trips/<trip_id>", methods=["GET"])
def get_trip(trip_id):
    """Get a specific trip by ID
    ---
    tags:
      - Trips
    summary: Retrieve a specific trip record
    description: Returns a single trip record by its ID
    parameters:
      - in: path
        name: trip_id
        type: string
        required: true
        description: The ID of the trip to retrieve
        example: "id12345"
    responses:
      200:
        description: Trip successfully retrieved
        schema:
          type: object
          properties:
            id:
              type: string
              description: Trip ID
              example: "id12345"
            vendor_id:
              type: integer
              description: Vendor identifier
              example: 1
            pickup_datetime:
              type: string
              format: date-time
              description: Pickup timestamp
              example: "2023-01-15T10:30:00"
            dropoff_datetime:
              type: string
              format: date-time
              description: Dropoff timestamp
              example: "2023-01-15T10:45:00"
            passenger_count:
              type: integer
              description: Number of passengers
              example: 2
            pickup_longitude:
              type: number
              format: float
              description: Pickup location longitude
              example: -73.935242
            pickup_latitude:
              type: number
              format: float
              description: Pickup location latitude
              example: 40.730610
            dropoff_longitude:
              type: number
              format: float
              description: Dropoff location longitude
              example: -73.925242
            dropoff_latitude:
              type: number
              format: float
              description: Dropoff location latitude
              example: 40.740610
            store_and_fwd_flag:
              type: string
              description: Store and forward flag
              example: "N"
            trip_duration:
              type: integer
              description: Trip duration in seconds
              example: 900
      404:
        description: Trip not found
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Trip not found"
    """
    trip = g.storage.get_trip(trip_id)
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    return jsonify(trip)
