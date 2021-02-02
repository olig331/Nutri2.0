import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../imgs/NutriLogo.png";
import "../style/forgotPassword.css";

export const ForgotPassword: React.FC = () => {


  // const fetchApi = () => {
  //   fetch("https://api.ipdata.co")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((res) => {
  //       console.log(res.ip);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const fetchIp = async ():Promise<void> =>{
  //   const response = await fetch("https://api.ipdata.co")
  //   const data = await response.json();
  //   console.log(data)
  // }



  const [responseFromMailReq, setresponseFromMailReq] = useState<string>("");
  const [forgotDeatilsEmail, setforgotDetailsEmail] = useState<string>("");
  const [passwordResetUserName, setpasswordResetUsername] = useState<string>(
    ""
  );

  const forgotProccessUserName = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    setpasswordResetUsername(e.currentTarget.value);
    setresponseFromMailReq("");
  };

  // Getting user Email for lost Account details
  const forgotProccess = (e: React.FormEvent<HTMLInputElement>): void => {
    setforgotDetailsEmail(e.currentTarget.value);
    setresponseFromMailReq("");
  };

  const getIp = async () => {
    const ipRes = await fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=13109748f2a64efc9ff327573580b6da")
    const ipData = await ipRes.json();
    return ipData.ip_address
  }
  


  const passwordReset = async (): Promise<void> => {

    const ipAdress = await getIp();

    console.log(ipAdress)
    const response = await fetch(
      "https://nutriserverside.herokuapp.com/forgotPassword",
      {
        method: "POST",
        body: JSON.stringify({
          email: forgotDeatilsEmail,
          name: passwordResetUserName,
          ip: ipAdress
        }),
      }
    );
    const data = await response.json();
    console.log(data)
    setresponseFromMailReq(data.message);
  };

  return (
    <div className="forgot_password_parent">
      <div className="reset_password_items">
        <img src={Logo} alt="Nutri Logo" />
        <br />
        <input
          style={
            responseFromMailReq === "No user found with entered details"
              ? { border: "1.5px solid red" }
              : { outline: "none" }
          }
          placeholder="Enter account email"
          name="enterEmail"
          type="text"
          onChange={forgotProccess}
        />

        <label htmlFor="forgot_username"></label>
        <input
          style={
            responseFromMailReq === "No user found with entered details"
              ? { border: "1.5px solid red" }
              : { outline: "none" }
          }
          placeholder="Enter user name"
          type="text"
          onChange={forgotProccessUserName}
        />

        <button onClick={passwordReset}>Send Password Reset Email</button>
        <div className="forgot_password_message_area">
          <h5
            style={
              responseFromMailReq !== "Password Reset email Sent please check your inbox" 
                ? { color: "red" }
                : { color: "green" }
            }
          >
            {responseFromMailReq}
          </h5>
        </div>
        <Link to="/">
          <button className="back_to_login">Back To Login</button>
        </Link>
      </div>
    </div>
  );
};
