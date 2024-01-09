/** @format */

import React, {useEffect, useRef, useState} from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import {WrapperButtonMore, WrapperProducts, WrapperTypeProduct} from './styled';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/images/slider1.webp';
import slider2 from '../../assets/images/slider2.webp';
import slider3 from '../../assets/images/slider3.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import {useQuery} from 'react-query';
import * as ProductService from '../../services/ProductService';
import {useSelector} from 'react-redux';
import {useDebounce} from '../../hooks/useDebounce';
import Loading from '../../components/LoadingComponent/Loading';
export default function HomePage() {
   const searchProduct = useSelector((state) => state?.product?.search);
   const searchDebounce = useDebounce(searchProduct, 500);
   const [limit, setLimit] = useState(6);
   const [typeProducts, setTypeProducts] = useState([]);
   const refSearch = useRef();
   const fetchProductAll = async (context) => {
      const limit = context?.queryKey && context?.queryKey[1];
      const search = context?.queryKey && context?.queryKey[2];
      const res = await ProductService.getAllProduct(search, Number(limit));
      return res;
   };

   useEffect(() => {
      if (refSearch.current) {
         fetchProductAll(searchDebounce);
      }
      refSearch.current = true;
   }, [searchDebounce]);
   const {isLoading, data: products} = useQuery(['products', limit, searchDebounce], fetchProductAll, {
      retry: 3,
      retryDelay: 1000,
   });

   const fetchAllTypeProduct = async () => {
      const res = await ProductService.getAllTypeProduct();
      if (res?.status === 'OK') {
         setTypeProducts(res?.data);
      }
   };
   useEffect(() => {
      fetchAllTypeProduct();
   }, []);
   return (
      <Loading isLoading={isLoading}>
         <div style={{padding: '0 120px'}}>
            <WrapperTypeProduct>
               {typeProducts.map((item) => (
                  <TypeProduct name={item} key={item} />
               ))}
            </WrapperTypeProduct>
         </div>
         <div id='container' style={{backgroundColor: '#efefef', padding: '0 120px'}}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
            <WrapperProducts>
               {products?.data?.map((product) => {
                  return (
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
                  );
               })}
            </WrapperProducts>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
               <WrapperButtonMore
                  textbutton={'Xem thêm'}
                  type='outline'
                  styleButton={{
                     border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                     color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                     width: '240px',
                     height: '38px',
                     borderRadius: '4px',
                  }}
                  disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                  styleTextButton={{fontWeight: 500, color: products?.total === products?.data?.length && '#fff'}}
                  onClick={() => setLimit((prev) => prev + 6)}
               />
            </div>
            <NavbarComponent />
         </div>
      </Loading>
   );
}
