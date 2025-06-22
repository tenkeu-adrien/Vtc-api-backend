// app/Controllers/Http/RidesController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ride from 'App/Models/Ride'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RidesController {
  public async index({ request,response }: HttpContextContract) {
    // const user = auth.user!
    console.log("request per_page" ,request.params)
    const page = request.input('page', 1)
    const limit = request.input('per_page', 10)
   const user={
    id:1,
    role:"admin"
   }
    const query = Ride.query()
      .preload('client')
      .preload('driver')
  
    if (user.role === 'client') {
      query.where('client_id', user.id)
    } else if (user.role === 'driver') {
      query.where('driver_id', user.id)
    } else if (user.role === 'admin') {
      // Ne filtre pas, il verra tout
    }
  
    if (request.input('status')) {
      query.where('status', request.input('status'))
    }
  
    let  rides = await query.paginate(page, limit)
   return  response.send({"message" :"rides get success" ,rides})
    
  }
  



  public async get({ response }: HttpContextContract) {
  const rides = await Ride.query()
    .where('status', 'completed')
  
    .orderBy('completed_at', 'desc') // tri facultatif, mais utile

  return response.ok({
    message: 'Completed rides fetched successfully',
    data: rides.map(ride => ride.serialize())
  })
}



  public async store({ request ,response}: HttpContextContract) {

    console.log("request" ,request.body())
    const schemaRide = schema.create({
      vehicleType: schema.enum(['moto', 'tricycle'] as const),
// Accepte absolument tout type
      paymentMethod: schema.string.optional(),
      duration: schema.string.optional(),
      distance: schema.number.optional(),
      price: schema.number.optional(),
    })

    const data = await request.validate({ schema: schemaRide })
  
    // console.log("auth middleware" , auth.user)
    const ride = await Ride.create({
      ...data,
      clientId: 1,
      pickupLocation:request.input("pickupLocation") ,
      destinationLocation:request.input("destinationLocation"),
      recipient:request.input("recipient") || null
    })
    // auth.user?.id 
  
    const io = use('Socket')
    io.emit('ride:new', {
      rideId: ride.id,
      clientId: ride.clientId,
      pickupLocation: ride.pickupLocation,
      destinationLocation: ride.destinationLocation
    })
    // TODO: émettre un event socket si besoin
    return  response.send({"message" :"ride add success" ,ride})
  }
  



  public async updateStatus({ params, request, auth, response }: HttpContextContract) {
    const schemaStatus = schema.create({
      status: schema.enum(['requested', 'accepted', 'in_progress', 'completed', 'cancelled'] as const),
    })
  
    const { status } = await request.validate({ schema: schemaStatus })
    console.log("ride id" ,params);

    const ride = await Ride.findOrFail(params.id)
   
    
    const user = auth.user!
  
    // Règles métier selon le nouveau statut
    switch (status) {
      case 'accepted':
        if (user.role !== 'driver') {
          return response.unauthorized({ message: 'Seul un chauffeur peut accepter une course.' })
        }
        ride.driverId = user.id
        ride.startedAt = DateTime.now()
        break
  
      case 'in_progress':
        if (user.role !== 'driver' || ride.driverId !== user.id) {
          return response.unauthorized({ message: 'Seul le chauffeur assigné peut démarrer la course.' })
        }
        break
  
      case 'completed':
        if (user.role !== 'driver' || ride.driverId !== user.id) {
          return response.unauthorized({ message: 'Seul le chauffeur assigné peut terminer la course.' })
        }
        ride.endedAt = DateTime.now()
        break
  
      case 'cancelled':
        // On ne laisse pas faire ici, une route spéciale s'en occupe
        return response.badRequest({ message: 'Utilisez la route /cancel pour annuler une course.' })
  
      case 'requested':
        return response.badRequest({ message: 'Impossible de remettre une course à l\'état initial.' })
    }
  
    ride.status = status
    await ride.save()

    const io = use('Socket')
    io.emit('ride:status:update', {
      rideId: ride.id,
      status: ride.status,
      driverId: ride.driverId,
      clientId: ride.clientId
    })
  
    return response.ok({ message: 'Statut de la course mis à jour.', ride })
  }
  



  // Dans votre contrôleur RidesController.js

