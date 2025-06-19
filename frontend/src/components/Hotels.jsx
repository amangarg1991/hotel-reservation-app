import { useEffect, useState } from 'react';
import { styles } from '../styles';
import { hotelsAPI } from '../api';

export function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await hotelsAPI.getAll();
      setHotels(data);
      setError('');
    } catch (e) {
      setError('Failed to fetch hotels');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hotelsAPI.create({ name, location });
      setName('');
      setLocation('');
      fetchHotels();
    } catch (e) {
      setError('Failed to add hotel');
    }
    setLoading(false);
  };

  const handleDeleteHotel = async (id) => {
    setLoading(true);
    try {
      await hotelsAPI.delete(id);
      fetchHotels();
    } catch (e) {
      setError('Failed to delete hotel');
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={{ color: '#1976d2' }}>Hotels</h2>
      <form onSubmit={handleAddHotel} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.btn}>Add Hotel</button>
      </form>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        hotels.length === 0 ? (
          <div style={styles.emptyState}>
            No hotels found.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {hotels.map(hotel => (
              <li key={hotel.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={styles.userItem}>
                  <span style={styles.userInfo}>
                    {hotel.name} <span style={{ color: '#888' }}>({hotel.location})</span>
                  </span>
                  <button 
                    onClick={() => handleDeleteHotel(hotel.id)} 
                    disabled={loading} 
                    style={{ ...styles.btn, ...styles.deleteBtn }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
} 