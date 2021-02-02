import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "../style/resetPassword.css";

export const NewPassword: React.FC = () => {
  // Reset Token from router param
  const token: { token: string } = useParams();

  const pageHistory = useHistory();

  //State for password reset response message
  const [
    passwordResetResponseMessage,
    setpasswordResetResponseMessage,
  ] = useState<string>("");
  const [newPassword, setnewPassword] = useState<string>("");
  const [confrimPassword, setconfirmPassword] = useState<string>("");
  const [passwordsMatch, setpasswordsMatch] = useState<boolean | undefined>();

  const finalizePasswordReset = async (): Promise<void> => {
    const response = await fetch(
      "https://nutriserverside.herokuapp.com/newUserPassword",
      {
        method: "POST",
        body: JSON.stringify({
          password: newPassword,
          token: token.token,
        }),
      }
    );
    const data = await response.json();
    setpasswordResetResponseMessage(data.message);
  };

  const checkPasswordsThenProcced = () => {
    if (passwordsMatch && newPassword !== "" && confrimPassword !== "") {
      finalizePasswordReset();
    } else {
      return;
    }
  };

  const passwordMatcher = (e: React.FormEvent<HTMLInputElement>):void => {
    if (newPassword !== e.currentTarget.value) {
      setpasswordsMatch(false);
    } else {
      setpasswordsMatch(true);
    }
    setconfirmPassword(e.currentTarget.value);
    return;
  };

  return (
    <div className="forgot_password_container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setnewPassword(e.currentTarget.value);
        }}
        style={
          !passwordsMatch && newPassword !== ""
            ? { border: "1.5px solid red" }
            : newPassword !== "" && passwordsMatch
            ? { border: "1.5px solid green" }
            : { outline: "none" }
        }
      />
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={passwordMatcher}
        style={
          !passwordsMatch && newPassword !== ""
            ? { border: "1.5px solid red" }
            : newPassword !== "" && passwordsMatch
            ? { border: "1.5px solid green" }
            : { outline: "none" }
        }
      />

      <button onClick={checkPasswordsThenProcced}>Submit new Password</button>

      <h3 
        style={passwordResetResponseMessage === "Your password has been updated" 
        ? {color: "green"} 
        : {color: "red"}}
        >{passwordResetResponseMessage}
      </h3>

      {passwordResetResponseMessage === "Your password has been updated" 
        ? (<button onClick={() => pageHistory.replace("/")}>
            Return To Login
           </button>
          ) 
        : null}
    </div>
  );
};
