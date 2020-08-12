import React from 'react'

interface passedProps {
  dailyFood: any[]
}

export const Stats: React.FC<passedProps> = ({ dailyFood }) => {

  const ProgressBar = (props: any) => {
    return (
      <div className="progress_bar">
        <Filler percent={props.percent} />
      </div>
    );
  };

  const Filler = (props: any) => {
    return (
      <div className="filler" style={props.percent < 100
        ? { width: `${props.percent}%` }
        : { width: `100%`, background: 'red' }}>

      </div>
    );
  };

  const getNutrientPercent = (nutrientName: any) => {
    let total: number = 0;
    dailyFood.map((x) => {
      x.hasOwnProperty(nutrientName)
        ? total += x[nutrientName]
        : console.log("Property Not Found")
    })
    return (total / 2500) * 100;
  };

  const getNutrientTotal = (nutrientName: any) => {
    let total: number = 0;
    dailyFood.map((x) => {
      x.hasOwnProperty(nutrientName)
        ? total += x[nutrientName]
        : console.log("Property Not Found")
    });
    return total;
  };


  return (
    <div>
      <>
        <h5>Calories: {getNutrientTotal("nf_calories")}</h5>
        <ProgressBar percent={getNutrientPercent("nf_calories")} />
      </>
      <>
        <h5>Protein: {getNutrientTotal("nf_protein")}</h5>
        <ProgressBar percent={getNutrientPercent("nf_protein")} />
      </>
      <>
        <h5>Saturated Fat: {getNutrientTotal("nf_saturated_fat")}</h5>
        <ProgressBar percent={getNutrientPercent("nf_saturated_fat")} />
      </>
      <>
        <h5>Fat: {getNutrientTotal("nf_total_fat")}</h5>
        <ProgressBar percent={getNutrientPercent("nf_total_fat")} />
      </>
      <>
        <h5>Sugars: {getNutrientTotal("nf_sugars")}</h5>
        <ProgressBar percent={getNutrientPercent("nf_sugars")} />
      </>
      <>
        <h5>Carbohydrates: {getNutrientTotal("nf_total_carbohydrate")}</h5>
        <ProgressBar percent={getNutrientPercent("nf_total_carbohydrate")} />
      </>
    </div>
  );
};


