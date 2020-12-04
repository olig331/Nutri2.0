import React from 'react';
import { useHistory } from 'react-router-dom';
import '../style/signUpComplete.css';

export const SignUpComplete:React.FC = () => {

  const pageHistory = useHistory();
  
  return (
    <div className="signup_complete_container">
      <h1>Thank you for signing up to <span>Nutri !</span></h1>
      <p>you should recieve a confirmation email shortly</p>
      <button onClick={() => pageHistory.replace('/')}>Continue to Log In </button>
    </div>
  )
}
