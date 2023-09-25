const API_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/markets';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

const fetchCryptoData = async (): Promise<Crypto[]> => {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '5',
      page: '1',
      sparkline: 'false',
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: Crypto[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the crypto data', error);
    return [];
  }
};

export { fetchCryptoData };
