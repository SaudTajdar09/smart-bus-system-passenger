# Depot Management Admin Dashboard

## Overview

The Depot Management Admin Dashboard is a comprehensive monitoring and control application for the CityBus Smart Ticketing System. It provides real-time insights into all operational aspects of the bus fleet.

## Features

### 1. Dashboard
- **System Stats**: Total buses, passengers, revenue, and occupancy rate
- **Quick Insights**: Status overview of all buses
- **Recent Activity**: Latest ticket bookings and scans
- **Revenue & Passenger Charts**: Visual analytics

### 2. Analytics
- Revenue breakdown by route
- Passenger distribution across routes
- Bus occupancy metrics
- Performance statistics
- Top performing routes

### 3. Fleet Management
- View all buses with real-time status
- Filter buses by status (Running, Idle, Maintenance)
- Occupancy monitoring per bus
- Driver and conductor information
- Status management

### 4. Live Tracking
- Real-time bus location simulation
- Current and next stop for each bus
- Progress tracking to next stop
- Route maps with stop information
- Live occupancy updates

### 5. Incidents Management
- SOS emergency alerts
- Bus breakdown reports
- Passenger complaints
- Incident status tracking (Pending/Resolved)
- Incident type statistics

### 6. Routes Management
- Complete route information
- Stop details for each route
- Bus assignments per route
- Route-wise statistics
- Revenue tracking by route

## Technology Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.2.2
- **Routing**: React Router v7
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   └── StatCard.jsx
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── BusCard.jsx
│   │   ├── IncidentCard.jsx
│   │   ├── RouteCard.jsx
│   │   ├── RevenueChart.jsx
│   │   └── PassengerChart.jsx
│   └── layout/             # Layout components
│       ├── Sidebar.jsx
│       └── Header.jsx
├── context/
│   └── DepotContext.jsx    # Global state management
├── hooks/
│   └── useDepot.js         # Custom hook for context
├── layouts/
│   └── MainLayout.jsx      # Main application layout
├── pages/
│   ├── Dashboard.jsx
│   ├── Analytics.jsx
│   ├── FleetManagement.jsx
│   ├── LiveTracking.jsx
│   ├── Incidents.jsx
│   └── Routes.jsx
├── routes/
│   └── AppRoutes.jsx       # Route definitions
├── App.jsx                 # Main app component
├── main.jsx                # Entry point
└── index.css              # Global styles
```

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

The dashboard will be available at `http://localhost:5175`

## Data Management

### Local Storage Simulation
- Bus data is stored in localStorage and synchronized across the system
- Routes and incidents data persist between sessions
- On first load, dummy data is populated

### Real-Time Updates
- Polls ticket server every 5 seconds (`http://localhost:3001/api/tickets`)
- Automatically updates bus occupancy and passenger counts
- Dashboard reflects real-time changes from Passenger and Conductor apps

### Data Flow
```
Ticket Server (3001)
    ↓
Depot Admin Context
    ↓
Components (with real-time updates)
```

## Integration Points

### Ready for Backend Integration

The app is structured for easy integration with:

1. **REST APIs**:
   - `/api/buses` - Get/update bus information
   - `/api/routes` - Get route details
   - `/api/incidents` - Get/update incidents
   - `/api/tickets` - Get ticket data
   - `/api/analytics` - Get analytics data

2. **Socket.IO Events** (for real-time updates):
   - `ticketBooked` - New ticket booking
   - `ticketScanned` - Ticket scanned at gate
   - `busUpdated` - Bus status changed
   - `incidentCreated` - New incident reported
   - `locationUpdated` - Bus location changed

### Example Socket.IO Integration

```javascript
// In DepotContext.jsx
import io from 'socket.io-client'

const socket = io('http://localhost:3001', {
  reconnection: true,
  reconnectionDelay: 1000,
})

// Listen for real-time updates
socket.on('ticketScanned', (data) => {
  // Update dashboard
})

socket.on('incidentCreated', (data) => {
  // Handle new incident
})
```

## Features Ready for Scaling

1. **Mobile Responsive**: Dashboard adapts to different screen sizes
2. **Modular Components**: Easy to add new pages and features
3. **State Management**: Centralized context for consistent data
4. **Alert System**: Pre-built incident tracking
5. **Analytics Ready**: Components for charts and graphs

## Demo Scenarios

1. **Passenger Books Ticket**
   - New ticket appears in recent activity
   - Revenue updates in real-time
   - Passenger count increases

2. **Conductor Scans Ticket**
   - Boarded count increases
   - Occupancy updates on all views
   - Bus status reflects changes

3. **Emergency Alert**
   - SOS incident appears in Incidents page
   - Red alert badge shows pending status
   - Team can resolve and mark as resolved

## Future Enhancements

- Advanced charting with Chart.js or D3.js
- GPS-based real bus tracking
- Predictive analytics
- Mobile app version
- Advanced reporting and export
- User authentication and roles
- Notification system
- API integration with production backend

## Notes

- All data is currently simulated for demo purposes
- Real-time polling interval is set to 5 seconds (configurable)
- Dashboard auto-updates from changes in Passenger and Conductor apps
- No backend required for demo (uses localStorage)

---

**Port**: 5175  
**API Endpoint**: http://localhost:3001  
**Last Updated**: April 2026
