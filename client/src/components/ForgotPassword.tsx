import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Logo from '../imgs/NutriLogo.png';
import '../style/forgotPassword.css';

export const ForgotPassword: React.FC = () => {

  const [responseFromMailReq, setresponseFromMailReq] = useState<string>("");
  const [forgotDeatilsEmail, setforgotDetailsEmail] = useState<string>("");
  const [passwordResetUserName, setpasswordResetUsername] = useState<string>("");

  const forgotProccessUserName = (e: React.FormEvent<HTMLInputElement>) => {
    setpasswordResetUsername(e.currentTarget.value);
    setresponseFromMailReq("")
  }

  // Getting user Email for lost Account details
  const forgotProccess = (e: React.FormEvent<HTMLInputElement>) => {
    setforgotDetailsEmail(e.currentTarget.value);
    setresponseFromMailReq("")
  }

  const passwordReset = async () => {
    const response = await fetch('http://localhost:5000/forgotPassword', {
      method: "POST",
      body: JSON.stringify({
        email: forgotDeatilsEmail,
        name: passwordResetUserName
      })
    });
    const data = await response.json();
    setresponseFromMailReq(data.message)
  }

  return (
    <div className="forgot_password_parent">
      <div className="reset_password_items">
        <img src={Logo} alt="Nutri Logo" /> 
        <br />
        <input
          style={responseFromMailReq === "No user found with entered details"
            ? { border: "1.5px solid red" } : { outline: "none" }}
          placeholder="Enter account email"
          name="enterEmail"
          type="text"
          onChange={forgotProccess}
        />
    
        <label htmlFor="forgot_username"></label>
        <input
          style={responseFromMailReq === "No user found with entered details"
            ? { border: "1.5px solid red" } : { outline: "none" }}
          placeholder="Enter user name"
          type="text"
          onChange={forgotProccessUserName}
        />
     
        <button onClick={passwordReset}>Send Password Reset Email</button>
        <div className="forgot_password_message_area">
          <h5 style={responseFromMailReq === "No user found with entered details"
            ? { color: "red" } : { color: "green" }}>{responseFromMailReq}</h5>
        </div>
        <Link to='/'>
          <button className="back_to_login">Back To Login</button>
        </Link>
      </div>
    </div>
  )
}