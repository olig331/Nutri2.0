import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IsLoggedContext, LoggedInUserSettingsContext, LoggedInIDContext, DailyFoodContext } from '../Context/Context';
import { rejects } from 'assert';
import { compileFunction } from 'vm';
import { isMethodDeclaration } from 'typescript';

interface passedFunction {
  logOutUpdate: () => void
}

export const Dashboard: React.FC<passedFunction> = ({ logOutUpdate }) => {


  const pageHistory = useHistory()

  //Date Variable for checking if dailyFood needs to be History
  const todaysDate = new Date().toLocaleDateString();

  // Toggle Pop Up State
  const [showPopUp, setshowpopUp] = useState<Boolean>(false);

  //CONTEXT 
  const { loggedInID, setloggedInID } = useContext(LoggedInIDContext);
  const { isLogged, setisLogged } = useContext(IsLoggedContext);
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);

  //when logout button is clicked state for displaying log out confirmation
  const togglePopUp = () => {
    showPopUp ? setshowpopUp(false) : setshowpopUp(true);
  };


  // When History tab is clicked this function will update the databse and set the previous days DailyFood to the history
  const updateHistory = async () => {
    await fetch(`http://localhost:5000/updateUserHistory?userId=${loggedInID}`, {
      method: 'POST',
      body: JSON.stringify(loggedInUserSettings.usersDailyFood),
    })
      .then(response => {
        pageHistory.replace('/history')
        return response.text();
      })
      .catch(err => {
        console.log(err)
      });
  };


  // Resetting the Databses DailyFood to empty Array when it is no longer the same day.
  const resetFood = async () => {
    await fetch(`http://localhost:5000/resetFood?userId=${loggedInID}`, {
      method: 'POST',
      body: JSON.stringify([])
    })
      .then(response => {
        pageHistory.replace('/tracker')
        console.log(response.text())
      })
      .catch(err => {
        console.log(err)
      })
  }


  return (
    <div>
      <Link to="/tracker">
        <div onClick={() => loggedInUserSettings.usersDailyFood[0] === todaysDate
          ? console.log("dates equal no update needed")
          : resetFood()}>Tracker</div>
      </Link>



      <div onClick={() => {
        loggedInUserSettings.usersDailyFood[0] !== todaysDate
          ? updateHistory()
          : console.log("dates eqaul")
      }}>
        History
      </div>

      <Link to="/settings">
        <div >Settings</div>
      </Link>
      <div onClick={togglePopUp}>Change User
        {showPopUp
          ? (
            <>
              <h5>Changing User will log you out. Are you sure you wish to continue?</h5>
              <Link to="/">
                <button onClick={logOutUpdate}>Log Out</button>
              </Link>
              <button onClick={togglePopUp}>Go Back</button>
            </>
          )
          : null
        }
      </div>
      <button onClick={() => { console.log(loggedInUserSettings); console.log(loggedInID) }}>Check status</button>
    </div>
  );
}; 
