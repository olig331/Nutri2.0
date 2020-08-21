import React, { useState, createContext, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { UserSetUp } from './components/UserSetUp';
import { History } from './components/History';
import './style/style.css';
import { UsersContext, IsLoggedContext, ViewPageContext } from './Context/Context';
import { UserSelect } from './components/UserSelect';
import { SettingsForm } from './components/SettingsForm';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';



export const App: React.FC = () => {

  const [isLogged, setisLogged] = useState<boolean>(false);
  const [users, setusers] = useState<UsersType[]>([]);
  const [viewPageArray, setviewPageArray] = useState<boolean[]>([false, false, false, false])
  const [showConditionalRender, setshowConditionalRender] = useState<boolean>(true);

  const userInfoFromStorage = localStorage.getItem("userArray")

  useEffect(() => {
    if (localStorage.getItem("userArray") !== null) {
      setusers(JSON.parse(localStorage.getItem("userArray")!))
    }
  }, []);


  //index 0 = tracker || index 1 = History || index 2 = Settings
  const togglePages = (index: number): void => {
    let newState: boolean[] = new Array(4).fill(false);
    if (index !== 10) {
      newState[index] = true;
      setviewPageArray(newState);
    } else
      setviewPageArray(newState);
  }

  const toggleIsLogged = () => {
    isLogged ? setisLogged(false) : setisLogged(true);
  }

  const toggleShowConditionalRender = ():void => {
    showConditionalRender ? setshowConditionalRender(false) : setshowConditionalRender(true);
  }

  return (
    <div>
      <UsersContext.Provider value={{ users, setusers }}>
        <IsLoggedContext.Provider value={{ isLogged, setisLogged }}>
          <Router>
            {userInfoFromStorage === null && setshowConditionalRender
              ? <UserSetUp />
              : isLogged && showConditionalRender
                ? <Dashboard
                    toggleRender={toggleShowConditionalRender}
                  />
                : isLogged === false && showConditionalRender
                  ? <UserSelect />
                  : ""
            }
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/select-user' component={UserSelect} />
            <Route path='/setup' component={UserSetUp} />
            <Route path='/tracker' component={Tracker} />
            <Route path='/history' component={History} />
            <Route path='/settings' component={SettingsForm} />
          </Router>
        </IsLoggedContext.Provider>
      </UsersContext.Provider>
      <button onClick={()=> {console.log(showConditionalRender); console.log(isLogged)}}>conole log stats</button>
    </div>
  );
};
