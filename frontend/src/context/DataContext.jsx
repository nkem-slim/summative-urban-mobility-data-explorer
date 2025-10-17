// Context for managing application state
import { createContext, useContext, useReducer, useCallback } from "react";
// Note: Using plain JavaScript objects instead of TypeScript interfaces
// Types are defined in JSDoc comments in ../types/index.jsx for documentation

// Initial state
const initialState = {
  trips: [],
  metrics: null,
  filters: {
    dateRange: { start: "", end: "" },
    fareRange: { min: 0, max: 1000 },
    distanceRange: { min: 0, max: 100 },
    passengerCount: [],
    boroughs: [],
    paymentTypes: [],
    vendors: [],
  },
  sort: { field: "pickupDateTime", direction: "desc" },
  pagination: { page: 1, pageSize: 50, total: 0 },
  loading: false,
  error: null,
  filterOptions: {
    boroughs: [],
    paymentTypes: [],
    vendors: [],
    dateRange: { min: "", max: "" },
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_TRIPS: "SET_TRIPS",
  SET_METRICS: "SET_METRICS",
  SET_FILTERS: "SET_FILTERS",
  SET_SORT: "SET_SORT",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTER_OPTIONS: "SET_FILTER_OPTIONS",
  RESET_FILTERS: "RESET_FILTERS",
  UPDATE_FILTER: "UPDATE_FILTER",
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.SET_TRIPS:
      return {
        ...state,
        trips: action.payload.data,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };

    case ActionTypes.SET_METRICS:
      return { ...state, metrics: action.payload, loading: false };

    case ActionTypes.SET_FILTERS:
      return { ...state, filters: action.payload };

    case ActionTypes.SET_SORT:
      return { ...state, sort: action.payload };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case ActionTypes.SET_FILTER_OPTIONS:
      return { ...state, filterOptions: action.payload };

    case ActionTypes.RESET_FILTERS:
      return { ...state, filters: initialState.filters };

    case ActionTypes.UPDATE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };

    default:
      return state;
  }
};

// Context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const setTrips = useCallback((tripsData) => {
    dispatch({ type: ActionTypes.SET_TRIPS, payload: tripsData });
  }, []);

  const setMetrics = useCallback((metrics) => {
    dispatch({ type: ActionTypes.SET_METRICS, payload: metrics });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  }, []);

  const setSort = useCallback((sort) => {
    dispatch({ type: ActionTypes.SET_SORT, payload: sort });
  }, []);

  const setPagination = useCallback((pagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });
  }, []);

  const setFilterOptions = useCallback((filterOptions) => {
    dispatch({ type: ActionTypes.SET_FILTER_OPTIONS, payload: filterOptions });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_FILTERS });
  }, []);

  const updateFilter = useCallback((key, value) => {
    dispatch({ type: ActionTypes.UPDATE_FILTER, payload: { key, value } });
  }, []);

  const value = {
    ...state,
    setLoading,
    setError,
    setTrips,
    setMetrics,
    setFilters,
    setSort,
    setPagination,
    setFilterOptions,
    resetFilters,
    updateFilter,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataContext;
