import React, { useState, useContext, useEffect } from 'react';
import { Search } from './Search';
import { Stats } from './Stats';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext, UsersContext } from '../Context/Context';



export const Tracker: React.FC = () => {

  const todaysDate = new Date().toLocaleDateString();

  const [dailyFood, setdailyFood] = useState<any[]>([]);

  const {users, setusers} = useContext(UsersContext)
  const {loggedInUserSettings, setLoggedInUserSettings} = useContext(LoggedInUserSettingsContext)


  useEffect(()=>{
    let copy = {...loggedInUserSettings}
    copy.usersDailyFood = dailyFood
    console.log(copy)
    setLoggedInUserSettings(copy)
  }, [dailyFood]);
  
  useEffect(()=>{
    console.log("users below")
    console.log(users);
    setdailyFood(loggedInUserSettings.usersDailyFood)
  },[]);

  useEffect(()=>{
    let usersVar = [...users]
    usersVar.map((x:UsersType, i:number)=>{
      if(x.userName === loggedInUserSettings.userName){
        usersVar[i] = loggedInUserSettings
      };
    });
    console.log(`this is users var ${usersVar}`);
    setusers(usersVar);
    
  }, [loggedInUserSettings]);

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
    if (indexOfItem === 0) {
      dailyFoodCopy.splice(indexOfItem, indexOfItem + 1);
    } else {
      dailyFoodCopy.splice(indexOfItem, indexOfItem);
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
          <li key={i}>{i + 1}. {x.item_name}<button onClick={() => removeItem(i)}>X</button></li>
        ))}
      </div>
      <Stats
        dailyFood={dailyFood}
      />
      <button onClick={()=> console.log(loggedInUserSettings)}>check if updating user setting</button>
    </>
  );
};
