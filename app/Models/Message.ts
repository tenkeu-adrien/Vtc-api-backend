import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Ride from './Ride'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rideId: number

  @column()
  public senderId: number

  @column()
  public receiverId: number

  @column()
public isRead: boolean

  @column()
  public content: string

  @belongsTo(() => User, { foreignKey: 'senderId' })
  public sender: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiverId' })
  public receiver: BelongsTo<typeof User>

  @belongsTo(() => Ride)
  public ride: BelongsTo<typeof Ride>
}
