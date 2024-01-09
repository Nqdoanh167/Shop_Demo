/** @format */

import {Col, Image, Rate, Row} from 'antd';
import React, {useState} from 'react';
import imageProduct from '../../assets/images/test.webp';
import imageProductSmall from '../../assets/images/imagesmall.webp';
import * as ProductService from '../../services/ProductService';
import {
   WrapperAddressProduct,
   WrapperCol,
   WrapperInputNumber,
   WrapperPriceProduct,
   WrapperPriceTextProduct,
   WrapperQualityProduct,
   WrapperStyleColImage,
   WrapperStyleImageSmall,
   WrapperStyleNameProduct,
   WrapperStyleTextSell,
} from './style';
import {StarFilled, PlusOutlined, MinusOutlined} from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import {useQuery} from 'react-query';
import {convertPrice} from '../../utils';
import {useSelector} from 'react-redux';
export default function ProductDetailsComponent({idProduct}) {
   const user = useSelector((state) => state.user);
   const [numProduct, setNumProduct] = useState(1);
   const onChange = () => {};
   const fetchGetDetailsProduct = async () => {
      const res = await ProductService.getDetailsProduct(idProduct);
      return res.data;
   };
   const {isLoading, data: productDetails} = useQuery(['product-details'], fetchGetDetailsProduct, {
      enabled: !!idProduct,
   });
   const handleChangeCount = (type) => {
      if (type === 'increase') {
         setNumProduct(numProduct + 1);
      } else setNumProduct(numProduct - 1);
   };
   return (
      <Row style={{padding: '16px', backgroundColor: '#fff', borderRadius: '4px'}}>
         <WrapperCol span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight: '8px'}}>
            <Image src={productDetails?.image} alt='Image Product' preview={false} />
            <Row style={{paddingTop: '10px', justifyContent: 'space-between'}}>
               <WrapperStyleColImage span={4}>
                  <WrapperStyleImageSmall src={imageProductSmall} alt='Image Small' preview={false} />
               </WrapperStyleColImage>
               <WrapperStyleColImage span={4}>
                  <WrapperStyleImageSmall src={imageProductSmall} alt='Image Small' preview={false} />
               </WrapperStyleColImage>
               <WrapperStyleColImage span={4}>
                  <WrapperStyleImageSmall src={imageProductSmall} alt='Image Small' preview={false} />
               </WrapperStyleColImage>
               <WrapperStyleColImage span={4}>
                  <WrapperStyleImageSmall src={imageProductSmall} alt='Image Small' preview={false} />
               </WrapperStyleColImage>
               <WrapperStyleColImage span={4}>
                  <WrapperStyleImageSmall src={imageProductSmall} alt='Image Small' preview={false} />
               </WrapperStyleColImage>
               <WrapperStyleColImage span={4}>
                  <WrapperStyleImageSmall src={imageProductSmall} alt='Image Small' preview={false} />
               </WrapperStyleColImage>
            </Row>
         </WrapperCol>
         <Col span={14} style={{paddingLeft: '10px'}}>
            <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
            <div>
               <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
               <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
            </div>
            <WrapperPriceProduct>
               <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
               <span>Giao đến </span>
               <span className='address'>{user?.address}</span>
               {' - '}
               <span className='change_address'>Đổi địa chỉ</span>
            </WrapperAddressProduct>
            <div
               style={{
                  margin: '10px 0 20px',
                  padding: '10px 0',
                  borderTop: '1px solid #e5e5e5',
                  borderBottom: '1px solid #e5e5e5',
               }}
            >
               <div style={{marginBottom: '10px'}}>Số lượng </div>
               <WrapperQualityProduct>
                  <button
                     style={{border: 'none', background: 'transparent', cursor: 'pointer'}}
                     onClick={() => handleChangeCount('decrease')}
                  >
                     <MinusOutlined style={{color: '#000', fontSize: '20px'}} />
                  </button>
                  <WrapperInputNumber min={1} max={10} value={numProduct} defaultValue={1} onChange={onChange} />
                  <button
                     style={{border: 'none', background: 'transparent', cursor: 'pointer'}}
                     onClick={() => handleChangeCount('increase')}
                  >
                     <PlusOutlined style={{color: '#000', fontSize: '20px'}} />
                  </button>
               </WrapperQualityProduct>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
               <ButtonComponent
                  size={40}
                  styleButton={{
                     background: 'rgb(255,57,69',
                     height: '48px ',
                     width: '220px',
                     border: 'none',
                     borderRadius: '4px',
                  }}
                  textbutton={'Chọn mua'}
                  styleTextButton={{color: '#fff', fontWeight: '700'}}
               ></ButtonComponent>
               <ButtonComponent
                  size={40}
                  styleButton={{
                     background: '#fff',
                     height: '48px ',
                     width: '220px',
                     border: '1px solid rgb(13,92,182)',
                     borderRadius: '4px',
                  }}
                  textbutton={'Mua trả sau'}
                  styleTextButton={{color: 'rgb(13,92,182', fontSize: '15px'}}
               ></ButtonComponent>
            </div>
         </Col>
      </Row>
   );
}
