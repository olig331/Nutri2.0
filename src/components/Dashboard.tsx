import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IsLoggedContext } from '../Context/Context';

interface passesFunc {
  toggleRender: () => void
}

export const Dashboard: React.FC<passesFunc> = ({ toggleRender }) => {

  const [showPopUp, setshowpopUp] = useState<Boolean>(false);
  const { isLogged, setisLogged } = useContext(IsLoggedContext);

  const togglePopUp = () => {
    showPopUp ? setshowpopUp(false) : setshowpopUp(true);
  }

  return (
    <div>
      <Link to="/tracker">
        <div onClick={toggleRender}>Tracker</div>
      </Link>
      <Link to="/history">
        <div onClick={toggleRender}>History</div>
      </Link>
      <Link to="/settings">
        <div onClick={toggleRender}>Settings</div>
      </Link>
       <div onClick={togglePopUp}>Change User
        {showPopUp
            ? (
              <>
                <h5>Changing User will log you out. Are you sure you wish to continue?</h5>
                  <Link to="/select=user">
                    <button onClick={()=>{setisLogged(false)}}>Log Out </button>
                  </Link>
                <button onClick={togglePopUp}>Go Back</button>
              </>
            )
            : null
          }
        </div>
    </div>
  );
}; 
