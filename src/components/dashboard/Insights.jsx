// src/components/dashboard/Insights.jsx
import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Target, Award, Zap, ShieldCheck, Info } from 'lucide-react';

const Insights = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;

  const categorySpend = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const highestSpending = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])[0];

  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonthExpense = 0;
    let lastMonthExpense = 0;

    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        thisMonthExpense += t.amount;
      } else if (
        (d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear) ||
        (currentMonth === 0 && d.getMonth() === 11 && d.getFullYear() === currentYear - 1)
      ) {
        lastMonthExpense += t.amount;
      }
    });

    if (lastMonthExpense === 0) return { text: "New Data Cycle", change: 0, isIncrease: false };
    const percentChange = ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
    return {
      text: percentChange >= 0 ? `↑ ${percentChange.toFixed(0)}%` : `↓ ${Math.abs(percentChange).toFixed(0)}%`,
      isIncrease: percentChange >= 0
    };
  };

  const monthlyComparison = getMonthlyComparison();

  const insights = [
    {
      label: 'TOP EXPENSE CATEGORY',
      value: highestSpending ? highestSpending[0] : 'Scanning...',
      subValue: `₹${highestSpending ? highestSpending[1].toLocaleString('en-IN') : 0} Total`,
      icon: TrendingDown,
      color: 'rose',
      badge: 'Attention Needed'
    },
    {
      label: 'MONTHLY VELOCITY',
      value: monthlyComparison.text,
      subValue: 'Spending Trend vs Prev',
      icon: Zap,
      color: monthlyComparison.isIncrease ? 'rose' : 'emerald',
      badge: monthlyComparison.isIncrease ? 'Rising Risk' : 'Efficiency High'
    },
    {
      label: 'CAPITAL RETENTION',
      value: `${savingsRate}%`,
      subValue: 'Savings Efficiency',
      icon: ShieldCheck,
      color: 'blue',
      badge: savingsRate > 30 ? 'Elite Tier' : 'Standard'
    }
  ];

  return (
    <div className="glass p-10 rounded-[2.5rem] border border-slate-800/50 shadow-2xl relative overflow-hidden group">
      <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-all duration-700"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-white mb-1 uppercase tracking-widest text-xs opacity-60 italic">AI Powered Reports</h3>
          <h4 className="text-3xl font-black text-slate-100 flex items-center gap-3">
            <Award className="text-blue-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            Strategic Insights
          </h4>
        </div>
        <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          Real-time analysis active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-slate-950/40 border border-slate-800 hover:border-blue-500/30 p-8 rounded-3xl transition-all duration-500 group/card hover:translate-y-[-4px] shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-${insight.color}-500/10 text-${insight.color}-500 group-hover/card:scale-110 transition-transform duration-300 shadow-inner`}>
                <insight.icon size={24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-${insight.color}-500/10 text-${insight.color}-500 border border-${insight.color}-500/20`}>
                {insight.badge}
              </span>
            </div>
            
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{insight.label}</h5>
            <div className="text-3xl font-black text-white mb-1 tracking-tight group-hover/card:text-blue-400 transition-colors">
              {insight.value}
            </div>
            <div className="text-sm font-bold text-slate-500 italic">
              {insight.subValue}
            </div>

            {insight.label === 'CAPITAL RETENTION' && (
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-500 tracking-widest">
                  <span>EFFICIENCY METER</span>
                  <span>{savingsRate}%</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50 shadow-inner p-[2px]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl relative z-10 flex items-start gap-4 hover:bg-blue-600/10 transition-colors duration-300">
        <div className="bg-blue-500/20 p-2 rounded-xl text-blue-500 shrink-0">
          <Info size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-100 leading-relaxed">
            <span className="text-blue-400 uppercase tracking-widest text-[10px] block mb-1">Critical Observation</span>
            Strategic focus on <span className="text-blue-400 underline decoration-2 underline-offset-4">{highestSpending ? highestSpending[0] : 'Liquid Assets'}</span> is required. 
            Reducing this by just 10% could increase your annual savings by <span className="text-emerald-400">₹{(highestSpending ? (highestSpending[1] * 0.1 * 12) : 0).toLocaleString('en-IN')}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;