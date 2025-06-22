import Rating from 'App/Models/Rating'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from './UserFactory'
import { RideFactory } from './RideFactory'

// Générer un ID aléatoire entre 1 et 10
const getRandomId = () => Math.floor(Math.random() * 10) + 1

export const RatingFactory = Factory
  .define(Rating, ({ faker }) => {
    // Générer une note entre 1 et 5 avec 1 décimale
    const rating = parseFloat(faker.number.float({ min: 1, max: 5, precision: 0.1 }).toFixed(1))

    // Générer des IDs aléatoires pour les relations
    const rideId = getRandomId()
    const clientId = getRandomId()
    const driverId = getRandomId()

    return {
      rating: rating,
      comment: faker.datatype.boolean(0.7) ? faker.lorem.sentence() : null,
      isDriverRating: faker.datatype.boolean(),
      rideId: rideId,
      clientId: clientId,
      driverId: driverId
    }
  })
  // .relation('ride', () => RideFactory.apply('id', getRandomId()))
  // .relation('client', () => UserFactory.apply('id', getRandomId()))
  // .relation('driver', () => UserFactory.apply('id', getRandomId()))
  .build()

// Fonction utilitaire pour créer des évaluations réalistes
export async function createCompleteRating() {
  // Créer un client et un driver avec des IDs aléatoires
  const client = await UserFactory.merge({
    role: 'client',
    id: getRandomId()
  }).create()

  const driver = await UserFactory.merge({
    role: 'driver',
    id: getRandomId()
  }).create()

  // Créer une course associée avec un ID aléatoire
  const ride = await RideFactory.merge({
    id: getRandomId(),
    clientId: client.id,
    driverId: driver.id,
    status: 'completed'
  }).create()

  // Créer l'évaluation avec des IDs cohérents
  return await RatingFactory.merge({
    rideId: ride.id,
    clientId: client.id,
    driverId: driver.id
  }).create()
}
