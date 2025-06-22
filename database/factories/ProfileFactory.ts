// database/factories/ProfileFactory.ts
import Profile from 'App/Models/Profile'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const ProfileFactory = Factory
  .define(Profile, ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatarUrl: faker.image.avatar(),
      dateOfBirth: faker.date.past({ years: 30 }),
      gender: faker.helpers.arrayElement(['male', 'female', 'other']),
      address: {
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
  .build()