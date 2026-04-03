// src/components/layout/DashboardLayout.jsx
import { useSelector, useDispatch } from 'react-redux';
import { setRole } from '../../redux/slices/uiSlice';
import SummaryCards from '../dashboard/SummaryCards';
import { Wallet, BarChart3, List, TrendingUp, LogOut } from 'lucide-react';
import FinanceCharts from '../dashboard/FinanceCharts';
import TransactionTable from '../transactions/TransactionTable';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.ui.role);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Zorvyn Finance</h1>
              <p className="text-xs text-zinc-500">Personal Finance Dashboard</p>
            </div>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-xl">
              <span className="text-sm text-zinc-400">Role:</span>
              <select 
                value={role}
                onChange={(e) => dispatch(setRole(e.target.value))}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center">
              👤
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 h-[calc(100vh-73px)] p-6 hidden md:block">
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-xl text-emerald-400">
              <BarChart3 size={20} />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-100 transition">
              <List size={20} />
              <span>Transactions</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-100 transition">
              <TrendingUp size={20} />
              <span>Insights</span>
            </a>
          </nav>

          <div className="mt-auto pt-8">
            <button className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-rose-400 w-full rounded-xl hover:bg-zinc-900">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-1">Good morning, Karthik 👋</h2>
            <p className="text-zinc-500">Here's what's happening with your finances today.</p>
          </div>

          {/* Summary Cards */}
          <SummaryCards />
          <FinanceCharts/>
          <TransactionTable/>

         
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;