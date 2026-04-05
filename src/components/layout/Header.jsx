import React from 'react'
import { useDispatch } from 'react-redux';
import { setRole } from '../../redux/slices/uiSlice';

const Header = () => {

    const dispatch=useDispatch();
    
  return (
    <div>
      <label htmlFor="">Role:</label>
      <select name="role" onChange={(e)=>{dispatch(setRole(e.target.value))}}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  )
}

export default Header
