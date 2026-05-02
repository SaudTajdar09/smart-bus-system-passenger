import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Route } from '../models/Route.js'
import { Bus } from '../models/Bus.js'

const routesSeed = [
  { id: 'R1', name: 'University Express', stops: ['City Center', 'Engineering College', 'Arts University', 'Medical College', 'Tech Park'], fare: 15 },
  { id: 'R2', name: 'City Circular', stops: ['Central Station', 'Market', 'Hospital', 'Mall', 'Airport'], fare: 25 },
  { id: 'R3', name: 'School Special', stops: ['Residential Zone', 'Primary School', 'Secondary School', 'International School'], fare: 10 },
  { id: 'R4', name: 'Metro Connect', stops: ['Metro North', 'Bus Depot', 'IT Hub', 'SEZ', 'Port'], fare: 30 },
]

const busesSeed = [
  { id: 'KA-01-F-1234', route: 'R1', driverName: 'Priya Singh', conductorName: 'Rajesh Kumar', capacity: 40, status: 'running' },
  { id: 'KA-01-F-5678', route: 'R2', driverName: 'Amit Patel', conductorName: 'Deepak Verma', capacity: 45, status: 'running' },
  { id: 'KA-01-G-2345', route: 'R3', driverName: 'Vikram Singh', conductorName: 'Arjun Das', capacity: 35, status: 'idle' },
  { id: 'KA-01-G-6789', route: 'R4', driverName: 'Sanjay Rao', conductorName: 'Suresh Kumar', capacity: 45, status: 'running' },
]

async function run() {
  await connectDB()
  const adminPasswordHash = await bcrypt.hash('admin1234', 10)
  const conductorPasswordHash = await bcrypt.hash('conductor1234', 10)
  const passengerPasswordHash = await bcrypt.hash('passenger1234', 10)

  await User.updateOne(
    { email: 'admin@citybus.demo' },
    { name: 'Depot Admin', email: 'admin@citybus.demo', role: 'depot_admin', passwordHash: adminPasswordHash },
    { upsert: true }
  )
  await User.updateOne(
    { email: 'conductor@citybus.demo' },
    { name: 'Conductor Demo', email: 'conductor@citybus.demo', role: 'conductor', passwordHash: conductorPasswordHash },
    { upsert: true }
  )
  await User.updateOne(
    { email: 'passenger@citybus.demo' },
    { name: 'Passenger Demo', email: 'passenger@citybus.demo', role: 'passenger', passwordHash: passengerPasswordHash },
    { upsert: true }
  )

  for (const route of routesSeed) {
    await Route.updateOne({ id: route.id }, route, { upsert: true })
  }
  for (const bus of busesSeed) {
    await Bus.updateOne({ id: bus.id }, bus, { upsert: true })
  }

  console.log('Seed completed')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
