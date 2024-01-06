/** @format */

import React, {useEffect, useState} from 'react';
import {WrapperFormItem, WrapperHeader, WrapperModal, WrapperUploadFile} from './style';
import {Button, Modal, Checkbox, Form, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import {getBase64} from '../../utils';
import * as ProductService from '../../services/ProductService';
import {useMutationHook} from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
export default function AdminProduct() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [stateProduct, setStateProduct] = useState({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      newType: '',
      discount: '',
   });
   const mutation = useMutationHook(async (data) => {
      const {name, price, description, rating, image, type, countInStock} = data;
      const res = await ProductService.createProduct({
         name,
         price,
         description,
         rating,
         image,
         type,
         countInStock,
      });
      return res;
   });
   const {data, isLoading, isSuccess, isError} = mutation;
   useEffect(() => {
      if (isSuccess && data?.status === 'OK') {
         message.success();
         handleCancel();
      } else if (isError) {
         message.error();
      }
   }, [isSuccess]);
   const handleCancel = () => {
      setIsModalOpen(false);
   };
   const onFinish = () => {
      mutation.mutate(stateProduct);
   };
   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };
   const handleOnChange = (e) => {
      setStateProduct({
         ...stateProduct,
         [e.target.name]: e.target.value,
      });
   };
   const handleOnChangeAvatar = async ({fileList}) => {
      const file = fileList[0];
      if (!file.url && !file.preview) {
         file.preview = await getBase64(file.originFileObj);
      }
      setStateProduct({
         ...stateProduct,
         image: file.preview,
      });
   };
   return (
      <div>
         <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
         <div style={{marginTop: '10px'}}>
            <Button
               style={{height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}}
               onClick={() => setIsModalOpen(true)}
            >
               <PlusOutlined style={{fontSize: '60px'}} />
            </Button>
         </div>
         <div style={{marginTop: '20px'}}>
            <TableComponent />
         </div>
         <Modal title='Tạo sản phẩm' open={isModalOpen} onCancel={handleCancel}>
            <Loading isLoading={isLoading}>
               <Form
                  name='basic'
                  labelCol={{
                     span: 8,
                  }}
                  wrapperCol={{
                     span: 16,
                  }}
                  style={{
                     maxWidth: 600,
                  }}
                  initialValues={{
                     remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete='off'
               >
                  <Form.Item
                     label='Name'
                     name='Name'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your name!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.name} onChange={handleOnChange} name='name' />
                  </Form.Item>

                  <Form.Item
                     label='Type'
                     name='type'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your type!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.type} onChange={handleOnChange} name='type' />
                  </Form.Item>
                  <Form.Item
                     label='count InStock'
                     name='countInStock'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your count InStock!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name='countInStock' />
                  </Form.Item>
                  <Form.Item
                     label='Price'
                     name='price'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your price!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.price} onChange={handleOnChange} name='price' />
                  </Form.Item>
                  <Form.Item
                     label='Description'
                     name='description'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your description!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.description} onChange={handleOnChange} name='description' />
                  </Form.Item>
                  <Form.Item
                     label='Rating'
                     name='rating'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your rating!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.rating} onChange={handleOnChange} name='rating' />
                  </Form.Item>
                  <WrapperFormItem
                     label='Image'
                     name='image'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your image!',
                        },
                     ]}
                  >
                     <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                           <Button>Select File</Button>
                           {stateProduct?.image && (
                              <img
                                 src={stateProduct?.image}
                                 style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: '10px',
                                 }}
                                 alt='avatar'
                              />
                           )}
                        </div>
                     </WrapperUploadFile>
                  </WrapperFormItem>
                  <Form.Item
                     name='remember'
                     valuePropName='checked'
                     wrapperCol={{
                        offset: 8,
                        span: 16,
                     }}
                  >
                     <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Form.Item
                     wrapperCol={{
                        offset: 8,
                        span: 16,
                     }}
                  >
                     <Button type='primary' htmlType='submit'>
                        Submit
                     </Button>
                  </Form.Item>
               </Form>
            </Loading>
         </Modal>
      </div>
   );
}
