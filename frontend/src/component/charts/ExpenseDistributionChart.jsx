import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ExpenseDistributionChart = () => {
  const [chartData, setChartData] = useState([]);
  const expenses = useSelector((state) => state.expense.expenses);
  const groups = useSelector((state) => state.group.groups);

  useEffect(() => {
    if (expenses.length > 0 && groups.length > 0) {
      // Group expenses by group_id and calculate total amount for each group
      const expensesByGroup = {};
      
      expenses.forEach(expense => {
        if (expensesByGroup[expense.group.id]) {
          expensesByGroup[expense.group.id] += parseFloat(expense.amount);
        } else {
          expensesByGroup[expense.group.id] = parseFloat(expense.amount);
        }
      });
      
      // Format data for the pie chart
      const data = Object.keys(expensesByGroup).map(groupId => {
        const group = groups.find(g => g.id === parseInt(groupId));
        return {
          name: group ? group.name : 'Unknown',
          value: expensesByGroup[groupId]
        };
      });
      
      setChartData(data);
    }
  }, [expenses, groups]);

  if (chartData.length === 0) {
    return <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">No expense data available</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense Distribution by Group</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseDistributionChart;