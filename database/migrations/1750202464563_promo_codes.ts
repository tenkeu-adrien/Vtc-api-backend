import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreatePromoCodes extends BaseSchema {
  protected tableName = 'promo_codes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('code', 20).notNullable().unique()
      table.decimal('discount', 5, 2).notNullable() // Ex: 10.50 pour 10.5%
      table.integer('rides_count').unsigned().notNullable()
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('used_count').unsigned().defaultTo(0)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index(['user_id'])
      table.index(['code'])
      table.index(['is_active'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}