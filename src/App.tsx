import React,{useState} from 'react';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { UserSetUp } from './components/UserSetUp'
import './style/style.css';
import { UserContext } from './Context/UserContext';

export const App:React.FC = () => {

  const [user, setuser] = useState<string>("");

  return (
    <div>
      <UserContext.Provider value={{user, setuser}}>
        <Dashboard />
        <Tracker />
        <UserSetUp />
      </UserContext.Provider>
    </div>
  );
};
