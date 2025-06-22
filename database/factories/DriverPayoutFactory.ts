import DriverPayout from 'App/Models/DriverPayout'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

export const DriverPayoutFactory = Factory
  .define(DriverPayout, ({ faker }) => {
    const totalEarnings = faker.number.float({ min: 50000, max: 500000, precision: 0.01 })
    const platformCut = parseFloat((totalEarnings * 0.2).toFixed(2))
    const payoutAmount = parseFloat((totalEarnings - platformCut).toFixed(2))

    return {
      userId: 1, // ou utiliser une relation
      payoutReference: `PYT${faker.number.int({ min: 1000, max: 9999 })}`,
      totalEarnings,
      platformCut,
      payoutAmount,
      status: 'pending',
      payoutDate: DateTime.fromJSDate(faker.date.recent()),
    }
  })
  .build()