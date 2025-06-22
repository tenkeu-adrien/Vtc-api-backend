// database/factories/VehicleFactory.ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import Vehicle from 'App/Models/Vehicule'

export const VehicleFactory = Factory
  .define(Vehicle, ({ faker }) => {
    return {
      type: faker.helpers.arrayElement(['moto', 'tricycle']),
      plateNumber: `CM${faker.string.numeric(4)}${faker.string.alpha(2)}`,
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      color: faker.vehicle.color(),
      isApproved: faker.datatype.boolean(),
    }
  })
  .build()