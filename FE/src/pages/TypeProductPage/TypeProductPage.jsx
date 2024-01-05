/** @format */

import React from 'react';

import {Col, Pagination, Row} from 'antd';
import {WrapperNavbar, WrapperProducts} from './style';
import NavbarComponent from '../../components/NavBarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
export default function TypeProductPage() {
   return (
      <div style={{padding: '0 120px', background: '#efefef'}}>
         <Row style={{flexWrap: 'nowrap', paddingTop: '10px'}}>
            <WrapperNavbar span={4}>
               <NavbarComponent />
            </WrapperNavbar>
            <Col span={20}>
               <WrapperProducts>
                  <CardComponent />
                  <CardComponent />
                  <CardComponent />
                  <CardComponent />
                  <CardComponent />
                  <CardComponent />
                  <CardComponent />
               </WrapperProducts>
               <Pagination defaultCurrent={1} total={50} style={{textAlign: 'center', marginTop: '10px'}} />
            </Col>
         </Row>
      </div>
   );
}
