import { useState, useEffect, useCallback } from 'react';
import { fetchFavorites, addFavorite, deleteFavorite } from '../services/api';

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function add(from, to) {
    try {
      await addFavorite(from, to);
      showToast(`${from} → ${to} saved to favorites`);
      await load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not save favorite';
      showToast(msg);
    }
  }

  async function remove(id) {
    try {
      await deleteFavorite(id);
      showToast('Favorite removed');
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      showToast('Could not remove favorite');
    }
  }

  function isSaved(from, to) {
    return favorites.some((f) => f.fromCurrency === from && f.toCurrency === to);
  }

  return { favorites, loading, error, toast, add, remove, isSaved };
}
