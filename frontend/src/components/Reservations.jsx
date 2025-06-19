import { useEffect, useState } from 'react';
import { styles } from '../styles';
import { reservationsAPI, usersAPI, hotelsAPI } from '../api';

export function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [userId, setUserId] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationsAPI.getAll();
      setReservations(data);
      setError('');
    } catch (e) {
      setError('Failed to fetch reservations');
    }
    setLoading(false);
  };

  const fetchUsersAndHotels = async () => {
    try {
      const [usersData, hotelsData] = await Promise.all([
        usersAPI.getAll(),
        hotelsAPI.getAll()
      ]);
      setUsers(usersData);
      setHotels(hotelsData);
    } catch (e) {
      console.error('Failed to fetch users or hotels:', e);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchUsersAndHotels();
  }, []);

  const handleAddReservation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reservationsAPI.create({
        userId: Number(userId),
        hotelId: Number(hotelId),
        startDate,
        endDate,
        numberOfRooms: Number(numberOfRooms)
      });
      
      // Reset form
      setUserId('');
      setHotelId('');
      setStartDate('');
      setEndDate('');
      setNumberOfRooms(1);
      
      fetchReservations();
    } catch (e) {
      setError('Failed to add reservation: ' + e.message);
    }
    setLoading(false);
  };

  const handleDeleteReservation = async (id) => {
    setLoading(true);
    try {
      await reservationsAPI.delete(id);
      fetchReservations();
    } catch (e) {
      setError('Failed to delete reservation');
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={{ color: '#1976d2' }}>Reservations</h2>
      <form onSubmit={handleAddReservation} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <select
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <select
          value={hotelId}
          onChange={e => setHotelId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Hotel</option>
          {hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          min="1"
          value={numberOfRooms}
          onChange={e => setNumberOfRooms(e.target.value)}
          required
          style={styles.input}
          placeholder="Number of Rooms"
        />
        <button type="submit" disabled={loading} style={styles.btn}>Add Reservation</button>
      </form>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        reservations.length === 0 ? (
          <div style={styles.emptyState}>
            No reservations found.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {reservations.map(reservation => (
              <li key={reservation.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={styles.userItem}>
                  <span style={styles.userInfo}>
                    {reservation.user?.name} → {reservation.hotel?.name} ({reservation.numberOfRooms} rooms)
                    <br />
                    <small style={{ color: '#666' }}>
                      {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                    </small>
                  </span>
                  <button 
                    onClick={() => handleDeleteReservation(reservation.id)} 
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