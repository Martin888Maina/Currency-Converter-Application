import { Button } from 'react-bootstrap';
import { BsDownload } from 'react-icons/bs';

export default function ExportButton({ filters, onExport }) {
  function handleExport() {
    const params = new URLSearchParams();
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);

    // open as a direct link so the browser triggers the file download
    const url = `/api/history/conversions/export?${params.toString()}`;
    window.open(url, '_blank');
    if (onExport) onExport();
  }

  return (
    <Button
      variant="outline-success"
      size="sm"
      onClick={handleExport}
      className="d-flex align-items-center gap-1"
    >
      <BsDownload size={14} />
      Export CSV
    </Button>
  );
}
