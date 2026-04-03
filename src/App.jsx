import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import RoleToggle from "./components/layout/RoleToggle";
import Header from "./components/layout/Header";

const AppContent = () => {

  const darkMode=useSelector((store)=>store.ui.darkMode);
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
