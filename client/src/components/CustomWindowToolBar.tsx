import React, { useState, useContext } from "react";
import logo from "../imgs/NutriLogo.png";
import { FaWindowMinimize, FaRegWindowMaximize } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { DailyFoodContext, LoggedInIDContext } from "../Context/Context";
import { useHistory } from "react-router-dom";

const ipcRenderer = window.require("electron").ipcRenderer;

export const CustomWindowToolBar: React.FC = () => {

  const [isOnline, setisOnline] = useState<boolean>(true);

  const updateOnlineStatus = () => {
    ipcRenderer.send(
      "online-status-changed",
      navigator.onLine ? "online" : "offline"
    );
  };

  window.addEventListener("online", () => {
    updateOnlineStatus();
    setisOnline(true);
  });
  window.addEventListener("offline", () => {
    updateOnlineStatus();
    setisOnline(false);
  });

  setTimeout(updateOnlineStatus, 20000);

  const pageHistory = useHistory();
  console.log(pageHistory);
  //State
  const [isMax, setisMax] = useState<boolean>(false);

  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInID } = useContext(LoggedInIDContext);

  const updateUsersDailyFood = async (): Promise<void> => {
    if (dailyFood.length > 1) {
      console.log("updateUserDailyFoodFunc");
      await fetch(
        `https://nutriserverside.herokuapp.com/updateUsersFood?userId=${loggedInID}`,
        {
          method: "POST",
          body: JSON.stringify(dailyFood),
        }
      );
      setdailyFood([]);
      console.log("updated");
      return;
    } else {
      return;
    }
  };

  // Handlers interacting with the ipcMain API from electron.js in /public to trigger events
  // (FYI) dragging the window is a CSS prop called  -webkit-app-region: drag; found in style.scss line 70~
  const minimizeHandler = () => {
    ipcRenderer.invoke("minimize-event");
  };

  const maximizeHandler = () => {
    ipcRenderer.invoke("maximize-event");
  };

  const unmaximizeHandler = () => {
    ipcRenderer.invoke("unmaximize-event");
  };

  const closeHandler = async () => {
    await updateUsersDailyFood();
    ipcRenderer.invoke("close-event");
  };

  const toggleMaximise = () => {
    if (isMax) {
      unmaximizeHandler();
      setisMax(false);
    } else {
      maximizeHandler();
      setisMax(true);
    }
  };

  return (
    <div className="custom_toolbar">
      <div className="title">
        <img src={logo} alt="Logo Icon" />
        <span>Nutri </span> <span className="divider">|</span> Personal
        Nutritonal Tracking App
        <h5 className="online_status">
          <div
            className="online_indicator"
            style={
              isOnline
                ? { backgroundColor: "rgb(8, 235, 8)" }
                : { backgroundColor: "red" }
            }
          ></div>
          {isOnline ? "Online" : "Offline"}
        </h5>
      </div>

      <div className="title_buttons">
        <div onClick={minimizeHandler} className="min action_button">
          <FaWindowMinimize />
        </div>
        <div onClick={toggleMaximise} className="max action_button">
          <FaRegWindowMaximize />
        </div>
        <div onClick={closeHandler} className="close action_button">
          <AiFillCloseCircle />
        </div>
      </div>
    </div>
  );
};
