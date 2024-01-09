/** @format */

import React from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import {useNavigate, useParams} from 'react-router-dom';

export default function ProductDetailsPage() {
   const {id} = useParams();
   const navigate = useNavigate();
   return (
      <div style={{padding: '0 120px', background: '#efefef'}}>
         <span>
            <b onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
               Trang chủ
            </b>{' '}
            - Chi tiết sản phẩm
         </span>
         <ProductDetailsComponent idProduct={id} />
      </div>
   );
}
