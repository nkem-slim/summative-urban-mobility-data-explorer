// Mock data service for demonstration

// Generate mock trip data
const generateMockTrips = (count = 1000) => {
  const boroughs = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island",
  ];
  const paymentTypes = [
    "Credit card",
    "Cash",
    "No charge",
    "Dispute",
    "Unknown",
    "Voided trip",
  ];
  const vendors = ["VTS", "CMT", "DDS"];

  const trips = [];

  for (let i = 0; i < count; i++) {
    const pickupTime = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)
    );
    const duration = Math.floor(Math.random() * 120) + 5; // 5-125 minutes
    const dropoffTime = new Date(pickupTime.getTime() + duration * 60000);

    const trip = {
      id: `trip_${i + 1}`,
      pickupDateTime: pickupTime.toISOString(),
      dropoffDateTime: dropoffTime.toISOString(),
      passengerCount: Math.floor(Math.random() * 6) + 1,
      tripDistance: Math.random() * 50 + 0.5, // 0.5-50.5 km
      pickupLongitude: -74.0 + Math.random() * 0.1,
      pickupLatitude: 40.7 + Math.random() * 0.1,
      dropoffLongitude: -74.0 + Math.random() * 0.1,
      dropoffLatitude: 40.7 + Math.random() * 0.1,
      fareAmount: Math.random() * 100 + 2.5, // $2.5-$102.5
      tipAmount: Math.random() * 20,
      tollsAmount: Math.random() * 10,
      totalAmount: 0, // Will be calculated
      paymentType:
        paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
      vendorId: vendors[Math.floor(Math.random() * vendors.length)],
      rateCodeId: "1",
      storeAndFwdFlag: "N",
      tripDuration: duration,
      averageSpeed: 0, // Will be calculated
      farePerKm: 0, // Will be calculated
      idleTime: Math.random() * 10,
      pickupBorough: boroughs[Math.floor(Math.random() * boroughs.length)],
      dropoffBorough: boroughs[Math.floor(Math.random() * boroughs.length)],
    };

    // Calculate derived fields
    trip.totalAmount = trip.fareAmount + trip.tipAmount + trip.tollsAmount;
    trip.averageSpeed = (trip.tripDistance / trip.tripDuration) * 60;
    trip.farePerKm = trip.fareAmount / trip.tripDistance;

    trips.push(trip);
  }

  return trips;
};

// Mock API responses
const mockTrips = generateMockTrips(1000);

const mockDataService = {
  /**
   * Get trips with filtering, sorting, and pagination
   * @param {Object} filters - Filter options
   * @param {Object} sort - Sort options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Trip data with pagination
   */
  async getTrips(
    filters = {},
    sort = { field: "pickupDateTime", direction: "desc" },
    pagination = { page: 1, pageSize: 50 }
  ) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Apply filters (simplified)
    let filteredTrips = [...mockTrips];

    if (filters.dateRange?.start) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.pickupDateTime >= filters.dateRange.start
      );
    }
    if (filters.dateRange?.end) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.pickupDateTime <= filters.dateRange.end
      );
    }
    if (filters.fareRange?.min !== undefined) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.fareAmount >= filters.fareRange.min
      );
    }
    if (filters.fareRange?.max !== undefined) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.fareAmount <= filters.fareRange.max
      );
    }
    if (filters.boroughs?.length > 0) {
      filteredTrips = filteredTrips.filter(
        (trip) =>
          filters.boroughs.includes(trip.pickupBorough) ||
          filters.boroughs.includes(trip.dropoffBorough)
      );
    }

    // Apply sorting
    filteredTrips.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

    return {
      data: paginatedTrips,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredTrips.length,
      },
      filters,
    };
  },

  /**
   * Get dashboard metrics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Dashboard metrics
   */
  async getDashboardMetrics(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredTrips = [...mockTrips];

    // Apply same filters as getTrips
    if (filters.dateRange?.start) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.pickupDateTime >= filters.dateRange.start
      );
    }
    if (filters.dateRange?.end) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.pickupDateTime <= filters.dateRange.end
      );
    }

    const metrics = {
      totalTrips: filteredTrips.length,
      totalRevenue: filteredTrips.reduce(
        (sum, trip) => sum + trip.totalAmount,
        0
      ),
      averageFare:
        filteredTrips.reduce((sum, trip) => sum + trip.fareAmount, 0) /
        filteredTrips.length,
      averageDistance:
        filteredTrips.reduce((sum, trip) => sum + trip.tripDistance, 0) /
        filteredTrips.length,
      averageDuration:
        filteredTrips.reduce((sum, trip) => sum + trip.tripDuration, 0) /
        filteredTrips.length,
      peakHour: "14:00",
      mostPopularBorough: "Manhattan",
      averageSpeed:
        filteredTrips.reduce((sum, trip) => sum + trip.averageSpeed, 0) /
        filteredTrips.length,
    };

    return metrics;
  },

  /**
   * Get chart data for different visualizations
   * @param {string} chartType - Chart type
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Chart data
   */
  async getChartData(chartType, filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let filteredTrips = [...mockTrips];

    // Apply filters
    if (filters.dateRange?.start) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.pickupDateTime >= filters.dateRange.start
      );
    }
    if (filters.dateRange?.end) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.pickupDateTime <= filters.dateRange.end
      );
    }

    switch (chartType) {
      case "hourly":
        const hourlyData = Array(24).fill(0);
        filteredTrips.forEach((trip) => {
          const hour = new Date(trip.pickupDateTime).getHours();
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

      case "borough":
        const boroughCounts = {};
        filteredTrips.forEach((trip) => {
          boroughCounts[trip.pickupBorough] =
            (boroughCounts[trip.pickupBorough] || 0) + 1;
        });
        return {
          labels: Object.keys(boroughCounts),
          datasets: [
            {
              data: Object.values(boroughCounts),
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

      case "payment":
        const paymentCounts = {};
        filteredTrips.forEach((trip) => {
          paymentCounts[trip.paymentType] =
            (paymentCounts[trip.paymentType] || 0) + 1;
        });
        return {
          labels: Object.keys(paymentCounts),
          datasets: [
            {
              label: "Payment Methods",
              data: Object.values(paymentCounts),
              backgroundColor: "#3B82F6",
            },
          ],
        };

      default:
        return { labels: [], datasets: [] };
    }
  },

  /**
   * Get available filter options
   * @returns {Promise<Object>} Filter options
   */
  async getFilterOptions() {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const boroughs = [...new Set(mockTrips.map((trip) => trip.pickupBorough))];
    const paymentTypes = [
      ...new Set(mockTrips.map((trip) => trip.paymentType)),
    ];
    const vendors = [...new Set(mockTrips.map((trip) => trip.vendorId))];

    return {
      boroughs,
      paymentTypes,
      vendors,
      dateRange: {
        min: "2024-01-01",
        max: "2024-12-31",
      },
    };
  },

  /**
   * Export data
   * @param {string} format - Export format
   * @param {Object} filters - Filter options
   * @param {Object} sort - Sort options
   * @returns {Promise<Blob>} Exported data
   */
  async exportData(
    format,
    filters = {},
    sort = { field: "pickupDateTime", direction: "desc" }
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This would return actual file data in a real implementation
    return new Blob(["Mock export data"], { type: "text/plain" });
  },
};

export default mockDataService;
