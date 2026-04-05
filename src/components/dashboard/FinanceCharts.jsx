// src/components/dashboard/FinanceCharts.jsx
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3 } from 'lucide-react';

const FinanceCharts = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  // Dynamic Last 6 Months Data
  const monthlyTrend = useMemo(() => {
    if (transactions.length === 0) {
      return [{ month: 'N/A', balance: 0 }];
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

    let runningBalance = 0;
    const sortedMonths = Object.values(monthsMap).sort((a, b) => 
      new Date(`2026 ${a.month} 01`) - new Date(`2026 ${b.month} 01`)
    );

    return sortedMonths.map(item => {
      runningBalance += item.net;
      return {
        month: item.month,
        balance: Math.max(0, Math.round(runningBalance))
      };
    });
  }, [transactions]);

  // Spending Breakdown
  const categoryData = useMemo(() => {
    const data = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find(item => item.name === t.category);
        if (existing) existing.value += t.amount;
        else acc.push({ name: t.category, value: t.amount });
        return acc;
      }, []);
    return data.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Balance Trend - Area Chart */}
      <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 shadow-xl shadow-blue-500/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-white mb-1 uppercase tracking-widest text-xs opacity-60">Visual Analytics</h3>
            <h4 className="text-2xl font-bold text-slate-100">Balance Momentum</h4>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Avg: ₹{(monthlyTrend.length > 0 ? monthlyTrend.reduce((s, m) => s + m.balance, 0) / monthlyTrend.length : 0).toLocaleString('en-IN')}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 600 }}
              tickFormatter={(val) => `₹${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(59, 130, 246, 0.3)', 
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)',
                padding: '12px'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#020617' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Breakdown - Premium List */}
      <div className="glass p-8 rounded-[2rem] border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 shadow-xl shadow-blue-500/5">
        <h3 className="text-xl font-extrabold tracking-tight text-white mb-8 uppercase tracking-widest text-xs opacity-60">Category Focus</h3>
        <h4 className="text-2xl font-bold text-slate-100 mb-8">Outflow Breakdown</h4>

        {categoryData.length > 0 ? (
          <div className="space-y-6">
            {categoryData.map((item, index) => {
              const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
              const percentage = Math.round((item.value / categoryData.reduce((s, c) => s + c.value, 0)) * 100);
              return (
                <div key={index} className="group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-white">₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.3)] shadow-inner"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: colors[index % colors.length] 
                      }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{percentage}% of spend</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
            <BarChart3 size={48} />
            <span className="text-sm font-bold tracking-widest uppercase">Awaiting Data Insights</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCharts;