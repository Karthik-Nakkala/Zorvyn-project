import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444'];

const FinanceCharts = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  // ==================== SMART DYNAMIC LAST 6 MONTHS ====================
  const monthlyTrend = useMemo(() => {
    if (transactions.length === 0) {
      return [{ month: 'No Data', balance: 0 }];
    }

    const monthsMap = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { month: monthKey, net: 0 };
      }
      monthsMap[monthKey].net += (t.type === 'income' ? t.amount : -t.amount);
    });

    // Get all months that have data and sort them
    let runningBalance = 0;
    const sortedMonths = Object.values(monthsMap).sort((a, b) => 
      new Date(`2026 ${a.month} 01`) - new Date(`2026 ${b.month} 01`)
    );

    const result = sortedMonths.map(item => {
      runningBalance += item.net;
      return {
        month: item.month,
        balance: Math.max(0, Math.round(runningBalance))
      };
    });

    // If less than 6 months, show only available (better than empty months)
    return result.length > 0 ? result : [{ month: 'No Data', balance: 0 }];
  }, [transactions]);

  // Spending Breakdown
  const categoryData = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find(item => item.name === t.category);
        if (existing) existing.value += t.amount;
        else acc.push({ name: t.category, value: t.amount });
        return acc;
      }, []);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
      
      {/* Balance Trend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-6">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }}
            />
            <Line 
              type="natural" 
              dataKey="balance" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ fill: '#10b981', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart (same) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-6">Spending Breakdown</h3>
        
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[320px] flex items-center justify-center text-zinc-500">
            No expense data available
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          {categoryData.slice(0, 6).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceCharts;