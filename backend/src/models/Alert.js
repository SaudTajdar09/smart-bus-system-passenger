import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    status: { type: String, default: 'active' },
    type: { type: String, default: 'Depot' },
    route: { type: String, default: 'R1' },
    passengerName: { type: String, default: 'Unknown Passenger' },
    passengerEmail: { type: String, default: 'unknown@demo.com' },
    location: { type: String, default: 'On Bus' },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false, timestamps: true }
)

alertSchema.index({ status: 1, createdAt: -1 })

export const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema)
