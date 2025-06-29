// app/Controllers/Http/StatsController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class StatsController {
 public async getDashboardStats({ response }: HttpContextContract) {
  try {
    const today = DateTime.now().toSQLDate()
    const currentMonthStart = DateTime.now().startOf('month').toSQLDate()

    const activeUsers = await Database.from('users')
      .where('is_deleted', false)
      .count('* as count')
      .first()

    const activeDrivers = await Database.from('users')
      .where('role', 'driver')
      .andWhere('is_deleted', false)
      .count('* as count')
      .first()

    const todayRides = await Database.from('rides')
      .where('created_at', '>=', today)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .count('* as count')
      .first()

    const todayRevenue = await Database.from('rides')
      .where('created_at', '>=', today)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .sum('price as total')
      .first()

    // ✅ Moyenne durée en minutes (extrait le nombre depuis la string)
    const avgRideDuration = await Database.from('rides')
      .where('created_at', '>=', today)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .select(Database.raw(`
        AVG(CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)) as avg_minutes
      `))
      .first()

    // ✅ Moyenne distance
    const avgDistance = await Database.from('rides')
      .where('created_at', '>=', today)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .avg('distance as avg')
      .first()

    // ✅ Total distance
    const totalDistance = await Database.from('rides')
      .where('created_at', '>=', currentMonthStart)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .sum('distance as total')
      .first()

    // ✅ Total durée
    const totalDuration = await Database.from('rides')
      .where('created_at', '>=', currentMonthStart)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .select(Database.raw(`
        SUM(CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED)) as total_minutes
      `))
      .first()

    const cancelledRides = await Database.from('rides')
      .where('created_at', '>=', currentMonthStart)
      .andWhere('status', 'cancelled')
      .count('* as count')
      .first()

    const totalRides = await Database.from('rides')
      .where('created_at', '>=', currentMonthStart)
      .count('* as count')
      .first()

    const cancellationRate = cancelledRides.count && totalRides.count
      ? (cancelledRides.count / totalRides.count) * 100
      : 0

    const vehicleDistribution = await Database.from('rides')
      .where('created_at', '>=', currentMonthStart)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .select('vehicle_type')
      .count('* as count')
      .groupBy('vehicle_type')

    const deliveryRides = await Database.from('rides')
      .where('created_at', '>=', currentMonthStart)
      .andWhere('status', 'completed')
      .andWhere('is_paid', true)
      .andWhereNotNull('recipient')
      .count('* as count')
      .first()

    const deliveryRate = deliveryRides.count && totalRides.count
      ? (deliveryRides.count / totalRides.count) * 100
      : 0

    const recentRides = await Database.from('rides')
      .join('users', 'rides.client_id', 'users.id')
      .where('rides.status', 'completed')
      .where('rides.is_paid', true)
      .orderBy('rides.completed_at', 'desc')
      .limit(5)
      .select([
        'rides.id',
        'rides.price',
        'rides.vehicle_type',
        'users.first_name',
        Database.raw("TIMESTAMPDIFF(MINUTE, rides.created_at, NOW()) as minutes_ago"),
        Database.raw("CASE WHEN rides.recipient IS NOT NULL THEN 'Livraison' ELSE 'Course' END as ride_type")
      ])

    const pendingDrivers = await Database.from('users')
      .where('role', 'driver')
      .andWhere('is_verified', false)
      .count('* as count')
      .first()

    const pendingComplaints = await Database.from('rides')
      .whereNotNull('rating_comment')
      .andWhere('rating', '<', 3)
      .count('* as count')
      .first()

    const stats = {
      mainStats: {
        activeUsers: activeUsers.count || 0,
        activeDrivers: activeDrivers.count || 0,
        todayRides: todayRides.count || 0,
        todayRevenue: todayRevenue.total || 0,
        avgRideDuration: avgRideDuration.avg_minutes || 0,
        avgDistance: avgDistance.avg || 0,
        totalDistance: totalDistance.total || 0,
        totalDuration: totalDuration.total_minutes || 0,
        occupationRate: vehicleDistribution.find(v => v.vehicle_type === 'moto-taxi')?.count || 0,
        cancellationRate: cancellationRate,
        deliveryRate: deliveryRate
      },
      vehicleDistribution: vehicleDistribution.map(v => ({
        type: v.vehicle_type,
        count: v.count
      })),
      recentActivities: recentRides.map(ride => ({
        id: ride.id,
        type: ride.ride_type,
        description: `${ride.first_name} - ${ride.vehicle_type}`,
        time: `Il y a ${ride.minutes_ago} min`,
        amount: ride.price
      })),
      alerts: [
        {
          title: `${pendingDrivers.count} chauffeurs en attente`,
          description: "Validation des documents requis",
          type: "driver_validation"
        },
        {
          title: `${pendingComplaints.count} réclamations`,
          description: "À traiter",
          type: "complaints"
        }
      ]
    }

    return response.ok(stats)
  } catch (error) {
    console.error(error)
    return response.internalServerError({
      message: 'Une erreur est survenue lors de la récupération des statistiques',
      error: error.message
    })
  }
}

}