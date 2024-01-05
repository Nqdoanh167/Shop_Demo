/** @format */

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const genneralAccessToken = async (payload) => {
   const accessToken = jwt.sign(
      {
         ...payload,
      },
      process.env.ACCESS_TOKEN,
      {expiresIn: '1d'},
   );
   return accessToken;
};
const genneralRefreshToken = async (payload) => {
   const refreshToken = jwt.sign(
      {
         ...payload,
      },
      process.env.REFRESH_TOKEN,
      {expiresIn: '365d'},
   );
   return refreshToken;
};
const refreshTokenJwt = async (token) => {
   return new Promise(async (resolve, reject) => {
      try {
         jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
            if (err) {
               return res.status(404).json({
                  status: 'ERR',
                  message: 'The authentication',
               });
            }
            const access_token = await genneralAccessToken({
               id: user?.id,
               isAdmin: user?.isAdmin,
            });
            resolve({
               status: 'OK',
               message: 'SUCCESS',
               access_token,
            });
         });
      } catch (e) {
         reject(e);
      }
   });
};
module.exports = {
   genneralAccessToken,
   genneralRefreshToken,
   refreshTokenJwt,
};
