import React, { useEffect, useState } from 'react';
import CryptoItem from './CryptoItem';
import { ListGroup, Spinner, Form } from 'react-bootstrap';
import { fetchCryptoData } from '../utils/api';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image?: string;
}

const SELECTED_CRYPTOS_KEY = 'selectedCryptos';
const CRYPTO_DATA_CACHE_KEY = 'cryptoDataCache';
const CACHE_EXPIRATION_TIME = 60000;

const CryptoList: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(() => {
    const savedSelections = localStorage.getItem(SELECTED_CRYPTOS_KEY);
    return savedSelections ? JSON.parse(savedSelections) : [];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const cachedData = localStorage.getItem(CRYPTO_DATA_CACHE_KEY);
    const currentTime = new Date().getTime();

    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (currentTime - timestamp < CACHE_EXPIRATION_TIME) {
        setCryptoData(data);
        setIsLoading(false);
        return;
      }
    }

    try {
      const data = await fetchCryptoData();
      setCryptoData(data);
      localStorage.setItem(CRYPTO_DATA_CACHE_KEY, JSON.stringify({ timestamp: currentTime, data }));
    } catch (error) {
      console.error('Error fetching the crypto data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(SELECTED_CRYPTOS_KEY, JSON.stringify(selectedCryptos));
  }, [selectedCryptos]);

  const handleSelectionChange = (cryptoId: string, isSelected: boolean) => {
    setSelectedCryptos((prevSelectedCryptos) =>
      isSelected
        ? [...prevSelectedCryptos, cryptoId]
        : prevSelectedCryptos.filter((id) => id !== cryptoId)
    );
  };

  const filteredCryptoData = cryptoData.filter((crypto) => {
    const nameMatch = crypto.name.toLowerCase().includes(searchQuery.toLowerCase());
    const symbolMatch = crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || symbolMatch;
  });

  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4">Crypto Price Tracker</h1>
      <Form.Group className="mb-4"> {/* Added a margin-bottom to the Form.Group */}
        <Form.Control
          type="text"
          placeholder="Search by name or symbol"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </Form.Group>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <ListGroup>
          {filteredCryptoData.map((crypto) => (
            <CryptoItem
              key={crypto.id}
              crypto={crypto}
              isSelected={selectedCryptos.includes(crypto.id)}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CryptoList;
