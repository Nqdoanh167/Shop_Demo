/** @format */

import {Table} from 'antd';
import React, {useState} from 'react';
import Loading from '../LoadingComponent/Loading';

export default function TableComponent(props) {
   const {selectionType = 'checkbox', isLoading = false, columns = [], data = [], handleDeleteMany} = props;
   const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
   const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
         console.log(`selectedRowKeys: ${selectedRowKeys}`);
         setRowSelectedKeys(selectedRowKeys);
      },
   };

   const handleDeleteAll = () => {
      handleDeleteMany(rowSelectedKeys);
   };
   return (
      <Loading isLoading={isLoading}>
         {!!rowSelectedKeys.length && (
            <div
               style={{
                  background: '#1d1ddd',
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '10px',
                  cursor: 'pointer',
               }}
               onClick={handleDeleteAll}
            >
               Xóa tất cả
            </div>
         )}
         <Table
            rowSelection={{
               type: selectionType,
               ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            {...props}
         />
      </Loading>
   );
}
