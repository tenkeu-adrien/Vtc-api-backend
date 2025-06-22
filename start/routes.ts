/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
}).prefix('/api/v1')




Route.group(() => {
  Route.post('/register/', 'AuthControllers.register')
  Route.post('/login/', 'AuthControllers.login')
  Route.post('/logout', 'AuthControllers.logout')
  Route.get('/me', 'AuthControllers.me')

  Route.get('pricing', 'AuthControllers.index')
  Route.put('pricing/:id', 'AuthControllers.update')

Route.get('/finance/stats', 'UsersController.getFinancialStats');
  Route.get('/users', 'UsersController.index')
   Route.get('/user/profile', 'AuthControllers.profile')
  Route.get('/users/:id', 'UsersController.indexx')
  Route.get('/users/show/:id', 'UsersController.show')
  Route.patch('/users/delete/:id', 'UsersController.destroy')
  Route.patch('/users/update/:id', 'UsersController.updated')
  Route.post('/users/:id/promo-codes', 'UsersController.promo')
  Route.get('/ratings/me', 'RatingsController.getUserRatings').middleware('auth')
    Route.post('/users/check-active-promos', 'UsersController.checkActivePromos')
    
    // Récupérer la promo active d'un utilisateur spécifique
    Route.get('/:userId/active-promo', 'UsersController.getActivePromo')
  Route.post('/refresh', 'AuthControllers.refresh').middleware('auth')
  Route.post('/forgot-password', 'AuthControllers.forgotPassword')
  Route.post('/reset-password', 'AuthControllers.resetPassword')
}).prefix('/api/v1')


Route.group(() => {
  Route.get('/messages', 'MessagesController.index')
  Route.get('/messages/:ride_id', 'MessagesController.show')
  Route.post('/messages', 'MessagesController.store')

}).prefix('api/v1').middleware(['auth'])

Route.group(() => {
  // Authentification

  // Client routes
  Route.group(() => {
    // Courses
    Route.post('/rides/request', 'RidesController.store')
        Route.get('/rides', 'RidesController.get')
    Route.get('/rides/history', 'RidesController.index')
    Route.patch('/rides/:id/cancel', 'RidesController.cancelRide')
    Route.get('/rides/:id/stats', 'RidesController.getRideById')
    Route.get('/rides/user/:id', 'RidesController.show')
    Route.patch('/rides/:id/status', 'RidesController.updateStatus')
    Route.get('/rides/:rideId/messages', 'MessagesController.getRideMessages')
    Route.patch('/rides/:rideId/messages/read', 'MessagesController.markMessagesAsRead')

    Route.get('/rides/revenue-stats', 'RidesController.revenueStats');
Route.get('/rides/payment-distribution', 'RidesController.paymentDistribution');

     Route.group(() => { Route.get('/mee', 'AuthControllers.me').middleware('auth')

    Route.get('/orders/current', 'OrdersController.current')
    Route.patch('/orders/:id/cancel', 'OrdersController.cancel')
    
  })
  // .middleware('auth:api')
  // .middleware(['auth', 'deliveryMan'])
  // Admin routes
  Route.group(() => {
    // Route.get('/orders', 'OrdersController.index')
    Route.get('/orders/:id/stats', 'OrdersController.getRideById')
    Route.patch('/orders/:id/status', 'OrdersController.updateStatus')
  })
  // .middleware(['auth', 'admin'])





// Transactions
Route.get('/transactions', 'TransactionsController.index')
Route.post('/transactions', 'TransactionsController.store')
Route.get('/transactions/:id', 'TransactionsController.show')

// Driver Payouts
Route.get('/driver-payouts', 'DriverPayoutsController.index')
Route.post('/driver-payouts', 'DriverPayoutsController.store')
Route.patch('/driver-payouts/:id/status', 'DriverPayoutsController.updateStatus')







    // Commandes
    // Route.post('/orders', 'OrdersController.index')
    Route.get('/orders', 'OrdersController.history')
    Route.get('/orders/:id', 'OrdersController.show')
    Route.post('/orders/:id/cancel', 'OrdersController.cancel')

    // Paiements
    Route.post('/payments/initiate', 'PaymentController.initiate')
    Route.get('/payments/:id/verify', 'PaymentController.verify')
  })


Route.group(() => {
  // Transactions paginées
  Route.get('user/:user_id/transactions', 'TransactionsController.getUserTransactions')
  
  // Statistiques driver
  Route.get('drivers/:id/stats', 'StatsController.index')
})




  // .middleware(['auth', 'checkRole:client'])
  // Driver routes
  Route.group(() => {
    Route.get('/rides/available', 'RideController.available')
    Route.post('/rides/:id/accept', 'RideController.accept')
    Route.post('/rides/:id/complete', 'RideController.complete')
  })
  // .middleware(['auth', 'checkRole:driver'])
  // Delivery man routes
  Route.group(() => {
    Route.get('/orders/available', 'OrdersController.available')
    Route.post('/orders/:id/accept', 'OrdersController.accept')
    Route.post('/orders/:id/complete', 'OrdersController.complete')
  })
  // .middleware(['auth', 'checkRole:delivery_man'])
  // Admin routes
// start/routes.ts





// start/routes.ts
Route.group(() => {
  // Routes pour les évaluations
  Route.post('/ratings', 'RatingsController.store')
  Route.get('/ratings', 'RatingsController.index')
  Route.get('/ratings/:id', 'RatingsController.show')
})




Route.group(() => {
  Route.get('/dashboard/admin-stats', 'AdminDashboard.getDashboardStats')
  Route.get('/dashboard/platform-stats', 'AdminDashboard.platformStats')
  Route.get('/dashboard/ride-metrics', 'AdminDashboard.rideMetrics')
})
  // .middleware(['auth', 'checkRole:admin'])
  // Callback Orange Money
  Route.post('/om/callback', 'PaymentController.callback')


}).prefix('/api/v1')






Route.group(() => {
  // Litiges
  Route.get('/litiges', 'LitigesController.index')
  Route.get('/litiges/:id', 'LitigesController.show')
  Route.put('/litiges/:id', 'LitigesController.update')

  // Support
  Route.get('/tickets', 'SupportController.index')
  Route.post('/tickets', 'SupportController.store')
  Route.post('/tickets/:id/assign', 'SupportController.assign')

  // Rapports
  Route.post('/rapports/generate', 'RapportsController.generate')
}).prefix('api/v1').middleware(['auth'])