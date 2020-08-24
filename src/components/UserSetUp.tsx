import React, { useContext, useState } from 'react';
import { SettingsForm } from './SettingsForm';
import { UsersSettingsContext, UsersContext, CreatingNewUserContext } from '../Context/Context';
import {Link} from 'react-router-dom';



export const UserSetUp: React.FC = () => {

  const [NameComplete, setNameComplete] = useState<boolean>(false);
  const {users} = useContext(UsersContext);
  const {setcreatingNewUser} = useContext(CreatingNewUserContext)

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
  })

  return (
    <>
      {!NameComplete 
      ?
        (<div>
          {users.length > 0 || users !== null
            ? <Link to="/select-user"><button onClick={()=>setcreatingNewUser(false)}>Back to User Select</button></Link>
            : null
          }
          <div style={{ border: "1px solid black", borderRadius: "50%", width: "100px", height: "100px" }}>PIC</div>
          <input type="text"
            name="userName"
            onChange={(e) => setuserSettings({...userSettings, [e.target.name]: e.target.value})}
           />
          <button onClick={() => setNameComplete(true)}>Next {">>"}</button>
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
