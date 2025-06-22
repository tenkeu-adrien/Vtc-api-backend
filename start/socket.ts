import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { Application } from '@adonisjs/core/build/standalone'

export default class Ws {
  public io: Server
  public boot(app: Application) {
    const server = app.container.use('Adonis/Core/Server')
    this.io = new Server(server.instance as HttpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    // Connexion d'un client
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Écoute des événements
      socket.on('ride:status', (data) => {
        console.log('Ride status update:', data)
        // Émettre à tous les clients
        this.io.emit('ride:status:update', data)
      })

      socket.on('user:location', (data) => {
        console.log('User location update:', data)
        this.io.emit('user:location:update', data)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
}
