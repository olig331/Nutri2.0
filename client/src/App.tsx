import React, { useState, useEffect, Component } from 'react';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { UserSetUp } from './components/UserSetUp';
import { History } from './components/History';
import './style/style.css';
import { UsersContext, IsLoggedContext, CreatingNewUserContext, LoggedInUserSettingsContext, DailyFoodContext, UserAuthedContext, LoggedInIDContext } from './Context/Context';
import { UserSelect } from './components/UserSelect';
import { SettingsForm } from './components/SettingsForm';
import { rejects } from 'assert';


import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';


interface passedItems {
  component: any,
  authed: any
  path: any
}

export const App: React.FC = () => {

  const [userAuthed, setuserAuthed] = useState<boolean>(false)
  const [isLogged, setisLogged] = useState<boolean>(false);
  const [users, setusers] = useState<UsersType[]>([]);
  const [creatingNewUser, setcreatingNewUser] = useState<boolean>(false);
  const [loggedInUserSettings, setLoggedInUserSettings] = useState<UsersDBType>();
  const [dailyFood, setdailyFood] = useState<any[]>([]);
  const [loggedInID, setloggedInID] = useState<string>("");


  useEffect(() => {
    setusers(JSON.parse(localStorage.getItem("userArray")!));
  }, []);

  useEffect(() => {
    console.log(creatingNewUser)
  }, [])


  window.onunload = async () => {
    await fetch(`http://localhost:5000/updateUsersFood?userId=${loggedInID}`, {
      method: 'POST',
      body: JSON.stringify(dailyFood),
      mode: "no-cors"
    })
      .then(response => {
        return response.text()
      })
      .catch((error) => {
        rejects(error)
      })
  }

  return (
    <div>
      <UserAuthedContext.Provider value={{ userAuthed, setuserAuthed }}>
        <UsersContext.Provider value={{ users, setusers }}>
          <IsLoggedContext.Provider value={{ isLogged, setisLogged }}>
            <CreatingNewUserContext.Provider value={{ creatingNewUser, setcreatingNewUser }}>
              <LoggedInUserSettingsContext.Provider value={{ loggedInUserSettings, setLoggedInUserSettings }}>
                <DailyFoodContext.Provider value={{ dailyFood, setdailyFood }}>
                  <LoggedInIDContext.Provider value={{ loggedInID, setloggedInID }}><Router>
                    <Switch>
                      <Route exact path='/' component={UserSelect} />
                      <Route path='/setup' component={UserSetUp} />
                      <Route path='/tracker' component={Tracker} />
                      <Route path='/history' component={History} />
                      <Route path='/settings' component={SettingsForm} />
                      <Route path="/dashboard" component={Dashboard} />
                    </Switch>
                  </Router>
                  </LoggedInIDContext.Provider>
                </DailyFoodContext.Provider>
              </LoggedInUserSettingsContext.Provider>
            </CreatingNewUserContext.Provider>
          </IsLoggedContext.Provider>
        </UsersContext.Provider>
      </UserAuthedContext.Provider>
      <button onClick={() => { console.log(isLogged); console.log(users); console.log(creatingNewUser); console.log(loggedInUserSettings); }}>conole log stats</button>
    </div >
  );
};
