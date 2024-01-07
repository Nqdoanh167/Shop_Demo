/** @format */

import {Drawer} from 'antd';
import React, {useState} from 'react';

export default function DrawerComponent({title = 'Drawer', placement = 'right', isOpen = false, children, ...rests}) {
   return (
      <>
         <Drawer title={title} placement={placement} open={isOpen} {...rests}>
            {children}
         </Drawer>
      </>
   );
}
