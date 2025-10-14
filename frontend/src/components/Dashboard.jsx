// Dashboard overview component
import { useMetrics, useChartData } from "../hooks/useData.jsx";
import {
  formatCurrency,
  formatNumber,
  formatDuration,
  formatSpeed,
} from "../utils/helpers.jsx";
import MetricsCard from "./MetricsCard";
import Chart from "./Chart";
import LoadingSpinner from "./LoadingSpinner";

const Dashboard = () => {
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
  } = useMetrics();
  const { fetchChartData: fetchHourlyData } = useChartData("hourly");
  const { fetchChartData: fetchBoroughData } = useChartData("borough");
  const { fetchChartData: fetchPaymentData } = useChartData("payment");

  if (metricsLoading) {
    return <LoadingSpinner />;
  }

  if (metricsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading dashboard data</div>
        <div className="text-gray-500">{metricsError}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Key metrics and insights from NYC urban mobility data
        </p>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Trips"
          value={formatNumber(metrics.totalTrips)}
          icon="trips"
          color="blue"
        />
        <MetricsCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon="revenue"
          color="green"
        />
        <MetricsCard
          title="Average Fare"
          value={formatCurrency(metrics.averageFare)}
          icon="fare"
          color="purple"
        />
        <MetricsCard
          title="Average Distance"
          value={`${metrics.averageDistance.toFixed(2)} km`}
          icon="distance"
          color="orange"
        />
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Average Duration"
          value={formatDuration(metrics.averageDuration)}
          icon="duration"
          color="indigo"
        />
        <MetricsCard
          title="Peak Hour"
          value={metrics.peakHour}
          icon="time"
          color="pink"
        />
        <MetricsCard
          title="Most Popular Borough"
          value={metrics.mostPopularBorough}
          icon="location"
          color="teal"
        />
        <MetricsCard
          title="Average Speed"
          value={formatSpeed(metrics.averageSpeed)}
          icon="speed"
          color="red"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Trips by Hour
          </h3>
          <Chart
            type="line"
            fetchData={fetchHourlyData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Trip Distribution Throughout the Day",
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Trips",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Hour of Day",
                  },
                },
              },
            }}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Trips by Borough
          </h3>
          <Chart
            type="doughnut"
            fetchData={fetchBoroughData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Trip Distribution by Borough",
                },
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Payment methods chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Methods
        </h3>
        <Chart
          type="bar"
          fetchData={fetchPaymentData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Payment Method Distribution",
              },
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Trips",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
