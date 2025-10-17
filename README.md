# Urban Mobility Data Explorer

A comprehensive full-stack application for exploring and analyzing urban mobility data, featuring a modern React frontend with interactive visualizations and real-time data exploration capabilities.

## Architecture

### Frontend Stack

- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts and visualizations
- **React Router** - Client-side routing
- **Date-fns** - Date manipulation and formatting
- **Heroicons** - Beautiful SVG icons

### Backend Integration

- **RESTful API** - Connected to external urban mobility data API
- **Real-time Data** - Live data fetching and updates
- **Data Processing** - Client-side filtering, sorting, and pagination

## Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Modern Browser** - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nkem-slim/summative-urban-mobility-data-explorer
   cd summative-urban-mobility-data-explorer
   ```

2. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Features

### Dashboard Overview

- **Key Metrics**: Total trips, revenue, average fare, distance, duration, speed
- **Interactive Charts**: Hourly trip distribution, borough analysis, payment methods
- **Real-time Updates**: Auto-refresh capabilities with configurable intervals
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Data Table

- **Advanced Filtering**: Filter by date range, fare, distance, passenger count, boroughs, payment types
- **Sorting**: Sort by any column (pickup time, fare, distance, etc.)
- **Pagination**: Configurable page sizes (25, 50, 100 records)
- **Search**: Real-time search across trip data
- **Export**: Download filtered data as CSV or JSON

### Map Visualization

- **Multiple Views**: Heat map, trip points, route visualization
- **Interactive Controls**: Toggle pickup/dropoff points, clustering options
- **Trip Details**: Click on trips for detailed information
- **Geographic Analysis**: Spatial distribution analysis

### Settings & Configuration

- **Theme Options**: Light, dark, or auto theme
- **Localization**: Multiple language support
- **Data Preferences**: Date formats, currency, timezone settings
- **Export Management**: Import/export application settings

## Development

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx      # Main application layout
│   │   ├── Dashboard.jsx   # Dashboard overview
│   │   ├── DataTable.jsx   # Data table with filtering
│   │   ├── MapView.jsx     # Map visualization
│   │   ├── Settings.jsx    # Application settings
│   │   ├── Chart.jsx       # Chart component
│   │   ├── Filters.jsx     # Filter controls
│   │   ├── MetricsCard.jsx # Metric display cards
│   │   └── LoadingSpinner.jsx
│   ├── context/            # React context for state management
│   │   └── DataContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useData.jsx
│   ├── services/           # API and data services
│   │   ├── dataService.jsx # Main data service
│   │   └── mockDataService.jsx # Mock data for development
│   ├── types/              # TypeScript type definitions
│   │   └── index.jsx
│   ├── utils/              # Utility functions
│   │   └── helpers.jsx
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
└── index.html            # HTML template
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://167.99.192.151:5000/

# Development Mode
VITE_USE_MOCK_DATA=false

# Environment
NODE_ENV=development
```

## API Integration

The application integrates with a comprehensive urban mobility data API that provides:

### Data Endpoints

- **Trip Data**: Real-time urban mobility trip information
- **Analytics**: Dashboard metrics and KPIs
- **Charts**: Pre-processed chart data for visualizations
- **Filters**: Available filter options and metadata
- **Export**: Data export functionality

### Data Processing

- **Client-side Filtering**: Advanced filtering capabilities
- **Real-time Sorting**: Dynamic column sorting
- **Pagination**: Efficient data loading
- **Caching**: Optimized data retrieval
- **Error Handling**: Robust error management

## Customization

### Adding New Chart Types

1. Update the chart type in `src/types/index.jsx`
2. Add chart logic in `src/services/dataService.jsx`
3. Create chart component in `src/components/`
4. Integrate with dashboard

### Adding New Filters

1. Update filter options in `src/context/DataContext.jsx`
2. Add filter UI in `src/components/Filters.jsx`
3. Update data service filter logic
4. Test with real data

### Styling

- **TailwindCSS**: Modify `tailwind.config.js` for theme customization
- **Global Styles**: Update `src/index.css` for global styles
- **Component Styles**: Use Tailwind utility classes throughout components

## Performance

### Optimization Features

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Pagination**: Large datasets efficiently handled
- **Debouncing**: Search inputs optimized
- **Virtual Scrolling**: Consider for very large datasets

### Browser Support

- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

## Testing

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions or issues:

1. Check this documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## Backend API

The frontend connects to a comprehensive urban mobility data API. For backend documentation and API endpoints, visit:

**[Backend API Documentation](http://167.99.192.151:8000/api-docs)**

---

Built with ❤️ for urban mobility data exploration
