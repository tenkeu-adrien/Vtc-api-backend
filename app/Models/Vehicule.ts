// app/Models/Vehicle.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: 'moto' | 'tricycle'

  @column()
  public pricePerKmCourse: number

  @column()
  public pricePerKmDelivery: number

  @column()
  public pricePerHourDelivery?: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}









 
