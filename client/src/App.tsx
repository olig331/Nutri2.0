import React, { useState, useEffect, Component } from 'react';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { UserSetUp } from './components/UserSetUp';
import { History } from './components/History';
import './style/style.css';
import { UsersContext,  LoggedInUserSettingsContext, DailyFoodContext, UserAuthedContext, LoggedInIDContext, NavigatedFromTrackerContext, UsersSettingsContext, SignedOutContext } from './Context/Context';
import { UserSelect } from './components/UserSelect';
import { SettingsForm } from './components/SettingsForm';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Stats } from './components/Stats';

export const App: React.FC = () => {

  const [userAuthed, setuserAuthed] = useState<boolean>(false)
  const [signedOut, setsignedOut] = useState<boolean>(false);
  const [loggedInUserSettings, setLoggedInUserSettings] = useState<UsersDBType>();
  const [dailyFood, setdailyFood] = useState<any[]>([]);
  const [loggedInID, setloggedInID] = useState<string>("");
  const [navigatedFromTracker, setnavigatedFromTracker] = useState<boolean>(false)
  const [userSettings, setuserSettings] = useState<UsersType>({
    userName: "",
    userPicture: "/static/media/bear.3a7022d5.png",
    password: "",
    email: "",
    usersPersonalSettings: {
      gender: "",
      age: 0,
      weight: 0,
      weightUnit: "",
      height: 0,
      heightUnit: "",
      goal: "",
      activityLevel: ""
    },
    usersDailyFood: [],
    usersHistory: []
  });

  function stats(){
    console.log(userAuthed)
    console.log(loggedInUserSettings)
    console.log(dailyFood)
    console.log(loggedInID)
    console.log(navigatedFromTracker)
    console.log(userSettings)
  }

  //Icons made by <a href="https://www.flaticon.com/authors/dighital" title="Dighital">Dighital</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

  return (
    <div>
      
      <UsersSettingsContext.Provider value={{ userSettings, setuserSettings }}>
        <NavigatedFromTrackerContext.Provider value={{ navigatedFromTracker, setnavigatedFromTracker }}>
          <UserAuthedContext.Provider value={{ userAuthed, setuserAuthed }}>
              <LoggedInUserSettingsContext.Provider value={{ loggedInUserSettings, setLoggedInUserSettings }}>
                <DailyFoodContext.Provider value={{ dailyFood, setdailyFood }}>
                  <LoggedInIDContext.Provider value={{ loggedInID, setloggedInID }}>
                  <SignedOutContext.Provider value={{signedOut, setsignedOut}}>
                    <Router>
                      <Switch>
                        <Route exact path='/' component={UserSelect} />
                        <Route path='/setup' component={UserSetUp} />
                        <Route path='/tracker' component={Tracker} />
                        <Route path='/history' render={props => (<History />)} />
                        <Route path='/settings' component={SettingsForm} />
                        <Route path="/dashboard" render={props => (<Dashboard />)} />
                      </Switch>
                    </Router>
                    </SignedOutContext.Provider>
                  </LoggedInIDContext.Provider>
                </DailyFoodContext.Provider>
              </LoggedInUserSettingsContext.Provider>
          </UserAuthedContext.Provider>
        </NavigatedFromTrackerContext.Provider>
      </UsersSettingsContext.Provider>
    </div >
  );
};
