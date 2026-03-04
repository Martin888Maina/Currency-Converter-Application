import { Table, Badge } from 'react-bootstrap';
import { formatNumber, formatRate, formatDateTime } from '../../utils/formatCurrency';

export default function HistoryTable({ records }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p className="mb-1 fw-semibold">No conversions yet.</p>
        <p className="small">Make your first conversion on the Converter page to see it here.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table striped hover className="small align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th className="text-end">Amount</th>
            <th className="text-end">Rate</th>
            <th className="text-end">Result</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td className="text-muted">{formatDateTime(r.createdAt)}</td>
              <td>
                <Badge bg="secondary" className="fw-semibold">{r.fromCurrency}</Badge>
              </td>
              <td>
                <Badge bg="primary" className="fw-semibold">{r.toCurrency}</Badge>
              </td>
              <td className="text-end fw-semibold">{formatNumber(Number(r.amount), 2)}</td>
              <td className="text-end text-muted">{formatRate(Number(r.rate))}</td>
              <td className="text-end fw-bold text-success">{formatNumber(Number(r.result), 2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
