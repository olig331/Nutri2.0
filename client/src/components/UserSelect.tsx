import React, { useContext, useState, useEffect } from 'react';
import { LoggedInUserSettingsContext, UserAuthedContext, LoggedInIDContext, SignedOutContext } from '../Context/Context';
import { Link, useHistory } from 'react-router-dom';



export const UserSelect: React.FC = () => {

  // For navigation through the application
  const pageHistory = useHistory()

  //STATE VARIABLES
  const [enterUserName, setenterUserName] = useState<string>("");
  const [password, setpassword] = useState<string>("")
  const [loginattemptfailed, setloginattemptfailed] = useState<boolean>(false);

  // CONTEXT
  const { loggedInID, setloggedInID } = useContext(LoggedInIDContext);
  const { userAuthed, setuserAuthed } = useContext(UserAuthedContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const { signedOut, setsignedOut } = useContext(SignedOutContext)

  // SETTING STATE FROM LOG IN INPUT 
  const enteredUserName = (e: React.FormEvent<HTMLInputElement>) => {
    setenterUserName(e.currentTarget.value);
    setloginattemptfailed(false);
  }
  const enteredPassword = (e: React.FormEvent<HTMLInputElement>) => {
    setpassword(e.currentTarget.value);
    setloginattemptfailed(false);
  }


  // CHECK IF USER EXISTS ON DB ? LOGIN : REJECT 
  const login = async () => {
    const response = await fetch(`http://localhost:5000/login`, {
      method: "POST",
      body: JSON.stringify({ userName: enterUserName, passWord: password })
    })
    let data = await response.json();
    console.log(data)
    delete data.password;
    if (data !== "401") {
      console.log("user Found")
      setuserAuthed(true)
      setloggedInID(data._id);
      setLoggedInUserSettings(data)
      pageHistory.replace("/dashboard") // will navigate to /dashboard page on succesfull user auth
    } else {
      setloginattemptfailed(true)
    }
  };

  useEffect(() => {
    signedOut ? refreshApp() : console.log("no refresh needed")
  }, [])

  const refreshApp = () => {
    window.location.reload()
  }

  return (
    <>
      <div>
        <label 
          htmlFor="userName">
          User Name
        </label>
        <input 
        style={loginattemptfailed ? { outline: "1.5px solid", outlineColor:"red"} : {outlineColor:"none"}}
          type="text" 
          name="userName" 
          onChange={enteredUserName}
        />
          <br />
        <label 
          htmlFor="password">
          password
        </label>
        <input 
          style={loginattemptfailed ? {outline: "1.5px solid", outlineColor:"red"} : {outlineColor:"none"}}
          type="password" 
          name="password" 
          onChange={enteredPassword} 
        />
          <br />
        <button 
          onClick={() => { login(); console.log(password) }}>
          Log In
        </button>

        {loginattemptfailed 
          ? <h5>User name or password is incorrect</h5>
          : ""
        }
      </div>
      <Link to="/setup">
        <button>Create New User</button>
      </Link>
    </>
  );
};
