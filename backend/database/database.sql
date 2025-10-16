--We create one table for our application. This is the trips Table that contains the core transactional data. It stores details of each individual taxi ride.
--We use appropriate data types for each column to ensure data integrity and optimize storage.

CREATE TABLE trips (
    trip_id VARCHAR(100) PRIMARY KEY, --Using the original ID from the dataset
    vendor_id TINYINT FOREIGN KEY, --Supposed to reference the vendor table, but we don't have that table in this dataset
    pickup_datetime DATETIME NOT NULL,
    dropoff_datetime DATETIME NOT NULL,
    passenger_count TINYINT,
    pickup_longitude DECIMAL(11, 8),
    pickup_latitude DECIMAL(10, 8),
    dropoff_longitude DECIMAL(11, 8),
    dropoff_latitude DECIMAL(10, 8),
    store_and_fwd_flag CHAR(1),
    trip_duration FLOAT,
);
