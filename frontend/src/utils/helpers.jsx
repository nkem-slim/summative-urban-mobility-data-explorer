// Utility functions for the NYC Urban Mobility Data Explorer

import { format, parseISO, isValid } from "date-fns";

// Format currency values
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format distance values
export const formatDistance = (distance) => {
  return `${distance.toFixed(2)} km`;
};

// Format duration values
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Format speed values
export const formatSpeed = (speed) => {
  return `${speed.toFixed(1)} km/h`;
};

// Format date and time
export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid Date";
    return format(date, "MMM dd, yyyy HH:mm");
  } catch (error) {
    return "Invalid Date";
  }
};

// Format date only
export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid Date";
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

// Format time only
export const formatTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid Time";
    return format(date, "HH:mm");
  } catch (error) {
    return "Invalid Time";
  }
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate trip duration in minutes
export const calculateDuration = (pickupTime, dropoffTime) => {
  try {
    const pickup = parseISO(pickupTime);
    const dropoff = parseISO(dropoffTime);

    if (!isValid(pickup) || !isValid(dropoff)) return 0;

    return (dropoff - pickup) / (1000 * 60); // Convert to minutes
  } catch (error) {
    return 0;
  }
};

// Calculate average speed
export const calculateAverageSpeed = (distance, duration) => {
  if (duration <= 0) return 0;
  return (distance / duration) * 60; // km/h
};

// Calculate fare per kilometer
export const calculateFarePerKm = (fare, distance) => {
  if (distance <= 0) return 0;
  return fare / distance;
};

// Generate color palette for charts
export const generateColors = (count) => {
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
    "#8B5A2B",
    "#059669",
    "#DC2626",
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format large numbers with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Get borough name from coordinates (simplified)
export const getBoroughFromCoordinates = (lat, lon) => {
  // This is a simplified implementation
  // In a real application, you would use a proper geocoding service

  const boroughs = [
    {
      name: "Manhattan",
      bounds: {
        north: 40.8176,
        south: 40.7047,
        east: -73.9442,
        west: -74.0479,
      },
    },
    {
      name: "Brooklyn",
      bounds: {
        north: 40.7395,
        south: 40.5707,
        east: -73.8332,
        west: -74.0421,
      },
    },
    {
      name: "Queens",
      bounds: {
        north: 40.8008,
        south: 40.5431,
        east: -73.7004,
        west: -74.0421,
      },
    },
    {
      name: "Bronx",
      bounds: {
        north: 40.9176,
        south: 40.7855,
        east: -73.7654,
        west: -73.9339,
      },
    },
    {
      name: "Staten Island",
      bounds: {
        north: 40.6514,
        south: 40.4774,
        east: -74.0421,
        west: -74.2591,
      },
    },
  ];

  for (const borough of boroughs) {
    if (
      lat >= borough.bounds.south &&
      lat <= borough.bounds.north &&
      lon >= borough.bounds.west &&
      lon <= borough.bounds.east
    ) {
      return borough.name;
    }
  }

  return "Unknown";
};

// Sort array of objects by field
export const sortByField = (array, field, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter array of objects by multiple criteria
export const filterArray = (array, filters) => {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true;

      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }

      if (
        typeof value === "object" &&
        value.min !== undefined &&
        value.max !== undefined
      ) {
        return item[key] >= value.min && item[key] <= value.max;
      }

      return item[key] === value;
    });
  });
};
