// database/factories/OrderItemFactory.ts
import OrderItem from 'App/Models/OrderItem'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { ProductFactory } from './ProductFactory'

export const OrderItemFactory = Factory
  .define(OrderItem, ({ faker }) => {
    return {
      quantity: faker.number.int({ min: 1, max: 5 }),
      unitPrice: parseFloat(faker.commerce.price({ min: 500, max: 10000 })),
    }
  })
  .relation('product', () => ProductFactory)
  .build()