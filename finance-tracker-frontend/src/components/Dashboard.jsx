import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ transactions }) {
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.totalIncome += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
          acc.balance -= curr.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  // Chart Data preparation
  const last7Days = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Income',
        data: last7Days.map(date => 
          transactions.filter(t => t.type === 'income' && t.date.startsWith(date))
                      .reduce((sum, t) => sum + t.amount, 0)
        ),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expense',
        data: last7Days.map(date => 
          transactions.filter(t => t.type === 'expense' && t.date.startsWith(date))
                      .reduce((sum, t) => sum + t.amount, 0)
        ),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  const doughnutData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [totalIncome, totalExpense],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8' } }
    },
    cutout: '75%'
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="summary-card glass">
          <h3>Total Balance</h3>
          <p className={balance >= 0 ? 'text-success' : 'text-danger'}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="summary-card glass">
          <h3>Total Income</h3>
          <p className="text-success">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card glass">
          <h3>Total Expense</h3>
          <p className="text-danger">${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card glass">
          <h3 style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Last 7 Days Activity</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="chart-card glass">
          <h3 style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Income vs Expense</h3>
          <div style={{ height: '300px' }}>
            {totalIncome === 0 && totalExpense === 0 ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)'}}>No data available</div>
            ) : (
                <Doughnut data={doughnutData} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
