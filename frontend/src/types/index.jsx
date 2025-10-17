// Types for NYC Urban Mobility Data Explorer

/**
 * @typedef {Object} TripRecord
 * @property {string} id
 * @property {string} pickupDateTime
 * @property {string} dropoffDateTime
 * @property {number} passengerCount
 * @property {number} tripDistance
 * @property {number} pickupLongitude
 * @property {number} pickupLatitude
 * @property {number} dropoffLongitude
 * @property {number} dropoffLatitude
 * @property {number} fareAmount
 * @property {number} tipAmount
 * @property {number} tollsAmount
 * @property {number} totalAmount
 * @property {string} paymentType
 * @property {string} vendorId
 * @property {string} rateCodeId
 * @property {string} storeAndFwdFlag
 * @property {number} tripDuration - Duration in minutes
 * @property {number} averageSpeed - Speed in km/h
 * @property {number} farePerKm
 * @property {number} idleTime - Idle time in minutes
 * @property {string} [pickupBorough] - Optional pickup borough
 * @property {string} [dropoffBorough] - Optional dropoff borough
 */

/**
 * @typedef {Object} FilterOptions
 * @property {Object} dateRange
 * @property {string} dateRange.start
 * @property {string} dateRange.end
 * @property {Object} fareRange
 * @property {number} fareRange.min
 * @property {number} fareRange.max
 * @property {Object} distanceRange
 * @property {number} distanceRange.min
 * @property {number} distanceRange.max
 * @property {number[]} passengerCount
 * @property {string[]} boroughs
 * @property {string[]} paymentTypes
 * @property {string[]} vendors
 */

/**
 * @typedef {Object} SortOptions
 * @property {keyof TripRecord} field
 * @property {'asc'|'desc'} direction
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} page
 * @property {number} pageSize
 * @property {number} total
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {number} totalTrips
 * @property {number} totalRevenue
 * @property {number} averageFare
 * @property {number} averageDistance
 * @property {number} averageDuration
 * @property {string} peakHour
 * @property {string} mostPopularBorough
 * @property {number} averageSpeed
 */

/**
 * @typedef {Object} ChartData
 * @property {string[]} labels
 * @property {Object[]} datasets
 * @property {string} datasets[].label
 * @property {number[]} datasets[].data
 * @property {string|string[]} [datasets[].backgroundColor]
 * @property {string|string[]} [datasets[].borderColor]
 * @property {number} [datasets[].borderWidth]
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {T} data
 * @property {PaginationOptions} pagination
 * @property {FilterOptions} filters
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {string} code
 * @property {*} [details]
 */

// Export empty object to make this a valid module
export {};
