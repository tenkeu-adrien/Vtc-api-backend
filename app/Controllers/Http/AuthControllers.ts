// app/Controllers/Http/AuthController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Pricing from 'App/Models/Pricing'
import Ride from 'App/Models/Ride'
// import app from '@adonisjs/core/services/app'
export default class AuthController {
  // Schema de validation pour l'inscription
  private registerSchema = schema.create({
    firstName: schema.string(),
    password: schema.string(),
    phone: schema.string(),
    role: schema.enum(['client', 'driver', 'deliverer'] as const),
    vehiculeType: schema.string.optional(),
  matricule: schema.string.optional(),
  avatar: schema.string.optional(), // Maintenant un string (URL)
  jointe: schema.string.optional(), // Maintenant un string (URL)
  driverType: schema.string.optional(),
  })

  // Schema de validation pour la connexion
  private loginSchema =schema.create({
    phone: schema.string(), // ou autres règles si nécessaire
    password: schema.string({}, [rules.minLength(6)]),
  })
  

  /**
   * Inscription utilisateur

      vehiculeType: schema.string.optional(),
  matricule: schema.string.optional()
   */



public async register({ request, response, auth }: HttpContextContract) {
  // Valider le payload
  const payload = await request.validate({ schema: this.registerSchema })

  console.log("")

  try {
    // Création de l'utilisateur avec les URLs des fichiers
    const user = await User.create({
      ...payload,
      avatar: payload.avatar || undefined, // URL de l'image depuis Firebase
      jointe: payload.jointe || undefined, // URL du document depuis Firebase
    })

    const token = await auth.use('api').generate(user, {
      expiresIn: '7days',
    })

    return response.created({
      user: user.serialize(),
      token,
    })

  } catch (error) {
    return response.internalServerError({
      message: 'Erreur lors de la création du compte',
      error: error.message,
    })
  }
}




 public async profile({ auth, response }: HttpContextContract) {
    try {
      // Récupère l'utilisateur authentifié
      const user = await auth.authenticate()

      // Version sécurisée avec sérialisation personnalisée
      const userProfile = {
        id: user.id,
        first_name: user.first_name,
        phone: user.phone,
        vehicule_type: user.vehicule_type,
        matricule: user.matricule,
        role: user.role,
        is_verified: user.is_verified,
        avatar: user.avatar, // URL depuis Firebase
        jointe: user.jointe, // URL du document depuis Firebase
        driver_type: user.driver_type,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }

      return response.ok({
        status: 'success',
        user: userProfile,
      })

    } catch (error) {
      return response.unauthorized({
        status: 'error',
        message: 'Accès non autorisé. Veuillez vous reconnecter.',
        error: error.message,
      })
    }
  }

public async index({ response }: HttpContextContract) {
  const pricings = await Pricing.all()
  
  return response.ok(
    pricings.reduce((acc, pricing) => ({
      ...acc,
      [pricing.vehicle_id]: {
        basePrice: pricing.base_price,
        pricePerKm: pricing.price_per_km,
        peakHoursMultiplier: pricing.peak_hours_multiplier,
        deliveryFee: pricing.delivery_fee,
        commissionRate: pricing.commission_rate // Ajouté
      }
    }), {})
  )
}

public async update({ params, request, response }: HttpContextContract) {
  const { id } = params
  const data = request.only([
    'basePrice',
    'pricePerKm',
    'peakHoursMultiplier',
    'deliveryFee',
    'commissionRate' // Ajouté
  ])

  try {
    let pricing = await Pricing.find(id)
    
    if (!pricing) {
      pricing = await Pricing.create({
        vehicle_id: id,
        base_price: data.basePrice,
        price_per_km: data.pricePerKm,
        peak_hours_multiplier: data.peakHoursMultiplier,
        delivery_fee: data.deliveryFee,
        commission_rate: data.commissionRate // Ajouté
      })
      return response.created(pricing)
    }

    pricing.merge({
      base_price: data.basePrice,
      price_per_km: data.pricePerKm,
      peak_hours_multiplier: data.peakHoursMultiplier,
      delivery_fee: data.deliveryFee,
      commission_rate: data.commissionRate // Ajouté
    })

    await pricing.save()
    return response.ok(pricing)
  } catch (error) {
    return response.badRequest({ message: 'Erreur lors de la mise à jour', error })
  }
}


public async show({ params, response }: HttpContextContract) {
  const vehiculeId = params.vehicule_id;

  console.log("vehicule_id" ,vehiculeId)
  console.log('params' ,params);
  const pricing = await Pricing.query()
    .where('vehicle_id', vehiculeId)
    .first();

  if (!pricing) {
    return response.notFound({ message: 'Aucun tarif trouvé pour ce véhicule.' });
  }

  console.log("data" ,pricing)

  return response.json(pricing)


}



