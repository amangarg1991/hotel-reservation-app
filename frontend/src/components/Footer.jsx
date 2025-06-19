import { styles } from '../styles';

export function Footer() {
  return (
    <footer style={styles.footer}>
      <span>&copy; {new Date().getFullYear()} Hotel Reservation App</span>
    </footer>
  );
} 