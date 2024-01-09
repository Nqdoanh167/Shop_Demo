/** @format */

import React from 'react';
import {
   StyleNameProduct,
   WrapperCardStyle,
   WrapperDiscountText,
   WrapperPriceText,
   WrapperReportText,
   WrapperStyleTextSell,
} from './style';
import {StarFilled} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';
import {useNavigate} from 'react-router-dom';
import {convertPrice} from '../../utils';

export default function CardComponent(props) {
   const {countInStock, description, image, name, price, rating, type, discount, selled, id} = props;
   const navigate = useNavigate();
   const handleDetailsProduct = (id) => {
      navigate(`/product-details/${id}`);
   };
   return (
      <WrapperCardStyle
         hoverable
         style={{width: 236, height: 320}}
         bodyStyle={{padding: '10px'}}
         cover={<img alt='' src={image} />}
         onClick={() => handleDetailsProduct(id)}
      >
         <img
            src={logo}
            alt='logo'
            style={{
               width: '68px',
               height: '16px',
               position: 'absolute',
               top: -1,
               left: -1,
               borderTopLeftRadius: '3px',
            }}
         />
         <StyleNameProduct>{name}</StyleNameProduct>
         <WrapperReportText>
            <span style={{marginRight: '4px'}}>
               <span>{rating} </span>
               <StarFilled style={{fontSize: '12px ', color: 'rgb(253,216,54)'}} />
               <StarFilled style={{fontSize: '12px ', color: 'rgb(253,216,54)'}} />
               <StarFilled style={{fontSize: '12px ', color: 'rgb(253,216,54)'}} />
            </span>
            <WrapperStyleTextSell>| Da ban {selled || 1000}+</WrapperStyleTextSell>
         </WrapperReportText>
         <WrapperPriceText>
            <span style={{marginRight: '8px'}}>{convertPrice(price)}</span>
            <WrapperDiscountText> - {discount || 5} %</WrapperDiscountText>
         </WrapperPriceText>
      </WrapperCardStyle>
   );
}
