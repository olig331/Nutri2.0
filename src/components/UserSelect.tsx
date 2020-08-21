import React, { useContext } from 'react';
import { IsLoggedContext } from '../Context/Context';

export const UserSelect: React.FC = () => {

  const localStorageArray = JSON.parse(localStorage.getItem("userArray")!)
  const { isLogged, setisLogged } = useContext(IsLoggedContext);

  const toggleIsLogged = () => {
    setisLogged(true);
  };

  return (
    <>
      {localStorageArray !== null
        ? localStorageArray.map((user: UsersType, index: number) => (
          <>
            <div style={{ border: "1px solid black", borderRadius: "50%", width: "100px", height: "100px" }}></div>
            <h5>{user.userName}</h5>
            <button onClick={toggleIsLogged}>Log In</button>
          </>

        )) : ""}
      <button>Create New User</button>
    </>
  );
};
