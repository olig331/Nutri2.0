import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../imgs/NutriLogo.png";
import "../style/forgotUserName.css";

export const ForgotUserName: React.FC = () => {
  // STATE
  const [forgotDeatilsEmail, setforgotDetailsEmail] = useState<string>("");
  const [responseFromMailReq, setresponseFromMailReq] = useState<string>("");

  // Getting user Email for lost Account details
  const forgotProccess = (e: React.FormEvent<HTMLInputElement>) => {
    setforgotDetailsEmail(e.currentTarget.value);
    setresponseFromMailReq("");
  };

  // Sends email to user upon completion of forgot username form
  const retreieveUserName = async ():Promise<void> => {
    const response = await fetch("https://nutriserverside.herokuapp.com/forgotUserName", {
      method: "POST",
      body: JSON.stringify({
        email: forgotDeatilsEmail,
      }),
    });
    const data = await response.json();
    //console.log(data);
    setresponseFromMailReq(data.message);
  };

  return (
    <div className="forgot_username_parent">
      <div className="items">
        <img src={Logo} alt="Nutri Logo" />
        <br />
        <input
          style={
            responseFromMailReq === "No User found with entered Email"
              ? { border: "1.5px solid red" }
              : { outline: "None" }
          }
          type="text"
          onChange={forgotProccess}
          placeholder="Enter account Email"
        />

        <button onClick={retreieveUserName}>Send Mail</button>

        <div className="forgot_username_message_area">
          <h5
            style={
              responseFromMailReq === "No User found with entered Email"
                ? { color: "red" }
                : { color: "green" }
            }
            className="response_message"
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
