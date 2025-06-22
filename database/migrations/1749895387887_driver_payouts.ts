// database/migrations/XXXXX_create_driver_payouts.ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'driver_payouts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('total_earnings', 12, 2).notNullable()
      table.decimal('platform_cut', 12, 2).notNullable()
      table.decimal('payout_amount', 12, 2).notNullable()
      table.string('payout_reference').notNullable()
      table.date('payout_date').notNullable()
      table.enum('status', ['pending', 'paid', 'failed']).defaultTo('pending')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}