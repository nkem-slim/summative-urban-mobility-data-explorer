// Filters component for data filtering
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext.jsx";
import { useFilterOptions } from "../hooks/useData.jsx";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Filters = () => {
  const { filters, updateFilter, resetFilters } = useData();
  const { filterOptions } = useFilterOptions();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    updateFilter(key, value);
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...localFilters.dateRange, [field]: value };
    handleFilterChange("dateRange", newDateRange);
  };

  const handleRangeChange = (key, field, value) => {
    const newRange = { ...localFilters[key], [field]: value };
    handleFilterChange(key, newRange);
  };

  const handleArrayChange = (key, value, checked) => {
    const currentArray = localFilters[key] || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    handleFilterChange(key, newArray);
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({
      dateRange: { start: "", end: "" },
      fareRange: { min: 0, max: 1000 },
      distanceRange: { min: 0, max: 100 },
      passengerCount: [],
      boroughs: [],
      paymentTypes: [],
      vendors: [],
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.dateRange.start || localFilters.dateRange.end) count++;
    if (localFilters.fareRange.min > 0 || localFilters.fareRange.max < 1000)
      count++;
    if (
      localFilters.distanceRange.min > 0 ||
      localFilters.distanceRange.max < 100
    )
      count++;
    if (localFilters.passengerCount.length > 0) count++;
    if (localFilters.boroughs.length > 0) count++;
    if (localFilters.paymentTypes.length > 0) count++;
    if (localFilters.vendors.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {activeFilterCount} active
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Reset all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={localFilters.dateRange.start}
              onChange={(e) => handleDateRangeChange("start", e.target.value)}
              className="input-field"
              placeholder="Start date"
            />
            <input
              type="date"
              value={localFilters.dateRange.end}
              onChange={(e) => handleDateRangeChange("end", e.target.value)}
              className="input-field"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Fare Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fare Range ($)
          </label>
          <div className="space-y-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={localFilters.fareRange.min}
              onChange={(e) =>
                handleRangeChange(
                  "fareRange",
                  "min",
                  parseFloat(e.target.value) || 0
                )
              }
              className="input-field"
              placeholder="Min fare"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={localFilters.fareRange.max}
              onChange={(e) =>
                handleRangeChange(
                  "fareRange",
                  "max",
                  parseFloat(e.target.value) || 1000
                )
              }
              className="input-field"
              placeholder="Max fare"
            />
          </div>
        </div>

        {/* Distance Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance Range (km)
          </label>
          <div className="space-y-2">
            <input
              type="number"
              min="0"
              step="0.1"
              value={localFilters.distanceRange.min}
              onChange={(e) =>
                handleRangeChange(
                  "distanceRange",
                  "min",
                  parseFloat(e.target.value) || 0
                )
              }
              className="input-field"
              placeholder="Min distance"
            />
            <input
              type="number"
              min="0"
              step="0.1"
              value={localFilters.distanceRange.max}
              onChange={(e) =>
                handleRangeChange(
                  "distanceRange",
                  "max",
                  parseFloat(e.target.value) || 100
                )
              }
              className="input-field"
              placeholder="Max distance"
            />
          </div>
        </div>

        {/* Passenger Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passenger Count
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <label key={count} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.passengerCount.includes(count)}
                  onChange={(e) =>
                    handleArrayChange("passengerCount", count, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {count} passenger{count > 1 ? "s" : ""}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Boroughs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Boroughs
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {filterOptions.boroughs.map((borough) => (
              <label key={borough} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.boroughs.includes(borough)}
                  onChange={(e) =>
                    handleArrayChange("boroughs", borough, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{borough}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Types
          </label>
          <div className="space-y-2">
            {filterOptions.paymentTypes.map((paymentType) => (
              <label key={paymentType} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.paymentTypes.includes(paymentType)}
                  onChange={(e) =>
                    handleArrayChange(
                      "paymentTypes",
                      paymentType,
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {paymentType}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.dateRange.start && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                From:{" "}
                {format(new Date(localFilters.dateRange.start), "MMM dd, yyyy")}
                <button
                  onClick={() => handleDateRangeChange("start", "")}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {localFilters.dateRange.end && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                To:{" "}
                {format(new Date(localFilters.dateRange.end), "MMM dd, yyyy")}
                <button
                  onClick={() => handleDateRangeChange("end", "")}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {localFilters.boroughs.map((borough) => (
              <span
                key={borough}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {borough}
                <button
                  onClick={() => handleArrayChange("boroughs", borough, false)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
