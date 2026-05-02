import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
  },
  { strict: false, timestamps: true }
)

ticketSchema.index({ route: 1, status: 1 })
ticketSchema.index({ createdAt: -1 })

export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema)
