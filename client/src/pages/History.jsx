import { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import useHistory from '../hooks/useHistory';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryTable from '../components/history/HistoryTable';
import Pagination from '../components/history/Pagination';
import ExportButton from '../components/history/ExportButton';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';

export default function History() {
  const { records, pagination, filters, loading, error, load, applyFilters, goToPage, clear } =
    useHistory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { load(); }, []);

  async function handleClear() {
    await clear();
    setShowConfirm(false);
    setToast('Conversion history cleared');
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h2 className="fw-bold mb-0">Conversion History</h2>
        <div className="d-flex gap-2">
          <ExportButton filters={filters} />
          <Button
            variant="outline-danger"
            size="sm"
            className="d-flex align-items-center gap-1"
            onClick={() => setShowConfirm(true)}
            disabled={records.length === 0}
          >
            <BsTrash size={14} />
            Clear All
          </Button>
        </div>
      </div>
      <p className="text-muted mb-4">
        Every conversion you make is logged here automatically.
        {pagination.total > 0 && (
          <span className="ms-2 fw-semibold text-dark">{pagination.total} total records</span>
        )}
      </p>

      <ErrorAlert message={error} />

      <HistoryFilters onApply={applyFilters} />

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <Loader message="Loading history..." />
          ) : (
            <HistoryTable records={records} />
          )}
        </Card.Body>
        {!loading && pagination.totalPages > 1 && (
          <Card.Footer className="bg-white border-top py-3">
            <Pagination pagination={pagination} onPageChange={goToPage} />
          </Card.Footer>
        )}
      </Card>

      {/* clear history confirmation */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Clear All History?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-muted small">
          This will permanently delete all {pagination.total} conversion records. This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleClear}>
            Yes, Clear All
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
        <Toast show={!!toast} autohide delay={3000} bg="dark">
          <Toast.Body className="text-white small">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
