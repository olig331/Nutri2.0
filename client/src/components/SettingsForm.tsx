import React, { useContext } from 'react';
import { UsersSettingsContext, IsLoggedContext, LoggedInUserSettingsContext } from '../Context/Context';
import { Link } from 'react-router-dom';
import { resolve } from 'url';
import { rejects } from 'assert';


export const SettingsForm: React.FC = () => {

  const ageArray: number[] = Array.from(Array(100), (_, i) => i + 1)

  const { isLogged, setisLogged } = useContext(IsLoggedContext);
  const { userSettings, setuserSettings } = useContext(UsersSettingsContext);
  const {loggedInUserSettings, setLoggedInUserSettings} = useContext(LoggedInUserSettingsContext);
  

  const handleSettingsOnChange = (e: any) => {
    var nestedCopy = { ...userSettings.usersPersonalSettings }
    console.log(nestedCopy);
    var fullCopy = { ...userSettings };
    nestedCopy[e.target.name] = e.target.value
    fullCopy.usersPersonalSettings = nestedCopy;
    setuserSettings(fullCopy);  
  };

  // ADD NEW USER TO MONGODB 
  const userSetUpComplete = async () => {
   return fetch("http://localhost:5000/createUser", {
      method: 'POST',
      body: JSON.stringify(userSettings),
      mode: "no-cors"
    })
    .then(response => {
      return response.text()
    })
    .catch((error) =>{
      rejects(error)
    })
  };



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
            defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.gender === "male"}
          />
        Female:
        <input
            name="gender"
            value="female"
            type="radio"
            onChange={handleSettingsOnChange}
            defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.gender === "female"}
          />
        </label>
        {/* AGE SECTION */}
        <label>
          Age:
        <select required name="age" defaultValue={isLogged? loggedInUserSettings.usersPersonalSettings.age:1} onChange={handleSettingsOnChange}>
            {ageArray.map((x: number) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
        {/* WEIGHT SECTION */}
        <label>
          Weight:
        <input type="number" name="weight" defaultValue={isLogged? loggedInUserSettings.usersPersonalSettings.weight: 0} onChange={handleSettingsOnChange} required />
        LBS:
        <input type="radio" name="weightUnit" value="lbs" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.weightUnit ==="lbs"} onChange={handleSettingsOnChange} required />
        KG:
        <input type="radio" name="weightUnit" value="kg" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.weightUnit ==="kg"} onChange={handleSettingsOnChange} required />
        </label>
        {/* HEIGHT SECTION */}
        <label>
          Height:
          <input type="number" name="height"  defaultValue={isLogged? loggedInUserSettings.usersPersonalSettings.height: 0} onChange={handleSettingsOnChange} required />
          Inch:
          <input type="radio" name="heightUnit" value="inches" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.heightUnit ==="inches"} onChange={handleSettingsOnChange} required />
          CM:
          <input type="radio" name="heightUnit" value="cm" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.heightUnit ==="cm"} onChange={handleSettingsOnChange} required />
        </label>
        {/* GOAL SECTION */}
        <label>
          Goal: {"  "}
        Lose:
        <input type="radio" name="goal" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.goal ==="lose"} onChange={handleSettingsOnChange} value="lose" required />
        Maintain:
        <input type="radio" name="goal" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.goal ==="maintain"} onChange={handleSettingsOnChange} value="maintain" required />
        Gain:
        <input type="radio" name="goal" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.goal ==="gain"} onChange={handleSettingsOnChange} value="gain" required />
        </label>
        {/* ACTIVITY LEVEL SECTION */}
        <label>
          Activity: {" "}
        Sedatory:
        <input type="radio" name="activityLevel" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.activityLevel ==="sedatory"} onChange={handleSettingsOnChange} value="sedatory" required />
        Light:
        <input type="radio" name="activityLevel" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.activityLevel ==="light"} onChange={handleSettingsOnChange} value="light" required />
        Medium:
        <input type="radio" name="activityLevel" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.activityLevel ==="medium"} onChange={handleSettingsOnChange} value="medium" required />
        High:
        <input type="radio" name="activityLevel" defaultChecked={isLogged && loggedInUserSettings.usersPersonalSettings.activityLevel ==="high"} onChange={handleSettingsOnChange} value="high" required />
        </label>.
        <Link to="/">
          <button onClick={isLogged ? saveUserSettings : userSetUpComplete}>{isLogged ? "Save Settings" : "Complete Set Up"}</button>
        </Link>
        <button onClick={() => {console.log(userSettings); console.log(isLogged); console.log(loggedInUserSettings.usersPersonalSettings.gender); console.log(loggedInUserSettings)}}>Check Settings</button>
      </div>
    </>
  )
}
