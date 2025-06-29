import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'partner_shops'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('address').notNullable()
      table.string('contact_phone').notNullable()
      table.enum('category', ['supermarket', 'convenience', 'other']).notNullable()
      table.boolean('is_active').defaultTo(true)
      table.decimal('commission_rate', 3, 2).defaultTo(0.1)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
