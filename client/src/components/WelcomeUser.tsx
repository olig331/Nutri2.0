import React,{useContext} from 'react';
import {LoggedInUserSettingsContext} from '../Context/Context';

export const WelcomeUser:React.FC = () => {

  //CONTEXT
  const {loggedInUserSettings} = useContext(LoggedInUserSettingsContext);


  return (
    <div>
      <img style={{width:"200px", height:"200px"}} src={loggedInUserSettings.userPicture} alt=""/>
      <h1>Welcome {loggedInUserSettings.userName}</h1>
      <div style={{width:"500px", height:"50px"}}></div>
    </div>
  )
}
