// Main App component with routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext.jsx";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import DataTable from "./components/DataTable";
import MapView from "./components/MapView";
import Settings from "./components/Settings";

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/table" element={<DataTable />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
