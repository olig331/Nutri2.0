import React, { useContext } from 'react'
import { LoggedInUserSettingsContext } from '../Context/Context';

interface passedProps {
  dailyFood: any[]
}

export const Stats: React.FC<passedProps> = ({ dailyFood }) => {

  const { loggedInUserSettings, setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);

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
    return (total / 2500) * 100;
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


  return (
    <div>
      <>
        <h5>Calories: {Math.round(getNutrientTotal("nf_calories"))} - {Math.round(usersCalculatedIntake())} KCal</h5>
        <ProgressBar percent={getNutrientPercent("nf_calories")} />
      </>
      <>
        <h5>Protein: {Math.round(getNutrientTotal("nf_protein"))}g - {Math.round((usersCalculatedIntake() * 0.4) / 4)}g</h5>
        <ProgressBar percent={getNutrientPercent("nf_protein")} />
      </>
      <>
        <h5>Carbohydrates: {Math.round(getNutrientTotal("nf_total_carbohydrate"))}g - {Math.round((usersCalculatedIntake() * 0.3) / 4)}g </h5>
        <ProgressBar percent={getNutrientPercent("nf_total_carbohydrate")} />
      </>
      <>
        <h5>Fat: {Math.round(getNutrientTotal("nf_total_fat"))}g - {Math.round((usersCalculatedIntake() * 0.3) / 9)}g</h5>
        <ProgressBar percent={getNutrientPercent("nf_total_fat")} />
      </>
      <>
        <h5>Saturated Fat: {Math.round(getNutrientTotal("nf_saturated_fat"))}g - {Math.round((usersCalculatedIntake() * 0.1) / 9)}g</h5>
        <ProgressBar percent={getNutrientPercent("nf_saturated_fat")} />
      </>
      <>
        <h5>Sugars: {Math.round(getNutrientTotal("nf_sugars"))}g - {Math.round((usersCalculatedIntake() * 0.15) / 4)}g</h5>
        <ProgressBar percent={getNutrientPercent("nf_sugars")} />
      </>
    </div>
  );
};


