/** @format */

import {Checkbox, Form, Radio} from 'antd';
import React, {useEffect, useState} from 'react';
import {
   CustomCheckbox,
   Lable,
   WrapperCountOrder,
   WrapperInfo,
   WrapperItemOrder,
   WrapperLeft,
   WrapperListOrder,
   WrapperRadio,
   WrapperRight,
   WrapperStyleHeader,
   WrapperStyleHeaderDilivery,
   WrapperTotal,
} from './style';
import {DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons';

import {WrapperInputNumber} from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
   decreaseAmount,
   increaseAmount,
   removeAllOrderProduct,
   removeOrderProduct,
   selectedOrder,
} from '../../redux/slides/orderSlide';
import {convertPrice} from '../../utils';
import {useMemo} from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import {useMutationHook} from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';

import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import {updateUser} from '../../redux/slides/userSlide';
import {useNavigate} from 'react-router-dom';
import StepComponent from '../../components/StepConponent/StepComponent';

const PaymentPage = () => {
   const order = useSelector((state) => state.order);
   const user = useSelector((state) => state.user);

   const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
   const [delivery, setDelivery] = useState('fast');
   const [payment, setPayment] = useState('later_money');
   const [stateUserDetails, setStateUserDetails] = useState({
      name: '',
      phone: '',
      address: '',
      city: '',
   });
   const navigate = useNavigate();
   const [form] = Form.useForm();

   const dispatch = useDispatch();

   const handleChangeCount = (type, idProduct, limited) => {
      if (type === 'increase') {
         if (!limited) {
            dispatch(increaseAmount({idProduct}));
         }
      } else {
         if (!limited) {
            dispatch(decreaseAmount({idProduct}));
         }
      }
   };

   const handleDeleteOrder = (idProduct) => {
      dispatch(removeOrderProduct({idProduct}));
   };

   useEffect(() => {
      form.setFieldsValue(stateUserDetails);
   }, [form, stateUserDetails]);

   useEffect(() => {
      if (isOpenModalUpdateInfo) {
         setStateUserDetails({
            city: user?.city,
            name: user?.name,
            address: user?.address,
            phone: user?.phone,
         });
      }
   }, [isOpenModalUpdateInfo]);

   const handleChangeAddress = () => {
      setIsOpenModalUpdateInfo(true);
   };

   const priceMemo = useMemo(() => {
      const result = order?.orderItemsSlected?.reduce((total, cur) => {
         return total + cur.price * cur.amount;
      }, 0);
      return result;
   }, [order]);

   const priceDiscountMemo = useMemo(() => {
      const result = order?.orderItemsSlected?.reduce((total, cur) => {
         const totalDiscount = cur.discount ? cur.discount : 0;
         return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
      }, 0);
      if (Number(result)) {
         return result;
      }
      return 0;
   }, [order]);

   const diliveryPriceMemo = useMemo(() => {
      if (priceMemo >= 20000 && priceMemo < 500000) {
         return 10000;
      } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
         return 0;
      } else {
         return 20000;
      }
   }, [priceMemo]);

   const totalPriceMemo = useMemo(() => {
      return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo);
   }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

   const mutationUpdate = useMutationHook((data) => {
      const {id, token, ...rests} = data;
      const res = UserService.updateUser(id, {...rests}, token);
      return res;
   });

   const {isLoading, data} = mutationUpdate;

   const handleCancleUpdate = () => {
      setStateUserDetails({
         name: '',
         email: '',
         phone: '',
         isAdmin: false,
      });
      form.resetFields();
      setIsOpenModalUpdateInfo(false);
   };
   const handleUpdateInforUser = () => {
      const {name, address, city, phone} = stateUserDetails;
      if (name && address && city && phone) {
         mutationUpdate.mutate(
            {id: user?.id, token: user?.access_token, ...stateUserDetails},
            {
               onSuccess: () => {
                  dispatch(updateUser({name, address, city, phone}));
                  setIsOpenModalUpdateInfo(false);
               },
            },
         );
      }
   };

   const handleOnchangeDetails = (e) => {
      setStateUserDetails({
         ...stateUserDetails,
         [e.target.name]: e.target.value,
      });
   };
   const itemsDelivery = [
      {
         title: '20.000 VND',
         description: 'Dưới 200.000 VND',
      },
      {
         title: '10.000 VND',
         description: 'Từ 200.000 VND đến dưới 500.000 VND',
      },
      {
         title: 'Free ship',
         description: 'Trên 500.000 VND',
      },
   ];

   const handleAddOrder = () => {
      if (
         user?.access_token &&
         order?.orderItemsSlected &&
         user?.name &&
         user?.address &&
         user?.phone &&
         user?.city &&
         priceMemo &&
         user?.id
      ) {
         // eslint-disable-next-line no-unused-expressions
         mutationAddOrder.mutate({
            token: user?.access_token,
            orderItems: order?.orderItemsSlected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email,
         });
      }
   };
   const mutationAddOrder = useMutationHook((data) => {
      const {token, ...rests} = data;
      const res = OrderService.createOrder(token, {...rests});
      return res;
   });
   const {data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder;
   useEffect(() => {
      if (isSuccess && dataAdd?.status === 'OK') {
         const arrayOrdered = [];
         order?.orderItemsSlected?.forEach((element) => {
            arrayOrdered.push(element.product);
         });
         dispatch(removeAllOrderProduct({listChecked: arrayOrdered}));
         message.success('Đặt hàng thành công');
         navigate('/orderSuccess', {
            state: {
               delivery,
               payment,
               orders: order?.orderItemsSlected,
               totalPriceMemo: totalPriceMemo,
            },
         });
      } else if (isError) {
         message.error();
      }
   }, [isSuccess, isError]);
   const handleDilivery = (e) => {
      setDelivery(e.target.value);
   };
   const handlePayment = (e) => {
      setPayment(e.target.value);
   };
   return (
      <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
         <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
            <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
            <div style={{display: 'flex', justifyContent: 'center'}}>
               <WrapperLeft>
                  <WrapperInfo>
                     <div>
                        <Lable>Chọn phương thức giao hàng</Lable>
                        <WrapperRadio onChange={handleDilivery} value={delivery}>
                           <Radio value='fast'>
                              <span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm
                           </Radio>
                           <Radio value='gojek'>
                              <span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm
                           </Radio>
                        </WrapperRadio>
                     </div>
                  </WrapperInfo>
                  <WrapperInfo>
                     <div>
                        <Lable>Chọn phương thức thanh toán</Lable>
                        <WrapperRadio onChange={handlePayment} value={payment}>
                           <Radio value='later_money'> Thanh toán tiền mặt khi nhận hàng</Radio>
                           <Radio value='paypal'> Thanh toán tiền bằng paypal</Radio>
                        </WrapperRadio>
                     </div>
                  </WrapperInfo>
               </WrapperLeft>
               <WrapperRight>
                  <div style={{width: '100%'}}>
                     <WrapperInfo>
                        <div>
                           <span>Địa chỉ: </span>
                           <span style={{fontWeight: 'bold'}}>{`${user?.address} ${user?.city}`} </span>
                           <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor: 'pointer'}}>
                              Thay đổi
                           </span>
                        </div>
                     </WrapperInfo>
                     <WrapperInfo>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                           <span>Tạm tính</span>
                           <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>
                              {convertPrice(priceMemo)}
                           </span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                           <span>Giảm giá</span>
                           <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>
                              {convertPrice(priceDiscountMemo)}
                           </span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                           <span>Phí giao hàng</span>
                           <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>
                              {convertPrice(diliveryPriceMemo)}
                           </span>
                        </div>
                     </WrapperInfo>
                     <WrapperTotal>
                        <span>Tổng tiền</span>
                        <span style={{display: 'flex', flexDirection: 'column'}}>
                           <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>
                              {convertPrice(totalPriceMemo)}
                           </span>
                           <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                        </span>
                     </WrapperTotal>
                  </div>
                  <ButtonComponent
                     onClick={() => handleAddOrder()}
                     size={40}
                     styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '320px',
                        border: 'none',
                        borderRadius: '4px',
                     }}
                     textbutton={'Mua hàng'}
                     styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
                  ></ButtonComponent>
               </WrapperRight>
            </div>
         </div>
         <ModalComponent
            title='Cập nhật thông tin giao hàng'
            open={isOpenModalUpdateInfo}
            onCancel={handleCancleUpdate}
            onOk={handleUpdateInforUser}
         >
            <Loading isLoading={isLoading}>
               <Form
                  name='basic'
                  labelCol={{span: 4}}
                  wrapperCol={{span: 20}}
                  // onFinish={onUpdateUser}
                  autoComplete='on'
                  form={form}
               >
                  <Form.Item label='Name' name='name' rules={[{required: true, message: 'Please input your name!'}]}>
                     <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name='name' />
                  </Form.Item>
                  <Form.Item label='City' name='city' rules={[{required: true, message: 'Please input your city!'}]}>
                     <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name='city' />
                  </Form.Item>
                  <Form.Item
                     label='Phone'
                     name='phone'
                     rules={[{required: true, message: 'Please input your  phone!'}]}
                  >
                     <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name='phone' />
                  </Form.Item>

                  <Form.Item
                     label='Adress'
                     name='address'
                     rules={[{required: true, message: 'Please input your  address!'}]}
                  >
                     <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name='address' />
                  </Form.Item>
               </Form>
            </Loading>
         </ModalComponent>
      </div>
   );
};

export default PaymentPage;
