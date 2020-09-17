import React, {useContext} from 'react';
import { LoggedInUserSettingsContext } from '../Context/Context';


export const UserInfo: React.FC = () => {

  const {loggedInUserSettings} = useContext(LoggedInUserSettingsContext);

  return (
    <>
      <h5>{loggedInUserSettings.userName} <img style={{width: "35px", height:"35px"}} src={loggedInUserSettings.userPicture} alt=""/></h5>
    </>
  )
}
