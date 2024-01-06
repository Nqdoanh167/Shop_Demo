/** @format */

import {Form, Modal, Upload} from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled.h1`
   color: #000;
   font-size: 14px;
`;
export const WrapperFormItem = styled(Form.Item)`
   & > div {
      display: flex;
      align-items: center;
   }
`;
export const WrapperUploadFile = styled(Upload)`
   & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
      width: 60px;
      height: 60px;
      border-radius: 50%;
   }

   & .ant-upload-list {
      display: none;
   }
`;
