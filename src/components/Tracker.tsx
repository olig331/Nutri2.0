import React, { useState } from 'react';
import { Search } from './Search';
import { Stats } from './Stats';

export const Tracker: React.FC = () => {

  const [dailyFood, setdailyFood] = useState<responseItemsFields[]>([]);
  

  const addItemFromSearch = (item: responseItemsFields): void => {
    setdailyFood(dailyFood => dailyFood.concat(item));
    console.log(dailyFood);
  };

  const removeItem = (indexOfItem: number): void => {
    let dailyFoodCopy = [...dailyFood];
    if (indexOfItem === 0) {
      dailyFoodCopy.splice(indexOfItem, indexOfItem + 1);
    } else {
      dailyFoodCopy.splice(indexOfItem, indexOfItem);
    }
    setdailyFood(dailyFoodCopy);
  };



  return (
    <>
      <Search
        addItem={addItemFromSearch}
      />
      <div>
        {dailyFood.map((x: any, i: number) => (
          <li key={i}>{i + 1}. {x.item_name}<button onClick={() => removeItem(i)}>X</button></li>
        ))}
      </div>
      <Stats
        dailyFood={dailyFood}
      />
    </>
  );
};
