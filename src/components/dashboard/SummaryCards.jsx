// src/components/dashboard/SummaryCards.jsx
import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SummaryCards = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const cards = [
    {
      title: 'TOTAL BALANCE',
      value: `₹${totalBalance.toLocaleString('en-IN')}`,
      icon: Wallet,
      trend: `${savingsRate}%`,
      isPositive: totalBalance >= 0,
      color: 'blue',
      description: 'Your net worth this month'
    },
    {
      title: 'INCOME',
      value: `₹${totalIncome.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      trend: '+12%',
      isPositive: true,
      color: 'emerald',
      description: 'Total earnings tracked'
    },
    {
      title: 'EXPENSES',
      value: `₹${totalExpenses.toLocaleString('en-IN')}`,
      icon: TrendingDown,
      trend: '-5%',
      isPositive: false,
      color: 'rose',
      description: 'Total spending activity'
    },
    {
      title: 'SAVINGS RATE',
      value: `${savingsRate}%`,
      icon: PiggyBank,
      trend: 'Target: 40%',
      isPositive: savingsRate >= 40,
      color: 'amber',
      description: 'Efficiency of your savings'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="glass glass-hover p-6 rounded-3xl transition-all duration-500 group flex flex-col justify-between h-48 relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${card.color}-500/10 blur-3xl rounded-full group-hover:bg-${card.color}-500/20 transition-all duration-700`}></div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center p-2 group-hover:scale-110 transition-all duration-300`}>
                <card.icon className={`w-5 h-5 text-${card.color}-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{card.title}</span>
            </div>
            <div className={`p-1.5 rounded-lg ${card.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} flex items-center gap-1 scale-90`}>
              {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </div>
          </div>

          <div className="mt-2">
            <div className="text-3xl font-extrabold tracking-tighter text-white transition-transform group-hover:translate-x-1 duration-300">
              {card.value}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {card.description}
            </p>
          </div>

          {/* Progress Indicator Snippet */}
          <div className="mt-4 w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-${card.color}-600 to-${card.color}-400 rounded-full group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000`}
              style={{ width: `${card.isPositive ? '75%' : '45%'}` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;