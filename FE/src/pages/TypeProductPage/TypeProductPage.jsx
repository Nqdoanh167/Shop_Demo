/** @format */

import React, {useEffect, useRef, useState} from 'react';

import {Col, Pagination, Row} from 'antd';
import {WrapperNavbar, WrapperProducts} from './style';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import {useLocation} from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';
import {useSelector} from 'react-redux';
import {useDebounce} from '../../hooks/useDebounce';
export default function TypeProductPage() {
   const searchProduct = useSelector((state) => state?.product?.search);
   const searchDebounce = useDebounce(searchProduct, 500);
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [panigate, setPanigate] = useState({
      page: 0,
      limit: 10,
      total: 1,
   });
   const newProducts = useRef([]);
   const {state} = useLocation();
   const fetchProductType = async (type, page, limit) => {
      setLoading(true);
      const res = await ProductService.getProductType(type, page, limit);
      if (res.status === 'OK') {
         setProducts(res?.data);
         newProducts.current = res?.data;
         setPanigate({...panigate, total: res?.total});
      }
      setLoading(false);
   };
   useEffect(() => {
      if (state) {
         fetchProductType(state, panigate.page, panigate.limit);
      }
   }, [state, panigate.page, panigate.limit]);
   const onChange = (current, pageSize) => {
      setPanigate({...panigate, page: current - 1, limit: pageSize});
   };
   console.log('panigate', panigate);
   useEffect(() => {
      if (searchDebounce) {
         const res = newProducts.current?.filter((pro) =>
            pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase()),
         );
         setProducts(res);
      } else setProducts(newProducts.current);
   }, [searchDebounce]);
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
                  <Pagination
                     defaultCurrent={panigate?.page + 1}
                     total={panigate?.total}
                     style={{textAlign: 'center', marginTop: '10px'}}
                     onChange={onChange}
                  />
               </Col>
            </Row>
         </div>
      </Loading>
   );
}
