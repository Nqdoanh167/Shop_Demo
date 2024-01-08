/** @format */

import React, {useEffect, useRef, useState} from 'react';
import {WrapperFormItem, WrapperHeader, WrapperModal, WrapperUploadFile} from './style';
import {Button, Modal, Checkbox, Form, Input, Space} from 'antd';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import {getBase64} from '../../utils';
import * as UserService from '../../services/UserService';
import {useMutationHook} from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import {useQuery} from 'react-query';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import {useSelector} from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
export default function AdminUser() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [rowSelected, setRowSelected] = useState('');
   const [isOpenDrawer, setIsOpenDrawer] = useState(false);
   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
   const [isModalOpenDelete, setIsOpenModalDelete] = useState(false);
   const user = useSelector((state) => state?.user);
   const [searchedColumn, setSearchedColumn] = useState('');
   const searchInput = useRef(null);
   const [form] = Form.useForm();
   //get detail user
   const [stateUserDetails, setStateUserDetails] = useState({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
      avatar: '',
      address: '',
   });
   const handleOnChangeDetails = (e) => {
      setStateUserDetails({
         ...stateUserDetails,
         [e.target.name]: e.target.value,
      });
   };
   const handleOnChangeAvatarDetails = async ({fileList}) => {
      const file = fileList[0];
      if (!file.url && !file.preview) {
         file.preview = await getBase64(file.originFileObj);
      }
      setStateUserDetails({
         ...stateUserDetails,
         avatar: file.preview,
      });
   };

   const fetchGetDetailsUser = async (rowSelected) => {
      const res = await UserService.getDetailsUser(rowSelected, user?.access_token);
      if (res?.data) {
         setStateUserDetails({
            name: res?.data?.name,
            email: res?.data?.email,
            phone: res?.data?.phone,
            isAdmin: res?.data?.isAdmin,
            avatar: res?.data?.avatar,
            address: res?.data?.address,
         });
      }
      setIsLoadingUpdate(false);
   };
   useEffect(() => {
      form.setFieldsValue(stateUserDetails);
   }, [form, stateUserDetails]);

   useEffect(() => {
      if (rowSelected && isOpenDrawer) {
         setIsLoadingUpdate(true);
         fetchGetDetailsUser(rowSelected);
      }
   }, [rowSelected, isOpenDrawer]);
   const handleDetailsUser = async () => {
      setIsOpenDrawer(true);
      setIsLoadingUpdate(true);
      console.log('rowSelected', rowSelected);
   };
   //update user

   const mutationUpdate = useMutationHook(async (data) => {
      const {id, access_token, ...rests} = data;
      const res = await UserService.updateUser(id, access_token, {...rests});
      return res;
   });
   const {
      data: dataUpdated,
      isLoading: isLoadingUpdated,
      isSuccess: isSuccessUpdated,
      isError: isErrorUpdated,
   } = mutationUpdate;
   const onUpdateUser = () => {
      mutationUpdate.mutate(
         {
            id: rowSelected,
            access_token: user?.access_token,
            ...stateUserDetails,
         },
         {
            onSettled: () => {
               queryUser.refetch();
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
      setStateUserDetails({
         name: '',
         email: '',
         phone: '',
         isAdmin: false,
         avatar: '',
         address: '',
      });
      form.resetFields();
   };
   // get list users
   const fetchUserAll = async () => {
      const res = await UserService.getAllUser(user?.access_token);
      return res;
   };
   const queryUser = useQuery(['users'], fetchUserAll, {
      retry: 3,
      retryDelay: 1000,
   });
   const {isLoading: isLoadingUsers, data: users} = queryUser;
   const renderAction = () => {
      return (
         <div>
            <DeleteOutlined
               style={{fontSize: '30px', color: 'red', cursor: 'pointer'}}
               onClick={() => setIsOpenModalDelete(true)}
            />
            <EditOutlined style={{fontSize: '30px', color: 'orange', cursor: 'pointer'}} onClick={handleDetailsUser} />
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
         sorter: (a, b) => a.name.length - b.name.length,
         ...getColumnSearchProps('name'),
      },
      {
         title: 'Email',
         dataIndex: 'email',
         sorter: (a, b) => a.email.length - b.email.length,
         ...getColumnSearchProps('email'),
      },
      {
         title: 'Address',
         dataIndex: 'address',
         sorter: (a, b) => a.address.length - b.address.length,
         ...getColumnSearchProps('address'),
      },
      {
         title: 'Admin',
         dataIndex: 'isAdmin',
         filters: [
            {
               text: 'True',
               value: true,
            },
            {
               text: 'False',
               value: false,
            },
         ],
      },
      {
         title: 'Phone',
         dataIndex: 'phone',
         sorter: (a, b) => a.phone - b.phone,
         ...getColumnSearchProps('phone'),
      },
      {
         title: 'Action',
         dataIndex: 'action',
         render: renderAction,
      },
   ];
   const dataTable =
      users?.data.length &&
      users?.data?.map((user) => {
         return {...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'};
      });

   // delete user

   const handleCancelDelete = () => {
      setIsOpenModalDelete(false);
   };

   const mutationDelete = useMutationHook(async (data) => {
      const {id, access_token} = data;
      const res = await UserService.deleteUser(id, access_token);
      return res;
   });
   const handleDeleteUser = () => {
      mutationDelete.mutate(
         {id: rowSelected, access_token: user?.access_token},
         {
            onSettled: () => {
               queryUser.refetch();
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
   console.log('mutationDelete', mutationDelete);
   console.log('isSuccessDeleted', isSuccessDeleted);
   console.log('dataDeleted', dataDeleted);
   useEffect(() => {
      if (isSuccessDeleted && dataDeleted?.status === 'OK') {
         message.success();
         handleCancelDelete();
      } else if (isErrorDeleted) {
         message.error();
      }
   }, [isSuccessDeleted]);
   return (
      <div>
         <WrapperHeader>Quản lý người dùng</WrapperHeader>

         <div style={{marginTop: '20px'}}>
            <TableComponent
               isLoading={isLoadingUsers}
               columns={columns}
               data={dataTable}
               onRow={(record, rowIndex) => {
                  return {
                     onClick: (event) => {
                        setRowSelected(record._id);
                     },
                  };
               }}
            />
         </div>

         <DrawerComponent
            title='Chi tiết người dùng'
            isOpen={isOpenDrawer}
            onClose={() => setIsOpenDrawer(false)}
            width='90%'
         >
            <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
               <Form
                  name='basic'
                  labelCol={{span: 2}}
                  wrapperCol={{span: 22}}
                  onFinish={onUpdateUser}
                  autoComplete='on'
                  form={form}
               >
                  <Form.Item label='Name' name='name' rules={[{required: true, message: 'Please input your name!'}]}>
                     <InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name='name' />
                  </Form.Item>

                  <Form.Item label='Email' name='email' rules={[{required: true, message: 'Please input your email!'}]}>
                     <InputComponent value={stateUserDetails['email']} onChange={handleOnChangeDetails} name='email' />
                  </Form.Item>
                  <Form.Item
                     label='Phone'
                     name='phone'
                     rules={[{required: true, message: 'Please input your  phone!'}]}
                  >
                     <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone' />
                  </Form.Item>

                  <Form.Item
                     label='Adress'
                     name='address'
                     rules={[{required: true, message: 'Please input your  address!'}]}
                  >
                     <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name='address' />
                  </Form.Item>

                  <WrapperFormItem
                     label='Avatar'
                     name='avatar'
                     rules={[{required: true, message: 'Please input your image!'}]}
                  >
                     <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                           <Button>Select File</Button>
                           {stateUserDetails?.avatar && (
                              <img
                                 src={stateUserDetails?.avatar}
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
                  <Form.Item wrapperCol={{offset: 20, span: 16}}>
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
            onOk={handleDeleteUser}
         >
            <Loading isLoading={isLoadingDeleted}>
               <div>Bạn có chắc muốn xóa sản phẩm này?</div>
            </Loading>
         </ModalComponent>
      </div>
   );
}
