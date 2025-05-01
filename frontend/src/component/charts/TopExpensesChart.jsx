import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopExpensesChart = () => {
  const [chartData, setChartData] = useState([]);
  const expenses = useSelector((state) => state.expense.expenses);

  useEffect(() => {
    if (expenses.length) {
      // Sort expenses by amount (descending) and take top 5
      const topExpenses = [...expenses]
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, 5)
        .map(expense => ({
          name: expense.name,
          amount: parseFloat(expense.amount),
          date: new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
      
      setChartData(topExpenses);
    }
  }, [expenses]);

  if (chartData.length === 0) {
    return <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">No expense data available</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Top 5 Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(name) => `${name}`}
          />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopExpensesChart;