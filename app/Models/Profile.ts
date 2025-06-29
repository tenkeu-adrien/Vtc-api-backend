// app/Models/Profile.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public avatarUrl: string | null

  @column.date()
  public dateOfBirth: DateTime | null

  @column()
  public gender: 'male' | 'female' | 'other' | null

  @column()
  public address: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}