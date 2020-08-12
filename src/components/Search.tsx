import React, { useState, useEffect, useContext } from 'react';

interface passedProps {
  addItem: (item: responseItemsFields) => void
}

export const Search: React.FC<passedProps> = ({ addItem }) => {

  const APP_ID: string = "fd252eb4";
  const APP_KEY: string = "d4916eb493b2039e2b8fa3f54b096386";

  const [itemsNutrition, setitemsNutrition] = useState<any[]>([]);
  const [searchInputValue, setsearchInputValue] = useState<string>("");
  const [showItemNutritionResults, setshowItemNutritionResults] = useState<boolean>(false);

  const getItemNutrition = async () => {
    const response = await fetch(`https://api.nutritionix.com/v1_1/search/${searchInputValue}?results=0:10&fields=item_name,brand_name,item_id,nf_calories,nf_protein,nf_sugars,nf_total_fat,nf_total_carbohydrate,nf_saturated_fat,nf_serving_weight_grams&appId=${APP_ID}&appKey=${APP_KEY}`);

    const data = await response.json();
    console.log(data.hits)
    setitemsNutrition(data.hits);
  };

  const searchBarInput = (e: any) => {
    setsearchInputValue(e.target.value);
  };

  const toggleShowItems = () => {
    showItemNutritionResults ? setshowItemNutritionResults(false) : setshowItemNutritionResults(true);
  };

  
  return (
    <>
      <input type="text" placeholder="Search..." onChange={searchBarInput} />
      <button
        onClick={() => { getItemNutrition(); toggleShowItems(); }}>{showItemNutritionResults
          ? "Close"
          : "Search"}
      </button>

      {itemsNutrition.map((item: responseItems, index: number) => (
        showItemNutritionResults
          ? (
            <div key={index}>
              <h5>
                <span>{item.fields.item_name}</span>
                {"  "}
                <span>
                  {item.fields.brand_name}{"  "}
                  {Math.round(item.fields.nf_calories)}Kcal
                  {item.fields.nf_serving_weight_grams !== null ?
                    ` (per ${item.fields.nf_serving_weight_grams}grams)` : ""}
                </span>
              </h5>
              <button onClick={() => addItem(item.fields)}>+</button>
            </div>
          )
          : null
      ))}
    </>
  );
};