import { useState, useMemo } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useCurrencies } from '../../context/CurrencyContext';
import { POPULAR_CURRENCIES } from '../../utils/constants';

export default function CurrencySelect({ value, onChange, label, id }) {
  const { currencies } = useCurrencies();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return currencies;
    const q = search.toUpperCase();
    return currencies.filter((c) => c.includes(q));
  }, [currencies, search]);

  function handleSelect(code) {
    onChange(code);
    setSearch('');
    setOpen(false);
  }

  return (
    <div className="position-relative">
      <Form.Label htmlFor={id} className="fw-semibold small text-muted">
        {label}
      </Form.Label>
      <Form.Control
        id={id}
        type="text"
        placeholder="Search or select..."
        value={open ? search : value}
        onFocus={() => { setOpen(true); setSearch(''); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
        className="fw-semibold"
      />
      {open && (
        <ListGroup
          className="position-absolute w-100 shadow-sm"
          style={{ zIndex: 1050, maxHeight: 240, overflowY: 'auto' }}
        >
          {filtered.length === 0 && (
            <ListGroup.Item className="text-muted small">No currencies found</ListGroup.Item>
          )}
          {filtered.map((code) => (
            <ListGroup.Item
              key={code}
              action
              active={code === value}
              onMouseDown={() => handleSelect(code)}
              className="d-flex align-items-center gap-2 py-2"
            >
              {POPULAR_CURRENCIES.includes(code) && (
                <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>
                  Popular
                </span>
              )}
              <span className="fw-semibold">{code}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
