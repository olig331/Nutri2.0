type responseItemsFields = {
  brand_name: string;
  item_id: string;
  item_name: string;
  nf_calories: number;
  nf_protein: number | null;
  nf_saturated_fat: number | null;
  nf_serving_size_qty: number | null;
  nf_serving_size_unit: string | null;
  nf_serving_weight_grams: string | null;
  nf_sugars: number | null;
  nf_total_carbohydrate: number | null;
  nf_total_fat: number | null;
};

type responseItems = {
  _id: string;
  _index: string;
  _score: number;
  _type: string;
  fields: responseItemsFields;
};

type gdaObj = {
  calories: number;
  sugar: number;
  carbohydrates: number;
  protein: number;
  saturatedFat: number;
  fat: number;
};

type UserInfo = {
  gender: string;
  age: number;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  goal: string;
  activityLevel: string;
};

type UsersType = {
  userName: string;
  userPicture: string;
  password: string;
  email: string;
  usersPersonalSettings: {
    gender: string;
    age: number;
    weight: number;
    weightUnit: string;
    height: number;
    heightUnit: string;
    goal: string;
    activityLevel: string;
  };
  usersDailyFood: any[];
  usersHistory: any[];
};

type UsersDBType = {
  userName: string;
  userPicture: string;
  usersPersonalSettings: {
    gender: string;
    age: number;
    weight: number;
    weightUnit: string;
    height: number;
    heightUnit: string;
    goal: string;
    activityLevel: string;
  };
  __v: number;
  _id: string;
  usersDailyFood: any[];
  usersHistory: any[];
};

type PrivateRouteType = {
  component: any;
  authed: any;
};

type CustomAddObj = {
  item_name: string,
  nf_serving_weight_grams:  number | undefined,
  nf_calories: number | undefined,
  nf_protein: number | undefined,
  nf_total_carbohydrate: number | undefined,
  nf_total_fat: number | undefined,
  nf_saturated_fat:number | undefined,
  nf_sugars: number | undefined
}

type CustomAddObjKeySafe = {[key:string]:string | number | undefined}

// type CustomAddObj = {
//   name: string,
//   [weight: string]: number | undefined,
//   [cals: string]: number | undefined,
//   [protein: string]: number | undefined,
//   [carbs: string]: number | undefined,
//   [fat: string]: number | undefined,
//   [satFat: string]: number | undefined,
//   sugar: string: number | undefined,
// };
