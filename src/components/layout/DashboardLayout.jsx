// src/components/layout/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRole } from '../../redux/slices/uiSlice';
import SummaryCards from '../dashboard/SummaryCards';
import {
  Wallet, BarChart3, List, TrendingUp,
  LogOut, Bell, Search, LayoutDashboard,
  ChevronDown, Shield, Eye, X, Sparkles
} from 'lucide-react';
import FinanceCharts from '../dashboard/FinanceCharts';
import TransactionTable from '../transactions/TransactionTable';
import Insights from '../dashboard/Insights';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard',    targetId: 'summary' },
  { id: 'transactions', icon: List,          label: 'Transactions', targetId: 'transactions' },
  { id: 'insights',    icon: TrendingUp,     label: 'Insights',     targetId: 'insights' },
];

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.ui.role);

  const [activeTab,         setActiveTab]         = useState('dashboard');
  const [showRoleDropdown,  setShowRoleDropdown]  = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Close dropdown on outside scroll / resize
  useEffect(() => {
    const close = () => setShowRoleDropdown(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, []);

  const scrollTo = (targetId) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNav = (item) => {
    setActiveTab(item.id);
    setShowMobileSidebar(false);
    setTimeout(() => scrollTo(item.targetId), 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">

      {/* ─── HEADER ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/60">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight text-white leading-none">
                Zorvyn<span className="text-blue-500"> Finance</span>
              </h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Premium Fintech</p>
            </div>
          </div>

         

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Bell */}
            <button className="relative p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            {/* Role Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(v => !v)}
                className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-2xl px-3 py-2 transition-all duration-200 group"
              >
                {/* icon pill */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${role === 'admin' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {role === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
                </div>
                {/* label */}
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.15em]">Role</span>
                  <span className={`text-xs font-black capitalize mt-0.5 ${role === 'admin' ? 'text-blue-400' : 'text-slate-300'}`}>
                    {role}
                  </span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-slate-500 transition-transform duration-300 hidden sm:block ${showRoleDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {showRoleDropdown && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setShowRoleDropdown(false)} />
                  <div className="absolute right-0 top-[calc(100%+8px)] w-52 z-[100] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden">
                    <div className="px-4 pt-3 pb-2 border-b border-slate-800">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.18em]">Access Authority</p>
                    </div>

                    {[
                      { value: 'viewer', icon: Eye,    label: 'Viewer', sub: 'Read-only analyst' },
                      { value: 'admin',  icon: Shield,  label: 'Admin',  sub: 'Full system control' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { dispatch(setRole(opt.value)); setShowRoleDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                          role === opt.value
                            ? 'bg-blue-600/15 text-blue-400'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${role === opt.value ? 'bg-blue-500/20' : 'bg-slate-800'}`}>
                          <opt.icon size={14} />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold leading-tight">{opt.label}</span>
                          <span className="text-[10px] opacity-50 mt-0.5">{opt.sub}</span>
                        </div>
                        {role === opt.value && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── BODY ───────────────────────────────────────── */}
      <div className="flex max-w-[1600px] mx-auto">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-slate-800/50 py-6 px-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <item.icon size={18} className={activeTab === item.id ? 'text-blue-500' : 'group-hover:scale-110 transition-transform'} />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-2">
            <div className="bg-gradient-to-br from-blue-600/20 via-blue-600/10 to-transparent p-4 rounded-2xl border border-blue-500/15 cursor-pointer hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-xs font-black text-white">Upgrade to Pro</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Advanced AI insights & priority support.</p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-400 rounded-2xl hover:bg-rose-500/5 transition-all group text-sm font-semibold">
              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">

          {/* Page heading */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">Karthik</span> 👋
              </h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">Your financial ecosystem at a glance.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 uppercase tracking-widest self-start sm:self-auto">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <section id="summary"><SummaryCards /></section>
            <section id="charts"><FinanceCharts /></section>
            <section id="transactions"><TransactionTable /></section>
            <section id="insights"><Insights /></section>
          </div>
        </main>
      </div>

      {/* ─── MOBILE BOTTOM NAV ─────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/70">
        <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {navItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 rounded-xl ${
                  active ? 'text-blue-500' : 'text-slate-600 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-200 ${active ? 'bg-blue-500/15' : ''}`}>
                  <item.icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]' : ''} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-40'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

        </div>
      </nav>

    </div>
  );
};

export default DashboardLayout;