// app/Controllers/Http/ProductsController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProductsController {
  public async index({ request }: HttpContextContract) {
    const shopId = request.input('shop_id')
    const query = Product.query()

    if (shopId) {
      query.where('shop_id', shopId)
    }

    if (request.input('category')) {
      query.where('category', request.input('category'))
    }

    return await query.exec()
  }

  public async store({ request }: HttpContextContract) {
    const productSchema = schema.create({
      shopId: schema.number(),
      name: schema.string(),
      description: schema.string.optional(),
      price: schema.number(),
      category: schema.string.optional(),
      stockQuantity: schema.number.optional(),
    })

    const data = await request.validate({ schema: productSchema })
    return await Product.create(data)
  }

  public async show({ params }: HttpContextContract) {
    return await Product.findOrFail(params.id)
  }

  public async update({ params, request }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)
    const productSchema = schema.create({
      name: schema.string.optional(),
      price: schema.number.optional(),
      stockQuantity: schema.number.optional(),
    })

    const data = await request.validate({ schema: productSchema })
    product.merge(data)
    return await product.save()
  }

  public async destroy({ params, response }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.noContent()
  }
}