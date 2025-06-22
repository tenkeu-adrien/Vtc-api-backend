// app/Controllers/Http/StatsController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class StatsController {
  public async index({ params }: HttpContextContract) {
    const driverId = params.id

    // Exécution parallèle des requêtes
    const [weekStats, monthStats, weekChart, monthChart] = await Promise.all([
      this.getAggregatedStats(driverId, 'week'),
      this.getAggregatedStats(driverId, 'month'),
      this.getChartData(driverId, 'week'),
      this.getChartData(driverId, 'month')
    ])

    return {
      stats: {
        week: weekStats,
        month: monthStats
      },
      chartData: {
        week: weekChart,
        month: monthChart
      }
    }
  }

  private async getAggregatedStats(driverId: number, period: 'week' | 'month') {
    const interval = period === 'week' ? { days: 7 } : { months: 1 }
    const startDate = DateTime.now().minus(interval).toSQL()

    const result = await Database.query()
      .from('rides')
      .innerJoin('transactions', 'transactions.ride_id', 'rides.id')
      .where('rides.driver_id', driverId)
      .where('transactions.transaction_date', '>=', startDate)
      .select(
        Database.raw('COUNT(*) as rides'),
        Database.raw('SUM(transactions.amount) as earnings'),
        Database.raw('SUM(rides.distance) as distance')
      )
      .first()

    return {
      rides: Number(result?.rides || 0),
      earnings: Number(result?.earnings || 0),
      distance: Number(result?.distance || 0)
    }
  }

  private async getChartData(driverId: number, period: 'week' | 'month') {
    let dateFormat: string
    let labels: string[]
    let interval: object

    if (period === 'week') {
      dateFormat = '%w' // %w: Jour de la semaine (0=dimanche, 1=lundi...)
      labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      interval = { days: 7 }
    } else {
      dateFormat = '%u' // %u: Numéro de semaine (1=lundi...7=dimanche)
      labels = ['Sem1', 'Sem2', 'Sem3', 'Sem4']
      interval = { months: 1 }
    }

    const results = await Database.query()
      .select(Database.raw(`DATE_FORMAT(transactions.transaction_date, '${dateFormat}') as period_key`))
      .sum('transactions.amount as total')
      .from('transactions')
      .innerJoin('rides', 'rides.id', 'transactions.ride_id')
      .where('rides.driver_id', driverId)
      .where('transactions.transaction_date', '>=', DateTime.now().minus(interval).toSQL())
      .groupBy('period_key')
      .orderBy('period_key', 'asc')

    // Mapping des résultats avec gestion des index
    const data = labels.map((_, index) => {
      const key = period === 'week' 
        ? index === 0 ? '0' : index.toString() // Dimanche=0, Lundi=1...
        : (index + 1).toString()
      
      const found = results.find(r => r.period_key === key)
      return found ? Number(found.total) : 0
    })

    return { labels, data }
  }
}