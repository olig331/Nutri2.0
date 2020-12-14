import React, { useContext } from "react";
import { LoggedInUserSettingsContext } from "../Context/Context";

export const UserInfo: React.FC = () => {
  
  //Context
  const { loggedInUserSettings } = useContext(LoggedInUserSettingsContext);

  return (
    <div>
      <h1 className="user_info_message">{loggedInUserSettings.userName}</h1>
      <img
        style={{ width: "40px", height: "40px" }}
        src={loggedInUserSettings.userPicture}
        alt="Users Icon"
      />
    </div>
  );
};
