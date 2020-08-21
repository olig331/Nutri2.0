import React, { useContext, useState, useEffect } from 'react';
import { UsersSettingsContext, IsLoggedContext, UsersContext } from '../Context/Context';
import { Link } from 'react-router-dom';


export const SettingsForm: React.FC = () => {

  const ageArray: number[] = Array.from(Array(100), (_, i) => i + 1)

  const { isLogged, setisLogged } = useContext(IsLoggedContext);
  const { userSettings, setuserSettings } = useContext(UsersSettingsContext);
  const { users, setusers } = useContext(UsersContext);
  const [setUpComplete, setsetUpComplete] = useState<boolean>(false);

  const handleSettingsOnChange = (e: any) => {
    var nestedCopy = { ...userSettings.usersPersonalSettings }
    var fullCopy = { ...userSettings };
    nestedCopy[e.target.name] = e.target.value
    fullCopy.usersPersonalSettings = nestedCopy;
    setuserSettings(fullCopy);  
  };

  const userSetUpComplete = () => {
    setsetUpComplete(true);
    setusers([...users, userSettings])
  };

  useEffect(() => {
    if (setUpComplete) {
      localStorage.setItem("userArray", JSON.stringify(users));
    }
  }, [setUpComplete])


  const saveUserSettings = (): void => {
    console.log("hello")
  }


  return (
    <>
      {isLogged?<Link to="/dashboard"><button>Dashboard</button></Link>:null}
      <div>
        <h5>SETTINGS TAB </h5>
        {/* GENDER SECTION */}
        <label>
          Gender:
          Male:
        <input
            name="gender"
            value="male"
            type="radio"
            onChange={handleSettingsOnChange}
          />
        Female:
        <input
            name="gender"
            value="female"
            type="radio"
            onChange={handleSettingsOnChange}
          />
        </label>
        {/* AGE SECTION */}
        <label>
          Age:
        <select required name="age" onChange={handleSettingsOnChange}>
            {ageArray.map((x: number) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
        {/* WEIGHT SECTION */}
        <label>
          Weight:
        <input type="number" name="weight" onChange={handleSettingsOnChange} required />
        LBS:
        <input type="radio" name="weightUnit" value="lbs" onChange={handleSettingsOnChange} required />
        KG:
        <input type="radio" name="weightUnit" value="kg" onChange={handleSettingsOnChange} required />
        </label>
        {/* HEIGHT SECTION */}
        <label>
          Height:
          <input type="number" name="height" onChange={handleSettingsOnChange} required />
          Inch:
          <input type="radio" name="heightUnit" value="inches" onChange={handleSettingsOnChange} required />
          CM:
          <input type="radio" name="heightUnit" value="cm" onChange={handleSettingsOnChange} required />
        </label>
        {/* GOAL SECTION */}
        <label>
          Goal: {"  "}
        Lose:
        <input type="radio" name="goal" onChange={handleSettingsOnChange} value="lose" required />
        Maintain:
        <input type="radio" name="goal" onChange={handleSettingsOnChange} value="maintain" required />
        Gain:
        <input type="radio" name="goal" onChange={handleSettingsOnChange} value="gain" required />
        </label>
        {/* ACTIVITY LEVEL SECTION */}
        <label>
          Activity: {" "}
        Sedatory:
        <input type="radio" name="activityLevel" onChange={handleSettingsOnChange} value="sedatory" required />
        Light:
        <input type="radio" name="activityLevel" onChange={handleSettingsOnChange} value="light" required />
        Medium:
        <input type="radio" name="activityLevel" onChange={handleSettingsOnChange} value="medium" required />
        High:
        <input type="radio" name="activityLevel" onChange={handleSettingsOnChange} value="high" required />
        </label>
        <button onClick={!isLogged ? userSetUpComplete : saveUserSettings}>{isLogged ? "Save Settings" : "Complete Set Up"}</button>
        <button onClick={() => console.log(userSettings)}>Check Settings</button>
      </div>
    </>
  )
}
