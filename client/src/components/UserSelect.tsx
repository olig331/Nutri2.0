import React, { useContext, useState, useEffect } from 'react';
import { LoggedInUserSettingsContext, UserAuthedContext, LoggedInIDContext, SignedOutContext } from '../Context/Context';
import { Link, useHistory } from 'react-router-dom';



export const UserSelect: React.FC = () => {

  // For navigation through the application
  const pageHistory = useHistory()

  //STATE VARIABLES
  const [enterUserName, setenterUserName] = useState<string>("");

  // CONTEXT
  const { loggedInID, setloggedInID } = useContext(LoggedInIDContext);
  const { userAuthed, setuserAuthed } = useContext(UserAuthedContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const { signedOut, setsignedOut } = useContext(SignedOutContext)

  // SETTING STATE FROM LOG IN INPUT 
  const enteredUserName = (e: React.FormEvent<HTMLInputElement>) => {
    setenterUserName(e.currentTarget.value);
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
      pageHistory.replace("/dashboard") // will navigate to /dashboard page on succesfull user auth
    }
  };

  useEffect(()=>{
    signedOut? refreshApp(): console.log("no refresh needed")
  },[])

  const refreshApp = () =>{
    window.location.reload()
  }

  return (
    <>
      <div>
        <input type="text" onChange={enteredUserName} />
        <button onClick={() => { login(); }}>Log In</button>
      </div>
      <button onClick={() => console.log(pageHistory)}></button>
      <Link to="/setup">
        <button>Create New User</button>
      </Link>
    </>
  );
};
