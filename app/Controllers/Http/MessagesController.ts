import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Ride from 'App/Models/Ride'
export default class MessagesController {
  public async index({ auth, response }: HttpContextContract) {
    const user = auth.user!

    if (user.role === 'admin') {
      const messages = await Message.query().preload('sender').preload('ride')
      return messages
    }

    const messages = await Message.query()
      .where('sender_id', user.id)
      .preload('sender')
      .preload('ride')

    return  response.send({success:true , messages  ,message:"message get succefully"})
}
  

public async getRideMessages({ params, auth, response }: HttpContextContract) {
    const rideId = params.rideId
    const user = auth.user!

    const ride = await Ride.findOrFail(rideId)

    // Autorisation : seul le client ou le chauffeur de la course peuvent accéder aux messages
    if (
      user.role !== 'admin' &&
      user.id !== ride.clientId &&
      user.id !== ride.driverId
    ) {
      return response.unauthorized({    success:false,message: 'Accès non autorisé à cette course' })
    }

    const messages = await Message
      .query()
      .where('ride_id', rideId)
      .orderBy('created_at', 'asc')

    return response.send({success:true , messages  ,message:"message get succefully"})
  }

public async store({ request, auth ,response}: HttpContextContract) {
    const { rideId, content, receiverId } = request.only(['rideId', 'content', 'receiverId'])
  
    const chatMessageSchema = schema.create({
        rideId: schema.number([rules.exists({ table: 'rides', column: 'id' })]),
        content: schema.string([rules.minLength(1)]),
        receiverId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      });
      

      await request.validate({ schema: chatMessageSchema })
    const messages = await Message.create({
      rideId,
      content,
      senderId: auth.user!.id,
      receiverId,
    })
  
    // Emission WebSocket ici si tu veux : Chat.emit('message', message)
    return response.send({success:true , messages  ,message:"message add  succefully"})
  }
  

  public async show({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    const rideId = params.ride_id

    if (user.role === 'admin') {
      return await Message.query().where('ride_id', rideId).preload('sender')
    }

    const messages = await Message.query()
      .where('ride_id', rideId)
      .andWhere('sender_id', user.id)
      .preload('sender')

    return   response.send({success:true , messages  ,message:"message get succefully"})
}



    /**
 * Marquer tous les messages reçus par l'utilisateur sur une course comme lus
 */
public async markMessagesAsRead({ auth, params, response }: HttpContextContract) {
    const user = auth.user!
    const rideId = params.rideId
  
    // On vérifie que le user est bien impliqué dans la course
    const ride = await Ride.findOrFail(rideId)
  
    if (
      user.role !== 'admin' &&
      user.id !== ride.clientId &&
      user.id !== ride.driverId
    ) {
      return response.unauthorized({ message: 'Accès interdit à cette course' })
    }
  
    const updatedCount = await Message
      .query()
      .where('ride_id', rideId)
      .where('receiver_id', user.id)
      .where('is_read', false)
      .update({ isRead: true })
  
    return response.ok({
      message: 'Messages marqués comme lus',
      updatedCount,
    })
  }
  



  }
