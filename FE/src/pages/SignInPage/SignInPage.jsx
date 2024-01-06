/** @format */

import React, {useEffect, useState} from 'react';
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import {Image} from 'antd';
import imageLogo from '../../assets/images/logo-login.png';
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import * as UserService from '../../services/UserService';
import {useMutationHook} from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import {jwtDecode} from 'jwt-decode';
import {useDispatch} from 'react-redux';
import {updateUser} from '../../redux/slides/userSlide';

export default function SignInPage() {
   const [isShowPassword, setIsShowPassword] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const dispatch = useDispatch();
   const handleOnChangeEmail = (value) => {
      setEmail(value);
   };
   const handleOnChangePassword = (value) => {
      setPassword(value);
   };
   const navigate = useNavigate();
   const mutation = useMutationHook((data) => UserService.loginUser(data));
   const {data, isLoading, isSuccess} = mutation;
   useEffect(() => {
      if (isSuccess) {
         // message.success();
         navigate('/');
         localStorage.setItem('access_token', JSON.stringify(data?.access_token));
         if (data?.access_token) {
            const decoded = jwtDecode(data?.access_token);
            console.log('decoded', decoded);
            if (decoded?.id) {
               handleGetDetailsUser(decoded?.id, data?.access_token);
            }
         }
      }
   }, [isSuccess]);
   const handleGetDetailsUser = async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({...res?.data, access_token: token}));
   };
   const handleNavigateSignUp = () => {
      navigate('/sign-up');
   };
   const handleSignIn = () => {
      mutation.mutate({
         email,
         password,
      });
      console.log('mutation', mutation);
      console.log('sign-up', email, password);
   };
   return (
      <div
         style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.53)',
            height: '100vh',
         }}
      >
         <div
            style={{
               width: '800px',
               height: '445px',
               borderRadius: '6px',
               background: '#fff',
               display: 'flex',
            }}
         >
            <WrapperContainerLeft>
               <h1>Xin chào</h1>
               <p>Đăng nhập vào tài khoản</p>
               <InputForm
                  style={{marginBottom: '10px'}}
                  placeholder='abc@gmail.com'
                  value={email}
                  onChange={handleOnChangeEmail}
               />
               <div style={{position: 'relative'}}>
                  <span
                     onClick={() => setIsShowPassword(!isShowPassword)}
                     style={{
                        zIndex: 10,
                        position: 'absolute',
                        top: '11px',
                        right: '8px',
                        fontSize: '14px',
                     }}
                  >
                     {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                  </span>
                  <InputForm
                     placeholder='password'
                     type={isShowPassword ? 'text' : 'password'}
                     value={password}
                     onChange={handleOnChangePassword}
                  />
               </div>
               {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
               <Loading isLoading={isLoading}>
                  <ButtonComponent
                     onClick={handleSignIn}
                     size={40}
                     disabled={!email.length || !password.length}
                     styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        margin: '26px 0 10px',
                     }}
                     textbutton={'Đăng nhập'}
                     styleTextButton={{color: '#fff', fontWeight: '700'}}
                  ></ButtonComponent>
               </Loading>
               <p>
                  <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
               </p>
               <p>
                  Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight>
               </p>
            </WrapperContainerLeft>
            <WrapperContainerRight>
               <Image src={imageLogo} preview={false} alt='iamge-logo' height='203px' width='203px' />
               <h4>Mua sắm tại LTTD</h4>
            </WrapperContainerRight>
         </div>
      </div>
   );
}
