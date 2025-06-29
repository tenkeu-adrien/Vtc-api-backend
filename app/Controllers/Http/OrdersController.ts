// app/Controllers/Http/OrdersController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import { schema } from '@ioc:Adonis/Core/Validator'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import { DateTime } from 'luxon'
export default class OrdersController {
  public async index({ request}: HttpContextContract) {
    // const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    const query = Order.query()
      .preload('client')
      .preload('deliverer')
    //   .preload('shop')
      .preload('items')

    // if (user.role === 'client') {
    //   query.where('client_id', user.id)
    // } else if (user.role === 'deliverer') {
    //   query.where('deliverer_id', user.id)
    // }

    // if (request.input('status')) {
    //   query.where('status', request.input('status'))
    // }

    return await query.paginate(page, limit)
  }

  // public async store({ request, auth }: HttpContextContract) {
  //   const orderSchema = schema.create({
  //     shopId: schema.number.optional(),
  //     items: schema.array().members(
  //       schema.object().members({
  //         productId: schema.number(),
  //         quantity: schema.number(),
  //       })
  //     ),
  //     deliveryAddress: schema.object().members({
  //       street: schema.string(),
  //       city: schema.string(),
  //       postal_code: schema.string(),
  //       coords: schema.object().members({
  //         lat: schema.number(),
  //         lng: schema.number()
  //       })
  //     }),
  //     paymentMethod: schema.enum(['mobile_money', 'cash'] as const),
  //   })

  //   const data = await request.validate({ schema: orderSchema })
  //   const order = await Order.create({
  //     clientId: auth.user!.id,
  //     status: 'pending',
  //     ...data
  //   })

  //   await order.related('items').createMany(data.items)
  //   return order
  // }

  public async show({ params}: HttpContextContract) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('client')
      .preload('deliverer')
    //   .preload('shop')
      .preload('items')
      .firstOrFail()

    // Autorisation simple
    // if (auth.user!.role === 'client' && order.clientId !== auth.user!.id) {
    //   throw new Error('Unauthorized')
    // }

    return order
  }

  public async updateStatus({ params, request }: HttpContextContract) {
    const order = await Order.findOrFail(params.id)
    const statusSchema = schema.create({
      status: schema.enum(['preparing', 'in_delivery', 'delivered', 'cancelled'] as const),
      delivererId: schema.number.optional(),
    })

    const data = await request.validate({ schema: statusSchema })
    order.merge(data)
    return await order.save()
  }


//   private createOrderSchema = schema.create({
//     items: schema.array([rules.minLength(1)]).members(
//       schema.object().members({
//         productId: schema.number(),
//         quantity: schema.number(),
//         unitPrice: schema.number(),
//       })
//     ),
//     deliveryAddress: schema.object().members({
//       street: schema.string(),
//       city: schema.string(),
//       coordinates: schema.object.optional().members({
//         lat: schema.number(),
//         lng: schema.number(),
//       }),
//     }),
//     partnerShopId: schema.number.optional(),
//   })

  /**
   * Récupérer toutes les commandes avec filtres
   */
//   public async index({ request, response }: HttpContextContract) {
//     const { status, page = 1, limit = 10 } = request.qs()

//     const query = Order.query()
//       .preload('client')
//       .preload('deliverer')
//       .preload('shop')
//       .preload('items')
//       .preload('review')

//     if (status) {
//       query.where('status', status)
//     }

//     const orders = await query.paginate(page, limit)

//     return response.ok(orders)
//   }

  /**
   * Récupérer les commandes disponibles pour les livreurs
   */
  public async available({ response }: HttpContextContract) {
    const availableOrders = await Order.query()
      .whereIn('status', ['preparing'])
      .preload('client')
      .preload('shop')
      .preload('items')

    return response.ok(availableOrders)
  }

  /**
   * Récupérer une commande spécifique
   */
//   public async show({ params, response }: HttpContextContract) {
//     const order = await Order.query()
//       .where('id', params.id)
//       .preload('client')
//       .preload('deliverer')
//       .preload('shop')
//       .preload('items')
//       .preload('review')
//       .firstOrFail()

//     return response.ok(order)
//   }

  /**
   * Créer une nouvelle commande
   */
//   public async store({ request, response, auth }: HttpContextContract) {
//     const payload = await request.validate({ schema: this.createOrderSchema })

