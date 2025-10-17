// Map view component for visualizing trip data
import { useState, useEffect } from "react";
import { useTrips } from "../hooks/useData.jsx";
import LoadingSpinner from "./LoadingSpinner";

const MapView = () => {
  const { trips, loading, error } = useTrips();
  const [mapType, setMapType] = useState("heatmap");
  const [selectedTrip, setSelectedTrip] = useState(null);

  if (loading) {
    return <LoadingSpinner size="large" className="py-12" />;
  }

  // Don't return early on error - show the map structure with empty state

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Map View</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize trip patterns and locations on an interactive map
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={mapType}
            onChange={(e) => setMapType(e.target.value)}
            className="input-field"
          >
            <option value="heatmap">Heat Map</option>
            <option value="points">Trip Points</option>
            <option value="routes">Trip Routes</option>
          </select>
        </div>
      </div>

      {/* Map container */}
      <div className="card">
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            {error ? (
              <>
                <div className="text-gray-500 text-lg mb-2">
                  Nothing to show now
                </div>
                <p className="text-sm text-gray-400">
                  Endpoint development in progress...
                </p>
              </>
            ) : (
              <>
                <div className="text-gray-500 mb-2">
                  {mapType === "heatmap" && "🗺️ Heat Map Visualization"}
                  {mapType === "points" && "📍 Trip Points Visualization"}
                  {mapType === "routes" && "🛣️ Trip Routes Visualization"}
                </div>
                <p className="text-sm text-gray-400">
                  Interactive map component would be integrated here
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Showing {trips.length} trips
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Map Statistics
          </h3>
          <div className="space-y-3">
            {error ? (
              <div className="text-center py-4">
                <div className="text-gray-500 text-sm">Nothing to show now</div>
                <div className="text-gray-400 text-xs mt-1">
                  Endpoint development in progress...
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Trips</span>
                  <span className="text-sm font-medium">{trips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Average Distance
                  </span>
                  <span className="text-sm font-medium">
                    {trips.length > 0
                      ? (
                          trips.reduce(
                            (sum, trip) => sum + (trip.distance || 0),
                            0
                          ) / trips.length
                        ).toFixed(2)
                      : "0.00"}{" "}
                    km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Average Duration
                  </span>
                  <span className="text-sm font-medium">
                    {trips.length > 0
                      ? (
                          trips.reduce(
                            (sum, trip) => sum + trip.tripDuration,
                            0
                          ) /
                          trips.length /
                          60
                        ).toFixed(1)
                      : "0.0"}{" "}
                    min
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Map Controls
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">
                Show Pickup Points
              </label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">
                Show Dropoff Points
              </label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Show Trip Routes</label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Cluster Points</label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                defaultChecked
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trip details panel */}
      {selectedTrip && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Trip Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pickup Time</p>
              <p className="text-sm font-medium">
                {selectedTrip.pickupDateTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dropoff Time</p>
              <p className="text-sm font-medium">
                {selectedTrip.dropoffDateTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-sm font-medium">
                {selectedTrip.tripDistance} km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fare</p>
              <p className="text-sm font-medium">${selectedTrip.fareAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
