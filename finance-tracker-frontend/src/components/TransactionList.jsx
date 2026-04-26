import React from 'react';
import { Trash2 } from 'lucide-react';
import { deleteTransaction } from '../utils/api';

export default function TransactionList({ transactions, refresh }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      refresh();
    }
  };

  return (
    <div className="transaction-list">
      <div className="transactions-header">
        <h2>Recent Transactions</h2>
      </div>
      
      <div className="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.text}</td>
                  <td>{t.category || '-'}</td>
                  <td>
                    <span className={`badge ${t.type}`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td className={t.type === 'income' ? 'text-success' : 'text-danger'}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                  <td>
                    <button 
                      className="btn-danger" 
                      style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
