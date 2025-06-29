import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('first_name').notNullable()
      table.string('phone').notNullable().unique()
      table.string('password').notNullable()
      table.string('vehicule_type').nullable()
      table.string('matricule').nullable()
      table.enum('role', ['client', 'driver', 'deliverer', 'admin']).notNullable()
      table.boolean('is_verified').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)
      table.string("avatar").nullable()
      table.string("jointe").nullable()
      table.string("driver_type").nullable()
      table.string('fcm_token').nullable()
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
