import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryExpenseChart = () => {
  const [chartData, setChartData] = useState([]);
  const expenses = useSelector((state) => state.expense.expenses);
  const groups = useSelector((state) => state.group.groups);

  useEffect(() => {
    if (expenses.length && groups.length) {
      // Create a map of group_id to group name
      const groupMap = {};
      groups.forEach(group => {
        groupMap[group.id] = group.name;
      });

      // Aggregate expenses by category (group)
      const categoryTotals = {};
      expenses.forEach(expense => {
        const groupName = groupMap[expense.group_id] || 'Uncategorized';
        if (!categoryTotals[groupName]) {
          categoryTotals[groupName] = 0;
        }
        categoryTotals[groupName] += parseFloat(expense.amount);
      });

      // Convert to chart data format
      const data = Object.keys(categoryTotals).map(category => ({
        category,
        amount: parseFloat(categoryTotals[category].toFixed(2))
      }));

      setChartData(data);
    }
  }, [expenses, groups]);

  if (chartData.length === 0) {
    return <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">No category data available</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense by Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={150} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          <Radar
            name="Amount"
            dataKey="amount"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip 
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(name) => `${name}`}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryExpenseChart;