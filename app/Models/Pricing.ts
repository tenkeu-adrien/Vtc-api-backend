import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Pricing extends BaseModel {
  public static table = 'pricings'

  @column({ isPrimary: true })
  public vehicle_id: number

  @column()
  public base_price: number

  @column()
  public price_per_km: number

  @column()
  public peak_hours_multiplier: number

  @column()
  public delivery_fee: number

  @column()
  public commission_rate: number // Nouveau champ

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}