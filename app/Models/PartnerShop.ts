// app/Models/PartnerShop.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Order from './Order'

export default class PartnerShop extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public contactPhone: string

  @column()
  public category: 'supermarket' | 'convenience' | 'other'

  @column()
  public isActive: boolean

  @column()
  public commissionRate: number

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}