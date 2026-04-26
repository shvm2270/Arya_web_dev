import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PlusCircle, Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import { getTransactions } from './utils/api';
import './App.css';

function Navigation({ setIsModalOpen }) {
  const location = useLocation();
  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <Wallet size={32} color="#3b82f6" />
        <h2>WealthTracker</h2>
      </div>
      <nav className="nav-menu">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
          <Receipt size={20} />
          <span>Transactions</span>
        </Link>
      </nav>
      <div className="sidebar-footer" style={{marginTop: 'auto'}}>
        <button className="btn w-full justify-center" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} />
          New Record
        </button>
      </div>
    </aside>
  );
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Router>
      <div className="app-layout">
        <Navigation setIsModalOpen={setIsModalOpen} />

        <main className="main-content">
          <header className="topbar">
            <h1>Overview</h1>
            <div className="user-profile">
              <div className="avatar">W</div>
            </div>
          </header>

          <div className="content-area animate-fade-in">
            {loading ? (
              <div className="loader">Loading your finances...</div>
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard transactions={transactions} />} />
                <Route path="/transactions" element={
                  <TransactionList transactions={transactions} refresh={fetchTransactions} />
                } />
              </Routes>
            )}
          </div>
        </main>

        {isModalOpen && (
          <AddTransactionModal 
            onClose={() => setIsModalOpen(false)} 
            refresh={fetchTransactions} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
