import mongoose from 'mongoose'

const incidentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    alertId: { type: String, index: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    type: { type: String, default: 'SOS' },
    description: { type: String, default: '' },
    busId: { type: String, default: 'Route Unknown' },
    route: { type: String, default: 'R1' },
    source: { type: String, default: 'alert' },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false, timestamps: true }
)

incidentSchema.index({ status: 1, createdAt: -1 })

export const Incident = mongoose.models.Incident || mongoose.model('Incident', incidentSchema)
