import { createSlice } from "@reduxjs/toolkit";
import { mockTransactions } from "../../data/mockTransactions";

const initialState={
    transactions:mockTransactions,
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
        addTransaction:(state,action)=>{
            state.transactions.unshift(action.payload);
        },
        deleteTransaction:(state,action)=>{
            state.transactions=state.transactions.filter(t=>t.id!==action.payload)
        },
        setFilters:(state,action)=>{
            state.filters={...state.filters,...action.payload}
        }
    }
})

export const {addTransaction,deleteTransaction,setFilters}=transactionsSlice.actions;

export default transactionsSlice.reducer;