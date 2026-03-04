import axios from 'axios';

// all calls go through our own Express backend — never directly to ExchangeRate-API
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export async function fetchCurrencies() {
  const { data } = await api.get('/currencies');
  return data.currencies;
}

export async function fetchRates(base) {
  const { data } = await api.get('/rates', { params: { base } });
  return data;
}

export async function convertCurrency(from, to, amount) {
  const { data } = await api.get('/convert', { params: { from, to, amount } });
  return data;
}

export async function fetchFavorites() {
  const { data } = await api.get('/favorites');
  return data.favorites;
}

export async function addFavorite(from, to) {
  const { data } = await api.post('/favorites', { from, to });
  return data.favorite;
}

export async function deleteFavorite(id) {
  await api.delete(`/favorites/${id}`);
}

export async function fetchHistory(params = {}) {
  const { data } = await api.get('/history/conversions', { params });
  return data;
}

export async function clearHistory() {
  await api.delete('/history/conversions');
}

export async function fetchRateHistory(from, to, days) {
  const { data } = await api.get('/history/rates', { params: { from, to, days } });
  return data;
}

export default api;
