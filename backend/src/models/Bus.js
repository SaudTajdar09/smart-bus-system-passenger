import mongoose from 'mongoose'

const busSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    route: { type: String, required: true, index: true },
    driverName: { type: String, default: '' },
    conductorName: { type: String, default: '' },
    capacity: { type: Number, default: 40 },
    passengerCount: { type: Number, default: 0 },
    status: { type: String, default: 'running' },
  },
  { timestamps: true }
)

export const Bus = mongoose.models.Bus || mongoose.model('Bus', busSchema)
