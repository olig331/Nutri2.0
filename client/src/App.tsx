import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { UserSetUp } from './components/UserSetUp';
import { History } from './components/History';
import './style/style.css';
import { UsersContext, IsLoggedContext, CreatingNewUserContext, LoggedInUserSettingsContext, DailyFoodContext } from './Context/Context';
import { UserSelect } from './components/UserSelect';
import { SettingsForm } from './components/SettingsForm';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';



export const App: React.FC = () => {

  const [isLogged, setisLogged] = useState<boolean>(false);
  const [users, setusers] = useState<UsersType[]>([]);
  const [creatingNewUser, setcreatingNewUser] = useState<boolean>(false);
  const [loggedInUserSettings, setLoggedInUserSettings] = useState<UsersType>();
  const [dailyFood, setdailyFood] = useState<any[]>([]);


  useEffect(() => {
    setusers(JSON.parse(localStorage.getItem("userArray")!));
  }, []);

  useEffect(() => {
    console.log(creatingNewUser)
  }, [])


  window.onunload = () => {
    localStorage.setItem("userArray", JSON.stringify(users));
  }

  return (
    <div>
      <UsersContext.Provider value={{ users, setusers }}>
        <IsLoggedContext.Provider value={{ isLogged, setisLogged }}>
          <CreatingNewUserContext.Provider value={{ creatingNewUser, setcreatingNewUser }}>
            <LoggedInUserSettingsContext.Provider value={{ loggedInUserSettings, setLoggedInUserSettings }}>
              <DailyFoodContext.Provider value={{ dailyFood, setdailyFood }}>
                <Router>
                  <Switch>
                    <Route path='/' exact component={UserSelect} />
                    <Route path='/dashboard' component={Dashboard} />
                    <Route path='/setup' component={UserSetUp} />
                    <Route path='/tracker' component={Tracker} />
                    <Route path='/history' component={History} />
                    <Route path='/settings' component={SettingsForm} />
                  </Switch>
                </Router>
              </DailyFoodContext.Provider>
            </LoggedInUserSettingsContext.Provider>
          </CreatingNewUserContext.Provider>
        </IsLoggedContext.Provider>
      </UsersContext.Provider>
      <button onClick={() => { console.log(isLogged); console.log(users); console.log(creatingNewUser); console.log(loggedInUserSettings); }}>conole log stats</button>
    </div >
  );
};
