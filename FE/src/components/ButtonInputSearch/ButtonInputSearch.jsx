/** @format */

import React from 'react';
import {SearchOutlined} from '@ant-design/icons';
export default function ButtonInputSearch(props) {
   const {textButton} = props;
   return (
      <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
         <SearchOutlined />
         <span style={{fontSize: '14px'}}>{textButton}</span>
      </div>
   );
}
