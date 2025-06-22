// app/Models/Order.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import PartnerShop from './PartnerShop'
import OrderItem from './OrderItem'
import Review from './Review'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientId: number

  @column()
  public delivererId: number | null


  @column()
  public status: 'pending' | 'preparing' | 'in_delivery' | 'delivered' | 'cancelled'

  @column()
  public totalAmount: number

  @column()
  public deliveryFee: number

  @column()
  public paymentMethod: 'mobile_money' | 'cash'

  @column()
  public paymentStatus: 'pending' | 'paid' | 'failed'

  @column()
  public deliveryAddress: object
  
  @column({ columnName: 'partner_shop_id' })
public partnerShopId: number | null
  

  @belongsTo(() => User, { foreignKey: 'clientId' })
  public client: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'delivererId' })
  public deliverer: BelongsTo<typeof User>

  @belongsTo(() => PartnerShop)
  public shop: BelongsTo<typeof PartnerShop>
  

  @hasMany(() => OrderItem)
  public items: HasMany<typeof OrderItem>

  @hasOne(() => Review)
  public review: HasOne<typeof Review>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}