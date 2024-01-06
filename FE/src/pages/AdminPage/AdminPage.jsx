/** @format */

import {Menu} from 'antd';
import React, {useState} from 'react';
import {AppstoreOutlined, UserOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import {getItem} from '../../utils';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminUser from '../../components/AdminUser/AdminUser';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
export default function AdminPage() {
   const items = [
      getItem('Người dùng', 'users', <UserOutlined />),
      getItem('Sản phẩm', 'products', <AppstoreOutlined />),
      getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
   ];
   const renderPage = (key) => {
      switch (key) {
         case 'users':
            return <AdminUser />;
         case 'products':
            return <AdminProduct />;
         case 'orders':
            return <OrderAdmin />;
         default:
            return <></>;
      }
   };
   const rootSubmenuKeys = ['user', 'product'];
   const [openKeys, setOpenKeys] = useState(['sub1']);
   const [keySelected, setKeySelected] = useState('');

   const onOpenChange = (keys) => {
      const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
      if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
         setOpenKeys(keys);
      } else {
         setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
   };
   const handleOnClick = ({key}) => {
      setKeySelected(key);
      console.log('click');
   };
   return (
      <>
         <HeaderComponent isHiddenSearch isHiddenCart />
         <div style={{display: 'flex'}}>
            <Menu
               mode='inline'
               openKeys={openKeys}
               onOpenChange={onOpenChange}
               style={{
                  width: 256,
                  boxShadow: '1px 1px 2px #ccc',
                  height: '100vh',
               }}
               items={items}
               onClick={handleOnClick}
            />
            <div style={{flex: 1, padding: '15px 0 15px 15px'}}>{renderPage(keySelected)}</div>
         </div>
      </>
   );
}
