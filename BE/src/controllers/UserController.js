/** @format */
const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const createUser = async (req, res) => {
   try {
      const {name, email, password, confirmPassword} = req.body;
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isCheckEmail = reg.test(email);
      if (!email || !password || !confirmPassword) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The input is required',
         });
      } else if (!isCheckEmail) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The input is email',
         });
      } else if (password !== confirmPassword) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The password is not equal confirmPassword',
         });
      }
      const response = await UserService.createUser(req.body);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const loginUser = async (req, res) => {
   try {
      const {email, password} = req.body;
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isCheckEmail = reg.test(email);
      if (!email || !password) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The input is required',
         });
      } else if (!isCheckEmail) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The input is email',
         });
      }
      const response = await UserService.loginUser(req.body);
      const {refresh_token, ...newResponse} = response;
      res.cookie('refresh_token', refresh_token, {
         httpOnly: true,
         secure: false,
         sameSite: 'strict',
      });
      return res.status(200).json(newResponse);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};

const updateUser = async (req, res) => {
   try {
      const idUser = req.params.id;
      if (!idUser) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The userId is required',
         });
      }
      const data = req.body;
      const response = await UserService.updateUser(idUser, data);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const deleteUser = async (req, res) => {
   try {
      const idUser = req.params.id;

      if (!idUser) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The userId is required',
         });
      }
      const response = await UserService.deleteUser(idUser);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const deleteMany = async (req, res) => {
   try {
      const ids = req.body.ids;
      if (!ids) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The ids is required',
         });
      }
      const response = await UserService.deleteManyUser(ids);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const getAllUser = async (req, res) => {
   try {
      const response = await UserService.getAllUser();
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const getDetailsUser = async (req, res) => {
   try {
      const idUser = req.params.id;

      if (!idUser) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The userId is required',
         });
      }
      const response = await UserService.getDetailsUser(idUser);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const refreshToken = async (req, res) => {
   try {
      const token = req?.cookies?.refresh_token;

      if (!token) {
         return res.status(200).json({
            status: 'ERR',
            message: 'The token is required',
         });
      }
      const response = await JwtService.refreshTokenJwt(token);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
const logoutUser = async (req, res) => {
   try {
      res.clearCookie('refresh_token');

      return res.status(200).json({
         status: 'OK',
         message: 'Logout Successfully',
      });
   } catch (e) {
      return res.status(404).json({
         message: e,
      });
   }
};
module.exports = {
   createUser,
   loginUser,
   updateUser,
   deleteUser,
   getAllUser,
   getDetailsUser,
   refreshToken,
   logoutUser,
   deleteMany,
};
