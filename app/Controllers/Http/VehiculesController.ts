import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vehicule from 'App/Models/Vehicule'

export default class VehiculesController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only([
      'type',
      'plate_number',
      'brand',
      'model',
      'color',
      'is_approved',
      'price_per_km_course',
      'price_per_km_delivery',
      'price_per_hour_delivery'
    ])

    const vehicule = await Vehicule.create({
      type: data.type,
      plateNumber: data.plate_number,
      brand: data.brand,
      model: data.model,
      color: data.color,
      isApproved: data.is_approved ?? false,
      pricePerKmCourse: data.price_per_km_course,
      pricePerKmDelivery: data.price_per_km_delivery,
      pricePerHourDelivery: data.price_per_hour_delivery ?? null
    })

    return response.created(vehicule)
  }

  public async update({ request, params, response }: HttpContextContract) {
    const vehicule = await Vehicule.findOrFail(params.id)

    const data = request.only([
      'type',
      'plate_number',
      'brand',
      'model',
      'color',
      'is_approved',
      'price_per_km_course',
      'price_per_km_delivery',
      'price_per_hour_delivery'
    ])

    vehicule.merge({
      type: data.type,
      plateNumber: data.plate_number,
      brand: data.brand,
      model: data.model,
      color: data.color,
      isApproved: data.is_approved,
      pricePerKmCourse: data.price_per_km_course,
      pricePerKmDelivery: data.price_per_km_delivery,
      pricePerHourDelivery: data.price_per_hour_delivery
    })

    await vehicule.save()
    return response.ok(vehicule)
  }
}
