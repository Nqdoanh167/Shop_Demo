/** @format */

import React, {useEffect, useState} from 'react';
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import {Image} from 'antd';
import imageLogo from '../../assets/images/logo-login.png';
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useMutationHook} from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import * as message from '../../components/Message/Message';
import Loading from '../../components/LoadingComponent/Loading';
export default function SignUpPage() {
   const [isShowPassword, setIsShowPassword] = useState(false);
   const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const handleOnChangeEmail = (value) => {
      setEmail(value);
   };
   const handleOnChangePassword = (value) => {
      setPassword(value);
   };
   const handleOnChangeConfirmPassword = (value) => {
      setConfirmPassword(value);
   };
   const navigate = useNavigate();
   const handleNavigateSignIn = () => {
      navigate('/sign-in');
   };
   const mutation = useMutationHook((data) => UserService.signupUser(data));
   const {data, isLoading, isSuccess, isError} = mutation;
   console.log('mutation', mutation);
   useEffect(() => {
      if (isSuccess) {
         message.success();
         handleNavigateSignIn();
      } else if (isError) {
         message.error();
      }
   }, [isSuccess, isError]);
   const handleSignUp = () => {
      mutation.mutate({
         email,
         password,
         confirmPassword,
      });
      console.log('sign-up', email, password, confirmPassword);
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
                     style={{marginBottom: '10px'}}
                     type={isShowPassword ? 'text' : 'password'}
                     value={password}
                     onChange={handleOnChangePassword}
                  />
               </div>
               <div style={{position: 'relative'}}>
                  <span
                     onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                     style={{
                        zIndex: 10,
                        position: 'absolute',
                        top: '11px',
                        right: '8px',
                        fontSize: '14px',
                     }}
                  >
                     {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                  </span>
                  <InputForm
                     placeholder='comfirm password'
                     type={isShowConfirmPassword ? 'text' : 'password'}
                     value={confirmPassword}
                     onChange={handleOnChangeConfirmPassword}
                  />
               </div>
               {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
               <Loading isLoading={isLoading}>
                  <ButtonComponent
                     disabled={!email.length || !password.length || !confirmPassword.length}
                     onClick={handleSignUp}
                     size={40}
                     styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        margin: '26px 0 10px',
                     }}
                     textbutton={'Đăng ký'}
                     styleTextButton={{color: '#fff', fontWeight: '700'}}
                  ></ButtonComponent>
               </Loading>

               <p>
                  Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight>
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
