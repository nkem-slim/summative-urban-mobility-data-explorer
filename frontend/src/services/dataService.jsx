// Data service for API communication
// Currently using mock data while backend is being developed
// API code is commented out but preserved for future use
import mockDataService from "./mockDataService.jsx";
// Note: Using plain JavaScript objects instead of TypeScript interfaces
// Types are defined in JSDoc comments in ../types/index.jsx for documentation

const API_BASE_URL = import.meta.env.REACT_APP_API_URL;
// Force using mock data for now since backend is not ready
const USE_MOCK_DATA = true;
// const USE_MOCK_DATA =
//   import.meta.env.MODE === "development" || !import.meta.env.REACT_APP_API_URL;

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
    sort = { field: "pickupDateTime", direction: "desc" },
    pagination = { page: 1, pageSize: 50 }
  ) {
    // Using mock data for now - backend not ready
    return mockDataService.getTrips(filters, sort, pagination);

    // API code (commented out for now):
    // const params = new URLSearchParams({
    //   ...this.buildFilterParams(filters),
    //   sortField: sort.field,
    //   sortDirection: sort.direction,
    //   page: pagination.page?.toString() || "1",
    //   pageSize: pagination.pageSize?.toString() || "50",
    // });
    // return this.makeRequest(`/trips?${params}`);
  }

  /**
   * Get dashboard metrics
   * @param {Partial<FilterOptions>} filters - Filter options
   * @returns {Promise<DashboardMetrics>} Dashboard metrics
   */
  async getDashboardMetrics(filters = {}) {
    // Using mock data for now - backend not ready
    return mockDataService.getDashboardMetrics(filters);

    // API code (commented out for now):
    // const params = new URLSearchParams(this.buildFilterParams(filters));
    // return this.makeRequest(`/dashboard/metrics?${params}`);
  }

  /**
   * Get chart data for different visualizations
   * @param {'hourly'|'daily'|'borough'|'payment'|'distance'} chartType - Chart type
   * @param {Partial<FilterOptions>} filters - Filter options
   * @returns {Promise<any>} Chart data
   */
  async getChartData(chartType, filters = {}) {
    // Using mock data for now - backend not ready
    return mockDataService.getChartData(chartType, filters);

    // API code (commented out for now):
    // const params = new URLSearchParams({
    //   ...this.buildFilterParams(filters),
    //   chartType,
    // });
    // return this.makeRequest(`/charts/${chartType}?${params}`);
  }

  /**
   * Get single trip details
   * @param {string} id - Trip ID
   * @returns {Promise<TripRecord>} Trip data
   */
  async getTripById(id) {
    // Using mock data for now - backend not ready
    // For now, return a mock trip with the given ID
    const mockTrips = await mockDataService.getTrips(
      {},
      { field: "pickupDateTime", direction: "desc" },
      { page: 1, pageSize: 1000 }
    );
    const trip = mockTrips.data.find((t) => t.id === id);
    if (!trip) {
      throw new Error(`Trip with ID ${id} not found`);
    }
    return trip;

    // API code (commented out for now):
    // return this.makeRequest(`/trips/${id}`);
  }

  /**
   * Get available filter options
   * @returns {Promise<{boroughs: string[], paymentTypes: string[], vendors: string[], dateRange: {min: string, max: string}}>} Filter options
   */
  async getFilterOptions() {
    // Using mock data for now - backend not ready
    return mockDataService.getFilterOptions();

    // API code (commented out for now):
    // return this.makeRequest("/filters/options");
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
    sort = { field: "pickupDateTime", direction: "desc" }
  ) {
    // Using mock data for now - backend not ready
    return mockDataService.exportData(format, filters, sort);

    // API code (commented out for now):
    // const params = new URLSearchParams({
    //   ...this.buildFilterParams(filters),
    //   sortField: sort.field,
    //   sortDirection: sort.direction,
    //   format,
    // });
    // const response = await fetch(`${API_BASE_URL}/export?${params}`);
    // if (!response.ok) {
    //   throw new Error(`Export failed: ${response.status}`);
    // }
    // return response.blob();
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
