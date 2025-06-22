import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { DriverPayoutFactory } from 'Database/factories/DriverPayoutFactory'
import { RatingFactory } from 'Database/factories/RatingFactory'
import { RideFactory } from 'Database/factories/RideFactory'
import { TransactionFactory } from 'Database/factories/TransactionFactory'

import { UserFactory } from 'Database/factories/UserFactory'

export default class extends BaseSeeder {
  public async run () {
  //   // Write your database queries inside the run method
  await UserFactory.createMany(10)
  await RideFactory.createMany(10)
   await RatingFactory.createMany(10)
    await TransactionFactory.createMany(10)
    await  DriverPayoutFactory.createMany(10)
    await RatingFactory.createMany(10)
 }

  // public async run() {
  //   await User.createMany([
  //     {
  //       email: 'admin@ton-transporteur.com',
  //       phone: '+237 699 999 999',
  //       password: 'AdminPassword123!',
  //       role: Roles.ADMIN,
  //       isVerified: true,
  //     },
  //     {
  //       email: 'driver@example.com',
  //       phone: '+237 677 777 777',
  //       password: 'DriverPassword123!',
  //       role: Roles.DRIVER,
  //       isVerified: true,
  //     },
  //     {
  //       email: 'client@example.com',
  //       phone: '+237 655 555 555',
  //       password: 'ClientPassword123!',
  //       role: Roles.CLIENT,
  //       isVerified: true,
  //     }
  //   ])
  // }
}


// database/seeders/UserSeeder.ts
