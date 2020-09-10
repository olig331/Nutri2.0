import React, { useState, useContext, useEffect } from 'react';
import { Search } from './Search';
import { Stats } from './Stats';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext, UsersContext, DailyFoodContext } from '../Context/Context';
import { log } from 'util';



export const Tracker: React.FC = () => {
  
  const {dailyFood, setdailyFood} = useContext(DailyFoodContext);
  const {loggedInUserSettings, setLoggedInUserSettings} = useContext(LoggedInUserSettingsContext);

  console.log(loggedInUserSettings)

  useEffect(()=>{
    if(loggedInUserSettings  !==  undefined){
      setdailyFood(loggedInUserSettings.usersDailyFood)
    }
  }, [])

  const addItemFromSearch = (item: responseItemsFields): void => {
    let copy = [...dailyFood]
    if(copy.length === 0){
      copy.push(new Date().toLocaleDateString());
      copy.push(item)
      setdailyFood(copy);
    } else{
      copy.push(item);
      setdailyFood(copy);
    }    
    console.log(copy)
  };

  const removeItem = (indexOfItem: number): void => {

    let dailyFoodCopy = [...dailyFood]
    console.log(dailyFood);
    console.log(indexOfItem)
    if (indexOfItem === 0) {
      dailyFoodCopy.splice(indexOfItem, indexOfItem + 1);
    } else {
      dailyFoodCopy.splice(indexOfItem + 1 , indexOfItem + 1);
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
          <li key={i}>{i + 1}. {x.item_name}<button onClick={() => {removeItem(i)}}>X</button></li>
        ))}
      </div>
      <Stats
        dailyFood={dailyFood}
      />
      <button onClick={()=> console.log(loggedInUserSettings)}>check if updating user setting</button>
    </>
  );
};
