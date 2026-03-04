import { Button } from 'react-bootstrap';
import { BsArrowLeftRight } from 'react-icons/bs';

export default function SwapButton({ onClick }) {
  return (
    <Button
      variant="outline-secondary"
      onClick={onClick}
      className="swap-btn rounded-circle p-2"
      title="Swap currencies"
      aria-label="Swap source and target currencies"
      style={{ width: 42, height: 42 }}
    >
      <BsArrowLeftRight size={18} />
    </Button>
  );
}
