import React, { useContext, useState } from 'react';
import { SettingsForm } from './SettingsForm';
import { UsersSettingsContext, UsersContext, CreatingNewUserContext } from '../Context/Context';
import {Link} from 'react-router-dom';
import { rejects } from 'assert';
import { runInNewContext } from 'vm';
import { nextTick } from 'process';



export const UserSetUp: React.FC = () => {

  //STATE
  const [nameComplete, setnameComplete] = useState<boolean>(false);
  const [uniqueName, setuniqueName] = useState<boolean>(true);
  const [userSettings, setuserSettings] = useState<UsersType>({
    userName: "",
    userPicture: "",
    usersPersonalSettings: {
      gender: "",
      age: 0,
      weight: 0,
      weightUnit: "",
      height: 0,
      heightUnit: "",
      goal: "",
      activityLevel: ""
    },
    usersDailyFood: [],
    usersHistory: []
  });

  const next = () =>{
    setnameComplete(true);
  }

  const validateUserName = async () =>{
    const response = await fetch(`/login?name=${userSettings.userName}`, {
      method: "get",
      mode: "no-cors",
    })
    const data = await response.json();
    if(data === null ){
      setuniqueName(true)
      next();
    }else{
      setuniqueName(false)
    }
  }

  const settingName = (e:React.FormEvent<HTMLInputElement>) =>{
    setuserSettings({...userSettings,[ e.currentTarget.name]: e.currentTarget.value});
    setuniqueName(true)
  }


  return (
    <>
      {!nameComplete 
      ?
        (<div>
          <div style={{ border: "1px solid black", borderRadius: "50%", width: "100px", height: "100px" }}>PIC</div>
          <input type="text"
            name="userName"
            onChange={settingName}
           />
           <span>{!uniqueName?"User name is taken":""}</span>
          <button disabled={!uniqueName} onClick={validateUserName}>Next {">>"}</button>
         </div>
        )
      :
        <UsersSettingsContext.Provider value={{userSettings, setuserSettings}}>
         <SettingsForm />
        </UsersSettingsContext.Provider>
      }
    </>
  );
};
