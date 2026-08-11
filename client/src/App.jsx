import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [message, setMessage] = useState('Checking backend...');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get('/health');

        setMessage(response.data.message);
      } catch (error) {
        console.error('Backend connection failed:', error);
        setMessage('Backend connection failed');
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Royal Chairs
        </h1>

        <p className="mt-4 text-green-600">
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;