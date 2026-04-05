import { createSlice } from "@reduxjs/toolkit";


const initialState={
    transactions:[],
    filters:{
        search:'',
        type:'all',
        category:'all'
    }
}

const transactionsSlice=createSlice({
    name:'transactions',
    initialState,
    reducers:{
        setTransactions: (state, action) => {
            state.transactions = action.payload;
        },
        addTransaction:(state,action)=>{
            state.transactions.unshift(action.payload);
        },
        deleteTransaction:(state,action)=>{
            state.transactions=state.transactions.filter(t=>t.id!==action.payload)
        },
        setFilters:(state,action)=>{
            state.filters={...state.filters,...action.payload}
        },
        
    }
})

export const {setTransactions,addTransaction,deleteTransaction,setFilters}=transactionsSlice.actions;

export default transactionsSlice.reducer;