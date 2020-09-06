import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInUserSettingsContext } from '../Context/Context';

export const History:React.FC = () => {

  const {loggedInuserSettings} = useContext(LoggedInUserSettingsContext);

  return (
    <div>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <div>
        {/* {loggedInuserSettings.usersHistory.map((day:any, index:number)=>(
          <>
            <h3></h3>
            <div>{day.map((item:any, index2:number)=>(
              <h5>{item.item_name}</h5>
            ))}
            </div>
          </>
        ))} */}
      </div>
      <button onClick={()=>console.log(loggedInuserSettings)}></button>
    </div>
  )
};
