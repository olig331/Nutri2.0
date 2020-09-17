import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isConstructorDeclaration } from 'typescript';
import { LoggedInUserSettingsContext, LoggedInIDContext } from '../Context/Context';
import { UserInfo } from './UserInfo';


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
        <h5>{index[0]}</h5>
        {index.slice(1).map((x:any, i:number)=>(
            <h5 key={i}>{x.item_name} {x.nf_calories}</h5>
        ))}    
      </div>
    )
  }

  return (
    <div>
      <UserInfo />
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>

      {historyCount === 0
        ? null
        : <button
          onClick={() => sethistoryCount(historyCount - 1)}
        >{`<`}
        </button>
      }

      <div>
        {ready && dbhistory.length >=1 
          ? renderHistoryPerDay(dbhistory[historyCount])
          : ""
        }
      </div>

      {historyCount === dbhistory.length - 1
        ? null
        : <button
          onClick={() => sethistoryCount(historyCount + 1)}
        >{`>`}
        </button>
      }

      <button onClick={() => { console.log(loggedInuserSettings); console.log(loggedInID) }}>Logged in from dash</button>


      <button onClick={() => { console.log(dbhistory); console.log(historyCount) }}>history and indez</button>
    </div>

  )
};
