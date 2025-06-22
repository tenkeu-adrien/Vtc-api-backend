import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import Ride from 'App/Models/Ride'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class TransactionsController {
  public async index({ response ,request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const transactions = await Transaction.query()
      .preload('ride')
      .preload('client')
      .preload('driver').paginate(page, limit)
    return response.ok(transactions)
  }

public async getUserTransactions({ params, request, response }: HttpContextContract) {
    try {
      const userId = params.user_id
      const page = request.input('page', 1)
      const limit = request.input('limit', 15) // Vous pouvez ajuster la limite par défaut
console.log("user_id" ,userId)
      // Vérifier que l'utilisateur existe
      const user = await User.find(userId)
      if (!user) {
        return response.notFound({ message: 'Utilisateur non trouvé' })
      }

      // Récupérer les transactions paginées avec les relations
      const transactions = await Transaction.query()
        .where((query) => {
          query.where('client_id', userId).orWhere('driver_id', userId)
        })
        .orderBy('transaction_date', 'desc')
        .preload('ride', (rideQuery) => {
          rideQuery
            .preload('driver', (driverQuery) => {
              driverQuery.select(['id', 'firstName', 'phone'])
            })
            .preload('client', (clientQuery) => {
              clientQuery.select(['id', 'firstName', 'phone'])
            })
        })
        .preload('client', (clientQuery) => {
          clientQuery.select(['id', 'firstName', 'phone'])
        })
        .preload('driver', (driverQuery) => {
          driverQuery.select(['id', 'firstName', 'phone'])
        })
        .paginate(page, limit)

      // Formater la réponse selon votre structure frontend
      const formattedTransactions = transactions.toJSON()
      formattedTransactions.data = formattedTransactions.data.map((transaction) => {
        return {
          id: transaction.id,
          ride_id: transaction.ride_id,
          client_id: transaction.client_id,
          driver_id: transaction.driver_id,
          payment_method: transaction.payment_method,
          amount: transaction.amount,
          commission: transaction.commission,
          transaction_date: transaction.transaction_date,
          ride: transaction.ride ? {
            id: transaction.ride.id,
            vehicle_type: transaction.ride.vehicle_type,
            status: transaction.ride.status,
            distance: transaction.ride.distance,
            price: transaction.ride.price,
            driver: transaction.ride.driver,
            client: transaction.ride.client,
            started_at: transaction.ride.started_at,
            completed_at: transaction.ride.completed_at
          } : null,
          client: transaction.client,
          driver: transaction.driver
        }
      })

      return response.ok(formattedTransactions)
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error)
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la récupération des transactions',error
      })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const transactionSchema = schema.create({
      rideId: schema.number([rules.exists({ table: 'rides', column: 'id' })]),
      paymentMethod: schema.enum(['cash', 'orange_money', 'mobile_money'] as const),
      amount: schema.number(),
      commission: schema.number(),
      transactionDate: schema.date(),
    })

    const payload = await request.validate({ schema: transactionSchema })
    const ride = await Ride.findOrFail(payload.rideId)

    const transaction = await Transaction.create({
      rideId: ride.id,
      clientId: ride.clientId,
      driverId: ride.driverId,
      paymentMethod: payload.paymentMethod,
      amount: payload.amount,
      commission: payload.commission,
      transactionDate: payload.transactionDate,
    })

    return response.created(transaction)
  }

  public async show({ params, response }: HttpContextContract) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('ride')
      .preload('client')
      .preload('driver')
      .firstOrFail()
    return response.ok(transaction)
  }
}