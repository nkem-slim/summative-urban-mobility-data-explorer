# NYC Urban Mobility Data Explorer - Frontend

A comprehensive React-based dashboard for exploring and analyzing NYC urban mobility data. This frontend application provides interactive visualizations, filtering capabilities, and detailed data exploration tools.

## Features

### 🏠 Dashboard Overview

- **Key Metrics**: Total trips, revenue, average fare, distance, duration, speed
- **Interactive Charts**: Hourly trip distribution, borough analysis, payment methods
- **Real-time Updates**: Auto-refresh capabilities with configurable intervals

### 📊 Data Table

- **Advanced Filtering**: Filter by date range, fare, distance, passenger count, boroughs, payment types
- **Sorting**: Sort by any column (pickup time, fare, distance, etc.)
- **Pagination**: Configurable page sizes (25, 50, 100 records)
- **Search**: Real-time search across trip data
- **Export**: Download filtered data as CSV or JSON

### 🗺️ Map Visualization

- **Multiple Views**: Heat map, trip points, route visualization
- **Interactive Controls**: Toggle pickup/dropoff points, clustering options
- **Trip Details**: Click on trips for detailed information

### ⚙️ Settings & Configuration

- **Theme Options**: Light, dark, or auto theme
- **Localization**: Multiple language support
- **Data Preferences**: Date formats, currency, timezone settings
- **Export Management**: Import/export application settings

## Technology Stack

- **React 19**: Modern React with hooks and context
- **TailwindCSS**: Utility-first CSS framework
- **Chart.js**: Interactive charts and visualizations
- **React Router**: Client-side routing
- **Date-fns**: Date manipulation and formatting
- **Heroicons**: Beautiful SVG icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main application layout
│   ├── Dashboard.jsx   # Dashboard overview
│   ├── DataTable.jsx   # Data table with filtering
│   ├── MapView.jsx     # Map visualization
│   ├── Settings.jsx    # Application settings
│   ├── Chart.jsx       # Chart component
│   ├── Filters.jsx     # Filter controls
│   ├── MetricsCard.jsx # Metric display cards
│   └── LoadingSpinner.jsx
├── context/            # React context for state management
│   └── DataContext.js
├── hooks/              # Custom React hooks
│   └── useData.js
├── services/           # API and data services
│   ├── dataService.js  # Main data service
│   └── mockDataService.js # Mock data for development
├── types/              # TypeScript type definitions
│   └── index.js
├── utils/              # Utility functions
│   └── helpers.js
└── App.jsx            # Main application component
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Development Mode (uses mock data if true)
NODE_ENV=development
```

## Usage

### Dashboard

- View key metrics and KPIs
- Explore interactive charts
- Monitor trip patterns and trends

### Data Table

- Use filters to narrow down data
- Sort columns by clicking headers
- Search for specific trips
- Export filtered results

### Map View

- Visualize trip patterns geographically
- Switch between different map types
- Analyze spatial distribution

### Settings

- Customize application preferences
- Configure data export options
- Manage API connections

## API Integration

The application is designed to work with a backend API that provides:

### Endpoints

- `GET /api/trips` - Get paginated trip data with filtering
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/charts/{type}` - Get chart data
- `GET /api/filters/options` - Get available filter options
- `GET /api/export` - Export data in various formats

### Mock Data

For development and demonstration, the application includes a comprehensive mock data service that generates realistic NYC trip data with:

- 1000+ sample trips
- Realistic coordinates and timestamps
- Multiple boroughs and payment types
- Calculated derived fields (speed, fare per km, etc.)

## Customization

### Adding New Chart Types

1. Update the `ChartData` type in `src/types/index.js`
2. Add chart type to the data service
3. Create chart component in `src/components/`

### Adding New Filters

1. Update `FilterOptions` interface
2. Add filter UI in `Filters.jsx`
3. Update data service filter logic

### Styling

- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Use Tailwind utility classes throughout components

## Performance Considerations

- **Lazy Loading**: Components are loaded on demand
- **Memoization**: Expensive calculations are memoized
- **Pagination**: Large datasets are paginated
- **Debouncing**: Search inputs are debounced
- **Virtual Scrolling**: Consider for very large datasets

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ for urban mobility data exploration
