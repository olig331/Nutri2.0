import React, { useContext, useState } from 'react';
import { SettingsForm } from './SettingsForm';
import { UsersSettingsContext } from '../Context/Context';

export const UserSetUp: React.FC = () => {

  const importAll = (r:any) => {
    return r.keys().map(r);
  }
  //if ts contex error --- npm i -D @types/webpack-env 
  const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/)); 

  //STATE
  const [nameComplete, setnameComplete] = useState<boolean>(false); // State for Rendering Settings page on compeltion of Username 
  const [uniqueName, setuniqueName] = useState<boolean>(true); // State for when a entered Username in set up is valid(unique) 

  //CONTEXT
  const { userSettings, setuserSettings } = useContext(UsersSettingsContext)

  
  const next = () => {
    setnameComplete(true);
  }

  // Function access the databse and matches a username to the input Field if null is returned Validation failed
  const validateUserName = async () => {
    const response = await fetch(`/login?name=${userSettings.userName}`, {
      method: "get",
      mode: "no-cors",
    })
    const data = await response.json();
    if (data === null) {
      setuniqueName(true)
      next();
    } else {
      setuniqueName(false)
    }
  }

  // Setting username to be passed onto settings to complete setup 
  const settingName = (e: React.FormEvent<HTMLInputElement>) => {
    setuserSettings({ ...userSettings, [e.currentTarget.name]: e.currentTarget.value });
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
          <span>{!uniqueName ? "User name is taken" : ""}</span>
          <button disabled={!uniqueName} onClick={validateUserName}>Next {">>"}</button>
        </div>
        )
        :
        <SettingsForm />
      }
    </>
  );
};
