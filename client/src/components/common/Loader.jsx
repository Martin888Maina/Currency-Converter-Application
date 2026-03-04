import { Spinner } from 'react-bootstrap';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <Spinner animation="border" variant="primary" role="status" />
      <span className="mt-3 small">{message}</span>
    </div>
  );
}
