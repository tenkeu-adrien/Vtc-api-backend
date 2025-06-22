import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class DriverPayout extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public payoutReference: string

// Votre clé étrangère actuelle

  @column()
  public totalEarnings: number

  @column()
  public platformCut: number

  @column()
  public payoutAmount: number

  @column()
public userId: number



  @column()
  public status: 'pending' | 'paid' | 'failed'

  @column.date()
  public payoutDate: DateTime

  // Spécifiez explicitement la clé étrangère
  @belongsTo(() => User)
  public driver: BelongsTo<typeof User>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}