public async revenueStats({ response }) {
  try {
    const revenueStats = await Database
      .query()
      .select(
        Database.raw('EXTRACT(MONTH FROM completed_at) as month'),
        Database.raw('SUM(price) as total_revenue')
      )
      .from('rides')
      .where('status', 'completed')
      .whereRaw('EXTRACT(YEAR FROM completed_at) = EXTRACT(YEAR FROM NOW())')
      .groupByRaw('EXTRACT(MONTH FROM completed_at)')
      .orderBy('month');

    const monthlyData = Array(12).fill(0);
    revenueStats.forEach(row => {
      monthlyData[row.month - 1] = parseFloat(row.total_revenue);
    });

    return response.ok(monthlyData);
  } catch (error) {
    return response.status(500).send({
      message: 'Erreur lors de la récupération des statistiques de revenus',
      error: error.message
    });
  }
}
_formatPaymentMethod(method) {
  const methods = {
    'cash': 'Espèces',
    'orange_money': 'Orange Money',
    'mobile_money': 'Mobile Money'
  };
  return methods[method] || method;
}

async paymentDistribution({ response }) {
  try {
    const distribution = await Database
      .query()
      .select(
        'payment_method as method',
        Database.raw('COUNT(*) as count'),
        Database.raw('SUM(price) as amount')
      )
      .from('rides')
      .where('status', 'completed')
      .groupBy('payment_method');

    const formattedData = distribution.map(row => ({
      method: this._formatPaymentMethod(row.method),
      count: parseInt(row.count),
      amount: parseFloat(row.amount)
    }));

    return response.ok(formattedData);
  } catch (error) {
    return response.status(500).send({
      message: 'Erreur lors de la récupération de la répartition des paiements',
      error: error.message
    });
  }
}





  

  public async getRideById({ params, auth, response }: HttpContextContract) {
    const ride = await Ride.findOrFail(params.id)
  
    const user = auth.user!
  
    if (user.role === 'client' && ride.clientId !== user.id) {
      return response.unauthorized({success:false , message: 'Accès interdit à cette course.' })
    }
  
    if (user.role === 'driver' && ride.driverId !== user.id) {
      return response.unauthorized({ success:false , message: 'Accès interdit à cette course.' })
    }
  
    // Si admin ou autorisé, on retourne la course
    return response.ok({succcess:true, message: 'ride  envoyer avec success', ride })
  }
  


  public async cancelRide({ params, auth, response }: HttpContextContract) {
    const ride = await Ride.findOrFail(params.id)
    const user = auth.user!
  
    // Admin peut toujours annuler
    if (user.role === 'admin') {
      ride.status = 'cancelled'
      await ride.save()
      return response.ok({ success:true , message: 'Course annulée par l\'admin.', ride })
    }
  
    // Client peut annuler seulement s’il est le propriétaire et si course pas encore acceptée
    if (user.role === 'client') {
      if (ride.clientId !== user.id) {
         ride.status = 'cancelled'
        await ride.save()
        return response.ok({ success:true , message: 'Course annulée par le client.', ride })
      }
      if (ride.status !== 'requested') {
        return response.badRequest({ success:false, message: 'Impossible d’annuler une course déjà acceptée ou en cours.' })
      }
      ride.status = 'cancelled'
      await ride.save()
      return response.ok({  success:true , message: 'Course annulée.', ride })
    }
  
    // Chauffeur peut annuler une course qui lui est assignée, si elle est en cours
    if (user.role === 'driver') {
      if (ride.driverId !== user.id) {
        return response.unauthorized({  success:false ,  message: 'Vous n\'êtes pas assigné à cette course.' })
      }
      if (ride.status !== 'in_progress') {
        return response.badRequest({  success:true ,  message: 'Seules les courses en cours peuvent être annulées par le chauffeur.' })
      }
      ride.status = 'cancelled'
      await ride.save()
      return response.ok({  success : true ,message: 'Course annulée par le chauffeur.', ride })
    }
  
    return response.badRequest({ success:false , message: 'Annulation non autorisée pour ce rôle.' })
  }
 public async show({ params, response }: HttpContextContract) {
  const userId = params.id // L'ID de l'utilisateur passé dans les paramètres

  const rides = await Ride.query()
    .where((query) => {
      query.where('client_id', userId) // Rides où l'utilisateur est client
           .orWhere('driver_id', userId) // Ou rides où l'utilisateur est driver
    })
    .preload('client') // Charge les données du client
    .preload('driver') // Charge les données du driver
    .exec() // Récupère tous les résultats (sans pagination)

  return response.send({
    message: "User rides retrieved successfully",
    data: rides // Retourne tous les rides en une seule fois
  })
}
}