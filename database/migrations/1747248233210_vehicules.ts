import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vehicules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')


      // Type du véhicule
      table.enum('type', ['moto', 'tricycle']).notNullable()

      // Champs manquants ajoutés ici
      table.float('price_per_km_course').nullable()
      table.float('price_per_km_delivery').nullable()
      table.float('price_per_hour_delivery').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
