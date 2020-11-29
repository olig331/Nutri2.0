import React, { useState } from "react";
import logo from "../imgs/NutriLogo.png";
import { FaWindowMinimize, FaRegWindowMaximize } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";

const ipcRenderer = window.require("electron").ipcRenderer;

export const CustomWindowToolBar: React.FC = () => {
  const [isMax, setisMax] = useState<boolean>(false);

  const minimizeHandler = () => {
    ipcRenderer.invoke("minimize-event");
  };

  const maximizeHandler = () => {
    ipcRenderer.invoke("maximize-event");
  };

  const unmaximizeHandler = () => {
    ipcRenderer.invoke("unmaximize-event");
  };

  const closeHandler = () => {
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
        <span>Nutri{" "}</span> <span className="divider">|</span> Personal Nutritonal Tracking App
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
