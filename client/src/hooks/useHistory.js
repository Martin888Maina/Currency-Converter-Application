import { useState, useCallback } from 'react';
import { fetchHistory, clearHistory } from '../services/api';
import { HISTORY_PAGE_SIZE } from '../utils/constants';

export default function useHistory() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ from: '', to: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (page = 1, activeFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: HISTORY_PAGE_SIZE };
      if (activeFilters.from) params.from = activeFilters.from;
      if (activeFilters.to) params.to = activeFilters.to;
      if (activeFilters.startDate) params.startDate = activeFilters.startDate;
      if (activeFilters.endDate) params.endDate = activeFilters.endDate;

      const data = await fetchHistory(params);
      setRecords(data.records);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load history');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  function applyFilters(newFilters) {
    setFilters(newFilters);
    load(1, newFilters);
  }

  function goToPage(page) {
    load(page);
  }

  async function clear() {
    try {
      await clearHistory();
      setRecords([]);
      setPagination({ page: 1, total: 0, totalPages: 1 });
    } catch (err) {
      setError('Could not clear history');
    }
  }

  return { records, pagination, filters, loading, error, load, applyFilters, goToPage, clear };
}
