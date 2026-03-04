import { Card, Toast, ToastContainer } from 'react-bootstrap';
import FavoriteChip from './FavoriteChip';
import AddFavoriteBtn from './AddFavoriteBtn';
import useFavorites from '../../hooks/useFavorites';

export default function FavoritePairs({ from, to, onApplyPair }) {
  const { favorites, loading, toast, add, remove, isSaved } = useFavorites();

  return (
    <>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-semibold small text-muted">Favorite Pairs</span>
            <AddFavoriteBtn
              isSaved={isSaved(from, to)}
              onClick={() => add(from, to)}
              disabled={!from || !to}
            />
          </div>

          {loading && <p className="text-muted small mb-0">Loading favorites...</p>}

          {!loading && favorites.length === 0 && (
            <p className="text-muted small mb-0">
              No favorites yet. Save your first pair using the button above.
            </p>
          )}

          {!loading && favorites.length > 0 && (
            <div className="d-flex flex-wrap mt-1">
              {favorites.map((pair) => (
                <FavoriteChip
                  key={pair.id}
                  pair={pair}
                  onClick={onApplyPair}
                  onRemove={remove}
                />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* toast notification for save/remove feedback */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
        <Toast show={!!toast} autohide delay={3000} bg="dark">
          <Toast.Body className="text-white small">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
