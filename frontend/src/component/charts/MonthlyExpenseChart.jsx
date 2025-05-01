import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyExpenseChart = () => {
  const [chartData, setChartData] = useState([]);
  const expenses = useSelector((state) => state.expense.expenses);

  useEffect(() => {
    if (expenses.length) {
      // Group expenses by month
      const expensesByMonth = {};
      
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (expensesByMonth[monthYear]) {
          expensesByMonth[monthYear] += parseFloat(expense.amount);
        } else {
          expensesByMonth[monthYear] = parseFloat(expense.amount);
        }
      });
      
      // Convert to array and sort by date
      const data = Object.keys(expensesByMonth)
        .map(monthYear => ({
          month: monthYear,
          amount: expensesByMonth[monthYear],
          // Format month for display
          displayMonth: new Date(`${monthYear}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));
      
      setChartData(data);
    }
  }, [expenses]);

  if (chartData.length === 0) {
    return <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">No expense data available</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Expense Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayMonth" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} name="Total Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseChart;