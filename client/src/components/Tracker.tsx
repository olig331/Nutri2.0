import React, { useState, useContext, useEffect } from 'react';
import { Search } from './Search';
import { Stats } from './Stats';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext,  DailyFoodContext, LoggedInIDContext, NavigatedFromTrackerContext } from '../Context/Context';
import { UserInfo } from './UserInfo';
import {BsChevronDoubleUp} from 'react-icons/bs';
import {RiDashboardFill} from 'react-icons/ri'
import {TiDelete} from 'react-icons/ti';


export const Tracker: React.FC = () => {

  console.log(new Date().toLocaleDateString())

  //Context
  const { loggedInID } = useContext(LoggedInIDContext)
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const {navigatedFromTracker, setnavigatedFromTracker} = useContext(NavigatedFromTrackerContext)

  const [showDailyFood, setshowDailyFood] = useState<boolean>(false)


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

  const toggleShowDailyFood = () =>{
    showDailyFood ? setshowDailyFood(false) : setshowDailyFood(true);
  }


  return (
    <div className="tracker_parent">
      <div className="user_info">
        <UserInfo/>
      </div>
      <Link to="/dashboard">
        <div 
          onClick={()=>{updateUsersDailyFood(); setnavigatedFromTracker(true)}}className="dashboard_button">
          <RiDashboardFill/>
        </div>
      </Link>
      <div className="search">
        <Search
          addItem={addItemFromSearch}
        />
      </div>
      <div className="daily_food" style={dailyFood.length <= 1?{opacity:"0"}: {backgroundColor:"rgba(119, 119, 119, 0.664)"}}>
        {dailyFood.slice(1).map((x: any, i: number) => (
          <li key={i}>{i + 1}. {x.item_name}<span className="remove_item" onClick={() => { removeItem(i) }}><TiDelete/></span></li>
        ))}
      </div>
      <div className="stats">
        <Stats
          dailyFood={dailyFood}
        />
      </div>
      <div onClick={toggleShowDailyFood} className="show_daily_food"><BsChevronDoubleUp/></div>
    </div>
  );
};
