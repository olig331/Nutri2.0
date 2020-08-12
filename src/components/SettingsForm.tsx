import React from 'react';


export const SettingsForm: React.FC = () => {

  const ageDropDown = Array.from(Array(100), (_, i: number) => i + 1);

  return (
    <div>
      <form>=
        <label htmlFor="gender">
          Male: 
          <input type="radio" name="gender" value="male" required/>
        </label>
        <label htmlFor="gender">
          Female: 
          <input type="radio" name="gender" value="female" required/>
        </label>
          <br/>
        <label>
          Age:
            <select>
            {ageDropDown.map((x: number) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
          <br/>
        <label>
          Weight:
          <input type="number" required />
              <label htmlFor="kg">
                kg
                <input id="kg" type="radio" name="weight" value="kg" required/>
              </label>
              <label htmlFor="lbs">
                lbs
                <input id="lbs" type="radio" name="weight" value="lbs" required/>
              </label>
        </label>
          <br/>
        <label htmlFor="">
          Height:
          <input type="number" name="height" required/>
            <label htmlFor="cm">
              cm
              <input type="radio" name="height" value="cm" required/>
            </label>
            <label htmlFor="inches">
              Inches
              <input type="radio" name="height" value="inches" required/>
            </label>
        </label>
        <br/>
        <label htmlFor="goal">Goal: {" "}
          <label htmlFor="lose">
            Lose
            <input id="lose" type="radio" name="goal" value="lose" required/>
          </label>
          <label htmlFor="gain">
            Gain
            <input type="radio" id="gain" name="goal" value="gain" required/>
          </label>
          <label htmlFor="maintain">
            Maintain
            <input type="radio" id="maintain" name="goal" value="maintain" required/>
          </label>
        </label>   
      </form>
    </div>
  )
}

