import { Badge, Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';

export default function FavoriteChip({ pair, onClick, onRemove }) {
  return (
    <span
      className="fav-chip d-inline-flex align-items-center gap-1 badge bg-warning text-dark me-2 mb-2 px-2 py-2"
      style={{ fontSize: '0.8rem', cursor: 'pointer' }}
      onClick={() => onClick(pair.fromCurrency, pair.toCurrency)}
      title={`Apply ${pair.fromCurrency} → ${pair.toCurrency}`}
    >
      {pair.fromCurrency} → {pair.toCurrency}
      <span
        role="button"
        aria-label={`Remove ${pair.fromCurrency} to ${pair.toCurrency} from favorites`}
        onClick={(e) => { e.stopPropagation(); onRemove(pair.id); }}
        className="ms-1 text-dark opacity-75"
        style={{ lineHeight: 1 }}
      >
        <BsX size={14} />
      </span>
    </span>
  );
}
