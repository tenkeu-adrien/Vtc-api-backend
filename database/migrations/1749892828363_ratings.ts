// database/migrations/XXXXX_create_ratings.ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RatingsSchema extends BaseSchema {
  protected tableName = 'ratings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // Références aux tables existantes
      table.integer('ride_id').unsigned().references('id').inTable('rides').onDelete('CASCADE')
      table.integer('client_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('driver_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      
      // Données d'évaluation
      table.float('rating', 2, 1).unsigned().notNullable() // Note entre 0.0 et 5.0
      table.text('comment').nullable()
      table.boolean('is_driver_rating').notNullable() // Pour différencier évaluation client/driver
      
      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      
      // Index
      table.index(['ride_id'])
      table.index(['client_id'])
      table.index(['driver_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}