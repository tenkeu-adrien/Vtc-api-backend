import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pricings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('vehicle_id').unsigned().primary()
      
      table.integer('base_price').notNullable().defaultTo(1500)
      table.integer('price_per_km').notNullable().defaultTo(500)
      table.decimal('peak_hours_multiplier', 3, 1).notNullable().defaultTo(1.5)
      table.integer('delivery_fee').notNullable().defaultTo(2000)
      table.integer('commission_rate').notNullable().defaultTo(10) // Nouveau champ (en pourcentage)
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}