import React, { useContext } from 'react';
import { LoggedInUserSettingsContext } from '../Context/Context';

interface passedProps {
  dailyFood: any[]
}

export const Stats: React.FC<passedProps> = ({ dailyFood }) => {

  const { loggedInUserSettings } = useContext(LoggedInUserSettingsContext);

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
    dailyFood.slice(1).map((x, i) => {
      x.hasOwnProperty(nutrientName)
        ? total += x[nutrientName]
        : console.log("Property Not Found")
    })
    return (total / helperFunc(nutrientName)) * 100;
  };

  const getNutrientTotal = (nutrientName: any) => {
    let total: number = 0;
    dailyFood.slice(1).map((x, i) => {
      x.hasOwnProperty(nutrientName)
        ? total += x[nutrientName]
        : console.log("Property Not Found")
    });
    return total;
  };

  const usersCalculatedIntake = () => {
    const copy = { ...loggedInUserSettings };
    const stats = { ...copy.usersPersonalSettings }
    let bmr, cals, heightInCm, weightInKg;
    stats.heightUnit === "inches"
      ? heightInCm = parseInt(stats.height) * 2.54
      : heightInCm = parseInt(stats.height);
    stats.weightUnit === "lbs"
      ? weightInKg = parseInt(stats.weight) / 2.2
      : weightInKg = parseInt(stats.weight);

    if (stats.gender === "male") {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * parseInt(stats.age))
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * parseInt(stats.age))
    }

    cals = Math.floor(stats.activityLevel === "sedatory"
      ? bmr *= 1.2
      : stats.activityLevel === "light"
        ? bmr *= 1.375
        : stats.activityLevel === "medium"
          ? bmr *= 1.55
          : bmr *= 1.725)

    return Math.floor(stats.goal === "lose"
      ? bmr -= (5250 / 7)
      : stats.goal === "gain"
        ? bmr += (5250 / 7)
        : bmr)
  }




  const helperFunc = (name: string) => {
    let multiplier: number = 1
    let divider: number = 1
    if (name === "nf_protein") {
      multiplier = 0.4
      divider = 4
    }
    if (name === "nf_total_carbohydrate") {
      multiplier = 0.3
      divider = 4
    }
    if (name === "nf_total_fat") {
      multiplier = 0.3
      divider = 9
    }
    if (name === "nf_saturated_fat") {
      multiplier = 0.1
      divider = 9
    }
    if (name === "nf_sugars") {
      multiplier = 0.15
      divider = 4
    }

    return Math.round((usersCalculatedIntake() * multiplier) / divider)
  }


  return (
    <>
      <div className="all_stats">
        <>
          <div className="bar">
            <h5>Calories: {Math.round(getNutrientTotal("nf_calories"))} - {helperFunc("calories")} KCal</h5>
            <ProgressBar percent={getNutrientPercent("nf_calories")} />
          </div>
      
         <div className="bar">
            <h5>Protein: {Math.round(getNutrientTotal("nf_protein"))}g - {helperFunc("nf_protein")}g</h5>
            <ProgressBar percent={getNutrientPercent("nf_protein")} />
         </div>
       
          <div className="bar">
            <h5>Carbohydrates: {Math.round(getNutrientTotal("nf_total_carbohydrate"))}g - {helperFunc("nf_total_carbohydrate")}g </h5>
            <ProgressBar percent={getNutrientPercent("nf_total_carbohydrate")} />
          </div>
        
          <div className="bar">
            <h5>Fat: {Math.round(getNutrientTotal("nf_total_fat"))}g - {helperFunc("nf_total_fat")}g</h5>
            <ProgressBar percent={getNutrientPercent("nf_total_fat")} />
          </div>
       
          <div className="bar">
            <h5>Saturated Fat: {Math.round(getNutrientTotal("nf_saturated_fat"))}g - {helperFunc("nf_saturated_fat")}g</h5>
            <ProgressBar percent={getNutrientPercent("nf_saturated_fat")} />
          </div>
       
          <div className="bar">
            <h5>Sugars: {Math.round(getNutrientTotal("nf_sugars"))}g - {helperFunc("nf_sugars")}g</h5>
            <ProgressBar percent={getNutrientPercent("nf_sugars")} />
          </div>
        </>
      </div>
    </>
  );
};


