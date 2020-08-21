type responseItemsFields = {
  brand_name: string,
  item_id: string,
  item_name: string,
  nf_calories: number,
  nf_protein: number | null,
  nf_saturated_fat: number | null,
  nf_serving_size_qty: number | null,
  nf_serving_size_unit: string | null,
  nf_serving_weight_grams: string | null,
  nf_sugars: number | null,
  nf_total_carbohydrate: number | null,
  nf_total_fat: number | null
};

type responseItems = {
  _id: string,
  _index: string,
  _score: number,
  _type: string,
  fields: responseItemsFields
};

type gdaObj ={
  calories: number,
  sugar: number,
  carbohydrates: number,
  protein: number,
  saturatedFat: number,
  fat: number
}

type UserInfo = {
  gender:string,
  age:number;
  height:number,
  heightUnit:string,
  weight:number,
  weightUnit:string,
  goal:string,
  activityLevel:string,
}


type UsersType = {
  userName: string,
  userPicture: string,
  usersPersonalSettings:{
    gender:string,
    age: number,
    weight:number,
    weightUnit:string,
    height:number,
    heightUnit:string,
    goal:string,
    activityLevel:string  
  }

}