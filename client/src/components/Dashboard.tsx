import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IsLoggedContext, LoggedInUserSettingsContext, DailyFoodContext } from '../Context/Context';


export const Dashboard: React.FC = () => {

  const todaysDate = new Date().toLocaleDateString();

  const [showPopUp, setshowpopUp] = useState<Boolean>(false);
  const { isLogged, setisLogged } = useContext(IsLoggedContext);
  const {dailyFood, setdailyFood} = useContext(DailyFoodContext);
  const {loggedInUserSettings, setLoggedInUserSettings} = useContext(LoggedInUserSettingsContext);

  const togglePopUp = () => {
    showPopUp ? setshowpopUp(false) : setshowpopUp(true);
  }

  // useEffect(()=>{
  //   let dateCheck = loggedInUserSettings.usersDailyFood;
  //   console.log(dateCheck)
  //   console.log(dateCheck[0])
  //   console.log(todaysDate)
  //   if(dateCheck[0]  !== todaysDate){
  //     let copy = {...loggedInUserSettings}
  //     copy.usersHistory.push(dateCheck)
  //     copy.usersDailyFood = []
  //     console.log(copy)
  //     setLoggedInUserSettings(copy);
  //   }else{
  //     setdailyFood(loggedInUserSettings.usersDailyFood)
  //   }
  // },[]);

  return (
    <div>
      <Link to="/tracker">
        <div>Tracker</div>
      </Link>
      <Link to="/history">
        <div >History</div>
      </Link>
      <Link to="/settings">
        <div >Settings</div>
      </Link>
       <div onClick={togglePopUp}>Change User
        {showPopUp
            ? (
              <>
                <h5>Changing User will log you out. Are you sure you wish to continue?</h5>
                  <Link to="/">
                    <button onClick={()=>{setisLogged(false)}}>Log Out </button>
                  </Link>
                <button onClick={togglePopUp}>Go Back</button>
              </>
            )
            : null
          }
        </div>
    </div>
  );
}; 
