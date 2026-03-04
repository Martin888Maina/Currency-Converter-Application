import { Button } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';

export default function AddFavoriteBtn({ isSaved, onClick, disabled }) {
  return (
    <Button
      variant={isSaved ? 'warning' : 'outline-warning'}
      size="sm"
      onClick={onClick}
      disabled={disabled || isSaved}
      className="d-flex align-items-center gap-1"
      title={isSaved ? 'Already in favorites' : 'Save this pair to favorites'}
    >
      {isSaved ? <BsStarFill size={14} /> : <BsStar size={14} />}
      {isSaved ? 'Saved' : 'Save Pair'}
    </Button>
  );
}
