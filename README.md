# Zorvyn Finance - Premium Fintech Dashboard

**Frontend Developer Intern Assignment**  
**Submitted by:** Karthik Nakkala

## 🚀 Live Demo
[Live Demo Link](https://zorvyn-project-wine.vercel.app/)

## 📋 Project Overview
A clean, modern, and fully interactive **Premium Personal Finance Dashboard** built for Zorvyn FinTech. Designed with a stunning deep dark-mode aesthetic, micro-animations, and smooth user flow to provide a high-end financial tracking experience.

Users can:
- View real-time financial summary cards and net worth
- Track balance momentum and trends over the last 6 months
- See categorized outflow breakdown with a beautiful pie chart
- Manage transactions (Add / Delete / Search / Sort)
- Role-based access control (Admin vs Viewer)
- Access smart AI-powered financial insights (Monthly velocity, Capital retention)
- Export all transaction data to CSV instantly
- Persist data locally across sessions using LocalStorage

---

## 📸 Screenshots

*(Note: Please place the screenshots you uploaded into the `public/screenshots` folder and rename them to match the filenames below, or update the links to match your current image paths.)*

### 1. Dashboard Overview & Summary Cards
![Dashboard Overview](./public/screenshots/dashboard-summary.png)
*Real-time overview displaying Total Balance, Income, Expenses, and Savings Efficiency.*

### 2. Deep Visual Analytics
![Visual Analytics](./public/screenshots/visual-analytics.png)
*Interactive charts rendering Balance Momentum and Category-specific Outflow Breakdowns.*

### 3. Smart AI-Powered Insights
![Insights & Analytics](./public/screenshots/insights.png)
*Actionable intelligence tracking top expense categories, monthly spending velocity, and capital retention meters.*

### 4. Comprehensive Transaction Ledger
![Transaction Table](./public/screenshots/transactions.png)
*A robust data grid allowing users to filter, sort, and export financial records to CSV.*

---

## 🛠️ Tech Stack
- **React 18** + Vite
- **Redux Toolkit** (State Management)
- **Tailwind CSS v4** (Modern Utility-First Styling)
- **Recharts** (Performant Charts)
- **TanStack Table v8** (Advanced data grid with sorting & filtering)
- **Lucide React** (Beautiful iconography)
- LocalStorage for zero-backend persistence

## ✨ Key Features
- **Summary Cards** – Total Balance, Income, Expenses, Savings Rate
- **Dynamic Charts** – Balance Trend (Line) + Spending Breakdown (Pie)
- **Fully Functional Transactions Table** – Search, Sort, Filter
- **Role Simulation** – Admin can Add/Delete, Viewer can only view
- **Smart Insights** – Highest spending category + Monthly comparison
- **CSV Export** – One-click scalable download
- **LocalStorage Persistence** – Data remains safe after refresh
- **Responsive & Modern Dark UI** – Engineered with glassmorphism and crisp modern aesthetics

## 🧪 How to Run Locally

```bash
git clone https://github.com/Karthik-Nakkala/Zorvyn-project
cd Zorvyn Project
npm install
npm run dev