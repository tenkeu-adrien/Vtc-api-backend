import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rides'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('client_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('driver_id').unsigned().references('id').inTable('users').nullable()
      table.enum('vehicle_type', ['moto-taxi', 'tricycle']).notNullable()
      table.text('pickup_location').notNullable() // { address: string, coordinates: { lat, lng } }
table.text('destination_location').notNullable()
table.enum('status', ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']).defaultTo('pending')
table.timestamp('scheduled_at').nullable() // Pour les courses programmées
      table.timestamp('started_at').nullable()
      table.timestamp('completed_at').nullable()
      table.float('price')  
table.enum('payment_method', ['cash', 'orange_money', 'mobile_money']).nullable()
table.text('recipient_info').nullable()
table.boolean('is_paid').defaultTo(false)
table.index(['driver_id', 'created_at'])
  table.float('rating', 2, 1).nullable().unsigned() // Stocke une note entre 0.0 et 5.0 (1 chiffre après la virgule)
      table.text('rating_comment').nullable()
      table.text('recipient').nullable()// pour les livraisons
table.string('duration').nullable() 
      table.float('distance').nullable()
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
