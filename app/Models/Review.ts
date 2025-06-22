// app/Models/Review.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Order from './Order'
import Ride from './Ride'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderId: number | null

  @column()
  public rideId: number | null

  @column()
  public reviewerId: number

  @column()
  public targetId: number

  @column()
  public rating: number

  @column()
  public comment: string | null

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>

  @belongsTo(() => Ride)
  public ride: BelongsTo<typeof Ride>

  @belongsTo(() => User, { foreignKey: 'reviewerId' })
  public reviewer: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'targetId' })
  public target: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}