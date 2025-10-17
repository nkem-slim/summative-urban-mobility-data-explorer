// Metrics card component
import {
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  ChartBarIcon,
  TruckIcon,
  ClockIcon as TimeIcon,
  MapIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const iconMap = {
  trips: ChartBarIcon,
  revenue: CurrencyDollarIcon,
  fare: CurrencyDollarIcon,
  distance: MapPinIcon,
  duration: ClockIcon,
  time: TimeIcon,
  location: MapIcon,
  speed: BoltIcon,
};

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
  pink: "bg-pink-500",
  teal: "bg-teal-500",
  red: "bg-red-500",
};

const MetricsCard = ({ title, value, icon, color = "blue" }) => {
  const IconComponent = iconMap[icon] || ChartBarIcon;
  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-lg p-3 ${colorClass}`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
