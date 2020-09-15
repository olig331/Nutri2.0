import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {  LoggedInUserSettingsContext, LoggedInIDContext, DailyFoodContext, NavigatedFromTrackerContext, SignedOutContext } from '../Context/Context';
import { WelcomeUser } from './WelcomeUser';




export const Dashboard: React.FC = () => {

  // PAGE HISTORY HOOK FOR NAVIGATION 
  const pageHistory:any = useHistory()

  //Date Variable for checking if dailyFood needs to be History
  const todaysDate = new Date().toLocaleDateString();

  // Toggle Pop Up State
  const [showPopUp, setshowpopUp] = useState<boolean>(false);
  const [finishLoad, setfinishLoad] = useState<boolean>(false);

  //CONTEXT 
  const {navigatedFromTracker, setnavigatedFromTracker} = useContext(NavigatedFromTrackerContext)
  const { loggedInID, setloggedInID } = useContext(LoggedInIDContext);
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const {setsignedOut} = useContext (SignedOutContext)
  

  // IF USER HAS NAVIGATED FROM TRACKER USER DATA WILL BE UPDATED
  useEffect(() =>{
    if(navigatedFromTracker){
      reFetchUserData()
    }
  },[])

  // FUNCTION TO UPDATE DATA
  const reFetchUserData = async ():Promise<void> =>{
     const response =  await fetch(`/refetchUserData?userId=${loggedInID}`, {
      method: 'GET'
    })
    const data = await response.json();
    setLoggedInUserSettings(data);
    setnavigatedFromTracker(false);
  };

  
  //when logout button is clicked state for displaying log out confirmation
  const togglePopUp = ():void => {
    showPopUp ? setshowpopUp(false) : setshowpopUp(true);
  };


  // When History tab is clicked this function will update the databse and set the previous days DailyFood to the history
  const updateHistory = async ():Promise<void> => {
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
  const resetFood = async ():Promise<void> => {
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
  };

  const refresh =():void =>{
    window.location.reload();
  }

  setTimeout(() => {
    setfinishLoad(true)
  }, 1500);

  return (
    <div>
      {!finishLoad ?
      <WelcomeUser />
      :
      <>
      <Link to="/tracker">
        <div onClick={()=>loggedInUserSettings.usersDailyFood[0] === todaysDate
        ? console.log("dates are equal")
        : resetFood()}>Tracker</div>
      </Link>



      <div onClick={() => {
        loggedInUserSettings.usersDailyFood[0] !== todaysDate && loggedInUserSettings.usersDailyFood.length > 0
          ? updateHistory()
          : pageHistory.replace('/history')
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
                <button onClick={setsignedOut(true)}>Log Out</button>
              </Link>
              <button onClick={togglePopUp}>Go Back</button>
            </>
          )
          : null
        }
      </div>
      <button onClick={() => { console.log(loggedInUserSettings); console.log(loggedInID) }}>Check status</button>
      </>
      }
    </div>
  );
}; 
