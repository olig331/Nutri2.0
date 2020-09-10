import React, { useContext, useEffect, useState, Component } from 'react';
import { IsLoggedContext, UsersContext, CreatingNewUserContext, LoggedInUserSettingsContext, UserAuthedContext, LoggedInIDContext } from '../Context/Context';
import { Link, Route, Redirect, Router, useHistory } from 'react-router-dom';
import { Dashboard } from './Dashboard';



export const UserSelect: React.FC = () => {

  const todaysDate = new Date().toLocaleDateString();

  const pageHistory = useHistory()

  //STATE VARIABLES
  const [enterUserName, setenterUserName] = useState<string>("");

  // CONTEXT
  const {loggedInID, setloggedInID} = useContext(LoggedInIDContext);
  const {userAuthed, setuserAuthed} = useContext(UserAuthedContext);
  const { setcreatingNewUser } = useContext(CreatingNewUserContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const { setisLogged } = useContext(IsLoggedContext);

  // SETTING STATE FROM LOG IN INPUT 
  const enteredUserName = (e: any) => {
    setenterUserName(e.target.value);
  }


  // CHECK IF USER EXISTS ON DB ? LOGIN : REJECT 
  const login = async () => {
    const response = await fetch(`http://localhost:5000/login?name=${enterUserName}`, {
      method: "GET",
    })
    const data = await response.json();
    console.log(data)
    if (data !== null) {
      console.log("user Found")
       setuserAuthed(true)
       setloggedInID(data._id);
       setLoggedInUserSettings(data)
       logFunc()
       pageHistory.replace("/dashboard")
    } 
  };

  function logFunc(){
    console.log(loggedInUserSettings);
    console.log(loggedInID);
  };


  return (
    <>
      <div>
          <input type="text" onChange={enteredUserName} />
          <button onClick={()=>{login();}}>Log In</button>
      </div>
      <button onClick={()=>console.log(pageHistory)}></button>
      <Link to="/setup">
        <button onClick={() => setcreatingNewUser(true)}>Create New User</button>
      </Link>
    </>
  );
};