//     const order = await Database.transaction(async (trx) => {
//       const order = new Order()
//       order.clientId = auth.user!.id
//       order.status = 'pending'
//       order.deliveryAddress = payload.deliveryAddress
//       order.partnerShopId = payload.partnerShopId || null
      
//       if (payload.partnerShopId) {
//         order.deliveryFee = await this.calculateDeliveryFee(payload.deliveryAddress)
//       }

//       await order.useTransaction(trx).save()

//       // Calcul du montant total
//       let totalAmount = order.deliveryFee
//       for (const item of payload.items) {
//         await order.related('items').create({
//           productId: item.productId,
//           quantity: item.quantity,
//           unitPrice: item.unitPrice,
//         })
//         totalAmount += item.unitPrice * item.quantity
//       }

//       order.totalAmount = totalAmount
//       await order.useTransaction(trx).save()

//       return order
//     })

//     return response.created(order)
//   }

  /**
   * Accepter une commande (pour livreur)
   */
  public async accept({ params, response, auth }: HttpContextContract) {
    const order = await Order.findOrFail(params.id)

    if (order.status !== 'preparing') {
      return response.badRequest({ message: 'Cette commande ne peut pas être acceptée' })
    }

    order.delivererId = auth.user!.id
    order.status = 'in_delivery'
    await order.save()

    return response.ok(order)
  }

  /**
   * Mettre à jour le statut d'une commande
   */
//   public async updateStatus({ params, request, response }: HttpContextContract) {
//     const { status } = await request.validate({
//       schema: schema.create({
//         status: schema.enum(['preparing', 'in_delivery', 'delivered', 'cancelled'] as const),
//       }),
//     })

//     const order = await Order.findOrFail(params.id)
    
//     // Validation des transitions de statut
//     const validTransitions: Record<string, string[]> = {
//       pending: ['preparing', 'cancelled'],
//       preparing: ['in_delivery', 'cancelled'],
//       in_delivery: ['delivered'],
//     }

//     if (!validTransitions[order.status]?.includes(status)) {
//       return response.badRequest({ 
//         message: `Transition de statut invalide: ${order.status} -> ${status}` 
//       })
//     }

//     order.status = status
    
//     // Si la commande est livrée, marquer comme payée si c'est le cas
//     if (status === 'delivered' && order.paymentMethod === 'cash') {
//       order.paymentStatus = 'paid'
//     }

//     await order.save()

//     return response.ok(order)
//   }

  /**
   * Annuler une commande
   */
  public async cancel({ params, response, auth }: HttpContextContract) {
    const order = await Order.findOrFail(params.id)

    // Seul le client ou un admin peut annuler
    if (order.clientId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.unauthorized({ message: 'Non autorisé' })
    }

    // Ne peut annuler que les commandes pas encore en livraison
    if (!['pending', 'preparing'].includes(order.status)) {
      return response.badRequest({ 
        message: 'Cette commande ne peut plus être annulée' 
      })
    }

    order.status = 'cancelled'
    await order.save()

    // TODO: Gérer le remboursement si paiement en ligne

    return response.ok(order)
  }

  /**
   * Récupérer les commandes en cours pour un utilisateur
   */
  public async current({ response, auth }: HttpContextContract) {
    const user = auth.user!

    let query = Order.query()
      .whereNot('status', 'delivered')
      .whereNot('status', 'cancelled')
      .preload('shop')
      .preload('items')

    if (user.role === 'client') {
      query = query.where('clientId', user.id)
    } else if (user.role === 'delivery_man') {
      query = query.where('delivererId', user.id)
    }

    const orders = await query.exec()

    return response.ok(orders)
  }

  /**
   * Calculer les frais de livraison (méthode privée)
   */
  // private async calculateDeliveryFee(deliveryAddress: any): Promise<number> {
  //   // Implémentez votre logique de calcul ici
  //   // Exemple basique: frais fixes + distance
  //   return 500 // 500 FCFA par défaut
  // }

  /**
   * Statistiques des commandes (pour dashboard admin)
   */
//   public async stats({ response }: HttpContextContract) {
//     const stats = await Order.query()
//       .select('status', Database.raw('count(*) as count'))
//       .groupBy('status')

//     const revenue = await Order.query()
//       .where('paymentStatus', 'paid')
//       .sum('totalAmount as total')
//       .first()

//     return response.ok({
//       stats,
//       totalRevenue: revenue?.total || 0,
//     })
//   }
}