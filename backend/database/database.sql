--We create one table for our application. This is the trips Table that contains the core transactional data. It stores details of each individual taxi ride.
--We use appropriate data types for each column to ensure data integrity and optimize storage.

CREATE TABLE trips (
    id VARCHAR(50) PRIMARY KEY, --Using the original ID from the dataset
    vendor_id INT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    dropoff_datetime DATETIME NOT NULL,
    passenger_count INT,
    pickup_longitude FLOAT,
    pickup_latitude FLOAT,
    dropoff_longitude FLOAT,
    dropoff_latitude FLOAT,
    store_and_fwd_flag CHAR(1),
    trip_duration INT,
    distance FLOAT
);

CREATE INDEX idx_vendor_id ON trips(vendor_id);
CREATE INDEX idx_pickup_datetime ON trips(pickup_datetime);
CREATE INDEX idx_dropoff_datetime ON trips(dropoff_datetime);
CREATE INDEX idx_trip_duration ON trips(trip_duration);
CREATE INDEX idx_distance ON trips(distance);

