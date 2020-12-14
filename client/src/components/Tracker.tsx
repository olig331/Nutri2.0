import React, { useState, useContext, useEffect } from "react";
import { Search } from "./Search";
import { Stats } from "./Stats";
import { useHistory } from "react-router-dom";
import { UserInfo } from "./UserInfo";
import { RiDashboardFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import "../style/tracker.css";
import { CreateCustomItem } from "./CreateCustomItem";
import {AddACustomFood} from './AddACustomFood';
import {
  LoggedInUserSettingsContext,
  DailyFoodContext,
  LoggedInIDContext,
  NavigatedFromTrackerContext,
} from "../Context/Context";





export const Tracker: React.FC = () => {

  const pageHistory = useHistory();

  //Context
  const { loggedInID } = useContext(LoggedInIDContext);
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings } = useContext(LoggedInUserSettingsContext);
  const { setnavigatedFromTracker } = useContext(NavigatedFromTrackerContext);

  // State
  const [customResults, setcustomResults] = useState<CustomAddObj[]>();

  const refetchCustomAdds = async ():Promise<void> => {
    const response = await fetch(
      `https://nutriserverside.herokuapp.com/fetchCustomAdds?userId=${loggedInID}`, {
        method: "GET",
      }
    );
    const data = await response.json();
    //console.log(data);
    setcustomResults(data);
  };

  useEffect(() => {
    setcustomResults(loggedInUserSettings.usersCustomFood);
  }, []);

  
  // Will pull from database when this page is rendered
  useEffect(() => {
    console.log("running on mount first useEffect");
    getDailyFood();
  }, []); 


  const updateUsersDailyFood = async ():Promise<void> => {
    console.log("updateUserDailyFoodFunc");
    await fetch(`https://nutriserverside.herokuapp.com/updateUsersFood?userId=${loggedInID}`, {
      method: "POST",
      body: JSON.stringify(dailyFood),
    })
    setdailyFood([]);
    console.log("updated");
    return;
  };


  // Pull daily Food from the Database will only return If the data is the same date as when posted due to funtions on Dashboard
  const getDailyFood = async ():Promise<void> => {
    const response = await fetch(
      `https://nutriserverside.herokuapp.com/getDailyFood?userId=${loggedInID}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    //console.log(data);
    setdailyFood(data);
  };


  const calcCustomWeightAdditions = (item: responseItemsFields | CustomAddObj,weight: number ) => {

      let newItemVals = { ...item };
      let prevWeight: any = item.nf_serving_weight_grams;

      newItemVals.nf_calories = newItemVals.nf_calories
        ? (newItemVals.nf_calories / prevWeight) * weight
        : 0;

      newItemVals.nf_protein = newItemVals.nf_protein
        ? (newItemVals.nf_protein / prevWeight) * weight
        : 0;

      newItemVals.nf_total_carbohydrate = newItemVals.nf_total_carbohydrate
        ? (newItemVals.nf_total_carbohydrate / prevWeight) * weight
        : 0;

      newItemVals.nf_total_fat = newItemVals.nf_total_fat
        ? (newItemVals.nf_total_fat / prevWeight) * weight
        : 0;

      newItemVals.nf_saturated_fat = newItemVals.nf_saturated_fat
        ? (newItemVals.nf_saturated_fat / prevWeight) * weight
        : 0;

      newItemVals.nf_sugars = newItemVals.nf_sugars
        ? (newItemVals.nf_sugars / prevWeight) * weight
        : 0;

      newItemVals.nf_serving_weight_grams = newItemVals.nf_serving_weight_grams
        ? weight.toString()
        : "0";

      let copy: any[] = [...dailyFood];

      if (copy.length === 0) {
        // if the array is empty add todays date to the array 
        copy.push(new Date().toLocaleDateString());
        copy.push(newItemVals);
        setdailyFood(copy);
      } else {
        copy.push(newItemVals);
        setdailyFood(copy);
      }
  };

  //Add a search item to dailyFood State
  const addApiItemFromSearch = (item: responseItemsFields | CustomAddObj): void => {

    let copy: any[] = [...dailyFood];
    if (copy.length === 0) {
      copy.push(new Date().toLocaleDateString());
      copy.push(item);
      setdailyFood(copy);
    } else {
      copy.push(item);
      setdailyFood(copy);
    }
  };

  // Remove an item from DailyFood
  const removeItem = (indexOfItem: number): void => {
    let dailyFoodCopy = [...dailyFood];
    dailyFoodCopy.splice(indexOfItem + 1, 1);
    setdailyFood(dailyFoodCopy);
  };


  return (
    <div className="tracker_parent">
      {/*  */}
      <div className="stats">
        <Stats dailyFood={dailyFood} />
      </div>
      {/*  */}
  
      <div className="user_info">
        <UserInfo />
      </div>
      {/*  */}
  
        <div
          onClick={async () => {
            await updateUsersDailyFood();
             pageHistory.replace("/dashboard")
          }}
          className="dashboard_button"
        >
          <RiDashboardFill />
        </div>
      {/*  */}
        
      <div className="bottom_half">

        {/*  */}
        <div className="search">
          <Search
            customAdd={calcCustomWeightAdditions}
            addApiItem={addApiItemFromSearch}
          />
        </div>
        {/*  */}

        {/* Daily Food ANCHOR */}
        <div className="daily_food">
          <ul>
            {dailyFood.slice(1).map((x: any, i: number) => (
              <li key={i}>
                <span
                  className="remove_item"
                  onClick={() => {
                    removeItem(i);
                  }}
                >
                  <TiDelete />
                </span>
                {x.item_name}
              </li>
            ))}
          </ul>
        </div>
        {/*  */}
        
        {/* Creating a custom food ANCHOR */}
        <div className="create_a_custom_item">
          <CreateCustomItem 
            refetchCustomAdds={refetchCustomAdds}
          />
        </div>
        {/*  */}
     
        <div className="adding_a_custom_food_container">
          <AddACustomFood
            addApiItemFromSearch={addApiItemFromSearch}
            calcCustomWeightAdditions={calcCustomWeightAdditions}
            customResults={customResults}
          />
        </div>
        {/*  */}

      </div>
    </div>
  );
};
