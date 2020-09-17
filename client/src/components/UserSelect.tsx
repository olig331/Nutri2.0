import React, { useContext, useState, useEffect } from 'react';
import { LoggedInUserSettingsContext, UserAuthedContext, LoggedInIDContext, SignedOutContext, NavigatedFromLoginContext } from '../Context/Context';
import { Link, useHistory } from 'react-router-dom';
import { Console } from 'console';



export const UserSelect: React.FC = () => {

  // For navigation through the application
  const pageHistory = useHistory()

  //STATE
  const [enterUserName, setenterUserName] = useState<string>("");
  const [password, setpassword] = useState<string>("")
  const [loginattemptfailed, setloginattemptfailed] = useState<boolean>(false);
  const [forgotUserNamePopUp, setforgotUserNamePopUp] = useState<boolean>(false);
  const [forgotDeatilsEmail, setforgotDetailsEmail] = useState<string>("");
  const [responseFromMailReq, setresponseFromMailReq] = useState<string>("");
  const [forgotPasswordPopUp, setforgotPasswordPopUp] = useState<boolean>(false)
  const [passwordResetUserName, setpasswordResetUsername] = useState<string>("");

  // CONTEXT
  const { navigatedFromLogin, setnavigatedFromLogin } = useContext(NavigatedFromLoginContext)
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

  // Getting user Email for lost Account details
  const forgotProccess = (e: React.FormEvent<HTMLInputElement>) => {
    setforgotDetailsEmail(e.currentTarget.value);
    setresponseFromMailReq("")
  }

  const forgotProccessUserName = (e: React.FormEvent<HTMLInputElement>) => {
    setpasswordResetUsername(e.currentTarget.value);
    setresponseFromMailReq("")
  }

  const retreieveUserName = async () => {
    const response = await fetch('http://localhost:5000/forgotUserName', {
      method: "POST",
      body: JSON.stringify({
        email: forgotDeatilsEmail
      })
    })
    const data = await response.json()
    console.log(data)
    setresponseFromMailReq(data.message);
  };

  const passwordReset = async () => {
    const response = await fetch('http://localhost:5000/forgotPassword', {
      method: "POST",
      body: JSON.stringify({
        email: forgotDeatilsEmail,
        name: passwordResetUserName
      })
    });
    const data = await response.json();
    console.log(data);
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
      setnavigatedFromLogin(true)
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
          style={loginattemptfailed ? { outline: "1.5px solid", outlineColor: "red" } : { outlineColor: "none" }}
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
          style={loginattemptfailed ? { outline: "1.5px solid", outlineColor: "red" } : { outlineColor: "none" }}
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

      <button onClick={() => setforgotUserNamePopUp(true)}>Forgot Username</button>
      <button onClick={() => setforgotPasswordPopUp(true)}>Forgot password</button>

      {forgotUserNamePopUp
        ? <div>
          <button onClick={() => setforgotUserNamePopUp(false)}>X</button>
          <h4>Enter Email address to recieve email containing User Name</h4>
          <input type="text"
            onChange={forgotProccess}
          />
          <button
            onClick={retreieveUserName}>
            Send Mail
            </button>
          <h5>{responseFromMailReq}</h5>
        </div>
        : ""}

      {forgotPasswordPopUp
        ? <div>
          <button onClick={() => setforgotPasswordPopUp(false)}>X</button>
          <br />
          <label htmlFor="forgot_email">Email</label>
          <input
            name="enterEmail"
            type="text"
            onChange={forgotProccess}
          />
          <br />
          <label htmlFor="forgot_username"></label>
          <input type="text"
            onChange={forgotProccessUserName}
          />
          <button onClick={passwordReset}>Send Password Reset Email</button>
          <h5>{responseFromMailReq}</h5>
        </div>
        : ""}
    </>
  );
};
