import React, { useContext, useState, useEffect } from 'react';
import { LoggedInUserSettingsContext, UserAuthedContext, LoggedInIDContext, SignedOutContext, NavigatedFromLoginContext } from '../Context/Context';
import { Link, useHistory } from 'react-router-dom';
import Logo from '../imgs/NutriLogo.png'
import { RiUserAddLine } from 'react-icons/ri';
import '../style/userSelect.css';


export const UserSelect: React.FC = () => {

  // For navigation through the application
  const pageHistory = useHistory()

  //STATE
  const [enterUserName, setenterUserName] = useState<string>("");
  const [password, setpassword] = useState<string>("")
  const [loginattemptfailed, setloginattemptfailed] = useState<boolean>(false);
  const [forgotPasswordPopUp, setforgotPasswordPopUp] = useState<boolean>(false)

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

  // SETTING STATE FOR ENTERED PASSWORD
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
      setnavigatedFromLogin(true)
      pageHistory.replace("/dashboard") // will navigate to /dashboard page on succesfull user auth
    } else {
      setloginattemptfailed(true)
    }
  };
 


  // if user signed out calling refresh to set all app state back to default
  useEffect(() => {
    signedOut ? refreshApp() : console.log("no refresh needed")
  }, [])



  const refreshApp = () => {
    window.location.reload()
  }


  return (
    <div className="user_select_parent">

      <div className="login_inputs">
        <img src={Logo} alt="Logo Img" />

        {/* Break quick fix for input bars staying aligned  */}
        <br/>
        
        <input
          style={loginattemptfailed ? { border: "1px solid red" } : { outlineColor: "none" }}
          type="text"
          name="userName"
          placeholder="Username"
          onChange={enteredUserName}
        />


        <input
          style={loginattemptfailed ? { border: "1px solid red" } : { outlineColor: "none" }}
          type="password"
          name="password"
          placeholder="Password"
          onChange={enteredPassword}
        />

     

        <button 
          className="login_button"
          onClick={() => {
            login(); 
            console.log(password) 
          }}>
          Log In
        </button>



        <div className= "forgot_buttons">
          <Link to="forgotUserName">
            <button 
              className="forgot_button">
              Forgot Username
            </button>
          </Link>
  
          <Link to="/forgotPassword">
            <button 
              className="forgot_button" >
              Forgot password
            </button>
          </Link>
        </div>

        <Link to="/setup" 
          style={{ textDecoration: 'none' }}>
          <div 
            className="create_user">
            <span>
              <RiUserAddLine />
            </span>
            <h5>Sign Up</h5>
          </div>
        </Link>

      </div>
    </div>
  );
};
