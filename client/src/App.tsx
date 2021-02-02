import React, { useState, useEffect, Component } from 'react';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { UserSetUp } from './components/UserSetUp';
import { History } from './components/History';
import './style/style.css';
import { LoggedInUserSettingsContext, DailyFoodContext, UserAuthedContext, LoggedInIDContext, NavigatedFromTrackerContext, UsersSettingsContext, SignedOutContext, NavigatedFromLoginContext } from './Context/Context';
import { UserSelect } from './components/UserSelect';
import { SettingsForm } from './components/SettingsForm';
import { HashRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { NewPassword } from './components/NewPassword';
import { ForgotUserName } from './components/ForgotUserName';
import { ForgotPassword } from './components/ForgotPassword';
import './style/style.css'
import { CustomWindowToolBar } from './components/CustomWindowToolBar';
import { SignUpComplete } from './components/SignUpComplete';


export const App: React.FC = () => {

  // import images
  const importAll = (r: any) => {
    return r.keys().map(r);
  };

  //if you get TS context error --- npm install -D @types/webpack-env
  let images = importAll(
    require.context("./UserIcons", true, /\.(png|jpe?g|svg)$/)
  );


  const [navigatedFromLogin, setnavigatedFromLogin] = useState<boolean>(false);
  const [userAuthed, setuserAuthed] = useState<boolean>(false)
  const [signedOut, setsignedOut] = useState<boolean>(false);
  const [loggedInUserSettings, setLoggedInUserSettings] = useState<UsersDBType>();
  const [dailyFood, setdailyFood] = useState<any[]>([]);
  const [loggedInID, setloggedInID] = useState<string>("");
  const [navigatedFromTracker, setnavigatedFromTracker] = useState<boolean>(false)
  const [userSettings, setuserSettings] = useState<UsersType>({
    userName: "",
    userPicture: images[0].default,
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


  return (
    <div className="app">

      <NavigatedFromLoginContext.Provider value={{ navigatedFromLogin, setnavigatedFromLogin }}>
        <UsersSettingsContext.Provider value={{ userSettings, setuserSettings }}>
          <NavigatedFromTrackerContext.Provider value={{ navigatedFromTracker, setnavigatedFromTracker }}>
            <UserAuthedContext.Provider value={{ userAuthed, setuserAuthed }}>
              <LoggedInUserSettingsContext.Provider value={{ loggedInUserSettings, setLoggedInUserSettings }}>
                <DailyFoodContext.Provider value={{ dailyFood, setdailyFood }}>
                  <LoggedInIDContext.Provider value={{ loggedInID, setloggedInID }}>
                    <CustomWindowToolBar />
                    <SignedOutContext.Provider value={{ signedOut, setsignedOut }}>
                      <Router>
                        <Switch>
                          <Route exact path='/' component={UserSelect} />
                          <Route path="/forgotUserName" component={ForgotUserName} />
                          <Route path="/forgotPassword" component={ForgotPassword} />
                          <Route path='/setup' component={UserSetUp} />
                          <Route path='/tracker' component={Tracker} />
                          <Route path='/history' render={props => (<History />)} />
                          <Route path='/settings' component={SettingsForm} />
                          <Route path="/dashboard" component={Dashboard} />
                          <Route path="/signUpComplete" component={SignUpComplete}/>
                          <Route path="/:token" component={NewPassword} />
                        </Switch>
                      </Router>
                    </SignedOutContext.Provider>
                  </LoggedInIDContext.Provider>
                </DailyFoodContext.Provider>
              </LoggedInUserSettingsContext.Provider>
            </UserAuthedContext.Provider>
          </NavigatedFromTrackerContext.Provider>
        </UsersSettingsContext.Provider>
      </NavigatedFromLoginContext.Provider>
    </div >
  );
};
