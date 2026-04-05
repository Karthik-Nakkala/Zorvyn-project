import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { store } from "./redux/store";
import RoleToggle from "./components/layout/RoleToggle";
import Header from "./components/layout/Header";
import { setTransactions } from "./redux/slices/transactionsSlice";
import { mockTransactions } from "./data/mockTransactions";

const AppContent = () => {

  const dispatch=useDispatch();
  const darkMode=useSelector((store)=>store.ui.darkMode);
  const transactions=useSelector((store)=>store.transactions.transactions)

  // Load from LocalStorage on first render
  useEffect(() => {
    const savedTransactions = localStorage.getItem('zorvynTransactions');
    if (savedTransactions) {
      console.log("Jai hanuman");
      dispatch(setTransactions(JSON.parse(savedTransactions)));
    }
    else{
      dispatch(setTransactions(mockTransactions));
      localStorage.setItem('zorvynTransactions',JSON.stringify(mockTransactions))
    }
  }, [dispatch]);

  // Save to LocalStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      console.log("Jai sri ram");
      localStorage.setItem('zorvynTransactions', JSON.stringify(transactions));
    }
  }, [transactions]);


  return (
    
      <div className={darkMode ? 'dark' : ''}>
        <DashboardLayout/>
      </div>
   
    
  )
}

import React from 'react'
import SummaryCards from "./components/dashboard/SummaryCards";
import DashboardLayout from "./components/layout/DashboardLayout";

const App = () => {
  return (
    <Provider store={store}>
    <div>
      <AppContent/>
    </div>
    </Provider>
  )
}




export default App
