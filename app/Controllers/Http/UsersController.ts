// app/Controllers/Http/UsersController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Ride from 'App/Models/Ride'
import PromoCode from 'App/Models/PromoCode'
import { DateTime } from 'luxon'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const searchTerm = request.input('search', '')
    const roleFilter = request.input('role', 'all')
    const regionFilter = request.input('region', 'all')

    let query = User.query()
      .select('users.*')
      .select([
        Database.raw('(SELECT COUNT(*) FROM rides WHERE rides.client_id = users.id) as client_rides_count'),
        Database.raw('(SELECT COUNT(*) FROM rides WHERE rides.driver_id = users.id) as driver_rides_count'),
        Database.raw('(SELECT COALESCE(SUM(distance), 0) FROM rides WHERE rides.client_id = users.id) as client_distance_total'),
        Database.raw('(SELECT COALESCE(SUM(distance), 0) FROM rides WHERE rides.driver_id = users.id) as driver_distance_total'),
        Database.raw('(SELECT COALESCE(SUM(duration), 0) FROM rides WHERE rides.client_id = users.id) as client_duration_total'),
        Database.raw('(SELECT COALESCE(SUM(duration), 0) FROM rides WHERE rides.driver_id = users.id) as driver_duration_total')
      ])


      query.orderBy('created_at', 'desc')
    // Appliquer les filtres
    if (searchTerm) {
      query.where((builder) => {
        builder
          .where('first_name', 'like', `%${searchTerm}%`)
          .orWhere('phone', 'like', `%${searchTerm}%`)
      })
    }

    if (roleFilter !== 'all') {
      query.where('role', roleFilter)
    }

    if (regionFilter !== 'all') {
      // Supposons que vous ayez une colonne 'ville' ou similaire
      query.where('ville', regionFilter)
    }
    const users = await query.paginate(page, limit)

    return response.json({
      success: true,
      data: {
        meta: users.getMeta(),
        users: users.all().map(user => ({
          ...user.toJSON(),
          rides_stats: {
            count: {
              total: Number(user.$extras.client_rides_count) + Number(user.$extras.driver_rides_count),
              as_client: Number(user.$extras.client_rides_count),
              as_driver: Number(user.$extras.driver_rides_count)
            },
            distance: {
              total: Number(user.$extras.client_distance_total) + Number(user.$extras.driver_distance_total),
              as_client: Number(user.$extras.client_distance_total),
              as_driver: Number(user.$extras.driver_distance_total)
            },
            duration: {
              total: Number(user.$extras.client_duration_total) + Number(user.$extras.driver_duration_total),
              as_client: Number(user.$extras.client_duration_total),
              as_driver: Number(user.$extras.driver_duration_total)
            }
          }
        }))
      },
      message: "Users retrieved successfully"
    })
  }




  public async store({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      phone: schema.string([rules.unique({ table: 'users', column: 'phone' })]),
      password: schema.string([rules.minLength(8)]),
      role: schema.enum(['client', 'driver', 'deliverer', 'admin'] as const),
        vehicule_type: schema.string.nullableAndOptional(),
  matricule: schema.string.nullableAndOptional()
    })



    const data = await request.validate({ schema: userSchema })
    const user = await User.create(data)
      let    paginateUser = response.created(user) 
      const io = use('Socket')
      
      io.emit('user:new', {
        userId: user.id,
        role: user.role
      })
   return   response.send({success:true , paginateUser  ,message:"user created succefully"})
  }

  public async show({ params ,response }: HttpContextContract) {
     let user = await User.findOrFail(params.id)
      
   return   response.send({success:true , user  ,message:"user get succefully"})
  }

 public async updated({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const userSchema = schema.create({

        avatar: schema.string.optional(),
        is_deleted: schema.boolean.optional()
    })

    const data = await request.validate({ schema: userSchema })

    // Mettre à jour les champs de base
   
    // Gérer le avatar si fourni
    if (data.avatar) {
        user.avatar = data.avatar
    } 
    // Si aucun avatar n'est fourni, mettre is_deleted à true
    else if (data.is_deleted !== undefined) {
        user.isDeleted = data.is_deleted
    } else {
        // Si aucun des deux n'est fourni, par défaut on met is_deleted à true
        user.isDeleted = true
    }

    await user.save()

    return response.ok(user)
}

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    user.isDeleted =true 
    let userDelete = await user.save()

    // return response.noContent()
    return   response.send({success:true , userDelete  ,message:"user delete succefully"})
  }




  public async availableDrivers({ request, response }: HttpContextContract) {
    try {
      const vehicleType = request.input('vehicleType')

      if (!vehicleType) {
        return response.badRequest({ success: false, message: 'Le type de véhicule est requis.' })
      }

      const drivers = await User.query()
        .where('role', 'driver')
        .andWhere('vehicule_type', vehicleType)
        .andWhere('is_verified', true)
        .andWhere('is_deleted', false)

      return response.ok({
        success: true,
        drivers,
        message: 'Liste des chauffeurs disponibles récupérée avec succès.',
      })
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des chauffeurs disponibles :', error)
      return response.internalServerError({
        success: false,
        message: 'Erreur serveur lors de la récupération des chauffeurs disponibles.',
      })
    }
  }



    public async updateFcmToken({ request, params, response }: HttpContextContract) {
    try {
      const userId = params.id
      const token = request.input('token')

      if (!token) {
        return response.badRequest({ success: false, message: 'Token FCM manquant.' })
      }

      const user = await User.findOrFail(userId)
      user.fcmToken = token
      await user.save()

      return response.ok({
        success: true,
        message: 'Token FCM enregistré avec succès.',
      })
    } catch (error) {
      console.error('❌ Erreur enregistrement FCM token:', error)
      return response.internalServerError({
        success: false,
        message: 'Erreur serveur lors de l’enregistrement du token.',
      })
    }
  }



  public async promo({ request, params, response  }: HttpContextContract) {
    const validationSchema = schema.create({
      code: schema.string({ trim: true }, [
        rules.maxLength(20),
        rules.unique({ table: 'promo_codes', column: 'code' }),
      ]),
      discount: schema.number([rules.range(1, 100)]),
      rides_count: schema.number(),
      start_date: schema.date(),
      end_date: schema.date(),
    })

    const data = await request.validate({ schema: validationSchema })

    const promoCode = await PromoCode.create({
      userId: params.user_id || 10, 
      ...data,
    })

    return response.created(promoCode)
  }



    public async completedRides({ params, response}: HttpContextContract) {
    try {
      const userId = params.user_id
      // Récupérer les courses complétées où l'utilisateur est soit client soit driver
      const rides = await Ride.query()
        .where((query) => {
          query
            .where('client_id', userId)
            .orWhere('driver_id', userId)
        })
        .andWhere('status', 'completed')
        .orderBy('completed_at', 'desc')
        
        .exec()

      // Formater la réponse
   

      return response.json({
        data:rides
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la récupération des courses',
        error: error.message
      })
    }
  }




  // Dans votre controller d'API

// Pour vérifier les promos actives par batch
async checkActivePromos({ request, response }) {
  const { userIds } = request.only(['userIds'])

  console.log("userIds code apis" ,userIds)
  const promos = await PromoCode.query()
    .whereIn('user_id', userIds)
    .where('is_active', true)
    .where('start_date', '<=', DateTime.now().toSQL())
    .where('end_date', '>=', DateTime.now().toSQL())
  
  const result = {}
  promos.forEach(promo => {
    result[promo.userId] = promo.toJSON()
  })
  
  console.log("resultat dans l'apis " ,result)
  return response.ok({ data: result })
}

// Pour obtenir la promo active d'un utilisateur
async getActivePromo({ params, response }) {
  const promo = await PromoCode.query()
    .where('user_id', params.id)
    .where('is_active', true)
    .where('start_date', '<=', DateTime.now().toSQL())
    .where('end_date', '>=', DateTime.now().toSQL())
    .first()
  
  return response.ok({ data: promo || null })
}
}