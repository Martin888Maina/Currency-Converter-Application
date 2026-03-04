import { Card, Badge } from 'react-bootstrap';
import { formatNumber, formatRate, formatDateTime } from '../../utils/formatCurrency';

export default function ConvertResult({ result, loading }) {
  if (loading) {
    return (
      <Card className="result-card p-4 text-center">
        <div className="spinner-border text-primary mx-auto" role="status" />
        <p className="text-muted mt-3 mb-0 small">Fetching rates...</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="result-card p-4 text-center text-muted">
        <p className="mb-0">Enter an amount to see the conversion result.</p>
      </Card>
    );
  }

  return (
    <Card className="result-card p-4">
      {result.stale && (
        <div className="stale-banner rounded mb-3">
          Using cached rates from {formatDateTime(result.cachedAt)}. Live rates unavailable.
        </div>
      )}
      <div className="text-center mb-3">
        <p className="text-muted mb-1 small">
          {formatNumber(result.amount, 2)} {result.from} =
        </p>
        <p className="amount-display mb-1">
          {formatNumber(result.result, 2)}
        </p>
        <p className="fs-5 fw-semibold text-primary mb-0">{result.to}</p>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center small text-muted">
        <span>
          1 {result.from} = <strong className="text-dark">{formatRate(result.rate)}</strong> {result.to}
        </span>
        <span className="d-flex align-items-center gap-1">
          {result.fromCache ? (
            <Badge bg="warning" text="dark">Cached</Badge>
          ) : (
            <Badge bg="success">Live</Badge>
          )}
          <span>Updated {formatDateTime(result.cachedAt)}</span>
        </span>
      </div>
    </Card>
  );
}
