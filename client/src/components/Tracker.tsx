import React, { useState, useContext, useEffect } from 'react';
import { Search } from './Search';
import { Stats } from './Stats';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext,  DailyFoodContext, LoggedInIDContext, NavigatedFromTrackerContext } from '../Context/Context';
import { UserInfo } from './UserInfo';


export const Tracker: React.FC = () => {

  console.log(new Date().toLocaleDateString())

  //Context
  const { loggedInID } = useContext(LoggedInIDContext)
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const {navigatedFromTracker, setnavigatedFromTracker} = useContext(NavigatedFromTrackerContext)


  // Will pull from database when this page is rendered
  useEffect(() => {
    console.log("running on mount first useEffect")
    getDailyFood();
  }, []);

  const updateUsersDailyFood = async () =>{
      await fetch(`http://localhost:5000/updateUsersFood?userId=${loggedInID}`, {
        method: 'POST',
        body: JSON.stringify(dailyFood),
      })
      .then(res =>{
        console.log(res)
        setdailyFood([])
      })
      .catch(err =>{
        console.log(err)
      })
  }

  // Pull daily Food from the Database will only return If the data is the same date as when posted due to funtions on Dashboard
  const getDailyFood = async () => {
    const response = await fetch(`http://localhost:5000/getDailyFood?userId=${loggedInID}`, {
      method: 'GET'
    })
    const data = await response.json()
    console.log("data should be shown from get dailyfood")
    console.log(data)
    setdailyFood(data)
  }

  
   window.onunload = () => {
     updateUsersDailyFood();
   };

  //Add a search item to dailyFood State
  const addItemFromSearch = (item: responseItemsFields): void => {
    let copy = [...dailyFood]
    if (copy.length === 0) {
      copy.push(new Date().toLocaleDateString());
      copy.push(item)
      setdailyFood(copy);
    } else {
      copy.push(item);
      setdailyFood(copy);
    }
    console.log(copy)
  };

  // Remove an item from DailyFood 
  const removeItem = (indexOfItem: number): void => {
    let dailyFoodCopy = [...dailyFood]
    console.log(dailyFoodCopy);
    console.log(indexOfItem)
    dailyFoodCopy.splice(indexOfItem +1, 1)
    setdailyFood(dailyFoodCopy);
  };



  return (
    <>
      <UserInfo/>
      <Link to="/dashboard">
        <button onClick={()=>{updateUsersDailyFood(); setnavigatedFromTracker(true)}}>Dashboard</button>
      </Link>
      <Search
        addItem={addItemFromSearch}
      />
      <div>
        {dailyFood.slice(1).map((x: any, i: number) => (
          <li key={i}>{i + 1}. {x.item_name}<button onClick={() => { removeItem(i) }}>X</button></li>
        ))}
      </div>
      <Stats
        dailyFood={dailyFood}
      />
      <button onClick={() => console.log(loggedInUserSettings)}>check if updating user setting</button>
      <button onClick={() => console.log(dailyFood)}>dailyFood</button>
    </>
  );
};
