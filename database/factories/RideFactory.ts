import { VehicleTypes, RideStatuses, PaymentMethods } from 'App/Enums/Rides';
import Ride from 'App/Models/Ride';
import Factory from '@ioc:Adonis/Lucid/Factory';
import { UserFactory } from './UserFactory';
import { DateTime } from 'luxon';

export const RideFactory = Factory
  .define(Ride, ({ faker }) => {
    const isDelivery = faker.datatype.boolean(0.3); // 30% de chance d'être une livraison
    const isScheduled = faker.datatype.boolean(0.2); // 20% de chance d'être programmé

    return {
      vehicleType: faker.helpers.arrayElement(Object.values(VehicleTypes)),
      pickupLocation: {
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude()
        }
      },
      destinationLocation: {
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude()
        }
      },
      status: faker.helpers.arrayElement(Object.values(RideStatuses)),
      scheduledAt: isScheduled ? DateTime.now().plus({ days: faker.number.int({ min: 1, max: 7 }) }) : null,
      startedAt: faker.datatype.boolean(0.6) ? DateTime.now().minus({ minutes: faker.number.int({ min: 5, max: 120 }) }) : null,
      completedAt: faker.datatype.boolean(0.4) ? DateTime.now() : null,
      price: parseFloat(faker.finance.amount({ min: 500, max: 10000, dec: 0 })),
      paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethods)),
      isPaid: faker.datatype.boolean(0.7), // 70% de chance d'être payé
      distance: faker.number.float({ min: 1, max: 50, precision: 0.1 }), // en km
      duration: `${faker.number.int({ min: 5, max: 120 })} min`, 

      // Champs spécifiques aux livraisons
      // recipientInfo: isDelivery ? {
      //   name: faker.person.fullName(),
      //   phone: faker.phone.number(),
      //   notes: faker.lorem.sentence()
      // } : null,
      clientId:2,
      driverId:1,

      recipient: isDelivery ? {
        name: faker.person.fullName(),
        contact: faker.phone.number(),
        address: faker.location.streetAddress()
      } : null
    }
  })
  .relation('client', () => UserFactory)
  .relation('driver', () => UserFactory)
  .build()