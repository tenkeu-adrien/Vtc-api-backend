import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ride_id').unsigned().references('id').inTable('rides').notNullable()
      table.integer('client_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('driver_id').unsigned().references('id').inTable('users').notNullable()
      table.enum('payment_method', ['cash', 'orange_money', 'mobile_money']).notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.decimal('commission', 12, 2).notNullable() // Commission de la plateforme
      table.timestamp('transaction_date').notNullable()
      table.index(['ride_id'])
table.index(['transaction_date'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}



















