// src/components/transactions/TransactionTable.jsx
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import { setFilters, deleteTransaction } from '../../redux/slices/transactionsSlice';
import { Trash2, Plus, Download, Search, Filter, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';

// ─── helpers ───────────────────────────────────────
const formatDate  = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatAmt   = (a) => `₹${Number(a).toLocaleString('en-IN')}`;
const CATEGORY_COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444'];
const catColor = (cat, all) => CATEGORY_COLORS[all.indexOf(cat) % CATEGORY_COLORS.length] ?? '#3b82f6';

// ─── Mobile transaction card ────────────────────────
const TxCard = ({ row, role, dispatch, allCats }) => {
  const tx = row.original;
  const isIncome = tx.type === 'income';
  const color    = catColor(tx.category, allCats);

  return (
    <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60 hover:border-blue-500/20 transition-all duration-200">
      {/* Category dot */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
      >
        {isIncome
          ? <TrendingUp  size={16} style={{ color }} />
          : <TrendingDown size={16} style={{ color }} />
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight">{tx.description}</p>
            <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">{tx.category} · {formatDate(tx.date)}</p>
          </div>
          <span className={`text-sm font-black shrink-0 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncome ? '+' : '-'}{formatAmt(tx.amount)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isIncome
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-rose-500/10    text-rose-500    border border-rose-500/20'
          }`}>
            {tx.type}
          </span>

          {role === 'admin' && (
            <button
              onClick={() => window.confirm('Delete this record?') && dispatch(deleteTransaction(tx.id))}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────
const TransactionTable = () => {
  const dispatch = useDispatch();
  const { transactions, filters } = useSelector((s) => s.transactions);
  const role = useSelector((s) => s.ui.role);

  const [sorting,     setSorting]     = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showModal,   setShowModal]   = useState(false);

  // pre-compute all unique categories for color mapping
  const allCats = useMemo(
    () => [...new Set(transactions.map(t => t.category))],
    [transactions]
  );

  const columns = useMemo(() => {
    const base = [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: i => <span className="text-slate-300 font-semibold text-sm">{formatDate(i.getValue())}</span>
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: i => <span className="text-white font-bold text-sm">{i.getValue()}</span>
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: i => {
          const color = catColor(i.getValue(), allCats);
          return (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
              <span className="capitalize text-slate-400 font-medium text-sm">{i.getValue()}</span>
            </div>
          );
        }
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: i => {
          const isIncome = i.row.original.type === 'income';
          return (
            <span className={`font-black text-sm ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isIncome ? '+' : '-'}{formatAmt(i.getValue())}
            </span>
          );
        }
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: i => {
          const isIncome = i.getValue() === 'income';
          return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
              isIncome
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : 'bg-rose-500/10    text-rose-500    border border-rose-500/20'
            }`}>
              {i.getValue()}
            </span>
          );
        }
      },
    ];

    if (role === 'admin') {
      base.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => window.confirm('Delete this record?') && dispatch(deleteTransaction(row.original.id))}
            className="group p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white transition-all"
          >
            <Trash2 size={15} />
          </button>
        )
      });
    }

    return base;
  }, [role, dispatch, allCats]);

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting, globalFilter: filters.search || globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: (v) => { setGlobalFilter(v); dispatch(setFilters({ search: v })); },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToCSV = () => {
    if (!transactions.length) return;
    const rows = [
      ['Date', 'Description', 'Category', 'Amount', 'Type'],
      ...transactions.map(t => [
        formatDate(t.date), t.description, t.category,
        (t.type === 'income' ? '+' : '-') + t.amount, t.type.toUpperCase()
      ])
    ];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `zorvyn_${Date.now()}.csv` });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">

      {/* ── Header bar ── */}
      <div className="p-5 sm:p-6 border-b border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Title */}
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">System Ledger</p>
            <h4 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2 flex-wrap">
              Transaction History
              <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/25 font-black">
                {transactions.length} records
              </span>
            </h4>
          </div>

          {/* Controls */}
          <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Filter..."
                value={globalFilter}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 w-40 sm:w-52 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Export */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-slate-600 px-4 py-2 rounded-xl text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider transition-all"
            >
              <Download size={14} /> CSV
            </button>

            {/* Add – admin only */}
            {role === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 uppercase tracking-wider transition-all active:scale-95"
              >
                <Plus size={14} /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-slate-800/60 bg-slate-950/30">
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="py-4 px-5 text-left text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:text-blue-400 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        <ArrowUpDown size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                      )}
                      {h.column.getIsSorted() === 'asc'  && <span className="text-blue-400 text-xs">↑</span>}
                      {h.column.getIsSorted() === 'desc' && <span className="text-blue-400 text-xs">↓</span>}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map(row => (
                <tr key={row.id} className="border-b border-slate-800/30 hover:bg-blue-500/[0.025] transition-colors duration-150 group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-4 px-5 align-middle whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <Filter size={36} className="opacity-30" />
                    <span className="text-xs font-black uppercase tracking-widest">No records found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card List ── */}
      <div className="sm:hidden">
        {visibleRows.length > 0 ? (
          <div className="p-4 space-y-3">
            {visibleRows.map(row => (
              <TxCard
                key={row.id}
                row={row}
                role={role}
                dispatch={dispatch}
                allCats={allCats}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-600">
            <Filter size={36} className="opacity-30" />
            <span className="text-xs font-black uppercase tracking-widest">No records found</span>
          </div>
        )}
      </div>

      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default TransactionTable;