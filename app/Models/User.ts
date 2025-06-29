// app/Models/User.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany , beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Order from './Order'
import Ride from './Ride'
import Review from './Review'
import Vehicle from './Vehicule'
import Hash from '@ioc:Adonis/Core/Hash'
import Rating from './Rating'
import PromoCode from './PromoCode'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string


  @column()
  public avatar: string

    @column()
  public  driverType: string

  @column()
  public jointe: string

  @column()
  public phone: string

  
    @column()
  public fcmToken : string

  

  @column()
  public  vehiculeType: string


    @column()
  public  matricule: string


  @column({ serializeAs: null })
  public password: string

  @column()
  public role: 'client' | 'driver' | 'deliverer' | 'admin'

  @column()
  public isVerified: boolean

  @column()
  public isDeleted: boolean


  @hasMany(() => Profile)
  public profile: HasMany<typeof Profile>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }


  @hasMany(() => PromoCode)
  public promoCodes: HasMany<typeof PromoCode>


  @hasMany(() => Rating, {
    foreignKey: 'clientId' // Utilisez le nom de la propriété (clientId) pas le nom de colonne
  })
  public givenRatings: HasMany<typeof Rating>

  @hasMany(() => Rating, {
    foreignKey: 'driverId' // Utilisez le nom de la propriété (driverId) pas le nom de colonne
  })
  public receivedRatings: HasMany<typeof Rating>



  @hasMany(() => Vehicle)
  public vehicles: HasMany<typeof Vehicle>

  @hasMany(() => Order, { foreignKey: 'clientId' })
  public orders: HasMany<typeof Order>

  @hasMany(() => Ride, { foreignKey: 'clientId' })
  public clientRides: HasMany<typeof Ride>

  @hasMany(() => Ride, { foreignKey: 'driverId' })
  public driverRides: HasMany<typeof Ride>

  @hasMany(() => Review, { foreignKey: 'reviewerId' })
  public reviewsGiven: HasMany<typeof Review>

  @hasMany(() => Review, { foreignKey: 'targetId' })
  public reviewsReceived: HasMany<typeof Review>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}