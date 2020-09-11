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
  const [creatingNewUser, setcreatingNewUser] = useState<boolean>(false);
  const [loggedInUserSettings, setLoggedInUserSettings] = useState<UsersDBType>();
  const [dailyFood, setdailyFood] = useState<any[]>([]);
  const [loggedInID, setloggedInID] = useState<string>("");


  useEffect(() => {
    console.log(creatingNewUser)
  }, [])

  // Function to take the current dailyFood state and setting it in the database
  const updateUsersDailyFood = async () =>{
    await fetch(`http://localhost:5000/updateUsersFood?userId=${loggedInID}`, {
      method: 'POST',
      body: JSON.stringify(dailyFood)
    })
      .then(response => {
        return response.text()
      })
      .catch((error) => {
        rejects(error)
      })
  }

  //when the user exits the application without sighning out this function will save the DailyFood to the databse.
  window.onunload = async () => {
   await updateUsersDailyFood();
  };

  return (
    <div>
      <UserAuthedContext.Provider value={{ userAuthed, setuserAuthed }}>
          <IsLoggedContext.Provider value={{ isLogged, setisLogged }}>
            <CreatingNewUserContext.Provider value={{ creatingNewUser, setcreatingNewUser }}>
              <LoggedInUserSettingsContext.Provider value={{ loggedInUserSettings, setLoggedInUserSettings }}>
                <DailyFoodContext.Provider value={{ dailyFood, setdailyFood }}>
                  <LoggedInIDContext.Provider value={{ loggedInID, setloggedInID }}><Router>
                    <Switch>
                      <Route exact path='/' component={UserSelect} />
                      <Route path='/setup' component={UserSetUp} />
                      <Route path='/tracker' component={Tracker} />
                      <Route path='/history' render={props => (<History />)} />
                      <Route path='/settings' component={SettingsForm} />
                      <Route path="/dashboard" render={props => (<Dashboard logOutUpdate={updateUsersDailyFood}/>)} />
                    </Switch>
                  </Router>
                  </LoggedInIDContext.Provider>
                </DailyFoodContext.Provider>
              </LoggedInUserSettingsContext.Provider>
            </CreatingNewUserContext.Provider>
          </IsLoggedContext.Provider>
      </UserAuthedContext.Provider>
      <button onClick={() => { console.log(isLogged); console.log(loggedInUserSettings); }}>conole log stats</button>
    </div >
  );
};
