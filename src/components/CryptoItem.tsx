import React from 'react';
import { Card, Form, Image } from 'react-bootstrap';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image?: string; // Making image optional
}

interface CryptoItemProps {
  crypto: Crypto;
  isSelected: boolean;
  onSelectionChange: (cryptoId: string, isSelected: boolean) => void;
}

const CryptoItem: React.FC<CryptoItemProps> = ({ crypto, isSelected, onSelectionChange }) => {
  return (
    <Card className="mb-3 shadow">
      <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
        <div className="d-flex align-items-center">
          {crypto.image && <Image src={crypto.image} roundedCircle width="30" height="30" className="mr-2" />}
          {crypto.name} ({crypto.symbol.toUpperCase()})
        </div>
        <Form.Check
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectionChange(crypto.id, e.target.checked)}
        />
      </Card.Header>
      <Card.Body>
        <Card.Text className="font-weight-bold">Current Price: ${crypto.current_price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CryptoItem;
