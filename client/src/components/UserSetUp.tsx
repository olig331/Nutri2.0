import React, {useRef, useContext, useState, useEffect } from 'react';
import { SettingsForm } from './SettingsForm';
import { UsersSettingsContext } from '../Context/Context';
import {Link} from 'react-router-dom';
import {AiFillCloseCircle} from 'react-icons/ai'
import { GrLinkNext } from "react-icons/gr";

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
  const [confirmPassword, setconfirmPassword] = useState<string>("");
  const [passwordsMatch, setpasswordsMatch] = useState<boolean>(true);

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

  const passwordMatcher = (e: React.FormEvent<HTMLInputElement>) =>{
    if(userSettings.password !== e.currentTarget.value){
      setpasswordsMatch(false)
    }else{
      setpasswordsMatch(true)
    }
    setconfirmPassword(e.currentTarget.value);
  }

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

  console.log(nameComplete)
  console.log(passwordsMatch)

  return (
    <>
      {nameComplete === false || passwordsMatch === false
        ?
        (<div className="setup_parent">
          <div className="setup_items">
          <img className="avatar_selector" onClick={toggleShowImg} src={userSettings.userPicture === "" ? images[0] : userSettings.userPicture } alt="User Avatar" />
          <br/>
          <br/>
          {showImgPopUp
            ?
            <div className="avatar_popup_window">
              <span className="close_avatar" onClick={toggleShowImg}><AiFillCloseCircle/></span>
              {/* // <div ref={node}> */}
              {images.map((src: string, index: number) => (
                <img key={index} onClick={() => {selectAvatar(src); toggleShowImg()}} style={{ width: "75px", height: "75px" }} src={src} />
              ))}
            </div>
            : ""
          } <br/>
         
          <input 
            style={!uniqueName ?{border:"1.5px solid red"}: {outline:"none"}}
            placeholder="Enter username..."
            type="text"
            name="userName"
            onChange={settingName}
            required
          /> 
          {!uniqueName ? <label htmlFor="userName">Username taken</label> : ""}
          <br/>
         
          <input
            placeholder="Enter email..." 
            type="text"
            name="email"
            onChange={settingName}
            required
          /> 
          <br/>
          
          <input 
            style={!passwordsMatch ?{border:"1.5px solid red"}:{outline:"none"}}
            placeholder="Create password..."
            type="password"
            name="password"
            onChange={settingName}
            required
          />
          {!passwordsMatch ? <label style={{color:"red"}} htmlFor="confirmPassword">X</label> : ""}
          <br/>
        
          <input 
            style={!passwordsMatch ?{border:"1.5px solid red"}:{outline:"none"}}
            placeholder="Confirm password..."
            name="confirmPassword" 
            type="password"
            required 
            onChange={passwordMatcher}
          />
          {!passwordsMatch ? <label style={{color:"red"}} htmlFor="confirmPassword">X</label> : ""}

          <br/>

          <span>{!uniqueName ? "User name is taken" : ""}</span>
          <button onClick={validateUserName}>Continue</button>
          <br/>
          <Link style={{textDecoration:"none"}} to="/">
            <button className="back_to_login_button">Back to Login</button>
          </Link>
          </div>
        </div>
        )
        :
        <SettingsForm />
      }
    </>
  );
};
