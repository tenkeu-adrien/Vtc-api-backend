// app/Models/Ride.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Review from './Review'

export default class Ride extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientId: number
                                   
  @column()
  public driverId: number

  @column()
public rating?: number

@column()
public ratingComment?: string

  @column()
  public vehicleType: 'moto-taxi' | 'tricycle'

  @column()
  public pickupLocation: string

  @column()
  public destinationLocation: string

  @column()
  public distance?: number

  @column()
  public price?: number

  @column()
  public paymentMethod?: string

  @column()
  public recipient?: string

  @column()
  public duration?: string

  @column.dateTime()
  public endedAt?: DateTime

  @column()
  public status:  string| 'pending'|'accepted'|'in_progress'|'completed'|'cancelled'

  @column.dateTime({ autoCreate: false })
  public startedAt: DateTime | null

    @column.dateTime({ autoCreate: false })
  public scheduledAt: DateTime | null

  @column.dateTime({ autoCreate: false })
  public completedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'clientId' })
  public client: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'driverId' })
  public driver: BelongsTo<typeof User>

 @column()
  public isPaid: boolean

  @hasOne(() => Review)
  public review: HasOne<typeof Review>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}