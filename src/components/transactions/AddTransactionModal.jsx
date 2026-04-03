import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../redux/slices/transactionsSlice';

const categories = [
  'Food & Drink', 'Transport', 'Shopping', 'Rent', 'Bills', 
  'Entertainment', 'Healthcare', 'Salary', 'Freelance', 'Refund'
];

const AddTransactionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.ui.role);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Drink',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;
  if (role !== 'admin') return null;   // Extra safety

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTransaction = {
      id: Date.now(),
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type
    };

    dispatch(addTransaction(newTransaction));
    onClose();
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'Food & Drink',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Add New Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Swiggy Order"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                placeholder="450"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-zinc-400 hover:bg-zinc-800 rounded-2xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium transition"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;