 public async financialStats({ response }: HttpContextContract) {
    try {
      // Calcul des statistiques financières
      const [totalRevenue, totalRides] = await Promise.all([
        this.getTotalRevenue(),
        this.getTotalRides(),
      ])

      // Calcul des sous-statistiques
      const commissionRate = 0.25 // 25% de commission
      const commission = totalRevenue * commissionRate
      const driverPayments = totalRevenue - commission

      return response.json([
        {
          id: 'total_revenue',
          title: "Revenu total",
          value: totalRevenue,
          change: "+5%", // À remplacer par une logique de comparaison périodique
          trend: "up"
        },
        {
          id: 'total_rides',
          title: "Courses",
          value: totalRides,
          change: "+8%",
          trend: "up"
        },
        {
          id: 'commission',
          title: "Commission",
          value: commission,
          change: "+3%",
          trend: "up"
        },
        {
          id: 'driver_payments',
          title: "Paiements chauffeurs",
          value: driverPayments,
          change: "+3%",
          trend: "up"
        }
      ])
    } catch (error) {
      return response.status(500).json({
        message: "Erreur lors de la récupération des statistiques financières"
      })
    }
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await Ride.query()
      .where('status', 'completed')
      .where('is_paid', true)
      .sum('price as total')
      .first()

    return Number(result?.$extras.total) || 0
  }

  private async getTotalRides(): Promise<number> {
    const result = await Ride.query()
      .where('status', 'completed')
      .where("is_paid" ,true)
      .count('* as total')
      .first()

    return Number(result?.$extras.total) || 0
  }

  // Méthode optionnelle pour les variations périodiques
  // private async getPeriodComparison() {
  //   // Implémentez la logique de comparaison avec la période précédente
  //   // Ex: comparer avec le mois dernier
  //   return 0
  // }


  /**
   * Connexion utilisateur
   */
  public async login({ request, response, auth }: HttpContextContract) {
      console.log("phone , password" ,request.input('username') ,request.input("password"))
    const { phone, password } = await request.validate({ schema: this.loginSchema })
  


    console.log("phone , password" ,phone ,password)
    try {
      // Utilise phone comme identifiant
      const token = await auth.use('api').attempt(phone, password, {
        expiresIn: '7days',
      })
      const user = await User.query()
        .where('phone', phone)
        .firstOrFail()
  
      return response.ok({
        user: user.serialize(),
        token,
      })
    } catch (error) {
      return response.json({
        message: 'Identifiants incorrects',
        error:error
      })
    }
  }
  

  /**
   * Déconnexion
   */
  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.noContent()
  }

  /**
   * Récupérer l'utilisateur courantMg.E32t4aXY8rzLTVKZBulOqQF_3jUw2GtoSgy7apahDFskyFwB9f1vI9fAsPbC
   */
  public async me({ auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.user!

    // Charge les relations si nécessaire
    // await user.load('profile')

    return response.ok(user)
  }

  /**

      vehiculeType: schema.string.optional(),
  matricule: schema.string.optional()
   * Rafraîchir le token
   */
  public async refresh({ auth, response }: HttpContextContract) {
    const user = auth.user!
    await auth.use('api').revoke()

    const token = await auth.use('api').generate(user, {
      expiresIn: '7days',
    })

    return response.ok({
      user: user.serialize(),
      token,
    })
  }

  /**
   * Envoyer un email de réinitialisation
   */
//   public async forgotPassword({ request, response }: HttpContextContract) {
//     const email = request.input('email')
//     const user = await User.findByOrFail('email', email)

//     // Générer un token et envoyer un email
//     const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
//     user.rememberMeToken = token
//     user.tokenCreatedAt = DateTime.now()
//     await user.save()

//     // TODO: Implémenter l'envoi d'email
//     // await Mail.send((message) => {
//     //   message
//     //     .to(user.email)
//     //     .subject('Réinitialisation de mot de passe')
//     //     .htmlView('emails/reset_password', { token })
//     // })

//     return response.accepted({
//       message: 'Un email de réinitialisation a été envoyé',
//     })
//   }

  /**
   * Réinitialiser le mot de passe
   */
//   public async resetPassword({ request, response }: HttpContextContract) {
//     const { token, password } = request.only(['token', 'password'])

//     const user = await User.query()
//       .where('remember_me_token', token)
//       .where('token_created_at', '>', DateTime.now().minus({ hours: 24 }).toSQL())
//       .firstOrFail()

//     user.password = password
//     user.rememberMeToken = null
//     user.tokenCreatedAt = null
//     await user.save()

//     return response.ok({
//       message: 'Mot de passe mis à jour avec succès',
//     })
//   }
}