import React, {useContext} from 'react';
import { LoggedInUserSettingsContext } from '../Context/Context';


export const UserInfo: React.FC = () => {

  const {loggedInUserSettings} = useContext(LoggedInUserSettingsContext);

  return (
    <>
      <h1 className="user_info_message">{loggedInUserSettings.userName} <img style={{width: "40px", height:"40px"}} src={loggedInUserSettings.userPicture} alt=""/></h1>
    </>
  )
}
