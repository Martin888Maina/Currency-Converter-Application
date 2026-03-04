import { Row, Col, Card } from 'react-bootstrap';
import { BsArrowUp, BsArrowDown, BsDash } from 'react-icons/bs';
import { formatRate } from '../../utils/formatCurrency';

export default function RateSummary({ summary, from, to }) {
  if (!summary) return null;

  const { min, max, avg, change } = summary;
  const isUp = change > 0;
  const isDown = change < 0;

  const stats = [
    { label: 'Minimum Rate', value: formatRate(min), variant: 'text-danger' },
    { label: 'Maximum Rate', value: formatRate(max), variant: 'text-success' },
    { label: 'Average Rate', value: formatRate(avg), variant: 'text-primary' },
  ];

  return (
    <Row className="g-3 mt-1">
      {stats.map((s) => (
        <Col key={s.label} xs={6} md={3}>
          <Card className="border-0 bg-light text-center p-3">
            <p className="small text-muted mb-1">{s.label}</p>
            <p className={`fw-bold mb-0 ${s.variant}`} style={{ fontSize: '1.1rem' }}>
              {s.value}
            </p>
          </Card>
        </Col>
      ))}

      {/* percentage change card */}
      <Col xs={6} md={3}>
        <Card className="border-0 bg-light text-center p-3">
          <p className="small text-muted mb-1">Period Change</p>
          <p
            className={`fw-bold mb-0 d-flex align-items-center justify-content-center gap-1 ${
              isUp ? 'text-success' : isDown ? 'text-danger' : 'text-muted'
            }`}
            style={{ fontSize: '1.1rem' }}
          >
            {isUp ? <BsArrowUp /> : isDown ? <BsArrowDown /> : <BsDash />}
            {Math.abs(change).toFixed(2)}%
          </p>
        </Card>
      </Col>
    </Row>
  );
}
