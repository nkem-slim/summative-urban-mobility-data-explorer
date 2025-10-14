// Settings component for application configuration
import { useState } from "react";
import { useDataExport } from "../hooks/useData.jsx";

const Settings = () => {
  const { exportData } = useDataExport();
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    dateFormat: "MMM dd, yyyy",
    currency: "USD",
    timezone: "America/New_York",
    autoRefresh: true,
    refreshInterval: 30,
    defaultPageSize: 50,
    showTooltips: true,
    enableNotifications: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nyc-mobility-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings((prev) => ({ ...prev, ...importedSettings }));
        } catch (error) {
          alert("Error importing settings file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your application preferences and data export options
        </p>
      </div>

      {/* General Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          General Settings
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
              className="input-field"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) =>
                handleSettingChange("dateFormat", e.target.value)
              }
              className="input-field"
            >
              <option value="MMM dd, yyyy">Jan 01, 2024</option>
              <option value="dd/MM/yyyy">01/01/2024</option>
              <option value="yyyy-MM-dd">2024-01-01</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="input-field"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Page Size
            </label>
            <select
              value={settings.defaultPageSize}
              onChange={(e) =>
                handleSettingChange("defaultPageSize", parseInt(e.target.value))
              }
              className="input-field"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Data Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Auto Refresh
              </label>
              <p className="text-sm text-gray-500">
                Automatically refresh data at regular intervals
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) =>
                handleSettingChange("autoRefresh", e.target.checked)
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          {settings.autoRefresh && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={settings.refreshInterval}
                onChange={(e) =>
                  handleSettingChange(
                    "refreshInterval",
                    parseInt(e.target.value)
                  )
                }
                className="input-field"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Show Tooltips
              </label>
              <p className="text-sm text-gray-500">
                Display helpful tooltips throughout the application
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showTooltips}
              onChange={(e) =>
                handleSettingChange("showTooltips", e.target.checked)
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enable Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications for important updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) =>
                handleSettingChange("enableNotifications", e.target.checked)
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Export/Import Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Settings Management
        </h3>
        <div className="flex items-center space-x-4">
          <button onClick={handleExportSettings} className="btn-primary">
            Export Settings
          </button>
          <label className="btn-secondary cursor-pointer">
            Import Settings
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Data Export */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Export your filtered data in various formats for further analysis.
          </p>
          <div className="flex items-center space-x-4">
            <button onClick={() => exportData("csv")} className="btn-primary">
              Export as CSV
            </button>
            <button
              onClick={() => exportData("json")}
              className="btn-secondary"
            >
              Export as JSON
            </button>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            {/* <input
              type="url"
              value={
                process.env.REACT_APP_API_URL || "http://localhost:5000/api"
              }
              disabled
              className="input-field bg-gray-50"
            /> */}
            <p className="text-sm text-gray-500 mt-1">
              Configure this in your environment variables
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
