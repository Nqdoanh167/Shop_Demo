/** @format */

import React, {useEffect, useState} from 'react';

import {Col, Pagination, Row} from 'antd';
import {WrapperNavbar, WrapperProducts} from './style';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import {useLocation} from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';
export default function TypeProductPage() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(false);
   const {state} = useLocation();
   const fetchProductType = async (type) => {
      setLoading(true);
      const res = await ProductService.getProductType(type);
      if (res.status === 'OK') {
         setProducts(res?.data);
      }
      setLoading(false);
   };
   useEffect(() => {
      if (state) fetchProductType(state);
   }, [state]);
   return (
      <Loading isLoading={loading}>
         <div style={{padding: '0 120px', background: '#efefef'}}>
            <Row style={{flexWrap: 'nowrap', paddingTop: '10px'}}>
               <WrapperNavbar span={4}>
                  <NavbarComponent />
               </WrapperNavbar>
               <Col span={20}>
                  <WrapperProducts>
                     {products?.map((product) => (
                        <CardComponent
                           key={product._id}
                           countInStock={product.countInStock}
                           description={product.description}
                           image={product.image}
                           name={product.name}
                           price={product.price}
                           rating={product.rating}
                           type={product.type}
                           selled={product.selled}
                           discount={product.discount}
                           id={product._id}
                        />
                     ))}
                  </WrapperProducts>
                  <Pagination defaultCurrent={1} total={50} style={{textAlign: 'center', marginTop: '10px'}} />
               </Col>
            </Row>
         </div>
      </Loading>
   );
}
