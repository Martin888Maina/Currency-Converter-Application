import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { CurrencyProvider, useCurrencies } from '../context/CurrencyContext';
import { fetchRateHistory } from '../services/api';
import CurrencySelect from '../components/converter/CurrencySelect';
import TimeRangeSelector from '../components/charts/TimeRangeSelector';
import RateChart from '../components/charts/RateChart';
import RateSummary from '../components/charts/RateSummary';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { DEFAULT_FROM, DEFAULT_TO } from '../utils/constants';

function ChartsInner() {
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [days, setDays] = useState(30);
  const [series, setSeries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChart = useCallback(async () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRateHistory(from, to, days);
      setSeries(data.series);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load rate history');
    } finally {
      setLoading(false);
    }
  }, [from, to, days]);

  useEffect(() => { loadChart(); }, [loadChart]);

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-1">Rate Trend Charts</h2>
      <p className="text-muted mb-4">
        Historical exchange rate trends built from daily snapshots. Snapshots are stored
        automatically each time rates are fetched.
      </p>

      <ErrorAlert message={error} onDismiss={() => setError(null)} />

      {/* pair selector and time range toggle */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-end">
            <Col xs={12} sm={4} md={3}>
              <CurrencySelect
                id="chart-from"
                label="From"
                value={from}
                onChange={setFrom}
              />
            </Col>
            <Col xs={12} sm={4} md={3}>
              <CurrencySelect
                id="chart-to"
                label="To"
                value={to}
                onChange={setTo}
              />
            </Col>
            <Col xs={12} sm="auto" className="d-flex flex-column">
              <span className="fw-semibold small text-muted mb-1">Time Range</span>
              <TimeRangeSelector value={days} onChange={setDays} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* chart */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Header className="bg-white border-bottom fw-semibold">
          {from} / {to} — {days}-Day Rate Trend
        </Card.Header>
        <Card.Body className="p-3">
          {loading ? (
            <Loader message="Loading chart data..." />
          ) : (
            <RateChart series={series} from={from} to={to} />
          )}
        </Card.Body>
      </Card>

      {/* summary stats */}
      {!loading && summary && (
        <RateSummary summary={summary} from={from} to={to} />
      )}

      {!loading && !summary && series.length === 0 && (
        <Card className="border-0 bg-light text-center p-4 text-muted">
          <p className="mb-1 fw-semibold">No data for this pair yet.</p>
          <p className="small mb-0">
            Convert {from} to {to} a few times over multiple days — snapshots build up automatically.
          </p>
        </Card>
      )}
    </Container>
  );
}

export default function Charts() {
  return (
    <CurrencyProvider>
      <ChartsInner />
    </CurrencyProvider>
  );
}
