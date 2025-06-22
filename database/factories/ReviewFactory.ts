// database/factories/ReviewFactory.ts
import Review from 'App/Models/Review'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from './UserFactory'
import { OrderFactory } from './OrderFactory'
import { RideFactory } from './RideFactory'

export const ReviewFactory = Factory
  .define(Review, ({ faker }) => {
    return {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
    }
  })
  .relation('reviewer', () => UserFactory)
  .relation('target', () => UserFactory)
  .relation('order', () => OrderFactory)
  .relation('ride', () => RideFactory)
  .build()