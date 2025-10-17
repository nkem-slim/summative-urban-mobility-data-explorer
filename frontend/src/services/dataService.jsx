// Data service for API communication
// Now using real API data
// Note: Using plain JavaScript objects instead of TypeScript interfaces
// Types are defined in JSDoc comments in ../types/index.jsx for documentation

const API_BASE_URL = "http://167.99.192.151:8000";
// Using real API data
const USE_MOCK_DATA = false;

class DataService {
  /**
   * Make HTTP request to API (commented out for now - using mock data)
   * @param {string} endpoint - API endpoint
   * @param {RequestInit} options - Request options
   * @returns {Promise<any>} Response data
   */
  async makeRequest(endpoint) {
    const url = `${endpoint}`;
    console.log(url);
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     ...options.headers,
    //   },
    //   ...options,
    // };

    try {
      // const response = await fetch(url, config);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * Get trips with filtering, sorting, and pagination
   * @param {Partial<FilterOptions>} filters - Filter options
   * @param {SortOptions} sort - Sort options
   * @param {Partial<PaginationOptions>} pagination - Pagination options
   * @returns {Promise<ApiResponse<TripRecord[]>>} Trip data
   */
  async getTrips(
    filters = {},
    sort = { field: "pickup_datetime", direction: "desc" },
    pagination = { page: 1, pageSize: 50 }
  ) {
    if (USE_MOCK_DATA) {
      // Fallback to mock data if needed
      const mockDataService = await import("./mockDataService.jsx");
      return mockDataService.default.getTrips(filters, sort, pagination);
    }

    // Build query parameters
    const params = new URLSearchParams({
      ...this.buildFilterParams(filters),
      sortField: sort.field,
      sortDirection: sort.direction,
      page: pagination.page?.toString() || "1",
      limit: pagination.pageSize?.toString() || "50",
    });

    const response = await this.makeRequest(`${API_BASE_URL}/trips?${params}`);

    // Transform API response to match expected format
    // The API returns an array directly, not wrapped in an object
    const trips = Array.isArray(response) ? response : response.trips || [];

    return {
      data: trips,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: trips.length,
      },
      filters,
    };
  }

  /**
   * Get dashboard metrics
   * @param {Partial<FilterOptions>} filters - Filter options
   * @returns {Promise<DashboardMetrics>} Dashboard metrics
   */
  async getDashboardMetrics(filters = {}) {
    if (USE_MOCK_DATA) {
      // Fallback to mock data if needed
      const mockDataService = await import("./mockDataService.jsx");
      return mockDataService.default.getDashboardMetrics(filters);
    }

    // Get all trips data to calculate metrics
    const response = await this.makeRequest(`${API_BASE_URL}/trips`);
    const trips = Array.isArray(response) ? response : response.trips || [];

    // Calculate metrics from actual API response data only
    const totalTrips = trips.length;

    // Calculate total and average distance using the distance field from API
    const totalDistance = trips.reduce((sum, trip) => {
      return sum + (trip.distance || 0);
    }, 0);
    const averageDistance = totalTrips > 0 ? totalDistance / totalTrips : 0;

    // Calculate average duration using tripDuration from API
    const totalDuration = trips.reduce(
      (sum, trip) => sum + trip.tripDuration,
      0
    );
    const averageDuration = totalTrips > 0 ? totalDuration / totalTrips : 0;

    // Find peak hour using pickupDatetime from API
    const hourlyCounts = Array(24).fill(0);
    trips.forEach((trip) => {
      const hour = new Date(trip.pickupDatetime).getHours();
      hourlyCounts[hour]++;
    });
    const peakHourIndex = hourlyCounts.indexOf(Math.max(...hourlyCounts));
    const peakHour = `${peakHourIndex.toString().padStart(2, "0")}:00`;

    // Count unique vendors using vendorId from API
    const uniqueVendors = new Set(trips.map((trip) => trip.vendorId));
    const totalVendors = uniqueVendors.size;

    // Find min and max passenger counts using passengerCount from API
    const passengerCounts = trips.map((trip) => trip.passengerCount);
    const maxPassengers = Math.max(...passengerCounts);
    const minPassengers = Math.min(...passengerCounts);

    return {
      totalTrips,
      totalDistance,
      averageDistance,
      averageDuration,
      peakHour,
      totalVendors,
      maxPassengers,
      minPassengers,
    };
  }

  /**
   * Get chart data for different visualizations
   * @param {'hourly'|'daily'|'borough'|'payment'|'distance'} chartType - Chart type
   * @param {Partial<FilterOptions>} filters - Filter options
   * @returns {Promise<any>} Chart data
   */
  async getChartData(chartType, filters = {}) {
    if (USE_MOCK_DATA) {
      // Fallback to mock data if needed
      const mockDataService = await import("./mockDataService.jsx");
      return mockDataService.default.getChartData(chartType, filters);
    }

    // Get trips data
    const response = await this.makeRequest(`${API_BASE_URL}/trips`);
    const trips = Array.isArray(response) ? response : response.trips || [];

    switch (chartType) {
      case "hourly": {
        const hourlyData = Array(24).fill(0);
        trips.forEach((trip) => {
          const hour = new Date(trip.pickupDatetime).getHours();
          hourlyData[hour]++;
        });
        return {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: [
            {
              label: "Trips",
              data: hourlyData,
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
            },
          ],
        };
      }

      case "borough": {
        // For now, use vendor_id as a proxy for borough since we don't have borough data
        const vendorCounts = {};
        trips.forEach((trip) => {
          const vendor = `Vendor ${trip.vendorId}`;
          vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
        });
        return {
          labels: Object.keys(vendorCounts),
          datasets: [
            {
              data: Object.values(vendorCounts),
              backgroundColor: [
                "#3B82F6",
                "#EF4444",
                "#10B981",
                "#F59E0B",
                "#8B5CF6",
              ],
            },
          ],
        };
      }

      case "payment": {
        // Use passenger count as a proxy for payment method since we don't have payment data
        const passengerCounts = {};
        trips.forEach((trip) => {
          const passengers = `${trip.passengerCount} passenger${
            trip.passengerCount > 1 ? "s" : ""
          }`;
          passengerCounts[passengers] = (passengerCounts[passengers] || 0) + 1;
        });
        return {
          labels: Object.keys(passengerCounts),
          datasets: [
            {
              label: "Passenger Count",
              data: Object.values(passengerCounts),
              backgroundColor: "#3B82F6",
            },
          ],
        };
      }

      default:
        return { labels: [], datasets: [] };
    }
  }

  /**
   * Get single trip details
   * @param {string} id - Trip ID
   * @returns {Promise<TripRecord>} Trip data
   */
  async getTripById(id) {
    if (USE_MOCK_DATA) {
      // Fallback to mock data if needed
      const mockDataService = await import("./mockDataService.jsx");
      const mockTrips = await mockDataService.default.getTrips(
        {},
        { field: "pickup_datetime", direction: "desc" },
        { page: 1, pageSize: 1000 }
      );
      const trip = mockTrips.data.find((t) => t.id === id);
      if (!trip) {
        throw new Error(`Trip with ID ${id} not found`);
      }
      return trip;
    }

    // Get trip from API
    const response = await this.makeRequest(`${API_BASE_URL}/trips`);
    const trips = Array.isArray(response) ? response : response.trips || [];
    const trip = trips.find((t) => t.id === id);
    if (!trip) {
      throw new Error(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  /**
   * Get available filter options
   * @returns {Promise<{boroughs: string[], paymentTypes: string[], vendors: string[], dateRange: {min: string, max: string}}>} Filter options
   */
  async getFilterOptions() {
    if (USE_MOCK_DATA) {
      // Fallback to mock data if needed
      const mockDataService = await import("./mockDataService.jsx");
      return mockDataService.default.getFilterOptions();
    }

    // Get trips data to extract filter options
    const response = await this.makeRequest(`${API_BASE_URL}/trips`);
    const trips = Array.isArray(response) ? response : response.trips || [];

    const vendors = [...new Set(trips.map((trip) => trip.vendorId))];
    const passengerCounts = [
      ...new Set(trips.map((trip) => trip.passengerCount)),
    ];

    // Get date range from trips
    const dates = trips.map((trip) => new Date(trip.pickupDatetime));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return {
      boroughs: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"], // Default boroughs
      paymentTypes: [
        "Credit card",
        "Cash",
        "No charge",
        "Dispute",
        "Unknown",
        "Voided trip",
      ], // Default payment types
      vendors: vendors.map((v) => `Vendor ${v}`),
      passengerCounts: passengerCounts.sort((a, b) => a - b),
      dateRange: {
        min: minDate.toISOString().split("T")[0],
        max: maxDate.toISOString().split("T")[0],
      },
    };
  }

  /**
   * Export data
   * @param {'csv'|'json'} format - Export format
   * @param {Partial<FilterOptions>} filters - Filter options
   * @param {SortOptions} sort - Sort options
   * @returns {Promise<Blob>} Exported data
   */
  async exportData(
    format,
    filters = {},
    sort = { field: "pickup_datetime", direction: "desc" }
  ) {
    if (USE_MOCK_DATA) {
      // Fallback to mock data if needed
      const mockDataService = await import("./mockDataService.jsx");
      return mockDataService.default.exportData(format, filters, sort);
    }

    // Get trips data
    const response = await this.makeRequest(`${API_BASE_URL}/trips`);
    const trips = Array.isArray(response) ? response : response.trips || [];

    if (format === "json") {
      return new Blob([JSON.stringify(trips, null, 2)], {
        type: "application/json",
      });
    } else if (format === "csv") {
      // Convert to CSV
      const headers = Object.keys(trips[0] || {});
      const csvContent = [
        headers.join(","),
        ...trips.map((trip) =>
          headers.map((header) => trip[header] || "").join(",")
        ),
      ].join("\n");
      return new Blob([csvContent], { type: "text/csv" });
    }

    throw new Error(`Unsupported export format: ${format}`);
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Degrees to convert
   * @returns {number} Radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Helper method to build filter parameters
   * @param {Partial<FilterOptions>} filters - Filter options
   * @returns {Record<string, string>} URL parameters
   */
  buildFilterParams(filters) {
    const params = {};

    if (filters.dateRange) {
      if (filters.dateRange.start) params.startDate = filters.dateRange.start;
      if (filters.dateRange.end) params.endDate = filters.dateRange.end;
    }

    if (filters.fareRange) {
      if (filters.fareRange.min !== undefined)
        params.minFare = filters.fareRange.min.toString();
      if (filters.fareRange.max !== undefined)
        params.maxFare = filters.fareRange.max.toString();
    }

    if (filters.distanceRange) {
      if (filters.distanceRange.min !== undefined)
        params.minDistance = filters.distanceRange.min.toString();
      if (filters.distanceRange.max !== undefined)
        params.maxDistance = filters.distanceRange.max.toString();
    }

    if (filters.passengerCount && filters.passengerCount.length > 0) {
      params.passengerCount = filters.passengerCount.join(",");
    }

    if (filters.boroughs && filters.boroughs.length > 0) {
      params.boroughs = filters.boroughs.join(",");
    }

    if (filters.paymentTypes && filters.paymentTypes.length > 0) {
      params.paymentTypes = filters.paymentTypes.join(",");
    }

    if (filters.vendors && filters.vendors.length > 0) {
      params.vendors = filters.vendors.join(",");
    }

    return params;
  }
}

export const dataService = new DataService();
export default dataService;
