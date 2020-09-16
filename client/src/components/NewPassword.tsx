import React,{useState} from 'react';
import {useParams} from 'react-router-dom';

export const NewPassword:React.FC = () => {

  // Reset Token from router param
  const token:{token:string} = useParams()
  console.log(token.token)
  
  //State for password reset response message 
  const [passwordResetResponseMessage, setpasswordResetResponseMessage] = useState<string>("");
  const [newPassword, setnewPassword] = useState<string>("");

  const finalizePasswordReset = async () =>{
    const response = await fetch("/newUserPassword", {
      method: "POST",
      body: JSON.stringify({
        password: newPassword,
        token: token.token
      })
    })
    const data = await response.json()
    setpasswordResetResponseMessage(data.message);
  }

  const settingNewPasswordState = (e: React.FormEvent<HTMLInputElement>) =>{
    setnewPassword(e.currentTarget.value);
  }

  return (
    <div>
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
