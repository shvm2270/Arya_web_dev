const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

// Get all transactions
app.get('/api/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions ORDER BY date DESC, id DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Add a transaction
app.post('/api/transactions', (req, res) => {
    const { text, amount, type, category, date } = req.body;
    if (!text || amount === undefined || !type || !date) {
        return res.status(400).json({ error: 'Please provide text, amount, type, and date' });
    }

    const stmt = db.prepare(`INSERT INTO transactions (text, amount, type, category, date) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([text, amount, type, category, date], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            text,
            amount,
            type,
            category,
            date
        });
    });
    stmt.finalize();
});

// Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM transactions WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Transaction deleted', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
