import Factory from '@ioc:Adonis/Lucid/Factory'
import PartnerShop from 'App/Models/PartnerShop'

export const PartnerShopFactory = Factory.define(PartnerShop, ({ faker }) => {
  return {
    name: faker.company.name(),

    // On cast explicitement en "object" ici
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      postal_code: faker.location.zipCode(),
      coords: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    } as object, // ✅ Ceci corrige le typage pour Adonis

    contactPhone: faker.phone.number(),

    // On sélectionne une valeur valide de l'enum
    category: faker.helpers.arrayElement([
      'supermarket',
      'convenience',
      'other',
    ]) as 'supermarket' | 'convenience' | 'other', // ✅ Cast explicite

    isActive: faker.datatype.boolean(),
    commissionRate: faker.number.float({ min: 0.05, max: 0.3, precision: 0.01 }),
  }
}).build()
