src/
├── components/
│   ├── layout/          # Sidebar, Header, RoleToggle
│   ├── dashboard/       # SummaryCards, BalanceTrendChart, SpendingPieChart
│   ├── transactions/    # TransactionTable, AddTransactionModal
│   └── common/          # Card, InsightCard, etc.
├── redux/
│   ├── store.js
│   ├── slices/
│   │   ├── transactionsSlice.js
│   │   └── uiSlice.js          # role + darkMode
├── data/
│   └── mockTransactions.js
├── utils/
│   └── helpers.js             # formatCurrency, calculateTotal etc.
├── App.jsx
└── main.jsx