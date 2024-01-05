/** @format */

import {Col, Image, Row} from 'antd';
import React from 'react';
import imageProduct from '../../assets/images/test.webp';
import imageProductSmall from '../../assets/images/imagesmall.webp';
import {
   WrapperAddressProduct,
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
export default function ProductDetailsComponent() {
   const onChange = () => {};
   return (
      <Row style={{padding: '16px', backgroundColor: '#fff', borderRadius: '4px'}}>
         <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight: '8px'}}>
            <Image src={imageProduct} alt='Image Product' preview={false} />
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
         </Col>
         <Col span={14} style={{paddingLeft: '10px'}}>
            <WrapperStyleNameProduct>Sách- Thám tử lừng danh Conan</WrapperStyleNameProduct>
            <div>
               <StarFilled style={{fontSize: '12px', color: 'rgb(253,216,54)'}} />
               <StarFilled style={{fontSize: '12px ', color: 'rgb(253,216,54)'}} />
               <StarFilled style={{fontSize: '12px ', color: 'rgb(253,216,54)'}} />
               <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
            </div>
            <WrapperPriceProduct>
               <WrapperPriceTextProduct>200.000đ</WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
               <span>Giao đến </span>
               <span className='address'>Ha Nam</span>
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
                  <button style={{border: 'none', background: 'transparent'}}>
                     <PlusOutlined style={{color: '#000', fontSize: '20px'}} />
                  </button>
                  <WrapperInputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                  <button style={{border: 'none', background: 'transparent'}}>
                     <MinusOutlined style={{color: '#000', fontSize: '20px'}} />
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
