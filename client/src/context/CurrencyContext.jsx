import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrencies } from '../services/api';
import { POPULAR_CURRENCIES } from '../utils/constants';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrencies()
      .then((list) => {
        // popular currencies float to the top, rest sorted alphabetically
        const popular = list.filter((c) => POPULAR_CURRENCIES.includes(c));
        const rest = list.filter((c) => !POPULAR_CURRENCIES.includes(c));
        setCurrencies([...popular, ...rest]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currencies, loading, error }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencies() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrencies must be used inside CurrencyProvider');
  return ctx;
}
