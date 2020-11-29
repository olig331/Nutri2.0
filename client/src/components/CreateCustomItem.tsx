import React,{useState, useContext, useEffect} from 'react'
import { LoggedInIDContext, LoggedInUserSettingsContext } from '../Context/Context';
import {BsChevronDoubleUp, BsChevronDoubleDown} from 'react-icons/bs';

export const CreateCustomItem:React.FC = () => {

  const defaultCustomAddVals: CustomAddObj = {
    item_name: "",
    nf_serving_weight_grams: undefined,
    nf_calories: undefined,
    nf_protein: undefined,
    nf_total_carbohydrate: undefined,
    nf_total_fat: undefined,
    nf_saturated_fat: undefined,
    nf_sugars: undefined,
  };

  const {loggedInID} = useContext(LoggedInIDContext);
  const {loggedInUserSettings} = useContext(LoggedInUserSettingsContext);

  const [showcustomAdd, setshowcustomAdd] = useState<boolean>(false);
  const [customResults, setcustomResults] = useState<CustomAddObj[]>();
  const [itemAddedResMessage, setitemAddedResMessage] = useState<string>("");
  const [customAddVals, setcustomAddVals] = useState<CustomAddObj>({
       ...defaultCustomAddVals,
  });

  useEffect(() => {
    setcustomResults(loggedInUserSettings.usersCustomFood);
  }, []);

  const refetchCustomAdds = async () => {
    const response = await fetch(
      `http://localhost:5000/fetchCustomAdds?userId=${loggedInID}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    console.log("this is refetch data V");
    console.log(data);
    setcustomResults(data);
  };

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

  const toggleCustomAdd = (): void => {
    showcustomAdd ? setshowcustomAdd(false) : setshowcustomAdd(true);
  };

  const handleCustomFoodOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ): void => {
    var copy: any = { ...customAddVals };
    if (fieldName !== "item_name") {
      copy[fieldName] = parseInt(e.currentTarget.value);
    } else {
      copy[fieldName] = e.currentTarget.value;
    }
    setcustomAddVals(copy);
  };

  return (  
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
                  name="item_name"
                  placeholder="Name"
                  value={customAddVals.item_name}
                  onChange={(e) => handleCustomFoodOnChange(e, "item_name")}
                  required
                />
                <input
                  type="number"
                  name="nf_serving_weight_grams"
                  placeholder="Weight in grams"
                  value={
                    customAddVals.nf_serving_weight_grams !== undefined
                      ? customAddVals.nf_serving_weight_grams
                      : ""
                  }
                  onChange={(e) =>
                    handleCustomFoodOnChange(e, "nf_serving_weight_grams")
                  }
                  required
                />
                <input
                  type="number"
                  name="nf_calories"
                  placeholder="Calories"
                  value={
                    customAddVals.nf_calories !== undefined
                      ? customAddVals.nf_calories
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "nf_calories")}
                  required
                />
                <input
                  type="number"
                  name="nf_protein"
                  placeholder="Protein"
                  value={
                    customAddVals.nf_protein !== undefined
                      ? customAddVals.nf_protein
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "nf_protein")}
                  required
                />
                <input
                  type="number"
                  name="nf_total_carbohydrate"
                  placeholder="Carbohydrates"
                  value={
                    customAddVals.nf_total_carbohydrate !== undefined
                      ? customAddVals.nf_total_carbohydrate
                      : ""
                  }
                  onChange={(e) =>
                    handleCustomFoodOnChange(e, "nf_total_carbohydrate")
                  }
                  required
                />
                <input
                  type="number"
                  name="nf_total_fat"
                  placeholder="Fat"
                  value={
                    customAddVals.nf_total_fat !== undefined
                      ? customAddVals.nf_total_fat
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "nf_total_fat")}
                  required
                />
                <input
                  type="number"
                  name="nf_saturated_fat"
                  placeholder="Saturated Fat"
                  value={
                    customAddVals.nf_saturated_fat !== undefined
                      ? customAddVals.nf_saturated_fat
                      : ""
                  }
                  onChange={(e) =>
                    handleCustomFoodOnChange(e, "nf_saturated_fat")
                  }
                  required
                />
                <input
                  type="number"
                  name="nf_sugars"
                  placeholder="Sugar"
                  value={
                    customAddVals.nf_sugars !== undefined
                      ? customAddVals.nf_sugars
                      : ""
                  }
                  onChange={(e) => handleCustomFoodOnChange(e, "nf_sugars")}
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
  )
}
