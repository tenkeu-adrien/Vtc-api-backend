// app/Models/Product.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PartnerShop from './PartnerShop'
import OrderItem from './OrderItem'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public shopId: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public price: number

  @column()
  public category: string | null

  @column()
  public imageUrl: string | null

  @column()
  public stockQuantity: number

  @belongsTo(() => PartnerShop)
  public shop: BelongsTo<typeof PartnerShop>

  @hasMany(() => OrderItem)
  public orderItems: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}