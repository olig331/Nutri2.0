import React,{useState} from 'react';
import {BsChevronDoubleDown, BsChevronDoubleUp} from 'react-icons/bs';

interface passedFuncs  {
  addApiItemFromSearch: (item:responseItemsFields | CustomAddObj) => void;
  calcCustomWeightAdditions:(item: responseItemsFields | CustomAddObj, weight:number) => void;
  customResults: CustomAddObj[] | undefined;
}

export const AddACustomFood:React.FC<passedFuncs> = ({addApiItemFromSearch, calcCustomWeightAdditions, customResults}) => {

  //State
  const [filteredResults, setFilterdResults] = useState<any>();
  const [CustomWeight, setCustomWeight] = useState<number>(0);
  const [showCustomFoodAdditions, setshowCustomFoodAdditions,] = useState<boolean>(false);

  const realTimeSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedList = customResults?.filter((item:any) => {
      return (
        item.item_name
          .toLowerCase()
          .search(e.currentTarget.value.toLowerCase()) !== -1
      );
    });
    //console.log(updatedList);
    setFilterdResults(updatedList);
  };


  const toggleShowCustomFoodAdditions = (): void => {
    showCustomFoodAdditions
      ? setshowCustomFoodAdditions(false)
      : setshowCustomFoodAdditions(true);
  };

  return (
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
              <ol>
                {filteredResults !== undefined
                  ? filteredResults.map((item: CustomAddObj, index: number) => (
                      <div key={index}>
                        <div className="top_section">
                          <li key={index}>
                            {item.item_name}{" "}
                            <span>
                              ({item.nf_calories}Kcal | per
                              {item.nf_serving_weight_grams}g)
                            </span>
                          </li>
                          <button onClick={() => addApiItemFromSearch(item)}>
                            +
                          </button>
                        </div>

                        <div className="custom_weight_add">
                          Custom serving size
                          <input
                            type="number"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setCustomWeight(parseInt(e.currentTarget.value))
                            }
                          />
                          <button
                            onClick={() =>
                              calcCustomWeightAdditions(item, CustomWeight)
                            }
                          >
                            {"+"}
                          </button>
                        </div>
                      </div>
                    ))
                  : customResults?.map((item: any, index: number) => (
                      <div key={index}>
                        <div className="top_section">
                          <li key={index}>
                            {item.item_name}{" "}
                            <span>
                              ({item.nf_calories}Kcal | per
                              {item.nf_serving_weight_grams}g)
                            </span>
                          </li>
                          <button onClick={() => addApiItemFromSearch(item)}>
                            +
                          </button>
                        </div>

                        <div className="custom_weight_add">
                          Custom serving size
                          <input
                            type="number"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setCustomWeight(parseInt(e.currentTarget.value))
                            }
                          />
                          <button
                            onClick={() =>
                              calcCustomWeightAdditions(item, CustomWeight)
                            }
                          >
                            {"+"}
                          </button>
                        </div>
                      </div>
                    ))}
              </ol>
            </>
          ) : null}
        </div>
  );
};
