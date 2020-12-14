import React,{useState} from 'react';
import {useParams} from 'react-router-dom';
import '../style/forgotPassword.css';

export const NewPassword:React.FC = () => {

  // Reset Token from router param
  const token:{token:string} = useParams();
  
  //State for password reset response message 
  const [passwordResetResponseMessage, setpasswordResetResponseMessage] = useState<string>("");
  const [newPassword, setnewPassword] = useState<string>("");

  const finalizePasswordReset = async ():Promise<void> =>{
    const response = await fetch("/newUserPassword", {
      method: "POST",
      body: JSON.stringify({
        password: newPassword,
        token: token.token
      })
    });
    const data = await response.json();
    setpasswordResetResponseMessage(data.message);
  };

  const settingNewPasswordState = (e: React.FormEvent<HTMLInputElement>):void =>{
    setnewPassword(e.currentTarget.value);
  }

  return (
    <div className="forgot_password_parent">
      <h2>Reset Password</h2>
      <input 
        type="text"
        placeholder="Enter new password"
        onChange={settingNewPasswordState}
      />
      <button onClick={finalizePasswordReset}>Submit new Password</button>
      <h5>{passwordResetResponseMessage}</h5>
    </div>
  )
}
