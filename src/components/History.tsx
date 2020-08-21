import React from 'react';
import { Link } from 'react-router-dom';



export const History:React.FC = () => {
  return (
    <div>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
    </div>
  )
};
