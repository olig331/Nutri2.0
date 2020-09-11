import React, { useState, useContext, useEffect } from 'react';
import { Search } from './Search';
import { Stats } from './Stats';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext, UsersContext, DailyFoodContext, LoggedInIDContext } from '../Context/Context';




export const Tracker: React.FC = () => {

  //Context
  const { loggedInID } = useContext(LoggedInIDContext)
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);

  console.log(loggedInUserSettings)

  // Will pull from database when this page is rendered
  useEffect(() => {
    getDailyFood()
  }, [])


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
    console.log(dailyFood);
    console.log(indexOfItem)
    if (indexOfItem === 0) {
      dailyFoodCopy.splice(indexOfItem, indexOfItem + 1);
    } else {
      dailyFoodCopy.splice(indexOfItem + 1, indexOfItem + 1);
    }
    setdailyFood(dailyFoodCopy);
  };



  return (
    <>
      <Link to="/dashboard">
        <button>Dashboard</button>
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
