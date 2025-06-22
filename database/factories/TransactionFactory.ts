// database/factories/TransactionFactory.ts
import Transaction from 'App/Models/Transaction'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { RideFactory } from './RideFactory'
import { UserFactory } from './UserFactory'
import { DateTime } from 'luxon'

export const TransactionFactory = Factory
  .define(Transaction, ({ faker }) => {
    return {
      paymentMethod: faker.helpers.arrayElement(['cash', 'orange_money', 'mobile_money']),
      amount: faker.datatype.number({ min: 1000, max: 10000 }),
      commission: faker.datatype.number({ min: 100, max: 2000 }),
      transactionDate: DateTime.fromJSDate(faker.date.recent()),
      rideId: 1, // Ou générez un ID valide
      clientId: 1,
      driverId: 1
    }
  })
  // .relation('ride', () => RideFactory) // Supposons que vous avez une RideFactory
  // .relation('client', () => UserFactory)
  // .relation('driver', () => UserFactory)
  .build()