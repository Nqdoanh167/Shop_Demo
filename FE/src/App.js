/** @format */

import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {routes} from './routes';
import DefalutComponent from './components/DefaultComponent/DefalutComponent';
import axios from 'axios';
import {useQuery} from 'react-query';
import {isJsonString} from './utils';
import {jwtDecode} from 'jwt-decode';
import {useDispatch} from 'react-redux';
import {updateUser} from './redux/slides/userSlide';
import * as UserService from './services/UserService';
export default function App() {
   const dispatch = useDispatch();

   useEffect(() => {
      const {decoded, storageData} = handleDecoded();
      if (decoded?.id) {
         handleGetDetailsUser(decoded?.id, storageData);
      }
   }, []);
   const handleDecoded = () => {
      let storageData = localStorage.getItem('access_token');
      let decoded = {};
      if (storageData && isJsonString(storageData)) {
         storageData = JSON.parse(storageData);
         decoded = jwtDecode(storageData);
      }
      return {
         decoded,
         storageData,
      };
   };
   UserService.axiosJWT.interceptors.request.use(
      async (config) => {
         // Do something before request is sent
         const currentTime = new Date();
         const {decoded} = handleDecoded();
         if (decoded?.exp < currentTime.getTime() / 1000) {
            const data = await UserService.refreshToken();
            config.headers['token'] = `Bearer ${data?.access_token}`;
         }
         return config;
      },
      function (error) {
         // Do something with request error
         return Promise.reject(error);
      },
   );
   const handleGetDetailsUser = async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({...res?.data, access_token: token}));
      console.log('res', res);
   };
   const fetchApi = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
      return res.data;
   };
   const query = useQuery('todos', fetchApi);
   return (
      <div>
         <Router>
            <Routes>
               {routes.map((route) => {
                  const Page = route.page;
                  const Layout = route.isShowHeader ? DefalutComponent : Fragment;
                  return (
                     <Route
                        key={route.path}
                        path={route.path}
                        element={
                           <Layout>
                              <Page />
                           </Layout>
                        }
                     ></Route>
                  );
               })}
            </Routes>
         </Router>
      </div>
   );
}
