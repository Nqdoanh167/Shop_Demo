/** @format */

import React from 'react';
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

export default function HomePage() {
   const arr = ['TV', 'Tu Lanh', 'Lap top'];
   const fetchProductAll = async () => {
      const res = await ProductService.getAllProduct();
      return res;
   };
   const {isLoading, data: products} = useQuery(['products'], fetchProductAll, {retry: 3, retryDelay: 1000});
   console.log('data', products);
   return (
      <>
         <div style={{padding: '0 120px'}}>
            <WrapperTypeProduct>
               {arr.map((item) => (
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
                  textbutton='Xem thêm'
                  type='outline'
                  styleButton={{
                     border: '1px solid rgb(11,116,229)',
                     color: 'rgb(11,116,229)',
                     width: '240px',
                     height: '28px',
                     borderRadius: '4px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}
               />
            </div>
            <NavbarComponent />
         </div>
      </>
   );
}
