// app/Controllers/Http/RatingsController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rating from 'App/Models/Rating'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Ride from 'App/Models/Ride'
import User from 'App/Models/User'

export default class RatingsController {
  // Créer une évaluation
  public async store({ request, response}: HttpContextContract) {
    const validationSchema = schema.create({
      ride_id: schema.number([
        rules.exists({ table: 'rides', column: 'id' })
      ]),
      rating: schema.number([
        rules.range(0, 5)
      ]),
      comment: schema.string.optional({ trim: true }),
      is_driver_rating: schema.boolean()
    })

    const data = await request.validate({
      schema: validationSchema,
      messages: {
        'ride_id.exists': 'La course spécifiée n\'existe pas',
        'rating.range': 'La note doit être entre 0 et 5'
      }
    })

    const ride = await Ride.findOrFail(data.ride_id)
    // const user = auth.user!

    const rating = await Rating.create({
      rideId: data.ride_id,
      clientId: ride.clientId,
      driverId: ride.driverId,
      rating: data.rating,
      comment: data.comment,
      isDriverRating: data.is_driver_rating,
    })

    return response.created(rating)
  }

  // Lister les évaluations d'un utilisateur
  public async index({ request, response }: HttpContextContract) {
    const { user_id, type } = request.qs()

    if (!user_id || !['driver', 'client'].includes(type)) {
      return response.badRequest({ message: 'Paramètres invalides' })
    }

    const ratings = await Rating.query()
      .where(type === 'driver' ? 'driver_id' : 'client_id', user_id)
      .preload('ride')
      .preload(type === 'driver' ? 'client' : 'driver')
      .orderBy('created_at', 'desc')

    return response.ok(ratings)
  }

  // Obtenir une évaluation spécifique
  public async show({ params, response }: HttpContextContract) {
    const rating = await Rating.query()
      .where('id', params.id)
      .preload('ride')
      .preload('client')
      .preload('driver')
      .firstOrFail()

    return response.ok(rating)
  }


 public async getUserRatings({ auth, response }: HttpContextContract) {
    // Récupérer l'utilisateur complet depuis la base de données
    const user = await User.query()
      .where('id', auth.user!.id)
      .preload('givenRatings', (query) => {
        query.preload('driver')
          .orderBy('created_at', 'desc')
      })
      .preload('receivedRatings', (query) => {
        query.preload('client')
          .orderBy('created_at', 'desc')
      })
      .firstOrFail()

    return response.ok({
      givenRatings: user.givenRatings,
      receivedRatings: user.receivedRatings
    })
  }

}