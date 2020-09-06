import React, { useContext, useState } from 'react';
import { SettingsForm } from './SettingsForm';
import { UsersSettingsContext, UsersContext, CreatingNewUserContext } from '../Context/Context';
import {Link} from 'react-router-dom';



export const UserSetUp: React.FC = () => {

  const [NameComplete, setNameComplete] = useState<boolean>(false);
  const [uniqueName, setuniqueName] = useState<boolean>(true);
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

  const validateUserName =  (e:any) =>{
    let usersState = [...users];
    let allUserNames:any[] = []
      usersState.map((x)=>{
       if(x.hasOwnProperty("userName")){
       allUserNames = [...allUserNames, x.userName];
     }
    })
    allUserNames.map((x)=>{
      if(e.target.value.toLowerCase() === x.toLowerCase()){
        console.log(x)
        console.log("username taken")
        setuniqueName(false)
      }else{
        setuserSettings({...userSettings,[ e.target.name]: e.target.value})
        setuniqueName(true);
      }
    });
    console.log(e.target.value)
  };


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
            onChange={validateUserName}
           />
           <span>{!uniqueName?"User name is taken":""}</span>
          <button disabled={!uniqueName} onClick={() => setNameComplete(true)}>Next {">>"}</button>
          <button onClick={()=> console.log(users)}>Users log</button>
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
