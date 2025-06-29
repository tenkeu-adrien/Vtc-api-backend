import { VehicleTypes, RideStatuses, PaymentMethods } from 'App/Enums/Rides'
import Ride from 'App/Models/Ride'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from './UserFactory'
import { DateTime } from 'luxon'

const doualaNeighborhoods = [
  'Akwa', 'Bonapriso', 'Bali', 'Deido', 'Bepanda', 'Logbaba', 'Makepe', 'Bonamoussadi', 'PK 14', 'Ndokoti'
]

const getRandomDoualaCoordinates = () => ({
  lat: 4.05 + Math.random() * 0.1,
  lng: 9.70 + Math.random() * 0.1
})

const landmarks = [
  {
    name: 'Hôpital Laquintinie',
    address: 'Rue de la Gendarmerie, Akwa, Douala',
    coordinates: { lat: 4.0486, lng: 9.7064 }
  },
  {
    name: 'Aéroport International de Douala',
    address: 'Aéroport, Bonanjo, Douala',
    coordinates: { lat: 4.0113, lng: 9.7194 }
  },
  {
    name: 'Stade Japoma',
    address: 'Japoma, Douala',
    coordinates: { lat: 4.0585, lng: 9.8346 }
  },
  {
    name: 'Université de Douala',
    address: 'Campus Ndogbong, Douala',
    coordinates: { lat: 4.0733, lng: 9.7622 }
  },
  {
    name: 'Marché Central',
    address: 'Boulevard de la République, Akwa, Douala',
    coordinates: { lat: 4.0504, lng: 9.7062 }
  }
]

export const RideFactory = Factory
  .define(Ride, ({ faker }) => {
    const isDelivery = faker.datatype.boolean(0.3)
    const isScheduled = faker.datatype.boolean(0.2)

    const useLandmarkPickup = faker.datatype.boolean(0.3)
    const useLandmarkDestination = faker.datatype.boolean(0.3)

    const pickup = useLandmarkPickup
      ? faker.helpers.arrayElement(landmarks)
      : {
          address: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(doualaNeighborhoods)}, Douala`,
          coordinates: getRandomDoualaCoordinates()
        }

    const destination = useLandmarkDestination
      ? faker.helpers.arrayElement(landmarks)
      : {
          address: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(doualaNeighborhoods)}, Douala`,
          coordinates: getRandomDoualaCoordinates()
        }

    return {
      vehicleType: faker.helpers.arrayElement(Object.values(VehicleTypes)),
      pickupLocation: {
        address: pickup.address,
        coordinates: pickup.coordinates,
      },
      destinationLocation: {
        address: destination.address,
        coordinates: destination.coordinates,
      },
      status: faker.helpers.arrayElement(Object.values(RideStatuses)),
      scheduledAt: isScheduled ? DateTime.now().plus({ days: faker.number.int({ min: 1, max: 7 }) }) : null,
      startedAt: faker.datatype.boolean(0.6)
        ? DateTime.now().minus({ minutes: faker.number.int({ min: 5, max: 120 }) })
        : null,
      completedAt: faker.datatype.boolean(0.4) ? DateTime.now() : null,

      price: parseFloat(faker.finance.amount({ min: 1500, max: 10000, dec: 0 })),
      paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethods)),
      isPaid: faker.datatype.boolean(0.7),
      distance: faker.number.float({ min: 1, max: 50, precision: 0.1 }),
      duration: `${faker.number.int({ min: 5, max: 120 })} min`,

      clientId: 2,
      driverId: 1,

      recipient: isDelivery
        ? {
            name: faker.person.fullName(),
            contact: faker.phone.number(),
            address: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(doualaNeighborhoods)}, Douala`,
          }
        : null
    }
  })
  .relation('client', () => UserFactory)
  .relation('driver', () => UserFactory)
  .build()
