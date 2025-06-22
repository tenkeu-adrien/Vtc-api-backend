// app/Controllers/Http/ReviewsController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Review from 'App/Models/Review'
import { schema } from '@ioc:Adonis/Core/Validator'
import Ride from 'App/Models/Ride'

export default class ReviewsController {
  public async index({ request }: HttpContextContract) {
    const targetId = request.input('target_id')
    const query = Review.query().preload('reviewer')

    if (targetId) {
      query.where('target_id', targetId)
    }

    return await query.exec()
  }

  public async rateDriver({ request, auth }: HttpContextContract) {
    const schemaReview = schema.create({
      rideId: schema.number(),
      rating: schema.number(),
      comment: schema.string.optional(),
    })
  
    const { rideId, rating, comment } = await request.validate({ schema: schemaReview })
  
    const ride = await Ride.findOrFail(rideId)
  
    if (ride.clientId !== auth.user!.id || ride.status !== 'completed') {
      return { error: 'Non autorisé ou course non terminée.' }
    }
  
    const review = await Review.create({
      rideId,
      reviewerId: auth.user!.id,
      targetId: ride.driverId!,
      rating,
      comment,
    })
  
    return review
  }
  
  
}