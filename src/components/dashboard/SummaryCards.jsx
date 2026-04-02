import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      
      {/* Total Balance Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="text-zinc-400 text-sm font-medium">TOTAL BALANCE</div>
          <Wallet className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-3xl font-semibold text-white mb-1">
          ₹{totalBalance.toLocaleString('en-IN')}
        </div>
        <div className={`text-sm flex items-center gap-1 ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {totalBalance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {totalBalance >= 0 ? '+' : ''}{savingsRate}%
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="text-zinc-400 text-sm font-medium">INCOME</div>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="text-3xl font-semibold text-emerald-400 mb-1">
          ₹{totalIncome.toLocaleString('en-IN')}
        </div>
        <div className="text-emerald-400/70 text-sm">This month</div>
      </div>

      {/* Expenses Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="text-zinc-400 text-sm font-medium">EXPENSES</div>
          <TrendingDown className="w-5 h-5 text-rose-500" />
        </div>
        <div className="text-3xl font-semibold text-rose-400 mb-1">
          ₹{totalExpenses.toLocaleString('en-IN')}
        </div>
        <div className="text-rose-400/70 text-sm">This month</div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="text-zinc-400 text-sm font-medium">SAVINGS RATE</div>
          <PiggyBank className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-3xl font-semibold text-amber-400 mb-1">
          {savingsRate}%
        </div>
        <div className="text-amber-400/70 text-sm">Of total income</div>
      </div>
    </div>
  );
};

export default SummaryCards;