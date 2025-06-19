import { useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Users } from './components/Users'
import { Hotels } from './components/Hotels'
import { Reservations } from './components/Reservations'
import { styles } from './styles'
import './App.css'

// API base URL - configurable for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <Users />;
      case 'hotels':
        return <Hotels />;
      case 'reservations':
        return <Reservations />;
      default:
        return <Users />;
    }
  };

  return (
    <div style={styles.appBg}>
      <div style={styles.overlay}></div>
      <Header />
      <div style={styles.layout}>
        <nav style={styles.sidebar}>
          <button
            onClick={() => setActiveTab('users')}
            style={styles.sidebarTab(activeTab === 'users')}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            style={styles.sidebarTab(activeTab === 'hotels')}
          >
            Hotels
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            style={styles.sidebarTab(activeTab === 'reservations')}
          >
            Reservations
          </button>
        </nav>
        <main style={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App
