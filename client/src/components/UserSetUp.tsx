import React, {useRef, useContext, useState, useEffect } from 'react';
import { SettingsForm } from './SettingsForm';
import { UsersSettingsContext } from '../Context/Context';
import PropTypes from 'prop-types';

export const UserSetUp: React.FC = () => {

  const importAll = (r: any) => {
    return r.keys().map(r);
  }
  //if you get TS context error --- npm install -D @types/webpack-env 
  let images = importAll(
    require.context('../UserIcons', false, /\.(png|jpe?g|svg)$/));

  //STATE
  const [nameComplete, setnameComplete] = useState<boolean>(false); // State for Rendering Settings page on compeltion of Username 
  const [uniqueName, setuniqueName] = useState<boolean>(true); // State for when a entered Username in set up is valid(unique) 
  const [showImgPopUp, setshowImgPopUp] = useState<boolean>(false);

  //CONTEXT
  const { userSettings, setuserSettings } = useContext(UsersSettingsContext)

  const next = () => {
    setnameComplete(true);
  }

  // Function access the databse and matches a username to the input Field if null is returned Validation failed
  const validateUserName = async () => {
    const response = await fetch(`/validateUserName?name=${userSettings.userName}`, {
      method: "get",
      mode: "no-cors",
    })
    const data = await response.json();
    console.log(data)
    if (data === null) {
      setuniqueName(true)
      next();
    } else {
      setuniqueName(false)
    }
  }

  // Setting username to be passed onto settings to complete setup 
  const settingName = (e: React.FormEvent<HTMLInputElement>) => {
    setuserSettings({ ...userSettings, [e.currentTarget.name]: e.currentTarget.value });
    setuniqueName(true)
  };

  const selectAvatar = (src: string) => {
    let userSettingsCopy = { ...userSettings }
    userSettingsCopy.userPicture = src
    setuserSettings(userSettingsCopy);
  };

  // const handleClick = (e: MouseEvent) =>{
  //   if(node.current.contains(e.target as Node)){
  //     setshowImgPopUp(false);  
  //   }
  //   console.log("clicking inside image container")
  // }

  // useEffect(()=>{
  //   document.addEventListener("mousedown", handleClick);

  //   return () =>{
  //     document.removeEventListener("mousedown", handleClick);
  //   };
  // },[]);

  // const node = useRef() as React.MutableRefObject<HTMLInputElement>;

  const toggleShowImg = () =>{
    showImgPopUp ? setshowImgPopUp(false) : setshowImgPopUp(true);
  }

  return (
    <>
      {!nameComplete
        ?
        (<div >
          <img style={{ width: "75px", height: "75px" }} src={userSettings.userPicture === "" ? images[0] : userSettings.userPicture } alt="User Avatar" />
          <button onClick={toggleShowImg}>{showImgPopUp?"Close":"Choose Avatar"}</button>
          {showImgPopUp
            ?
            <div>
              {/* // <div ref={node}> */}
              {images.map((src: string, index: number) => (
                <img key={index} onClick={() => selectAvatar(src)} style={{ width: "75px", height: "75px" }} src={src} />
              ))}
            </div>
            : ""
          }
          <input type="text"
            name="userName"
            onChange={settingName}
          />
          <input type="password"
            name="password"
            onChange={settingName}
          />
          <span>{!uniqueName ? "User name is taken" : ""}</span>
          <button disabled={!uniqueName} onClick={validateUserName}>Next {">>"}</button>
          <button onClick={()=>console.log(userSettings)}>check password in settings</button>
        </div>
        )
        :
        <SettingsForm />
      }
    </>
  );
};
