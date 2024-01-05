/** @format */

import React, {useEffect, useState} from 'react';
import {Badge, Button, Col, Popover} from 'antd';
import {
   WrapperContentPopup,
   WrapperHeader,
   WrapperHeaderAccount,
   WrapperTextHeader,
   WrapperTextHeaderSmall,
} from './style';
import Search from 'antd/es/input/Search';
import {UserOutlined, CaretDownOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import * as UserService from '../../services/UserService';
import {resetUser} from '../../redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';

export default function HeaderComponent() {
   const navigate = useNavigate();
   const user = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const [userName, setUserName] = useState('');
   const [userAvatar, setUserAvatar] = useState('');
   const [loading, setLoading] = useState(false);
   const handleNavigateLogin = () => {
      navigate('/sign-in');
   };
   const handleLogout = async () => {
      setLoading(true);
      await UserService.logoutUser();
      dispatch(resetUser());
      setLoading(false);
   };
   useEffect(() => {
      setLoading(true);
      setUserName(user?.name);
      setUserAvatar(user?.avatar);
      setLoading(false);
   }, [user?.name, user?.avatar]);
   const content = (
      <div>
         <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
         <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
      </div>
   );
   return (
      <div>
         <WrapperHeader>
            <Col span={5}>
               <WrapperTextHeader>LAPTRINHTHATDE</WrapperTextHeader>
            </Col>
            <Col span={13}>
               <Search
                  placeholder='input search text'
                  allowClear
                  enterButton=<ButtonInputSearch textButton={'Tìm kiếm'} />
                  size='large'
                  // onSearch={onSearch}
               />
            </Col>
            <Col span={6} style={{display: 'flex', gap: '54px', alignItems: 'center', justifyContent: 'space-evenly'}}>
               <Loading isLoading={loading}>
                  <WrapperHeaderAccount>
                     {userAvatar ? (
                        <img
                           src={userAvatar}
                           alt='avatar'
                           style={{
                              height: '30px',
                              width: '30px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                           }}
                        />
                     ) : (
                        <UserOutlined style={{fontSize: '30px'}} />
                     )}
                     {user?.access_token ? (
                        <>
                           <Popover content={content} trigger='click'>
                              <div style={{cursor: 'pointer'}}>{userName.length ? userName : user?.email}</div>
                           </Popover>
                        </>
                     ) : (
                        <div>
                           <WrapperTextHeaderSmall onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
                              Đăng nhập/Đăng ký
                           </WrapperTextHeaderSmall>
                           <div>
                              <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                              <CaretDownOutlined />
                           </div>
                        </div>
                     )}
                  </WrapperHeaderAccount>
               </Loading>
               <div>
                  <Badge count={4} size='small'>
                     <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}} />
                  </Badge>
                  <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
               </div>
            </Col>
         </WrapperHeader>
      </div>
   );
}
