import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { formatRate } from '../../utils/formatCurrency';

function CustomTooltip({ active, payload, label, from, to }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="bg-white border rounded shadow-sm p-2"
      style={{ fontSize: '0.8rem', minWidth: 140 }}
    >
      <p className="text-muted mb-1">{label}</p>
      <p className="fw-bold text-primary mb-0">
        1 {from} = {formatRate(payload[0].value)} {to}
      </p>
    </div>
  );
}

export default function RateChart({ series, from, to }) {
  if (!series || series.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p className="fw-semibold mb-1">Not enough historical data yet.</p>
        <p className="small">
          Rate snapshots are stored once per day when rates are fetched. Check back after a few
          conversions over multiple days.
        </p>
      </div>
    );
  }

  // only show a subset of x-axis labels so they don't crowd
  const tickInterval = Math.max(1, Math.floor(series.length / 6));

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={series} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6c757d' }}
            interval={tickInterval}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6c757d' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatRate(v)}
            width={80}
          />
          <Tooltip content={<CustomTooltip from={from} to={to} />} />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#0d6efd"
            strokeWidth={2}
            fill="url(#rateGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#0d6efd' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
