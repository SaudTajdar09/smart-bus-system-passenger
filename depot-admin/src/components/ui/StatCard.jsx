import { Card } from './Card.jsx'

export function StatCard({ title, value, icon: Icon, trend, trendLabel, className = '' }) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-2 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        {Icon && <Icon className="h-8 w-8 text-blue-600 opacity-50" />}
      </div>
    </Card>
  )
}
