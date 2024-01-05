/** @format */

import {Button} from 'antd';
import React from 'react';

const ButtonComponent = ({size, styleButton, styleTextButton, textbutton, disabled, ...rests}) => {
   return (
      <Button
         disabled={disabled}
         style={{
            ...styleButton,
            background: disabled ? '#ccc' : styleButton.background,
         }}
         size={size}
         {...rests}
      >
         <span style={styleTextButton}>{textbutton}</span>
      </Button>
   );
};

export default ButtonComponent;
