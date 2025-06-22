import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckRole {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    roles: string[]
  ) {
    const user = auth.user
    
    if (!user || !roles.includes(user.role)) {
      return response.unauthorized({
        message: 'Unauthorized access',
      })
    }

    await next()
  }
}



// app/Middleware/CheckRole.ts

