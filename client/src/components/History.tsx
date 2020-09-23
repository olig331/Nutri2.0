import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isConstructorDeclaration } from 'typescript';
import { LoggedInUserSettingsContext, LoggedInIDContext } from '../Context/Context';
import { UserInfo } from './UserInfo';
import { RiDashboardFill } from 'react-icons/ri';
import { Stats } from './Stats';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

export const History: React.FC = () => {



  // Running the function when the app Renders
  useEffect(() => {
    pullHistoryFromDB()
  }, []);

  //CONTEXT
  const { loggedInID } = useContext(LoggedInIDContext);
  const { loggedInuserSettings } = useContext(LoggedInUserSettingsContext);

  //STATE
  const [dbhistory, setdbhistory] = useState<any[][]>([])
  const [historyCount, sethistoryCount] = useState<number>(0) //TO ACCESS INDIVIDUAL DAY OF HISTORY &&  FOR ARROW BUTTONS
  const [ready, setready] = useState<boolean>(false);

  // Pulls the users Current history from the Database this will be upToDate from the functions already run on the Dashboard on sign in 
  const pullHistoryFromDB = async () => {
    const response = await fetch(`/history?userId=${loggedInID}`, {
      method: 'GET'
    })
    const data = await response.json()
    setdbhistory(data);
    setready(true)
    console.log("this is data from function")
    console.log(data)
  }

  useEffect(() => {
    console.log("dbhistory useEffect Running ")
    sethistoryCount(dbhistory.length - 1)
  }, [dbhistory])


  const renderHistoryPerDay = (index: any) => {
    console.log(index)
    return (
      <div>
        <h3 style={{color:"slateblue"}}>{index[0]}</h3>
        {index.slice(1).map((x: any, i: number) => (
          <h5 key={i}>{i +1}{x.item_name}Kcal</h5>
        ))}
      </div>
    )
  }


  return (
    <div className="history_parent">
      <div className="user_info"> <UserInfo /></div>
      <Link to="/dashboard">
        <div
          className="dashboard_button">
          <RiDashboardFill />
        </div>
      </Link>
      <div className="food_history_container">
        <div className="food_history">
          <div
            style={historyCount === 0 || dbhistory === [] ? { opacity: "0", pointerEvents:"none" } : { opacity: "1" }}
            className="history_arrow"
            onClick={() => sethistoryCount(historyCount - 1)}>
            <GoChevronLeft />
          </div>

          <div>
            {ready && dbhistory.length >= 1
              ? renderHistoryPerDay(dbhistory[historyCount])
              : ""
            }
          </div>
          <div
            style={historyCount === dbhistory.length - 1 ? { opacity: "0", pointerEvents:"none" } : { opacity: "1" }}
            className="history_arrow"
            onClick={() => sethistoryCount(historyCount + 1)}>
            <GoChevronRight />
          </div>
        </div>
      </div>
      {dbhistory[historyCount] === undefined ? null :
        <Stats
          dailyFood={dbhistory[historyCount]}
        />
      }
    </div>

  )
};


