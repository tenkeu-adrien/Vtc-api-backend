// database/factories/ProductFactory.ts
import Product from 'App/Models/Product'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const ProductFactory = Factory
  .define(Product, ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 100, max: 10000 })),
      category: faker.commerce.department(),
      imageUrl: faker.image.urlLoremFlickr({ category: 'food' }),
      stockQuantity: faker.number.int({ min: 0, max: 100 }),
    }
  })
  .build()