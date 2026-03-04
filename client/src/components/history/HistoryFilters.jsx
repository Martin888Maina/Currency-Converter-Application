import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function HistoryFilters({ onApply }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function handleApply(e) {
    e.preventDefault();
    onApply({ from: from.toUpperCase(), to: to.toUpperCase(), startDate, endDate });
  }

  function handleClear() {
    setFrom(''); setTo(''); setStartDate(''); setEndDate('');
    onApply({ from: '', to: '', startDate: '', endDate: '' });
  }

  return (
    <Form onSubmit={handleApply} className="mb-4">
      <Row className="g-2 align-items-end">
        <Col xs={6} sm={3} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">From</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. USD"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            maxLength={3}
          />
        </Col>
        <Col xs={6} sm={3} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">To</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. KES"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            maxLength={3}
          />
        </Col>
        <Col xs={6} sm={3} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col xs={6} sm={3} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
        <Col xs={12} sm="auto" className="d-flex gap-2">
          <Button type="submit" variant="primary" size="sm">Apply</Button>
          <Button type="button" variant="outline-secondary" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
