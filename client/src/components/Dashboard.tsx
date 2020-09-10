import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IsLoggedContext, LoggedInUserSettingsContext,LoggedInIDContext,  DailyFoodContext } from '../Context/Context';
import { rejects } from 'assert';
import { compileFunction } from 'vm';

interface passedFunction {
  logOutUpdate: () => void
}

export const Dashboard: React.FC<passedFunction> = ({logOutUpdate}) => {

  //VARIABLES
  const todaysDate = new Date().toLocaleDateString();
  
  //STATE
  const [showPopUp, setshowpopUp] = useState<Boolean>(false);
  
  //CONTEXT 
  const {loggedInID, setloggedInID} = useContext(LoggedInIDContext);
  const {isLogged, setisLogged } = useContext(IsLoggedContext);
  const {dailyFood, setdailyFood} = useContext(DailyFoodContext);
  const {loggedInUserSettings, setLoggedInUserSettings} = useContext(LoggedInUserSettingsContext);

  const togglePopUp = () => {
    showPopUp ? setshowpopUp(false) : setshowpopUp(true);
  };


  
  const updateHistory = async () =>{
    await fetch(`http://localhost:5000/updateUserHistory?userId=${loggedInID}`, {
      method: 'POST',
      body: JSON.stringify(loggedInUserSettings.usersDailyFood),
      mode: 'no-cors'
    })
    .then(response =>{
      return response.text();
    })
    .catch(err =>{
      rejects(err)
    });

  };

  const resetDailyFood =() =>{
   const copy = {...loggedInUserSettings};
    copy.usersDailyFood = [];
    setLoggedInUserSettings(copy);
  };

  useEffect(() => {
    async function blob(){
    if(loggedInUserSettings.usersDailyFood[0] !== todaysDate){
      await  updateHistory();
        resetDailyFood();
    };
  };

   blob();
  },[]);


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
                    <button onClick={()=>{setisLogged(false); logOutUpdate();}}>Log Out</button>
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
