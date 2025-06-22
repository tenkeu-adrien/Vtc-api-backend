import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!)
  }
}

export default new Ws()



















import Ride from 'App/Models/Ride'
import { sendPushNotification } from '../Services/NotificationService'

Ws.boot()

Ws.io.on('connection', (socket) => {
  console.log('New connection:', socket.id)

  // Écoute des mises à jour de position
  socket.on('driver-location-update', async (data) => {
    // Sauvegarder la position actuelle
    await Ride.query()
      .where('id', data.rideId)
      .update({ current_location: JSON.stringify(data) })

    // Diffuser aux clients concernés
    socket.to(`ride-${data.rideId}`).emit('driver-position', data)

    // Vérifier la proximité avec le point de départ
    checkDriverProximity(data.rideId, data)
  })

  // Rejoindre une room spécifique pour une course
  socket.on('join-ride', (rideId) => {
    socket.join(`ride-${rideId}`)
  })
})

async function checkDriverProximity(rideId: number, driverLocation: any) {
  const ride = await Ride.findOrFail(rideId)
  const pickup = JSON.parse(ride.pickup_location)

  const distance = calculateDistance(
    driverLocation.latitude,
    driverLocation.longitude,
    pickup.coordinates.lat,
    pickup.coordinates.lng
  )

  // Si le chauffeur est à moins de 200m
  if (distance < 200 && ride.status === 'accepted') {
    await sendPushNotification(
      ride.client_id,
      'Votre chauffeur arrive',
      `Le chauffeur est à ${Math.round(distance)} mètres`
    )
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Implémentation de la formule Haversine
  const R = 6371e3 // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI/180
  const φ2 = lat2 * Math.PI/180
  const Δφ = (lat2-lat1) * Math.PI/180
  const Δλ = (lon2-lon1) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}