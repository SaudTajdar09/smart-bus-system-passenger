import mongoose from 'mongoose'

const routeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    stops: { type: [String], default: [] },
    fare: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Route = mongoose.models.Route || mongoose.model('Route', routeSchema)
