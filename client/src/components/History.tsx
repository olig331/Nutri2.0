import React, { useContext,useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext, LoggedInIDContext } from '../Context/Context';


export const History:React.FC = () => {

  const {loggedInuserSettings, setloggedInUserSettings} = useContext(LoggedInUserSettingsContext);
  const [dbhistory, setdbhistory] = useState<any[]>([])

  const {loggedInID, setloggedInID} = useContext(LoggedInIDContext);

  // Pulls the users Current history from the Database this will be upToDate from the functions already run on the Dashboard on sign in 
  const pullHistoryFromDB = async () =>{
    const response = await fetch(`/history?userId=${loggedInID}`, {
      method: 'GET'
    })
    const data = await response.json()
    console.log(await data)
    setdbhistory([...dbhistory].concat(data));
  }

  // Running the function when the app Renders
  useEffect(()=>{
    pullHistoryFromDB()
  },[])


  return (
    <div>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <div>
        {/* {dbhistory.map((x, i)=> x.map((y:any)=>(
          <div><h3>{y.item_name}</h3></div>
        ))(
          
        ))} */}
      </div>

      
        <button onClick={()=>{console.log(loggedInuserSettings); console.log(loggedInID)}}>Logged in from dash</button>
    
     
      <button onClick={()=> console.log(dbhistory)}></button>
    </div>

  )
};
