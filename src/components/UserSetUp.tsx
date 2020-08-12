import React, { useState } from 'react';
import { SettingsForm } from './SettingsForm';



export const UserSetUp: React.FC = () => {

  const [userSetComplete, setuserSetComplete] = useState<boolean>(false);
  const [userName, setuserName] = useState<UserInfo>({
    name:"",
    gender:"",
    age:0,
    height:0,
    heightUnit:"",
    weight:0,
    weightUnit:"",
    goal:"",
    activityLevel:""
  });

  const handleSubmit = () =>{
    setuserSetComplete(true);
  }

  const getUserName =(event:any) =>{
    setuserName({...userName, name: event.target.value});
  }

  return (
    <div>
      {!userSetComplete
        ? (<div>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "2px solid black" }}>
              PICTURE
            </div>
            <form action="submit" onSubmit={handleSubmit} id="userForm">
            <label htmlFor="username">
              Username:
              <input type="text" placeholder="Enter Username..." onChange={getUserName} id="username" name="username" required />
            </label>
              <button  type="submit" form="userForm" value="Submit">{">>"}</button>
            </form>
          </div>)
        : <SettingsForm 

          />}
    </div>
  );
};
