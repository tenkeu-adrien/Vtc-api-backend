// app/Controllers/Http/ProfilesController.ts
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Profile from 'App/Models/Profile'
// import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProfilesController {
  // public async show({ params }: HttpContextContract) {
  //   return await Profile.query().where('user_id', params.userId).firstOrFail()
  // }

  // public async update({ params, request }: HttpContextContract) {
  //   const profile = await Profile.findByOrFail('user_id', params.userId)
  //   const profileSchema = schema.create({
  //     firstName: schema.string.optional(),
  //     lastName: schema.string.optional(),
  //     avatarUrl: schema.string.optional(),
  //     dateOfBirth: schema.date.optional(),
  //     gender: schema.enum.optional(['male', 'female', 'other'] as const),
  //     address: schema.string.optional(),
  //       street: schema.string(),
  //       city: schema.string(),
  //       postal_code: schema.string(),
  //       coords: schema.object().members({
  //         lat: schema.number(),
  //         lng: schema.number()
  //       })
  //     })
  //   })

    // const data = await request.validate({ schema: profileSchema })
    // profile.merge(data)
    // return await profile.save()
  }
