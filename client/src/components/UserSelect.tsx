import React, { useContext, useEffect } from 'react';
import { IsLoggedContext, UsersContext, CreatingNewUserContext, LoggedInUserSettingsContext } from '../Context/Context';
import { Link } from 'react-router-dom';



export const UserSelect: React.FC = () => {

  const localStorageArray = JSON.parse(localStorage.getItem("userArray")!)
  
  const {users, setusers} = useContext(UsersContext);
  const {setcreatingNewUser} = useContext(CreatingNewUserContext);
  const {loggedInUserSettings, setLoggedInUserSettings} = useContext(LoggedInUserSettingsContext)
  const {setisLogged} = useContext(IsLoggedContext);

  

  useEffect(()=>{
    setusers(JSON.parse(localStorage.getItem("userArray")!))
  },[])

  const settingSettings = (userDetails: UsersType) =>{
    setLoggedInUserSettings(userDetails)
  }


  return (
    <>
      {users.length > 0
        ? users.map((user: UsersType, index: number) => (
          <div key={index}>
            <div style={{ border: "1px solid black", borderRadius: "50%", width: "100px", height: "100px" }}></div>
            <h5>{user.userName}</h5>
            <Link to="/dashboard">
              <button onClick={()=> {settingSettings(user); setisLogged(true)}}>Log In</button>
            </Link>
          </div>

        )) : ""}
      <Link to="/setup">
        <button onClick={()=>setcreatingNewUser(true)}>Create New User</button>
      </Link>
    <button onClick={()=> {console.log(users); console.log(loggedInUserSettings)}}>button in user select for settings</button>
    </>
  );
};
