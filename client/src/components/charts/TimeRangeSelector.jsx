import { ButtonGroup, Button } from 'react-bootstrap';
import { TIME_RANGES } from '../../utils/constants';

export default function TimeRangeSelector({ value, onChange }) {
  return (
    <ButtonGroup size="sm">
      {TIME_RANGES.map((r) => (
        <Button
          key={r.value}
          variant={value === r.value ? 'primary' : 'outline-secondary'}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
