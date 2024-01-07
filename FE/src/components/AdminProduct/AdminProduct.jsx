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
import {useQuery} from 'react-query';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
export default function AdminProduct() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [form] = Form.useForm();

   // get list products
   const fetchProductAll = async () => {
      const res = await ProductService.getAllProduct();
      return res;
   };
   const {isLoading: isLoadingProducts, data: products} = useQuery(['products'], fetchProductAll, {
      retry: 3,
      retryDelay: 1000,
   });
   const renderAction = () => {
      return (
         <div>
            <DeleteOutlined style={{fontSize: '30px', color: 'red', cursor: 'pointer'}} />
            <EditOutlined style={{fontSize: '30px', color: 'orange', cursor: 'pointer'}} />
         </div>
      );
   };
   const columns = [
      {
         title: 'Name',
         dataIndex: 'name',
         render: (text) => <a>{text}</a>,
      },
      {
         title: 'Price',
         dataIndex: 'price',
      },
      {
         title: 'Rating',
         dataIndex: 'rating',
      },
      {
         title: 'Type',
         dataIndex: 'type',
      },
      {
         title: 'Action',
         dataIndex: 'action',
         render: renderAction,
      },
   ];
   const dataTable =
      products?.data.length &&
      products?.data?.map((product) => {
         return {...product, key: product._id};
      });
   // create product
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
      setStateProduct({
         name: '',
         price: '',
         description: '',
         rating: '',
         image: '',
         type: '',
         countInStock: '',
         discount: '',
      });
      form.resetFields();
   };
   const onFinish = () => {
      mutation.mutate(stateProduct);
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
            <TableComponent isLoading={isLoadingProducts} columns={columns} data={dataTable} />
         </div>
         <Modal title='Tạo sản phẩm' open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Loading isLoading={isLoading}>
               <Form
                  name='basic'
                  labelCol={{
                     span: 6,
                  }}
                  wrapperCol={{
                     span: 18,
                  }}
                  style={{
                     maxWidth: 600,
                  }}
                  initialValues={{
                     remember: true,
                  }}
                  onFinish={onFinish}
                  autoComplete='on'
                  form={form}
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
                     wrapperCol={{
                        offset: 20,
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
