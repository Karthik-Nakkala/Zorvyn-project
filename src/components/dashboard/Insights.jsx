import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

const Insights = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;

  // Highest Spending Category
  const categorySpend = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const highestSpending = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])[0];

  // ==================== DYNAMIC MONTHLY COMPARISON ====================
  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonthExpense = 0;
    let lastMonthExpense = 0;

    transactions.forEach(t => {
      if (t.type !== 'expense') return;

      const txDate = new Date(t.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      if (txMonth === currentMonth && txYear === currentYear) {
        thisMonthExpense += t.amount;
      } else if (
        (txMonth === currentMonth - 1 && txYear === currentYear) ||
        (currentMonth === 0 && txMonth === 11 && txYear === currentYear - 1)
      ) {
        lastMonthExpense += t.amount;
      }
    });

    if (lastMonthExpense === 0) return "New Month";

    const changePercent = ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;

    return changePercent >= 0 
      ? `↑ ${changePercent.toFixed(0)}%` 
      : `↓ ${Math.abs(changePercent).toFixed(0)}%`;
  };

  const monthlyComparison = getMonthlyComparison();

  return (
    <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold flex items-center gap-3">
          <Award className="text-amber-400" />
          Smart Insights
        </h3>
        <p className="text-zinc-500 text-sm">Based on your recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Highest Spending */}
        <div className="bg-zinc-950 border border-zinc-700 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
          <div className="flex items-center gap-3 text-rose-400 mb-4">
            <TrendingDown size={24} />
            <span className="font-medium">HIGHEST SPENDING CATEGORY</span>
          </div>
          <div className="text-3xl font-semibold mb-1">
            {highestSpending ? highestSpending[0] : 'No Data'}
          </div>
          <div className="text-zinc-400">
            ₹{highestSpending ? highestSpending[1].toLocaleString('en-IN') : 0} spent
          </div>
        </div>

        {/* Monthly Comparison - Now Dynamic */}
        <div className="bg-zinc-950 border border-zinc-700 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-3 text-amber-400 mb-4">
            <Target size={24} />
            <span className="font-medium">MONTHLY COMPARISON</span>
          </div>
          <div className={`text-3xl font-semibold mb-1 ${monthlyComparison.includes('↑') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {monthlyComparison}
          </div>
          <div className="text-zinc-400">vs Last Month</div>
          <div className="text-sm text-zinc-500 mt-4">
            You are {monthlyComparison.includes('↑') ? 'spending more' : 'saving more'} this month
          </div>
        </div>

        {/* Savings Insight */}
        <div className="bg-zinc-950 border border-zinc-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3 text-emerald-400 mb-4">
            <Award size={24} />
            <span className="font-medium">SAVINGS RATE</span>
          </div>
          <div className="text-3xl font-semibold text-emerald-400 mb-1">
            {savingsRate}%
          </div>
          <div className="text-zinc-400">of your income saved</div>
          
          <div className="mt-6 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Extra Observation */}
      <div className="mt-8 p-6 bg-zinc-950 border border-zinc-700 rounded-2xl text-sm leading-relaxed text-zinc-300">
        💡 <span className="font-medium text-amber-400">Observation:</span> 
        Your highest expense is on <span className="text-rose-400 font-medium">
          {highestSpending ? highestSpending[0] : 'Rent'}
        </span>. 
        Consider reviewing this category to improve savings.
      </div>
    </div>
  );
};

export default Insights;