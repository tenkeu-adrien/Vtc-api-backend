export default {
  // Configuration de base
  connection: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  },
  
  // Namespaces
  namespaces: {
    '/': {
      // Middleware global pour le namespace
      middleware: [],
      // Gestionnaires d'événements
      handlers: {
        'ride:status': 'RideController.handleRideStatus',
        'user:location': 'UserController.handleUserLocation'
      }
    }
  }
} 