/** @format */

import React, {useEffect, useRef, useState} from 'react';
import {WrapperFormItem, WrapperHeader, WrapperModal, WrapperUploadFile} from './style';
import {Button, Modal, Checkbox, Form, Input, Space, Select} from 'antd';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import {getBase64, renderOptions} from '../../utils';
import * as ProductService from '../../services/ProductService';
import {useMutationHook} from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import {useQuery} from 'react-query';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import {useSelector} from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
export default function AdminProduct() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [rowSelected, setRowSelected] = useState('');
   const [isOpenDrawer, setIsOpenDrawer] = useState(false);
   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
   const [isModalOpenDelete, setIsOpenModalDelete] = useState(false);
   const user = useSelector((state) => state?.user);
   const [searchText, setSearchText] = useState('');
   const [searchedColumn, setSearchedColumn] = useState('');
   const searchInput = useRef(null);
   const [form] = Form.useForm();
   //get detail product
   const [stateProductDetails, setStateProductDetails] = useState({
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
   const handleOnChangeDetails = (e) => {
      setStateProductDetails({
         ...stateProductDetails,
         [e.target.name]: e.target.value,
      });
   };
   const handleOnChangeAvatarDetails = async ({fileList}) => {
      const file = fileList[0];
      if (!file.url && !file.preview) {
         file.preview = await getBase64(file.originFileObj);
      }
      setStateProductDetails({
         ...stateProductDetails,
         image: file.preview,
      });
   };
   const fetchGetDetailsProduct = async (rowSelected) => {
      const res = await ProductService.getDetailsProduct(rowSelected);
      if (res?.data) {
         setStateProductDetails({
            name: res?.data?.name,
            price: res?.data?.price,
            description: res?.data?.description,
            rating: res?.data?.rating,
            image: res?.data?.image,
            type: res?.data?.type,
            countInStock: res?.data?.countInStock,
            newType: res?.data?.newType,
            discount: res?.data?.discount,
         });
      }
      setIsLoadingUpdate(false);
   };
   useEffect(() => {
      form.setFieldsValue(stateProductDetails);
   }, [form, stateProductDetails]);

   useEffect(() => {
      if (rowSelected && isOpenDrawer) {
         setIsLoadingUpdate(true);
         fetchGetDetailsProduct(rowSelected);
      }
   }, [rowSelected, isOpenDrawer]);
   const handleDetailsProduct = async () => {
      setIsOpenDrawer(true);
      setIsLoadingUpdate(true);
   };
   //update product

   const mutationUpdate = useMutationHook(async (data) => {
      const {id, access_token, ...rests} = data;
      const res = await ProductService.updateProduct(id, access_token, {...rests});
      return res;
   });
   const {
      data: dataUpdated,
      isLoading: isLoadingUpdated,
      isSuccess: isSuccessUpdated,
      isError: isErrorUpdated,
   } = mutationUpdate;
   const onUpdateProduct = () => {
      mutationUpdate.mutate(
         {
            id: rowSelected,
            access_token: user?.access_token,
            ...stateProductDetails,
         },
         {
            onSettled: () => {
               queryProduct.refetch();
            },
         },
      );
      setIsOpenDrawer(false);
   };
   useEffect(() => {
      if (isSuccessUpdated && dataUpdated?.status === 'OK') {
         message.success();
         handleCloseDrawer();
      } else if (isErrorUpdated) {
         message.error();
      }
   }, [isSuccessUpdated, isErrorUpdated]);
   const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateProductDetails({
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
   // get list products
   const fetchProductAll = async () => {
      const res = await ProductService.getAllProduct();
      return res;
   };
   const queryProduct = useQuery(['products'], fetchProductAll, {
      retry: 3,
      retryDelay: 1000,
   });
   const {isLoading: isLoadingProducts, data: products} = queryProduct;
   const renderAction = () => {
      return (
         <div>
            <DeleteOutlined
               style={{fontSize: '30px', color: 'red', cursor: 'pointer'}}
               onClick={() => setIsOpenModalDelete(true)}
            />
            <EditOutlined
               style={{fontSize: '30px', color: 'orange', cursor: 'pointer'}}
               onClick={handleDetailsProduct}
            />
         </div>
      );
   };
   const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      // setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
   };
   const handleReset = (clearFilters) => {
      clearFilters();
      // setSearchText('');
   };
   const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
         <div
            style={{
               padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
         >
            <InputComponent
               ref={searchInput}
               placeholder={`Search ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
               onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
               style={{
                  marginBottom: 8,
                  display: 'block',
               }}
            />
            <Space>
               <Button
                  type='primary'
                  onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size='small'
                  style={{
                     width: 90,
                  }}
               >
                  Search
               </Button>
               <Button
                  onClick={() => clearFilters && handleReset(clearFilters)}
                  size='small'
                  style={{
                     width: 90,
                  }}
               >
                  Reset
               </Button>
            </Space>
         </div>
      ),
      filterIcon: (filtered) => (
         <SearchOutlined
            style={{
               color: filtered ? '#1677ff' : undefined,
            }}
         />
      ),
      onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
         if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
         }
      },
   });
   const columns = [
      {
         title: 'Name',
         dataIndex: 'name',
         sorter: (a, b) => a.name.localeCompare(b.name),
         ...getColumnSearchProps('name'),
      },
      {
         title: 'Price',
         dataIndex: 'price',
         sorter: (a, b) => a.price - b.price,
         filters: [
            {
               text: '>= 50',
               value: '>=',
            },
            {
               text: '<= 50',
               value: '<=50',
            },
         ],

         onFilter: (value, record) => {
            if (value === '>=') return record.price >= 50;
            return record.price <= 50;
         },
      },
      {
         title: 'Rating',
         dataIndex: 'rating',
         sorter: (a, b) => a.rating - b.rating,
         filters: [
            {
               text: '>= 3',
               value: '>=',
            },
            {
               text: '<= 3',
               value: '<=',
            },
         ],

         onFilter: (value, record) => {
            if (value === '>=') return record.rating >= 3;
            return record.rating <= 3;
         },
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
      const {name, price, description, rating, image, type, countInStock, discount} = data;
      const res = await ProductService.createProduct({
         name,
         price,
         description,
         rating,
         image,
         type,
         countInStock,
         discount,
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
   }, [isSuccess, isError]);
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
      const params = {
         ...stateProduct,
         type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      };
      mutation.mutate(params, {
         onSettled: () => {
            queryProduct.refetch();
         },
      });
   };

   const handleOnChange = (e) => {
      setStateProduct({
         ...stateProduct,
         [e.target.name]: e.target.value,
      });
   };
   const handleChangeSelect = (value) => {
      setStateProduct({
         ...stateProduct,
         type: value,
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

   // delete product

   const handleCancelDelete = () => {
      setIsOpenModalDelete(false);
   };

   const mutationDelete = useMutationHook(async (data) => {
      const {id, access_token} = data;
      const res = await ProductService.deleteProduct(id, access_token);
      return res;
   });
   const handleDeleteProduct = () => {
      mutationDelete.mutate(
         {id: rowSelected, access_token: user?.access_token},
         {
            onSettled: () => {
               queryProduct.refetch();
            },
         },
      );
   };

   const {
      data: dataDeleted,
      isLoading: isLoadingDeleted,
      isSuccess: isSuccessDeleted,
      isError: isErrorDeleted,
   } = mutationDelete;

   useEffect(() => {
      if (isSuccessDeleted && dataDeleted?.status === 'OK') {
         message.success();
         handleCancelDelete();
      } else if (isErrorDeleted) {
         message.error();
      }
   }, [isSuccessDeleted, isErrorDeleted]);

   // delete many products
   const mutationDeletedMany = useMutationHook((data) => {
      const {access_token, ...ids} = data;
      const res = ProductService.deleteManyProduct(ids, access_token);
      return res;
   });
   const handleDeleteManyProducts = (ids) => {
      mutationDeletedMany.mutate(
         {ids: ids, access_token: user?.access_token},
         {
            onSettled: () => {
               queryProduct.refetch();
            },
         },
      );
   };
   const {
      data: dataDeletedMany,
      isLoading: isLoadingDeletedMany,
      isSuccess: isSuccessDeletedMany,
      isError: isErrorDeletedMany,
   } = mutationDeletedMany;

   useEffect(() => {
      if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
         message.success();
      } else if (isErrorDeleted) {
         message.error();
      }
   }, [isSuccessDeleted, isErrorDeletedMany]);

   // get type product
   const fetchAllTypeProduct = async () => {
      const res = await ProductService.getAllTypeProduct();
      return res;
   };
   const typeProduct = useQuery({queryKey: ['type-product'], queryFn: fetchAllTypeProduct});

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
            <TableComponent
               isLoading={isLoadingProducts}
               columns={columns}
               data={dataTable}
               handleDeleteMany={handleDeleteManyProducts}
               onRow={(record, rowIndex) => {
                  return {
                     onClick: (event) => {
                        setRowSelected(record._id);
                     },
                  };
               }}
            />
         </div>
         <ModalComponent title='Tạo sản phẩm' open={isModalOpen} onCancel={handleCancel} footer={null}>
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
                     name='name'
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
                     <Select
                        name='type'
                        // defaultValue="lucy"
                        // style={{ width: 120 }}
                        value={stateProduct.type}
                        onChange={handleChangeSelect}
                        options={renderOptions(typeProduct?.data?.data)}
                     />
                  </Form.Item>
                  {stateProduct.type === 'add_type' && (
                     <Form.Item
                        label='New type'
                        name='newType'
                        rules={[{required: true, message: 'Please input your type!'}]}
                     >
                        <InputComponent value={stateProduct.newType} onChange={handleOnChange} name='newType' />
                     </Form.Item>
                  )}
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
                  <Form.Item
                     label='Discount'
                     name='discount'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your discount of product!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProduct.discount} onChange={handleOnChange} name='discount' />
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
         </ModalComponent>
         <DrawerComponent
            title='Chi tiết sản phẩm'
            isOpen={isOpenDrawer}
            onClose={() => setIsOpenDrawer(false)}
            size={'large'}
            width='90%'
         >
            <Loading isLoading={isLoadingUpdate && isLoadingUpdated}>
               <Form
                  name='basic'
                  labelCol={{
                     span: 4,
                  }}
                  wrapperCol={{
                     span: 22,
                  }}
                  style={{
                     maxWidth: 1000,
                  }}
                  initialValues={{
                     remember: true,
                  }}
                  onFinish={onUpdateProduct}
                  autoComplete='on'
                  form={form}
               >
                  <Form.Item
                     label='Name'
                     name='name'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your name!',
                        },
                     ]}
                  >
                     <InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name='name' />
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
                     <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name='type' />
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
                     <InputComponent
                        value={stateProductDetails.countInStock}
                        onChange={handleOnChangeDetails}
                        name='countInStock'
                     />
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
                     <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name='price' />
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
                     <InputComponent
                        value={stateProductDetails.description}
                        onChange={handleOnChangeDetails}
                        name='description'
                     />
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
                     <InputComponent
                        value={stateProductDetails.rating}
                        onChange={handleOnChangeDetails}
                        name='rating'
                     />
                  </Form.Item>
                  <Form.Item
                     label='Discount'
                     name='discount'
                     rules={[
                        {
                           required: true,
                           message: 'Please input your discount of product!',
                        },
                     ]}
                  >
                     <InputComponent
                        value={stateProductDetails.discount}
                        onChange={handleOnChangeDetails}
                        name='discount'
                     />
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
                     <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                           <Button>Select File</Button>
                           {stateProductDetails?.image && (
                              <img
                                 src={stateProductDetails?.image}
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
                        Apply
                     </Button>
                  </Form.Item>
               </Form>
            </Loading>
         </DrawerComponent>
         <ModalComponent
            title='Xóa sản phẩm'
            open={isModalOpenDelete}
            onCancel={handleCancelDelete}
            onOk={handleDeleteProduct}
         >
            <Loading isLoading={isLoadingDeleted}>
               <div>Bạn có chắc muốn xóa sản phẩm này?</div>
            </Loading>
         </ModalComponent>
      </div>
   );
}
