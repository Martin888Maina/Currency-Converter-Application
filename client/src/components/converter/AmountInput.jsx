import { Form } from 'react-bootstrap';
import { MAX_AMOUNT } from '../../utils/constants';

export default function AmountInput({ value, onChange, error }) {
  function handleChange(e) {
    const raw = e.target.value;
    // allow empty string so the user can clear the field
    if (raw === '' || raw === '.') {
      onChange(raw);
      return;
    }
    // only digits and a single decimal point
    if (!/^\d*\.?\d{0,2}$/.test(raw)) return;
    if (parseFloat(raw) > MAX_AMOUNT) return;
    onChange(raw);
  }

  return (
    <div>
      <Form.Label htmlFor="amount-input" className="fw-semibold small text-muted">
        Amount
      </Form.Label>
      <Form.Control
        id="amount-input"
        type="text"
        inputMode="decimal"
        placeholder="Enter amount"
        value={value}
        onChange={handleChange}
        isInvalid={!!error}
        className="fw-semibold fs-5"
      />
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </div>
  );
}
