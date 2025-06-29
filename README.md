# VTC API - Real-time Communication Setup

## Real-time Communication Implementation

This project uses Socket.IO for real-time communication between the API, React frontend, and mobile app.

### Backend Setup

1. Ensure Socket.IO is installed:
```bash
npm install @adonisjs/socket.io
```

2. Configure Socket.IO in `config/socket.ts`:
```typescript
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default function (app: ApplicationContract) {
  const Ws = app.container.resolveBinding('@ioc:Adonis/Core/Ws')
  Ws.init({
    host: app.environment.get('HOST', 'localhost'),
    port: app.environment.get('PORT', 3333),
    secure: false,
    key: app.environment.get('SSL_KEY'),
    cert: app.environment.get('SSL_CERT'),
    verify: async (handshake) => {
      // Add your authentication logic here
      return true
    },
    middleware: [],
  })
}
```

### Frontend (React) Setup

1. Install Socket.IO client:
```bash
cd frontend
npm install socket.io-client
```

2. Create a Socket service (`frontend/src/services/socketService.ts`):
```typescript
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  NEW_RIDE: 'ride:new',
  RIDE_STATUS_UPDATE: 'ride:status:update',
  RIDE_CANCELLED: 'ride:cancelled',
  RIDE_PAYMENT_UPDATE: 'ride:payment:update',
};

// Socket event handlers
export const handleSocketEvents = (handlers: any) => {
  socket.on(socketEvents.CONNECT, handlers.onConnect);
  socket.on(socketEvents.DISCONNECT, handlers.onDisconnect);
  socket.on(socketEvents.ERROR, handlers.onError);
  socket.on(socketEvents.NEW_RIDE, handlers.onNewRide);
  socket.on(socketEvents.RIDE_STATUS_UPDATE, handlers.onRideStatusUpdate);
  socket.on(socketEvents.RIDE_CANCELLED, handlers.onRideCancelled);
  socket.on(socketEvents.RIDE_PAYMENT_UPDATE, handlers.onRidePaymentUpdate);
};

// Cleanup function
export const cleanupSocketEvents = () => {
  Object.values(socketEvents).forEach((event: string) => {
    socket.off(event);
  });
};
```

3. Use the Socket service in your React components:
```typescript
import { socket, socketEvents, handleSocketEvents } from '../services/socketService';

// In your component
useEffect(() => {
  const handlers = {
    onConnect: () => {
      console.log('Connected to Socket.IO server');
    },
    onNewRide: (data) => {
      // Handle new ride event
    },
    onRideStatusUpdate: (data) => {
      // Handle ride status update
    },
    // ... other handlers
  };

  handleSocketEvents(handlers);

  return () => {
    cleanupSocketEvents();
  };
}, []);
```

### Mobile App Setup

For your mobile app (assuming React Native), follow similar steps:

1. Install Socket.IO client:
```bash
npm install socket.io-client
```

2. Use the same Socket service pattern as in React

3. Handle events in your mobile components

### Available Events

- `ride:new`: Emitted when a new ride is created
  - Data: `{ rideId, clientId, pickupLocation, destinationLocation, status }`

- `ride:status:update`: Emitted when a ride status changes
  - Data: `{ rideId, status, driverId, clientId, pickupLocation, destinationLocation }`

- `ride:cancelled`: Emitted when a ride is cancelled
  - Data: `{ rideId, clientId, driverId, reason }`

- `ride:payment:update`: Emitted when a ride payment status changes
  - Data: `{ rideId, paymentStatus, paymentMethod, amount }`

### Security Considerations

1. Always authenticate Socket.IO connections
2. Implement proper authorization for different user roles
3. Use HTTPS in production
4. Implement rate limiting
5. Validate all incoming data

### Error Handling

Implement proper error handling for:
- Connection errors
- Disconnection events
- Authentication failures
- Invalid data

### Monitoring

Consider implementing:
- Connection monitoring
- Event logging
- Error tracking
- Performance monitoring

### Testing

Create tests for:
- Connection handling
- Event emission
- Event reception
- Error scenarios
- Reconnection logic

This setup provides a robust real-time communication system between your API, React frontend, and mobile app. Make sure to adjust the configuration and event handlers according to your specific needs.
