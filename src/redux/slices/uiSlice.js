import { createSlice } from "@reduxjs/toolkit";

const uiSlice=createSlice({
    name:'ui',
    initialState:{
        role:'viwer',
        darkMode:true,
    },
    reducers:{
        setRole:(state,action)=>{
            
            state.role=action.payload
        },
        toggleDarkMode:(state)=>{
            state.darkMode=!state.darkMode
        }
    }
})


export const {setRole,toggleDarkMode}=uiSlice.actions;
export default uiSlice.reducer;