import { styles } from '../styles';

export function Header() {
  return (
    <header style={styles.header}>
      <h1 style={{ margin: 0, fontWeight: 700, letterSpacing: 1 }}>Hotel Reservation App</h1>
      <p style={{ margin: 0, fontWeight: 300 }}>Manage users, hotels, and reservations easily</p>
    </header>
  );
} 