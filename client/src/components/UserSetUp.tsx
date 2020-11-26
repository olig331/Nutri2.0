import React, { useRef, useContext, useState, useEffect } from "react";
import { SettingsForm } from "./SettingsForm";
import { UsersSettingsContext } from "../Context/Context";
import { Link } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { GrLinkNext } from "react-icons/gr";
import { GiConsoleController } from "react-icons/gi";
import { TiTick } from "react-icons/ti";
import "../style/userSetUp.css";

export const UserSetUp: React.FC = () => {
  const importAll = (r: any) => {
    return r.keys().map(r);
  };
  
  //if you get TS context error --- npm install -D @types/webpack-env
  let images = importAll(
    require.context("../UserIcons", false, /\.(png|jpe?g|svg)$/)
  );

  //STATE
  const [nameComplete, setnameComplete] = useState<boolean>(false); // State for Rendering Settings page on compeltion of Username
  const [uniqueName, setuniqueName] = useState<boolean>(false); // State for when a entered Username in set up is valid(unique)
  const [showImgPopUp, setshowImgPopUp] = useState<boolean>(false);
  const [confirmPassword, setconfirmPassword] = useState<string>("");
  const [passwordsMatch, setpasswordsMatch] = useState<boolean>(false);
  const [validEmail, setvalidEmail] = useState<boolean | undefined>(undefined);

  //CONTEXT
  const { userSettings, setuserSettings } = useContext(UsersSettingsContext);
  
  // Completes this stage of the setup and moves onto the settings
  const next = () => {
    setnameComplete(true);
  };

  // Function access the databse and matches a username to the input Field if null is returned Validation failed
  const validateUserName = async () => {
    checkEmail();
    const name = userSettings.userName;
    console.log(name);
    const response = await fetch(
      `http://localhost:5000/validateUserName?name=${name}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.status === 200) {
      setuniqueName(true);
      next();
    } else {
      setuniqueName(false);
    }
  };

  // Setting username to be passed onto settings to complete setup
  const settingName = (e: React.FormEvent<HTMLInputElement>) => {
    setuserSettings({
      ...userSettings,
      [e.currentTarget.name]: e.currentTarget.value,
    });
    setuniqueName(true);
  };

  // Selecting The users icon and saving to state
  const selectAvatar = (src: string) => {
    let userSettingsCopy = { ...userSettings };
    userSettingsCopy.userPicture = src;
    setuserSettings(userSettingsCopy);
  };

  // Matches the two passwords together 
  const passwordMatcher = (e: React.FormEvent<HTMLInputElement>) => {
    if (userSettings.password !== e.currentTarget.value) {
      setpasswordsMatch(false);
    } else {
      setpasswordsMatch(true);
    }
    setconfirmPassword(e.currentTarget.value);
  };


  // Check for a valid Email Adress
  const checkEmail = (): void => {
    const regex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(userSettings.email)) {
      setvalidEmail(true);
    } else {
      setvalidEmail(false);
    }
  };


  
  const toggleShowImg = () => {
    showImgPopUp ? setshowImgPopUp(false) : setshowImgPopUp(true);
  };

  return (
    <>
      {nameComplete === false || passwordsMatch === false ? (
        <div className="setup_parent">
          <div className="setup_items">
            <img
              className="avatar_selector"
              onClick={toggleShowImg}
              src={
                userSettings.userPicture === ""
                  ? images[0]
                  : userSettings.userPicture
              }
              alt="User Avatar"
            />
            
            {/* User Icon Pop up window for selecting a Icon */}
            {showImgPopUp ? (
              <div className="avatar_popup_window">
                <span className="close_avatar" onClick={toggleShowImg}>
                  <AiFillCloseCircle />
                </span>
                {/* // <div ref={node}> */}
                <br />
                {images.map((src: string, index: number) => (
                  <img
                    key={index}
                    onClick={() => {
                      selectAvatar(src);
                      toggleShowImg();
                    }}
                    style={{ width: "75px", height: "75px" }}
                    src={src}
                  />
                ))}
              </div>
            ) : (
              ""
            )}
            <br />

            {/* Selecting Unique UserName */}
              <input
                style={
                  !uniqueName && userSettings.userName !== ""
                    ? { border: "1.5px solid red" }
                    : { outline: "none" }
                }
                placeholder="Enter username..."
                type="text"
                name="userName"
                onChange={settingName}
                required
              />
              {!uniqueName && userSettings.userName !== "" ? (
                <label style={{ color: "red" }} htmlFor="userName">
                  Username unavailable
                </label>
              ) : (
                ""
              )}
      

            {/* Enter Email */}
            <input
              style={
                !validEmail && userSettings.email !== ""
                  ? { border: "1.5px solid red" }
                  : validEmail && userSettings.email !== ""
                  ? { border: "1.5px solid green" }
                  : { outline: "none" }
              }
              placeholder="Enter email..."
              type="text"
              name="email"
              onChange={settingName}
              required
            />
            {!validEmail && userSettings.email !== "" ? (
              <label style={{ color: "red" }} htmlFor="email">
                Invalid Email
              </label>
            ) : validEmail && userSettings.email !== "" ? (
              <label style={{ color: "green" }}>
                <TiTick />
              </label>
            ) : (
              ""
            )}

            {/* Create Password */}
            <input
              style={
                !passwordsMatch && userSettings.password !== ""
                  ? { border: "1.5px solid red" }
                  : userSettings.password !== "" && passwordsMatch
                  ? { border: "1.5px solid green" }
                  : { outline: "none" }
              }
              placeholder="Create password..."
              type="password"
              name="password"
              onChange={settingName}
              required
            />
            {passwordsMatch && userSettings.password !== "" ? (
              <label style={{ color: "green" }} htmlFor="confirmPassword">
                <TiTick />
              </label>
            ) : (
              ""
            )}
            
            {/* Confirm Password */}
            <input
              style={
                !passwordsMatch && userSettings.password !== ""
                  ? { border: "1.5px solid red" }
                  : userSettings.password !== "" && passwordsMatch
                  ? { border: "1.5px solid green" }
                  : { outline: "none" }
              }
              placeholder="Confirm password..."
              name="confirmPassword"
              type="password"
              required
              onChange={passwordMatcher}
            />

            {passwordsMatch && userSettings.password !== "" ? (
              <label style={{ color: "green" }} htmlFor="confirmPassword">
                <TiTick />
              </label>
            ) : (
              ""
            )}

            <button onClick={validateUserName}>Continue</button>

            <Link style={{ textDecoration: "none" }} to="/">
              <button className="back_to_login_button">Back to Login</button>
            </Link>

          </div>
        </div>
      ) : (
        <SettingsForm />
      )}
    </>
  );
};
