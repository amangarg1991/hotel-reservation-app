import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

// API base URL - configurable for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const appBg = {
  minHeight: '100vh',
  background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center center / cover no-repeat fixed`,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};
const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30, 42, 73, 0.65)',
  zIndex: 0,
  pointerEvents: 'none',
};
const layout = {
  display: 'flex',
  flex: 1,
  width: '100%',
  minHeight: 'calc(100vh - 120px)', // header+footer height estimate
};
const sidebar = {
  width: 220,
  minWidth: 180,
  background: 'rgba(255,255,255,0.97)',
  borderRight: '1.5px solid #1976d2',
  boxShadow: '2px 0 8px #0001',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  padding: '2rem 0 2rem 0',
  zIndex: 2,
};
const sidebarTab = isActive => ({
  ...btn,
  background: isActive ? '#1976d2' : '#fff',
  color: isActive ? '#fff' : '#1976d2',
  border: 'none',
  borderLeft: isActive ? '4px solid #1565c0' : '4px solid transparent',
  borderRadius: '0 24px 24px 0',
  margin: '0 0 12px 0',
  textAlign: 'left',
  fontWeight: isActive ? 700 : 500,
  fontSize: 18,
  padding: '12px 24px',
  boxShadow: isActive ? '0 2px 8px #1976d222' : 'none',
  transition: 'all 0.2s',
});
const mainContent = {
  flex: 1,
  width: '100%',
  padding: '0 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  zIndex: 1,
};
const card = { background: 'rgba(255,255,255,0.95)', borderRadius: 8, boxShadow: '0 2px 16px #0002', padding: 24, margin: '2rem 0', width: 600, minWidth: 600, maxWidth: 600 };
const btn = { background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer', marginLeft: 8 };
const navBtn = { ...btn, background: '#fff', color: '#1976d2', border: '1px solid #1976d2', marginLeft: 0, marginRight: 8 };
const input = { padding: 8, borderRadius: 4, border: '1px solid #ccc', marginRight: 8, marginBottom: 8 };

function Header() {
  return (
    <header style={{ background: '#1976d2', color: '#fff', padding: '1.5rem 0', textAlign: 'center', marginBottom: 24, boxShadow: '0 2px 8px #0002' }}>
      <h1 style={{ margin: 0, fontWeight: 700, letterSpacing: 1 }}>Hotel Reservation App</h1>
      <p style={{ margin: 0, fontWeight: 300 }}>Manage users, hotels, and reservations easily</p>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#1976d2', color: '#fff', textAlign: 'center', padding: '1rem 0', marginTop: 40 }}>
      <span>&copy; {new Date().getFullYear()} Hotel Reservation App</span>
    </footer>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      const data = await res.json();
      setUsers(data);
      setError('');
    } catch (e) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (!res.ok) throw new Error('Failed to add user');
      setName('');
      setEmail('');
      fetchUsers();
    } catch (e) {
      setError('Failed to add user');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user');
    }
    setLoading(false);
  };

  return (
    <div style={card}>
      <h2 style={{ color: '#1976d2' }}>Users</h2>
      <form onSubmit={handleAddUser} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={input}
        />
        <button type="submit" disabled={loading} style={btn}>Add User</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        users.length === 0 ? (
          <div style={{ color: '#b71c1c', background: '#fff3e0', border: '1px solid #ffccbc', borderRadius: 8, padding: 16, textAlign: 'center', marginTop: 16, fontWeight: 500, fontSize: 18 }}>
            No users found.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ color: '#222', background: '#e3f2fd', padding: '4px 8px', borderRadius: 4, flex: 1 }}>
                    {user.name} <span style={{ color: '#888' }}>({user.email})</span>
                  </span>
                  <button onClick={() => handleDeleteUser(user.id)} disabled={loading} style={{ ...btn, background: '#e53935', marginLeft: 8 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedHotelId, setExpandedHotelId] = useState(null);
  // RoomType state
  const [roomTypeName, setRoomTypeName] = useState({}); // { hotelId: name }
  const [roomTypes, setRoomTypes] = useState({}); // { hotelId: [roomTypes] }
  const [showAddRoomType, setShowAddRoomType] = useState({}); // { hotelId: bool }
  const [showRoomTypes, setShowRoomTypes] = useState({}); // { hotelId: bool }
  const [roomTypeAvailability, setRoomTypeAvailability] = useState({}); // { hotelId: availability }
  const [editingAvailability, setEditingAvailability] = useState({}); // { roomTypeId: bool }
  const [editAvailabilityValue, setEditAvailabilityValue] = useState({}); // { roomTypeId: value }
  const [roomTypeDate, setRoomTypeDate] = useState({}); // { hotelId: date string }
  const [addAvailabilityDate, setAddAvailabilityDate] = useState({}); // { roomTypeId: date string }
  const [addAvailabilityValue, setAddAvailabilityValue] = useState({}); // { roomTypeId: value }
  const [showAddAvailability, setShowAddAvailability] = useState({}); // { roomTypeId: bool }
  // Add state for inventories per room type
  const [inventories, setInventories] = useState({}); // { roomTypeId: [inventory] }

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hotels`);
      const data = await res.json();
      setHotels(data);
      setError('');
    } catch (e) {
      setError('Failed to fetch hotels');
    }
    setLoading(false);
  };

  // Fetch room types for a hotel
  const fetchRoomTypes = async (hotelId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/${hotelId}/room-types`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRoomTypes(prev => ({ ...prev, [hotelId]: data }));
        // Fetch inventories for each room type
        data.forEach(rt => fetchInventories(rt.id));
      } else {
        setRoomTypes(prev => ({ ...prev, [hotelId]: [] }));
      }
    } catch (err) {
      setRoomTypes(prev => ({ ...prev, [hotelId]: [] }));
      console.error('Error fetching room types:', err);
    }
  };

  // Fetch inventories for a room type
  const fetchInventories = async (roomTypeId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/${roomTypeId}/inventory`);
      const data = await res.json();
      setInventories(prev => ({ ...prev, [roomTypeId]: data }));
    } catch {}
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location })
      });
      if (!res.ok) throw new Error('Failed to add hotel');
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
      await fetch(`${API_BASE_URL}/hotels/${id}`, { method: 'DELETE' });
      fetchHotels();
    } catch (e) {
      setError('Failed to delete hotel');
    }
    setLoading(false);
  };

  // Update room type availability
  const handleUpdateAvailability = async (roomTypeId, hotelId) => {
    try {
      const value = Number(editAvailabilityValue[roomTypeId]);
      const res = await fetch(`${API_BASE_URL}/room-types/${roomTypeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: value })
      });
      if (!res.ok) throw new Error('Failed to update availability');
      setEditingAvailability(prev => ({ ...prev, [roomTypeId]: false }));
      setEditAvailabilityValue(prev => ({ ...prev, [roomTypeId]: '' }));
      fetchRoomTypes(hotelId);
    } catch {}
  };

  const handleExpand = (hotelId) => {
    setExpandedHotelId(expandedHotelId === hotelId ? null : hotelId);
    if (expandedHotelId !== hotelId) fetchRoomTypes(hotelId);
  };

  // Add room type to hotel
  const handleAddRoomType = async (hotelId, e) => {
    e.preventDefault();
    try {
      const avail = Number(roomTypeAvailability[hotelId]);
      const date = roomTypeDate[hotelId] ? new Date(roomTypeDate[hotelId]) : undefined;
      const body = {
        name: roomTypeName[hotelId] || '',
        availability: avail
      };
      if (date) body.date = date;
      const res = await fetch(`${API_BASE_URL}/hotels/${hotelId}/room-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to add room type');
      setRoomTypeName(prev => ({ ...prev, [hotelId]: '' }));
      setRoomTypeAvailability(prev => ({ ...prev, [hotelId]: '' }));
      setRoomTypeDate(prev => ({ ...prev, [hotelId]: '' }));
      fetchRoomTypes(hotelId);
    } catch {}
  };

  // Add inventory for a room type
  const handleAddInventory = async (roomTypeId, hotelId) => {
    try {
      const date = addAvailabilityDate[roomTypeId];
      const availability = Number(addAvailabilityValue[roomTypeId]);
      const res = await fetch(`${API_BASE_URL}/room-inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomTypeId,
          availability,
          date: new Date(date)
        })
      });
      if (!res.ok) throw new Error('Failed to add inventory');
      setAddAvailabilityDate(prev => ({ ...prev, [roomTypeId]: '' }));
      setAddAvailabilityValue(prev => ({ ...prev, [roomTypeId]: '' }));
      setShowAddAvailability(prev => ({ ...prev, [roomTypeId]: false }));
      fetchRoomTypes(hotelId);
    } catch {}
  };

  return (
    <div style={card}>
      <h2 style={{ color: '#1976d2' }}>Hotels</h2>
      <form onSubmit={handleAddHotel} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={input}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          style={input}
        />
        <button type="submit" disabled={loading} style={btn}>Add Hotel</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        hotels.length === 0 ? (
          <div style={{ color: '#b71c1c', background: '#fff3e0', border: '1px solid #ffccbc', borderRadius: 8, padding: 16, textAlign: 'center', marginTop: 16, fontWeight: 500, fontSize: 18 }}>
            No hotels found.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {hotels.map(hotel => (
              <li key={hotel.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ color: '#222', background: '#e3f2fd', padding: '4px 8px', borderRadius: 4, flex: 1 }}>
                    {hotel.name} <span style={{ color: '#888' }}>({hotel.location})</span>
                  </span>
                  <div>
                    <button onClick={() => handleExpand(hotel.id)} style={{ ...btn, background: expandedHotelId === hotel.id ? '#1565c0' : '#1976d2' }}>{expandedHotelId === hotel.id ? 'Collapse' : 'Expand'}</button>
                    <button onClick={() => handleDeleteHotel(hotel.id)} disabled={loading} style={{ ...btn, background: '#e53935', marginLeft: 8 }}>Delete</button>
                  </div>
                </div>
                {expandedHotelId === hotel.id && (
                  <div style={{ background: '#f1f8e9', borderRadius: 8, margin: '12px 0', padding: 16 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <button style={btn} onClick={() => setShowAddRoomType(prev => ({ ...prev, [hotel.id]: !prev[hotel.id] }))}>
                        {showAddRoomType[hotel.id] ? 'Cancel' : 'Add Room Type'}
                      </button>
                      <button style={btn} onClick={() => setShowRoomTypes(prev => ({ ...prev, [hotel.id]: !prev[hotel.id] }))}>
                        {showRoomTypes[hotel.id] ? 'Hide Room Types' : 'View Room Types'}
                      </button>
                    </div>
                    {showAddRoomType[hotel.id] && (
                      <form onSubmit={e => handleAddRoomType(hotel.id, e)} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <input type="text" placeholder="Room Type Name" value={roomTypeName[hotel.id] || ''} onChange={e => setRoomTypeName(prev => ({ ...prev, [hotel.id]: e.target.value }))} required style={input} />
                        <input type="number" placeholder="Available" value={roomTypeAvailability[hotel.id] || ''} onChange={e => setRoomTypeAvailability(prev => ({ ...prev, [hotel.id]: e.target.value }))} required style={input} min={0} />
                        <input type="date" value={roomTypeDate[hotel.id] || ''} onChange={e => setRoomTypeDate(prev => ({ ...prev, [hotel.id]: e.target.value }))} style={input} />
                        <button type="submit" style={btn}>Add</button>
                      </form>
                    )}
                    {showRoomTypes[hotel.id] && (
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {(roomTypes[hotel.id] || []).length === 0 && (
                          <li style={{ color: '#888', fontStyle: 'italic' }}>No room types found for this hotel.</li>
                        )}
                        {(roomTypes[hotel.id] || []).map(rt => (
                          <li key={rt.id} style={{ marginBottom: 12 }}>
                            <div style={{ fontWeight: 500, color: '#1976d2', marginBottom: 4 }}>
                              {rt.name}
                              <button style={{ ...btn, background: '#43a047', marginLeft: 12 }} onClick={() => {
                                setShowAddAvailability(prev => ({ ...prev, [rt.id]: !prev[rt.id] }));
                              }}>Add Availability</button>
                            </div>
                            {showAddAvailability[rt.id] && (
                              <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4, border: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                  <input
                                    type="date"
                                    value={addAvailabilityDate[rt.id] || ''}
                                    onChange={e => setAddAvailabilityDate(prev => ({ ...prev, [rt.id]: e.target.value }))}
                                    style={input}
                                    required
                                  />
                                  <input
                                    type="number"
                                    placeholder="Availability"
                                    value={addAvailabilityValue[rt.id] || ''}
                                    onChange={e => setAddAvailabilityValue(prev => ({ ...prev, [rt.id]: e.target.value }))}
                                    style={input}
                                    min={0}
                                    required
                                  />
                                  <button style={btn} onClick={async () => {
                                    await fetch(`${API_BASE_URL}/room-types/${rt.id}/inventory`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        date: addAvailabilityDate[rt.id],
                                        availability: addAvailabilityValue[rt.id]
                                      })
                                    });
                                    setAddAvailabilityDate(prev => ({ ...prev, [rt.id]: '' }));
                                    setAddAvailabilityValue(prev => ({ ...prev, [rt.id]: '' }));
                                    setShowAddAvailability(prev => ({ ...prev, [rt.id]: false }));
                                    fetchInventories(rt.id);
                                  }}>Save</button>
                                  <button style={{ ...btn, background: '#888' }} onClick={() => setShowAddAvailability(prev => ({ ...prev, [rt.id]: false }))}>Cancel</button>
                                </div>
                              </div>
                            )}
                            <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                              {(inventories[rt.id] || []).map(inv => (
                                <li key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  <span style={{ color: '#555', fontWeight: 400, fontStyle: 'italic' }}>
                                    Date: {new Date(inv.date).toISOString().slice(0, 10)}
                                  </span>
                                  <span style={{ color: '#388e3c', fontWeight: 500 }}>
                                    Availability: {inv.availability}
                                  </span>
                                  <button style={{ ...btn, marginLeft: 8 }} onClick={() => {
                                    setEditingAvailability(prev => ({ ...prev, [inv.id]: true }));
                                    setEditAvailabilityValue(prev => ({ ...prev, [inv.id]: inv.availability }));
                                  }}>Edit</button>
                                  {editingAvailability[inv.id] && (
                                    <>
                                      <input
                                        type="number"
                                        value={editAvailabilityValue[inv.id] || ''}
                                        onChange={e => setEditAvailabilityValue(prev => ({ ...prev, [inv.id]: e.target.value }))}
                                        style={{ ...input, width: 80 }}
                                        min={0}
                                      />
                                      <button style={{ ...btn, marginLeft: 8 }} onClick={async () => {
                                        await fetch(`${API_BASE_URL}/room-inventory/${inv.id}`, {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ availability: editAvailabilityValue[inv.id] })
                                        });
                                        setEditingAvailability(prev => ({ ...prev, [inv.id]: false }));
                                        setEditAvailabilityValue(prev => ({ ...prev, [inv.id]: '' }));
                                        fetchInventories(rt.id);
                                      }}>Save</button>
                                      <button style={{ ...btn, background: '#888', marginLeft: 4 }} onClick={() => setEditingAvailability(prev => ({ ...prev, [inv.id]: false }))}>Cancel</button>
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [userId, setUserId] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`);
      const data = await res.json();
      setReservations(data);
      setError('');
    } catch (e) {
      setError('Failed to fetch reservations');
    }
    setLoading(false);
  };

  const fetchRoomTypes = async (hotelId) => {
    if (!hotelId) {
      setRoomTypes([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/${hotelId}/room-types`);
      const data = await res.json();
      setRoomTypes(Array.isArray(data) ? data : []);
    } catch (e) {
      setRoomTypes([]);
    }
  };

  const fetchUsersAndHotels = async () => {
    try {
      const [usersRes, hotelsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`),
        fetch(`${API_BASE_URL}/hotels`)
      ]);
      setUsers(await usersRes.json());
      setHotels(await hotelsRes.json());
    } catch {}
  };

  useEffect(() => {
    fetchReservations();
    fetchUsersAndHotels();
  }, []);

  useEffect(() => {
    fetchRoomTypes(hotelId);
    setRoomTypeId(''); // Reset room type when hotel changes
  }, [hotelId]);

  const handleAddReservation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: Number(userId), 
          hotelId: Number(hotelId), 
          roomTypeId: Number(roomTypeId),
          startDate, 
          endDate,
          numberOfRooms: Number(numberOfRooms)
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Failed to add reservation');
      }
      
      setUserId('');
      setHotelId('');
      setRoomTypeId('');
      setStartDate('');
      setEndDate('');
      setNumberOfRooms(1);
      fetchReservations();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleDeleteReservation = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete reservation');
      fetchReservations();
    } catch (e) {
      setError('Failed to delete reservation');
    }
    setLoading(false);
  };

  return (
    <div style={card}>
      <h2 style={{ color: '#1976d2' }}>Reservations</h2>
      <form onSubmit={handleAddReservation} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <select value={userId} onChange={e => setUserId(e.target.value)} required style={input}>
          <option value="">Select User</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={hotelId} onChange={e => setHotelId(e.target.value)} required style={input}>
          <option value="">Select Hotel</option>
          {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <select value={roomTypeId} onChange={e => setRoomTypeId(e.target.value)} required style={input}>
          <option value="">Select Room Type</option>
          {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
          style={input}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
          style={input}
        />
        <input
          type="number"
          placeholder="Number of Rooms"
          value={numberOfRooms}
          onChange={e => setNumberOfRooms(e.target.value)}
          required
          style={input}
          min={1}
        />
        <button type="submit" disabled={loading} style={btn}>Add Reservation</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        reservations.length === 0 ? (
          <div style={{ color: '#b71c1c', background: '#fff3e0', border: '1px solid #ffccbc', borderRadius: 8, padding: 16, textAlign: 'center', marginTop: 16, fontWeight: 500, fontSize: 18 }}>
            No reservations found.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {reservations.map(r => (
              <li key={r.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ color: '#222', background: '#e3f2fd', padding: '4px 8px', borderRadius: 4, flex: 1 }}>
                    User: <b>{r.user?.name || `User #${r.userId}`}</b>, Hotel: <b>{r.hotel?.name || `Hotel #${r.hotelId}`}</b>,
                    {r.roomType && `, Room Type: <b>${r.roomType.name}</b>`}
                    {` ${r.startDate ? new Date(r.startDate).toLocaleDateString() : ''} - ${r.endDate ? new Date(r.endDate).toLocaleDateString() : ''}`}
                    {r.numberOfRooms && `, Rooms: ${r.numberOfRooms}`}
                  </span>
                  <button onClick={() => handleDeleteReservation(r.id)} disabled={loading} style={{ ...btn, background: '#e53935', marginLeft: 8 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('users');
  return (
    <div style={appBg}>
      <div style={overlay}></div>
      <Header />
      <div style={layout}>
        <aside style={sidebar}>
          <button onClick={() => setPage('users')} style={sidebarTab(page === 'users')}>Users</button>
          <button onClick={() => setPage('hotels')} style={sidebarTab(page === 'hotels')}>Hotels</button>
          <button onClick={() => setPage('reservations')} style={sidebarTab(page === 'reservations')}>Reservations</button>
        </aside>
        <div style={mainContent}>
          {page === 'users' && <Users />}
          {page === 'hotels' && <Hotels />}
          {page === 'reservations' && <Reservations />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App
