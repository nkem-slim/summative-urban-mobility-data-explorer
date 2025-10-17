// Custom hooks for data management
import { useEffect, useCallback } from "react";
import { useData } from "../context/DataContext.jsx";
import { dataService } from "../services/dataService.jsx";

// Hook for managing trips data
export const useTrips = () => {
  const {
    trips,
    filters,
    sort,
    pagination,
    loading,
    error,
    setLoading,
    setError,
    setTrips,
    setPagination,
  } = useData();

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dataService.getTrips(filters, sort, pagination);
      setTrips(response);
    } catch (err) {
      setError(err.message);
    }
  }, [filters, sort, pagination, setLoading, setError, setTrips]);

  const getTrips = async () => {
    const response = await dataService.makeRequest("trips", {
      options: { limit: 50 },
    });
    console.log("API DATA");
    console.log(response.json());
  };

  useEffect(() => {
    fetchTrips();
    getTrips();
  }, [fetchTrips]);

  return {
    trips,
    loading,
    error,
    refetch: fetchTrips,
  };
};

// Hook for managing dashboard metrics
export const useMetrics = () => {
  const { metrics, filters, loading, error, setLoading, setError, setMetrics } =
    useData();

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dataService.getDashboardMetrics(filters);
      setMetrics(response);
    } catch (err) {
      setError(err.message);
    }
  }, [filters, setLoading, setError, setMetrics]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};

// Hook for managing chart data
export const useChartData = (chartType) => {
  const { filters, setError } = useData();

  const fetchChartData = useCallback(async () => {
    try {
      setError(null);
      return await dataService.getChartData(chartType, filters);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [chartType, filters, setError]);

  return {
    fetchChartData,
  };
};

// Hook for managing filter options
export const useFilterOptions = () => {
  const { filterOptions, setFilterOptions, setError } = useData();

  const fetchFilterOptions = useCallback(async () => {
    try {
      setError(null);
      const options = await dataService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      setError(err.message);
    }
  }, [setFilterOptions, setError]);

  useEffect(() => {
    if (!filterOptions.boroughs.length) {
      fetchFilterOptions();
    }
  }, [filterOptions.boroughs.length, fetchFilterOptions]);

  return {
    filterOptions,
    refetch: fetchFilterOptions,
  };
};

// Hook for data export
export const useDataExport = () => {
  const { filters, sort, setError } = useData();

  const exportData = useCallback(
    async (format = "csv") => {
      try {
        setError(null);
        const blob = await dataService.exportData(format, filters, sort);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `nyc-mobility-data.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setError(err.message);
      }
    },
    [filters, sort, setError]
  );

  return {
    exportData,
  };
};
