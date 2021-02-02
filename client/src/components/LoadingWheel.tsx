import React from 'react';
import '../style/loadingWheel.css';

interface passedProps{
   width: string, 
   height: string
}

export const LoadingWheel: React.FC<passedProps> = ({width, height}) => {
   return(
      <div 
         className="loader"
         style={{width:`${width}`, height: `${height}`}}>

      </div>
   )
}