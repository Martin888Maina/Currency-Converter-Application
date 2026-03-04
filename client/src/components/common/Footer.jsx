import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-white border-top mt-auto py-3">
      <Container>
        <p className="text-muted text-center small mb-0">
          Exchange rates are provided for informational purposes only and may not reflect
          real-time market rates.
        </p>
      </Container>
    </footer>
  );
}
