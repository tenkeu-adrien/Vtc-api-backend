import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Ride from './Ride'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rideId: number

  @column()
  public clientId: number

  @column()
  public driverId: number

  @column()
  public paymentMethod: 'cash' | 'orange_money' | 'mobile_money'

  @column()
  public amount: number

  @column()
  public commission: number

  @column.dateTime()
  public transactionDate: DateTime

  @belongsTo(() => Ride)
  public ride: BelongsTo<typeof Ride>

  @belongsTo(() => User, { foreignKey: 'clientId' })
  public client: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'driverId' })
  public driver: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}






















