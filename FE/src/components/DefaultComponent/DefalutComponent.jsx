/** @format */

import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';

export default function DefalutComponent({children}) {
   return (
      <div>
         <HeaderComponent />
         {children}
      </div>
   );
}
