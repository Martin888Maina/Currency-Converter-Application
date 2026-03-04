import { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { BsPlus, BsX } from 'react-icons/bs';
import CurrencySelect from './CurrencySelect';
import { convertCurrency } from '../../services/api';
import { formatNumber, formatRate } from '../../utils/formatCurrency';
import { MAX_COMPARE_CURRENCIES } from '../../utils/constants';

export default function MultiCurrencyCompare({ from, amount }) {
  const [targets, setTargets] = useState(['EUR', 'GBP', 'JPY']);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!from || !amount || parseFloat(amount) <= 0) {
      setResults({});
      return;
    }

    setLoading(true);
    Promise.all(
      targets.map((to) =>
        convertCurrency(from, to, parseFloat(amount))
          .then((data) => ({ to, data }))
          .catch(() => ({ to, error: true }))
      )
    )
      .then((all) => {
        const map = {};
        all.forEach(({ to, data, error }) => {
          map[to] = error ? null : data;
        });
        setResults(map);
      })
      .finally(() => setLoading(false));
  }, [from, amount, targets]);

  function addTarget() {
    if (targets.length >= MAX_COMPARE_CURRENCIES) return;
    // pick a currency not already in the list
    const defaults = ['CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD', 'MXN', 'BRL'];
    const next = defaults.find((c) => !targets.includes(c) && c !== from) || 'NGN';
    setTargets([...targets, next]);
  }

  function removeTarget(code) {
    setTargets(targets.filter((c) => c !== code));
  }

  function updateTarget(index, code) {
    const updated = [...targets];
    updated[index] = code;
    setTargets(updated);
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white fw-semibold border-bottom">
        Multi-Currency Comparison
        <span className="text-muted fw-normal small ms-2">
          ({targets.length}/{MAX_COMPARE_CURRENCIES} currencies)
        </span>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {targets.map((code, i) => {
            const res = results[code];
            return (
              <Col key={`${code}-${i}`} xs={12} sm={6} lg={4}>
                <Card className="h-100 border bg-light">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div style={{ flex: 1, marginRight: 8 }}>
                        <CurrencySelect
                          id={`compare-${i}`}
                          label=""
                          value={code}
                          onChange={(c) => updateTarget(i, c)}
                        />
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle p-1"
                        style={{ width: 28, height: 28 }}
                        onClick={() => removeTarget(code)}
                        aria-label={`Remove ${code}`}
                      >
                        <BsX size={14} />
                      </Button>
                    </div>
                    {loading ? (
                      <p className="text-muted small mb-0">Loading...</p>
                    ) : res ? (
                      <>
                        <p className="fw-bold fs-5 text-primary mb-0">
                          {formatNumber(res.result, 2)} {code}
                        </p>
                        <p className="text-muted small mb-0">
                          1 {from} = {formatRate(res.rate)} {code}
                        </p>
                      </>
                    ) : (
                      <p className="text-danger small mb-0">Could not fetch rate</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}

          {targets.length < MAX_COMPARE_CURRENCIES && (
            <Col xs={12} sm={6} lg={4}>
              <Button
                variant="outline-primary"
                className="w-100 h-100 border-dashed d-flex align-items-center justify-content-center gap-2"
                style={{ minHeight: 100, borderStyle: 'dashed' }}
                onClick={addTarget}
              >
                <BsPlus size={20} />
                Add Currency
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
