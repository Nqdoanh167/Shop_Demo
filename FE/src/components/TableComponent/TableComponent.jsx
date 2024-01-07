/** @format */

import {Divider, Radio, Table} from 'antd';
import React, {useState} from 'react';
import Loading from '../LoadingComponent/Loading';

export default function TableComponent(props) {
   const {selectionType = 'checkbox', isLoading = false, columns = [], data = []} = props;

   const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
         disabled: record.name === 'Disabled User',
         // Column configuration not to be checked
         name: record.name,
      }),
   };
   return (
      <Loading isLoading={isLoading}>
         <Table
            rowSelection={{
               type: selectionType,
               ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
         />
      </Loading>
   );
}
