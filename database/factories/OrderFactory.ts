// database/factories/OrderFactory.ts
import Order from 'App/Models/Order'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { OrderStatuses, PaymentMethods, PaymentStatuses } from 'App/Enums/Orders'
import { UserFactory } from './UserFactory'
import { OrderItemFactory } from './OrderItemFactory'
import { PartnerShopFactory } from './PartnerShopFactory'

export const OrderFactory = Factory
  .define(Order, ({ faker }) => {
    return {
      status: faker.helpers.arrayElement(Object.values(OrderStatuses)),
      totalAmount: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
      deliveryFee: parseFloat(faker.commerce.price({ min: 500, max: 3000 })),
      paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethods)),
      paymentStatus: faker.helpers.arrayElement(Object.values(PaymentStatuses)),
      deliveryAddress: {
        street: faker.location.streetAddress(),
        city: 'Douala',
        postal_code: faker.location.zipCode(),
        coords: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude()
        }
      }
    }
  })
  .relation('client', () => UserFactory)
  .relation('deliverer', () => UserFactory)
  .relation('shop', () => PartnerShopFactory)
  .relation('items', () => OrderItemFactory)
  .build()