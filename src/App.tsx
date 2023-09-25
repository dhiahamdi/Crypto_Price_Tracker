import React from 'react';
import { Container } from 'react-bootstrap';
import CryptoList from './components/CryptoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 text-primary">Crypto Price Tracker</h1>
      <CryptoList />
    </Container>
  );
}

export default App;
