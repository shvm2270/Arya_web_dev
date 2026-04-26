import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addTransaction } from '../utils/api';

export default function AddTransactionModal({ onClose, refresh }) {
  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    type: 'expense',
    category: 'General',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      refresh();
      onClose();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass animate-fade-in">
        <div className="modal-header">
          <h2>Add New Record</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              name="text" 
              value={formData.text} 
              onChange={handleChange} 
              placeholder="e.g. Groceries"
              required 
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required 
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {formData.type === 'expense' ? (
                <>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="General">General</option>
                </>
              ) : (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investments">Investments</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-danger w-full justify-center" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn w-full justify-center" disabled={loading}>
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
