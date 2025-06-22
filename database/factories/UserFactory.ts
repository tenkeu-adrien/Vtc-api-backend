import { Vehiclee } from './../../app/Enums/Roles';
import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Roles } from 'App/Enums/Roles'
import { ProfileFactory } from './ProfileFactory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    // Générer un matricule uniquement pour les chauffeurs
    const role = faker.helpers.arrayElement(Object.values(Roles));
    const isDriver = role === Roles.DRIVER;
    
    return {
      firstName: faker.internet.userName(),
      phone: faker.phone.number(), 
      password: 'password123!',
      matricule: isDriver ? generateMatricule(faker) : null, // Génère seulement pour les drivers
      role: role,
      isVerified: faker.datatype.boolean(),
      vehiculeType: isDriver ? faker.helpers.arrayElement(Object.values(Vehiclee)) : null,
    }
  })
  .relation('profile', () => ProfileFactory)
  .build()

// Fonction helper pour générer un matricule réaliste
function generateMatricule(faker) {
  const letters = faker.random.alpha({ count: 2, upcase: true });
  const numbers = faker.random.numeric(5);
  return `${letters}${numbers}`;
  
  // Alternative avec date si préféré:
  // const year = new Date().getFullYear().toString().slice(-2);
  // const seq = faker.random.numeric(4);
  // return `DRV-${year}-${seq}`;
}