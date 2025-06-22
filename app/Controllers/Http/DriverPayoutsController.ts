import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DriverPayout from 'App/Models/DriverPayout'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class DriverPayoutsController {
  public async index({ response ,request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const payouts = await DriverPayout.query().preload('driver').paginate(page,limit)
    return response.ok(payouts)
  }

  public async store({ request, response }: HttpContextContract) {
    const payoutSchema = schema.create({
      driverId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      totalEarnings: schema.number(),
      platformCut: schema.number(),
      payoutAmount: schema.number(),
      payoutDate: schema.date(),
    })

    const payload = await request.validate({ schema: payoutSchema })
    const driver = await User.findOrFail(payload.driverId)

    // Générer une référence unique
    const payoutReference = `PYT${DateTime.now().toFormat('yyyyMMddHHmmss')}`

    const payout = await DriverPayout.create({
      payoutReference,
      userId: driver.id,
      totalEarnings: payload.totalEarnings,
      platformCut: payload.platformCut,
      payoutAmount: payload.payoutAmount,
      payoutDate: payload.payoutDate,
      status: 'pending',
    })

    return response.created(payout)
  }

  public async updateStatus({ params, request, response }: HttpContextContract) {
    const statusSchema = schema.create({
      status: schema.enum(['pending', 'paid', 'failed'] as const),
    })

    const { status } = await request.validate({ schema: statusSchema })
    const payout = await DriverPayout.findOrFail(params.id)

    payout.status = status
    await payout.save()

    return response.ok(payout)
  }
}