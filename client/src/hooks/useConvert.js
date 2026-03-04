import { useState, useCallback } from 'react';
import { convertCurrency } from '../services/api';
import { DEFAULT_FROM, DEFAULT_TO } from '../utils/constants';

export default function useConvert() {
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convert = useCallback(async () => {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await convertCurrency(from, to, parsed);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Conversion failed. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [from, to, amount]);

  // swap without clearing the amount or the last result
  function swap() {
    setFrom(to);
    setTo(from);
    setResult(null);
  }

  // called when a favorite chip is clicked
  function applyPair(favFrom, favTo) {
    setFrom(favFrom);
    setTo(favTo);
    setResult(null);
  }

  return {
    from, setFrom,
    to, setTo,
    amount, setAmount,
    result,
    loading,
    error, setError,
    convert,
    swap,
    applyPair,
  };
}
