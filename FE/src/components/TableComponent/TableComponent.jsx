/** @format */

import {Table} from 'antd';
import React, {useMemo, useRef, useState} from 'react';
import Loading from '../LoadingComponent/Loading';
import {DownloadTableExcel} from 'react-export-table-to-excel';
import {Excel} from 'antd-table-saveas-excel';
export default function TableComponent(props) {
   const {selectionType = 'checkbox', isLoading = false, columns = [], data = [], handleDeleteMany} = props;
   const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
   const tableRef = useRef(null);
   const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
         console.log(`selectedRowKeys: ${selectedRowKeys}`);
         setRowSelectedKeys(selectedRowKeys);
      },
   };
   const newColumnExport = useMemo(() => {
      const arr = columns?.filter((col) => col.dataIndex !== 'action');
      return arr;
   }, [columns]);
   const handleDeleteAll = () => {
      handleDeleteMany(rowSelectedKeys);
   };
   const handlePrint = () => {
      const excel = new Excel();
      excel
         .addSheet('sheet 1')
         .addColumns(newColumnExport)
         .addDataSource(data, {
            str2Percent: true,
         })
         .saveAs('Excel.xlsx');
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
         <button onClick={handlePrint}> Export excel </button>
         <Table
            rowSelection={{
               type: selectionType,
               ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            ref={tableRef}
            {...props}
         />
      </Loading>
   );
}
