import React, { useState, useEffect, useContext } from "react";
import { TiDelete } from "react-icons/ti";

interface passedProps {
  addApiItem: (item: responseItemsFields) => void;
  customAdd: (item: responseItemsFields, weight: number) => void;
}

export const Search: React.FC<passedProps> = ({addApiItem,customAdd,}) => {
  // STATE
  const [customItemsNutrition, setcustomItemsNutrition] = useState<
    CustomAddObj[]
  >([]);
  const [apiItemsNutrition, setapiItemsNutrition] = useState<any[]>([]);
  const [searchInputValue, setsearchInputValue] = useState<string>("");
  const [
    showItemNutritionResults,
    setshowItemNutritionResults,
  ] = useState<boolean>(false);
  const [customWeight, setCustomWeight] = useState<number>(0);

  // Nutrionix API CALL
  const getItemNutrition = async () => {
   
    const apiResponse = await fetch(
      `https://api.nutritionix.com/v1_1/search/${searchInputValue}?results=0:10&fields=item_name,brand_name,item_id,nf_calories,nf_protein,nf_sugars,nf_total_fat,nf_total_carbohydrate,nf_saturated_fat,nf_serving_weight_grams&appId=${process.env.REACT_APP_APP_ID}&appKey=${process.env.REACT_APP_APP_KEY}`
    );

    const apiData = await apiResponse.json();
    setapiItemsNutrition(apiData.hits);
  };

  const searchBarInput = (e: React.FormEvent<HTMLInputElement>) => {
    setsearchInputValue(e.currentTarget.value);
  };


  return (
    <>
      <div className="search_bar">
        <input 
          value={searchInputValue}
          type="text" 
          placeholder="Search for food..." 
          onChange={searchBarInput} 
        />
        <span onClick={() => setsearchInputValue("")}><TiDelete/></span>
      </div>

      <div className="search_buttons">
        <button
          className="search_close_btn"
          onClick={() => {
            getItemNutrition();
            setshowItemNutritionResults(true);
          }}
        >
         Search
        </button>
        <button onClick={() =>setshowItemNutritionResults(false)}>Close</button>
      </div>
      <div
        className="search_response"
        style={
          showItemNutritionResults
            ? {
                overflowY: "scroll",
                backgroundColor: "rgba(255, 255, 255, 0.913)",
              }
            : { display: "none" }
        }
      >
        {customItemsNutrition.map((item: CustomAddObj, index: number) => (
          <div key={index}>
            <h5>
              <span>{item.item_name}</span>{" "}
              <span>
                {item.nf_calories}Kcal | per {item.nf_serving_weight_grams}grams
              </span>
            </h5>
            {/* <button onClick={() => addApiItem(item)}>+</button> */}
          </div>
        ))}

        {apiItemsNutrition.map((item: responseItems, index: number) =>
          showItemNutritionResults ? (
            <div key={index}>
             <div className="top_section">
                <h5>
                  <span>{item.fields.item_name}</span>
                  {"  "}
                  <span>
                    {item.fields.brand_name}
                    {"  "}
                    {Math.round(item.fields.nf_calories)}Kcal
                    {item.fields.nf_serving_weight_grams !== null
                      ? ` (per ${item.fields.nf_serving_weight_grams}grams)`
                      : ""}
                  </span>
                </h5>
                <button onClick={() => addApiItem(item.fields)}>+</button>
                
             </div>
              <div className="custom_weight_add">
              Custom serving size
                <input
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomWeight(parseInt(e.currentTarget.value))
                  }
                />
                
                <button onClick={() => customAdd(item.fields, customWeight)}>+</button>
              </div>
            </div>
          ) : null
        )}
      </div>
    </>
  );
};
