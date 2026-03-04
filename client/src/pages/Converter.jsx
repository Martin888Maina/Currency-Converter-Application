import { useEffect } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { CurrencyProvider } from '../context/CurrencyContext';
import useConvert from '../hooks/useConvert';
import CurrencySelect from '../components/converter/CurrencySelect';
import AmountInput from '../components/converter/AmountInput';
import SwapButton from '../components/converter/SwapButton';
import ConvertResult from '../components/converter/ConvertResult';
import MultiCurrencyCompare from '../components/converter/MultiCurrencyCompare';
import FavoritePairs from '../components/favorites/FavoritePairs';

function ConverterInner() {
  const {
    from, setFrom,
    to, setTo,
    amount, setAmount,
    result, loading, error, setError,
    convert, swap, applyPair,
  } = useConvert();

  // auto-convert whenever inputs change and are all valid
  useEffect(() => {
    const parsed = parseFloat(amount);
    if (amount && !isNaN(parsed) && parsed > 0 && from && to) {
      convert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, amount]);

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-1">Currency Converter</h2>
      <p className="text-muted mb-4">Live rates for 160+ currencies, updated every hour.</p>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
          {error}
        </Alert>
      )}

      {/* favorite pairs strip — click a chip to auto-populate the dropdowns */}
      <FavoritePairs from={from} to={to} onApplyPair={applyPair} />

      {/* main converter card */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-end">
            <Col xs={12} md={4}>
              <CurrencySelect
                id="from-currency"
                label="From"
                value={from}
                onChange={setFrom}
              />
            </Col>

            <Col xs={12} md={1} className="d-flex justify-content-center">
              <SwapButton onClick={swap} />
            </Col>

            <Col xs={12} md={4}>
              <CurrencySelect
                id="to-currency"
                label="To"
                value={to}
                onChange={setTo}
              />
            </Col>

            <Col xs={12} md={3}>
              <AmountInput
                value={amount}
                onChange={setAmount}
                error={null}
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Button
                variant="primary"
                size="lg"
                className="px-5"
                onClick={convert}
                disabled={loading}
              >
                {loading ? 'Converting...' : 'Convert'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* result card */}
      <div className="mb-4">
        <ConvertResult result={result} loading={loading} />
      </div>

      {/* multi-currency comparison panel */}
      {from && (
        <MultiCurrencyCompare from={from} amount={amount} />
      )}
    </Container>
  );
}

export default function Converter() {
  return (
    <CurrencyProvider>
      <ConverterInner />
    </CurrencyProvider>
  );
}
