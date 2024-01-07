/** @format */

import {Modal} from 'antd';
import React from 'react';

export default function ModalComponent({title = 'Modal', isOpen = false, children, ...rests}) {
   return (
      <Modal title={title} open={isOpen} {...rests}>
         {children}
      </Modal>
   );
}
