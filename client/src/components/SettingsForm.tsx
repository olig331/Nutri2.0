import React, { useContext } from 'react';
import { UsersSettingsContext, LoggedInUserSettingsContext, LoggedInIDContext, UserAuthedContext } from '../Context/Context';
import { Link, useHistory } from 'react-router-dom';
import { rejects } from 'assert';
import { UserInfo } from './UserInfo';



export const SettingsForm: React.FC = () => {

  const ageArray: number[] = Array.from(Array(100), (_, i) => i + 1)

  const pageHistory = useHistory();

  const { userAuthed } = useContext(UserAuthedContext)
  const { userSettings, setuserSettings } = useContext(UsersSettingsContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const { loggedInID, setloggedInID } = useContext(LoggedInIDContext);


  const handleSettingsOnChange = (e: any) => {
    var nestedCopy = { ...userSettings.usersPersonalSettings }
    console.log(nestedCopy);
    var fullCopy = { ...userSettings };
    nestedCopy[e.target.name] = e.target.value
    fullCopy.usersPersonalSettings = nestedCopy;
    setuserSettings(fullCopy);
  };

  // ADD NEW USER TO MONGODB 
  const userSetUpComplete = async (): Promise<void> => {
    await fetch("http://localhost:5000/createUser", {
      method: 'POST',
      body: JSON.stringify(userSettings),
    })
      .then(response => {
        pageHistory.replace('/');
        return response.text()
      })
      .catch((error) => {
        rejects(error)
      })
  };


  const saveUserSettings = async (): Promise<void> => {
    console.log(userSettings.usersPersonalSettings)
    const response = await fetch(`/updateUsersSettings?userId=${loggedInID}`, {
      method: 'POST',
      body: JSON.stringify(userSettings.usersPersonalSettings)
    })
    const data = await response.json()
    console.log(data)
    pageHistory.replace('/dashboard')
  }




  return (
    <> 
     
      {userAuthed ? (<><UserInfo /> <Link to="/dashboard"><button>Dashboard</button></Link></>) : null}
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
            defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.gender === "male"}
          />
        Female:
        <input
            name="gender"
            value="female"
            type="radio"
            onChange={handleSettingsOnChange}
            defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.gender === "female"}
          />
        </label>
        {/* AGE SECTION */}
        <label>
          Age:
        <select required name="age" defaultValue={userAuthed ? loggedInUserSettings.usersPersonalSettings.age : 1} onChange={handleSettingsOnChange}>
            {ageArray.map((x: number) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
        {/* WEIGHT SECTION */}
        <label>
          Weight:
        <input type="number" name="weight" defaultValue={userAuthed ? loggedInUserSettings.usersPersonalSettings.weight : 0} onChange={handleSettingsOnChange} required />
        LBS:
        <input type="radio" name="weightUnit" value="lbs" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.weightUnit === "lbs"} onChange={handleSettingsOnChange} required />
        KG:
        <input type="radio" name="weightUnit" value="kg" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.weightUnit === "kg"} onChange={handleSettingsOnChange} required />
        </label>
        {/* HEIGHT SECTION */}
        <label>
          Height:
          <input type="number" name="height" defaultValue={userAuthed ? loggedInUserSettings.usersPersonalSettings.height : 0} onChange={handleSettingsOnChange} required />
          Inch:
          <input type="radio" name="heightUnit" value="inches" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.heightUnit === "inches"} onChange={handleSettingsOnChange} required />
          CM:
          <input type="radio" name="heightUnit" value="cm" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.heightUnit === "cm"} onChange={handleSettingsOnChange} required />
        </label>
        {/* GOAL SECTION */}
        <label>
          Goal: {"  "}
        Lose:
        <input type="radio" name="goal" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.goal === "lose"} onChange={handleSettingsOnChange} value="lose" required />
        Maintain:
        <input type="radio" name="goal" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.goal === "maintain"} onChange={handleSettingsOnChange} value="maintain" required />
        Gain:
        <input type="radio" name="goal" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.goal === "gain"} onChange={handleSettingsOnChange} value="gain" required />
        </label>
        {/* ACTIVITY LEVEL SECTION */}
        <label>
          Activity: {" "}
        Sedatory:
        <input type="radio" name="activityLevel" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.activityLevel === "sedatory"} onChange={handleSettingsOnChange} value="sedatory" required />
        Light:
        <input type="radio" name="activityLevel" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.activityLevel === "light"} onChange={handleSettingsOnChange} value="light" required />
        Medium:
        <input type="radio" name="activityLevel" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.activityLevel === "medium"} onChange={handleSettingsOnChange} value="medium" required />
        High:
        <input type="radio" name="activityLevel" defaultChecked={userAuthed && loggedInUserSettings.usersPersonalSettings.activityLevel === "high"} onChange={handleSettingsOnChange} value="high" required />
        </label>.
          <button onClick={userAuthed ? saveUserSettings : userSetUpComplete}>{userAuthed ? "Save Settings" : "Complete Set Up"}</button>
        <button onClick={() => { console.log(userSettings); console.log(userAuthed); console.log(loggedInUserSettings.usersPersonalSettings.gender); console.log(loggedInUserSettings) }}>Check Settings</button>
        <button onClick={() => console.log(userSettings)}>checkUserSettings</button>
      </div>
    </>
  )
}
