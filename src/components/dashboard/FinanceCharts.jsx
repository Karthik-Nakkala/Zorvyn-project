import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444'];

const FinanceCharts = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  // Mock Monthly Balance Trend Data (real ga calculations cheyyochchu, but for speed static + dynamic mix)
  const monthlyTrend = [
    { month: 'Oct', balance: 85000 },
    { month: 'Nov', balance: 112000 },
    { month: 'Dec', balance: 98000 },
    { month: 'Jan', balance: 145000 },
    { month: 'Feb', balance: 168000 },
    { month: 'Mar', balance: 192280 },
  ];

  // Spending by Category (Dynamic)
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
      
      {/* Balance Trend Line Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span>Balance Trend</span>
          <span className="text-emerald-400 text-sm">(Last 6 Months)</span>
        </h3>
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

      {/* Spending Breakdown Pie Chart */}
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
                fill="#8884d8"
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
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          {categoryData.slice(0, 6).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceCharts;