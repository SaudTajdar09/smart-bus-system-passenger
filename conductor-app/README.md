# Conductor App

A real-time QR ticket scanning and passenger management application for bus conductors.

## Features

- 📊 **Dashboard**: Real-time bus occupancy statistics
- 🔍 **QR Scanner**: Simulated QR ticket scanning interface
- 👥 **Passenger List**: View all passengers and their boarding status
- 🗺️ **Route Management**: Switch routes and view stop information

## Tech Stack

- React 19
- React Router v7
- Tailwind CSS
- Vite

## Project Structure

```
src/
  components/
    ui/              # Reusable UI components
    layout/          # Layout components (Topbar, BottomNav)
    conductor/       # Conductor-specific components
    common/          # Common components
  pages/             # Page components
  context/           # State management
  hooks/             # Custom hooks
  data/              # Mock data
  layouts/           # Layout wrappers
  routes/            # Router configuration
  utils/             # Utility functions
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (runs on port 5174)
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

## Features Implemented

### Dashboard Page
- Conductor information display
- Real-time bus occupancy stats
- Visual progress bar
- Quick action buttons
- Route information card

### Scanner Page
- Simulated QR scanner UI
- Manual ticket ID input
- Success/error feedback
- Recently boarded passenger list

### Passengers Page
- Passenger list with status
- Summary statistics
- Filter-like badges for quick reference
- Direct boarding buttons

### Route Page
- Current route details
- Route switching capability
- Stop listing with current location
- Next stops preview

## State Management

Uses React Context API with `ConductorProvider` to manage:
- Current route
- Passenger list
- Boarding status
- Scan feedback
- Current stop information

## Data Simulation

All data is stored in React state and simulated locally:
- Tickets are marked as "boarded" when scanned
- Occupancy stats update in real-time
- New bookings can be simulated dynamically
- localStorage ready for future persistence

## Future Enhancements

- Socket.IO integration for real-time updates
- Backend API integration
- Camera QR scanning capability
- Passenger database synchronization
- Detailed analytics
- Multi-shift support
- Incident reporting

## License

MIT
