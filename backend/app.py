import os
from dotenv import load_dotenv
from storage.models import TripRecord
from requests_ratelimiter import LimiterSession
from storage.storage_adapters import DBStorage
from flask import Flask, jsonify, request, g
from utils.handler import handler
from flasgger import Swagger
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from utils.sort import sort_trip_records
load_dotenv()


app = Flask(__name__)

jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

CORS(app)
session = LimiterSession(per_hour=20)

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


@app.route("/login", methods=["POST"])
@handler
def login():
    """Login endpoint
    ---
    tags:
      - Authentication
    summary: Login
    description: Return object with username and token
    responses:
      200:
        description:
        schema:
        type: object
          properties:
            message:
              type: string
              example: "Vincent"
            token:
              type: string
              example: "jwt.token.example"
    """

    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if not username or not password:
        return jsonify({"message": "Bad username or password"}), 401
    access_token = create_access_token(identity=username)
    return jsonify({"username": username, "token": access_token})


@app.route("/")
@handler
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
# @jwt_required
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
# @jwt_required
@handler
def list_trips():
    """Get trip records with pagination
    ---
    tags:
      - Trips
    summary: Retrieve trip records with pagination
    description: Returns a paginated list of trip records from the database
    parameters:
      - in: query
        name: page
        type: integer
        default: 1
        minimum: 1
        description: Page number (1-based)
        example: 1
      - in: query
        name: limit
        type: integer
        default: 10
        minimum: 1
        maximum: 1000
        description: Number of trips per page
        example: 10
    responses:
      200:
        description: List of trips successfully retrieved
        schema:
          type: object
          properties:
            trips:
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
            pagination:
              type: object
              properties:
                page:
                  type: integer
                  description: Current page number
                  example: 1
                limit:
                  type: integer
                  description: Number of items per page
                  example: 10
                total:
                  type: integer
                  description: Total number of items
                  example: 100
      400:
        description: Invalid pagination parameters
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Invalid pagination parameters"
    """
    # Get pagination parameters from query string
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    sort_by = request.args.get("sort_by", None, type=str)

    # Validate parameters
    if page < 1:
        return jsonify({"error": "Page must be >= 1"}), 400
    if limit < 1 or limit > 1000:
        return jsonify({"error": "Limit must be between 1 and 1000"}), 400
  

    # Calculate offset
    offset = (page - 1) * limit

    # Get trips with pagination
    trips = g.storage.list_trips(offset=offset, limit=limit)
    sorted_trips = sort_trip_records(trips, field=sort_by)

    # For database storage
    if isinstance(g.storage, DBStorage):
        from storage.models import TripModel
        total = g.storage.db.query(TripModel).count()
    else:
        # File storage - load all and count
        all_trips = g.storage.list_trips()
        total = len(all_trips)

    response = {
        "trips": sorted_trips,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total
        }
    }

    return jsonify(response)

# Example /trips/<id> endpoint


@app.route("/trips/<trip_id>", methods=["GET"])
# @jwt_required
@handler
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
