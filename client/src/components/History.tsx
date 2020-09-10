import React, { useContext,useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext, LoggedInIDContext } from '../Context/Context';

export const History:React.FC = () => {

  const {loggedInuserSettings} = useContext(LoggedInUserSettingsContext);
  const [dbhistory, setdbhistory] = useState<any[]>([])

  const {loggedInID, setloggedInID} = useContext(LoggedInIDContext);

  const pullHistoryFromDB = async () =>{
    const response = await fetch(`/history?userId=${loggedInID}`, {
      method: 'GET'
    })
    const data = await response.json()
    console.log(await data)
    setdbhistory(data);
  }

  useEffect(()=>{
    pullHistoryFromDB()
  },[])


  return (
    <div>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <div>
        {dbhistory.map((x, i)=>(
          <h3>{x}</h3>
        ))}
      </div>
      <button onClick={()=>console.log(loggedInuserSettings)}></button>
      <button onClick={()=> console.log(dbhistory)}></button>
    </div>
  )
};
