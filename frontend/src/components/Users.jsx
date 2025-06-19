import { useEffect, useState } from 'react';
import { styles } from '../styles';
import { usersAPI } from '../api';

export function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
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
      await usersAPI.create({ name, email });
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
      await usersAPI.delete(id);
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user');
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={{ color: '#1976d2' }}>Users</h2>
      <form onSubmit={handleAddUser} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.btn}>Add User</button>
      </form>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        users.length === 0 ? (
          <div style={styles.emptyState}>
            No users found.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={styles.userItem}>
                  <span style={styles.userInfo}>
                    {user.name} <span style={{ color: '#888' }}>({user.email})</span>
                  </span>
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
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