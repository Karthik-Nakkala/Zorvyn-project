import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  flexRender 
} from '@tanstack/react-table';
import { setFilters } from '../../redux/slices/transactionsSlice';
import { Pencil, Trash2, Plus,Download } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import { deleteTransaction } from '../../redux/slices/transactionsSlice';

const TransactionTable = () => {
  const dispatch = useDispatch();
  const { transactions, filters } = useSelector((state) => state.transactions);
  const role = useSelector((state) => state.ui.role);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Columns definition
  const columns = useMemo(() => {
    const baseColumns = [
      { accessorKey: 'date', header: 'Date', cell: info => new Date(info.getValue()).toLocaleDateString('en-IN') },
      { accessorKey: 'description', header: 'Description' },
      { 
        accessorKey: 'category', 
        header: 'Category',
        cell: info => <span className="capitalize">{info.getValue()}</span>
      },
      { 
        accessorKey: 'amount', 
        header: 'Amount',
        cell: info => {
          const amount = info.getValue();
          const isIncome = info.row.original.type === 'income';
          return (
            <span className={`font-medium ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isIncome ? '+' : ''}₹{amount.toLocaleString('en-IN')}
            </span>
          );
        }
      },
      { accessorKey: 'type', header: 'Type', cell: info => <span className="capitalize">{info.getValue()}</span> },
    ];

    // Admin ki matrame Actions column add chey
    if (role === 'admin') {
      baseColumns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => {
              if (window.confirm('Delete this transaction?')) {
                dispatch(deleteTransaction(row.original.id));
              }
            }}
            className="text-rose-400 hover:text-rose-500 p-1 hover:bg-zinc-800 rounded-lg transition"
          >
            <Trash2 size={18} />
          </button>
        )
      });
    }

    return baseColumns;
  }, [role, dispatch]);   //role change ayithe columns refresh avvali

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      globalFilter: filters.search || globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      dispatch(setFilters({ search: value }));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export!");
      return;
    }

    const headers = ["Date", "Description", "Category", "Amount", "Type"];
    
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('en-IN'),
      t.description,
      t.category,
      t.type === 'income' ? `+₹${t.amount}` : `-₹${t.amount}`,
      t.type.toUpperCase()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zorvyn_transactions_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search transactions..."
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-72"
          />

          {/* NEW CSV EXPORT BUTTON */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all active:scale-95"
          >
            <Download size={18} />
            Export CSV
          </button>

          {/* Add Button - Admin only */}
          {role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)} 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-xl text-sm font-medium transition"
            >
              <Plus size={18} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-zinc-800">
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left py-4 px-4 text-zinc-400 font-medium cursor-pointer hover:text-zinc-100"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-4 px-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default TransactionTable;