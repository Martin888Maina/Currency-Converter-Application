import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsCurrencyExchange, BsGraphUp, BsClockHistory, BsStarFill } from 'react-icons/bs';

const features = [
  {
    icon: <BsCurrencyExchange size={32} className="text-primary mb-3" />,
    title: 'Real-Time Rates',
    description:
      'Convert between 160+ world currencies using live exchange rates fetched from ExchangeRate-API and cached server-side.',
  },
  {
    icon: <BsStarFill size={32} className="text-warning mb-3" />,
    title: 'Multi-Currency Compare',
    description:
      'Convert one amount into up to 5 target currencies at once and compare results side by side.',
  },
  {
    icon: <BsGraphUp size={32} className="text-success mb-3" />,
    title: 'Rate Trend Charts',
    description:
      'View historical exchange rate trends over 7, 30, or 90 days with interactive line charts and rate summaries.',
  },
  {
    icon: <BsClockHistory size={32} className="text-info mb-3" />,
    title: 'Conversion History',
    description:
      'Every conversion is automatically logged. Filter, search, and export your full conversion history as a CSV file.',
  },
];

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="bg-primary text-white py-5">
        <Container className="py-4 text-center">
          <h1 className="display-5 fw-bold mb-3">
            Convert currencies with live rates
          </h1>
          <p className="lead mb-4 opacity-75">
            Fast, free, and secure. 160+ currencies, real-time data, and a full conversion
            history — all in one place.
          </p>
          <Button as={Link} to="/converter" variant="light" size="lg" className="fw-semibold px-5">
            Start Converting
          </Button>
        </Container>
      </section>

      {/* feature highlights */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Everything you need in one tool</h2>
          <Row className="g-4">
            {features.map((f) => (
              <Col key={f.title} xs={12} sm={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm text-center p-3">
                  <Card.Body>
                    {f.icon}
                    <Card.Title className="fw-semibold mb-2">{f.title}</Card.Title>
                    <Card.Text className="text-muted small">{f.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* how it works strip */}
      <section className="bg-white border-top border-bottom py-5">
        <Container>
          <Row className="align-items-center g-4">
            <Col md={6}>
              <h2 className="fw-bold mb-3">Your API key stays hidden</h2>
              <p className="text-muted mb-3">
                All requests to ExchangeRate-API are made exclusively from the Express
                backend — the browser never sees the API key. Rates are cached in memory and
                PostgreSQL to keep usage well within the free tier.
              </p>
              <Button as={Link} to="/converter" variant="primary">
                Try the Converter
              </Button>
            </Col>
            <Col md={6}>
              <Card className="border-0 bg-light p-4">
                <code className="small text-muted d-block" style={{ lineHeight: 1.8 }}>
                  Browser → Express /api/convert<br />
                  Express → in-memory cache (1 hr TTL)<br />
                  Express → PostgreSQL cache (fallback)<br />
                  Express → ExchangeRate-API (last resort)<br />
                  Express → returns result to browser
                </code>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to get started?</h2>
          <p className="text-muted mb-4">
            No sign-up required. Select your currencies, enter an amount, and convert instantly.
          </p>
          <Button as={Link} to="/converter" variant="primary" size="lg" className="px-5">
            Open Converter
          </Button>
        </Container>
      </section>
    </>
  );
}
