import React, { useState, useContext, useEffect } from "react";
import { Search } from "./Search";
import { Stats } from "./Stats";
import { Link } from "react-router-dom";
import {
  LoggedInUserSettingsContext,
  DailyFoodContext,
  LoggedInIDContext,
  NavigatedFromTrackerContext,
} from "../Context/Context";
import { UserInfo } from "./UserInfo";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import "../style/tracker.css";
import { promises } from "dns";
import { spawn } from "child_process";

export const Tracker: React.FC = () => {
  console.log(new Date().toLocaleDateString());

  //Context
  const { loggedInID } = useContext(LoggedInIDContext);
  const { dailyFood, setdailyFood } = useContext(DailyFoodContext);
  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(
    LoggedInUserSettingsContext
  );
  const { navigatedFromTracker, setnavigatedFromTracker } = useContext(
    NavigatedFromTrackerContext
  );

  //Toggle showing the custom add form
  const toggleCustomAdd = (): void => {
    showcustomAdd ? setshowcustomAdd(false) : setshowcustomAdd(true);
  };

  const defaultCustomAddVals: CustomAddObj = {
    name: "",
    weight: undefined,
    cals: undefined,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    satFat: undefined,
    sugar: undefined,
  };

  const [
    showCustomFoodAdditions,
    setshowCustomFoodAdditions,
  ] = useState<boolean>(false);
  const [filteredResults, setFilterdResults] = useState<any>();
  const [customResults, setcustomResults] = useState<CustomAddObj[]>();
  const [showcustomAdd, setshowcustomAdd] = useState<boolean>(false);
  const [showDailyFood, setshowDailyFood] = useState<boolean>(false);
  // CustomAddObjKeySafe is a type for matching keys the types are the same just they keys are type string
  // so they can be matched in the search componenet when passed through
  const [customAddVals, setcustomAddVals] = useState<CustomAddObjKeySafe>({
    ...defaultCustomAddVals,
  });
  const [itemAddedResMessage, setitemAddedResMessage] = useState<string>("");

  useEffect(() => {
    setcustomResults(loggedInUserSettings.usersCustomFood);
  }, []);

  useEffect(() => {
    console.log(customResults);
  }, [customResults]);

  const toggleShowCustomFoodAdditions = (): void => {
    showCustomFoodAdditions
      ? setshowCustomFoodAdditions(false)
      : setshowCustomFoodAdditions(true);
  };

  const realTimeSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedList = customResults?.filter((item) => {
      return (
        item.name.toLowerCase().search(e.currentTarget.value.toLowerCase()) !==
        -1
      );
    });
    console.log(updatedList);
    setFilterdResults(updatedList);
  };

  const refetchCustomAdds = async ()=>{
    const response = await fetch(`http://localhost:5000/fetchCustomAdds?userId=${loggedInID}`, {
      method: "GET"
    });
    const data = await response.json();
    console.log("this is refetch data V")
    console.log(data)
    setcustomResults(data);
  }


  const submitCustomItem = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log("submitted");
    const response = await fetch("http://localhost:5000/addToCustomList", {
      method: "POST",
      body: JSON.stringify({
        payload: customAddVals,
        id: loggedInID,
      }),
    });
    const data = await response.json();
    console.log(data);
    setitemAddedResMessage(data.message);
    refetchCustomAdds();

    setTimeout(() => {
      setitemAddedResMessage("");
    }, 3500);

    setcustomAddVals({ ...defaultCustomAddVals });
  };

  const handleCustomFoodOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ): void => {
    var copy = { ...customAddVals };
    if (fieldName !== "name") {
      copy[fieldName] = parseInt(e.currentTarget.value);
    } else {
      copy[fieldName] = e.currentTarget.value;
    }
    setcustomAddVals(copy);
  };

  // Will pull from database when this page is rendered
  useEffect(() => {
    console.log("running on mount first useEffect");
    getDailyFood();
  }, []);

  const updateUsersDailyFood = async () => {
    await fetch(`http://localhost:5000/updateUsersFood?userId=${loggedInID}`, {
      method: "POST",
      body: JSON.stringify(dailyFood),
    })
      .then((res) => {
        console.log(res);
        setdailyFood([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const serchCustomFoods = (): void => {
    console.log("seraching customss");
  };

  // Pull daily Food from the Database will only return If the data is the same date as when posted due to funtions on Dashboard
  const getDailyFood = async () => {
    const response = await fetch(
      `http://localhost:5000/getDailyFood?userId=${loggedInID}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    console.log("data should be shown from get dailyfood");
    console.log(data);
    setdailyFood(data);
  };

  window.onunload = () => {
    updateUsersDailyFood();
  };

  const calcCustomWeightAdditions = (item:responseItemsFields, weight: number) =>{
    let newItemVals = {...item};
    let prevWeight:any = item.nf_serving_weight_grams

    newItemVals.nf_calories = newItemVals.nf_calories 
      ?  ((newItemVals.nf_calories / prevWeight) * weight )
      : 0;
    newItemVals.nf_protein = newItemVals.nf_protein 
      ? ((newItemVals.nf_protein / prevWeight) * weight) 
      : 0;
    newItemVals.nf_total_carbohydrate = newItemVals.nf_total_carbohydrate 
      ? ((newItemVals.nf_total_carbohydrate / prevWeight) * weight) 
      : 0;
    newItemVals.nf_total_fat = newItemVals.nf_total_fat
      ?((newItemVals.nf_total_fat / prevWeight) * weight)
      :0;
    newItemVals.nf_saturated_fat = newItemVals.nf_saturated_fat
      ?((newItemVals.nf_saturated_fat / prevWeight) * weight)
      :0;
    newItemVals.nf_sugars = newItemVals.nf_sugars
      ?((newItemVals.nf_sugars / prevWeight) * weight)
      :0;
    newItemVals.nf_serving_weight_grams = newItemVals.nf_serving_weight_grams ? weight.toString() : "0";

    let copy:any[] = [...dailyFood];
    if(copy.length === 0){
      copy.push(new Date().toLocaleDateString());
      copy.push(newItemVals)
      setdailyFood(copy)
    } else {
      copy.push(newItemVals)
      setdailyFood(copy);
    }
    console.log(copy)
  } 

  //Add a search item to dailyFood State
  const addApiItemFromSearch = (
    item: responseItemsFields 
  ): void => {
    let copy:any[] = [...dailyFood];
    if (copy.length === 0) {
      copy.push(new Date().toLocaleDateString());
      copy.push(item);
      setdailyFood(copy);
    } else {
      copy.push(item);
      setdailyFood(copy);
    }
    console.log(copy);
  };

  // Remove an item from DailyFood
  const removeItem = (indexOfItem: number): void => {
    let dailyFoodCopy = [...dailyFood];
    console.log(dailyFoodCopy);
    console.log(indexOfItem);
    dailyFoodCopy.splice(indexOfItem + 1, 1);
    setdailyFood(dailyFoodCopy);
  };

  const toggleShowDailyFood = () => {
    showDailyFood ? setshowDailyFood(false) : setshowDailyFood(true);
  };

  return (
    <div className="tracker_parent">
      <div className="stats">
        <Stats dailyFood={dailyFood} />
      </div>
      <div className="user_info">
        <UserInfo />
      </div>
      <Link to="/dashboard">
        <div
          onClick={() => {
            updateUsersDailyFood();
            setnavigatedFromTracker(true);
          }}
          className="dashboard_button"
        >
          <RiDashboardFill />
        </div>
      </Link>
      <div className="bottom_half">
        <div className="search">
          <Search
            customAdd={calcCustomWeightAdditions}
            addApiItem={addApiItemFromSearch}
            customResults={customResults}
          />
        </div>
        <div className="daily_food">
          {dailyFood.slice(1).map((x: any, i: number) => (
            <li key={i}>
              {i + 1}. {x.item_name}
              <span
                className="remove_item"
                onClick={() => {
                  removeItem(i);
                }}
              >
                <TiDelete />
              </span>
            </li>
          ))}
        </div>
        {/* <div onClick={toggleShowDailyFood} className="show_daily_food">
          <BsChevronDoubleUp />
        </div> */}
        <div className="custom_add">
          <div className="title">
            <h4>Create a custom item</h4>
          </div>

          <span onClick={toggleCustomAdd}>
            {showcustomAdd ? <BsChevronDoubleUp /> : <BsChevronDoubleDown />}
          </span>

          {showcustomAdd ? (
            <div className="add_form">
              <form onSubmit={submitCustomItem}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={customAddVals.name}
                  onChange={(e) => handleCustomFoodOnChange(e, "name")}
                  required
                />
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight in grams"
                  value={
                    customAddVals.weight !== undefined
                      ? customAddVals.weight
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "weight")}
                  required
                />
                <input
                  type="number"
                  name="cals"
                  placeholder="calories"
                  value={
                    customAddVals.cals !== undefined ? customAddVals.cals : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "cals")}
                  required
                />
                <input
                  type="number"
                  name="protein"
                  placeholder="Protein"
                  value={
                    customAddVals.protein !== undefined
                      ? customAddVals.protein
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "protein")}
                  required
                />
                <input
                  type="number"
                  name="carbs"
                  placeholder="Carbohydrates"
                  value={
                    customAddVals.carbs !== undefined ? customAddVals.carbs : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "carbs")}
                  required
                />
                <input
                  type="number"
                  name="fat"
                  placeholder="Fat"
                  value={
                    customAddVals.fat !== undefined ? customAddVals.fat : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "fat")}
                  required
                />
                <input
                  type="number"
                  name="satFat"
                  placeholder="Saturated Fat"
                  value={
                    customAddVals.satFat !== undefined
                      ? customAddVals.satFat
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "satFat")}
                  required
                />
                <input
                  type="number"
                  name="sugar"
                  placeholder="Sugar"
                  value={
                    customAddVals.sugar !== undefined ? customAddVals.sugar : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "sugar")}
                  required
                />
                <button type="submit" value="submit">
                  Add Custom Item
                </button>
                <h5>{itemAddedResMessage}</h5>
              </form>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="add_a_custom_food">
          {!showCustomFoodAdditions ? <h5>Add your custom Items</h5> : ""}
          <span onClick={toggleShowCustomFoodAdditions}>
            {showCustomFoodAdditions ? (
              <BsChevronDoubleDown />
            ) : (
              <BsChevronDoubleUp />
            )}
          </span>
          {showCustomFoodAdditions ? (
            <>
              <input
                type="text"
                placeholder="Search custom foods"
                onChange={realTimeSearch}
              />
              <ul>
                {filteredResults !== undefined
                  ? filteredResults.map((item: CustomAddObj, index: number) => (
                      <div>
                        <li key={index}>
                          {item.name}{" "}
                          <span>
                            ({item.cals}Kcal | per{item.weight}g)
                          </span>
                          </li>
                          <button>+</button>
                        
                      </div>
                    ))
                  : ""}
              </ul>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
