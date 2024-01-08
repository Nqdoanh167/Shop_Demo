/** @format */
const Product = require('../models/ProductModel');
const createProduct = (newProduct) => {
   return new Promise(async (resolve, reject) => {
      const {name, image, type, price, countInStock, rating, description} = newProduct;
      try {
         const checkProduct = await Product.findOne({
            name: name,
         });
         if (checkProduct) {
            resolve({
               status: 'OK',
               message: 'The name of product is already',
            });
         }

         const createProduct = await Product.create({
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description,
         });
         if (createProduct) {
            resolve({
               status: 'OK',
               message: 'SUCCESS',
               data: createProduct,
            });
         }
      } catch (e) {
         reject(e);
      }
   });
};
const updateProduct = (id, data) => {
   return new Promise(async (resolve, reject) => {
      try {
         const checkProduct = await Product.findOne({_id: id});
         if (!checkProduct) {
            resolve({
               status: 'OK',
               message: 'The product is not defined',
            });
         }
         const updateProduct = await Product.findByIdAndUpdate(id, data, {new: true});
         resolve({
            status: 'OK',
            message: 'UPDATE SUCCESSFULLY',
            data: updateProduct,
         });
      } catch (e) {
         reject(e);
      }
   });
};
const getDetailsProduct = (id) => {
   return new Promise(async (resolve, reject) => {
      try {
         const product = await Product.findOne({_id: id});
         if (!product) {
            resolve({
               status: 'OK',
               message: 'The product is not defined',
            });
         }
         resolve({
            status: 'OK',
            message: 'GET DETAILS PRODUCT SUCCESS',
            data: product,
         });
      } catch (e) {
         reject(e);
      }
   });
};
const deleteProduct = (id) => {
   return new Promise(async (resolve, reject) => {
      try {
         const checkProduct = await Product.findOne({_id: id});
         if (!checkProduct) {
            resolve({
               status: 'OK',
               message: 'The product is not defined',
            });
         }
         await Product.findByIdAndDelete(id);
         resolve({
            status: 'OK',
            message: 'DELETE PRODUCT SUCCESS',
         });
      } catch (e) {
         reject(e);
      }
   });
};
const deleteManyProduct = (ids) => {
   return new Promise(async (resolve, reject) => {
      try {
         await Product.deleteMany({_id: ids});
         resolve({
            status: 'OK',
            message: 'Delete product success',
         });
      } catch (e) {
         reject(e);
      }
   });
};
const getAllProduct = (limit, page, sort, filter) => {
   return new Promise(async (resolve, reject) => {
      try {
         const totalProduct = await Product.countDocuments();
         if (filter) {
            const label = filter[0];
            const allProductFilter = await Product.find({[label]: {$regex: filter[1]}})
               .limit(limit)
               .skip(limit * page);
            resolve({
               status: 'OK',
               message: 'GET ALL PRODUCT SUCCESS',
               total: totalProduct,
               pageCurrent: page + 1,
               totalPage: Math.ceil(totalProduct / limit),
               data: allProductFilter,
            });
         }
         if (sort) {
            const objectSort = {};
            objectSort[sort[1]] = sort[0];
            const allProductSort = await Product.find()
               .limit(limit)
               .skip(limit * page)
               .sort(objectSort);
            resolve({
               status: 'OK',
               message: 'GET ALL PRODUCT SUCCESS',
               total: totalProduct,
               pageCurrent: page + 1,
               totalPage: Math.ceil(totalProduct / limit),
               data: allProductSort,
            });
         }
         const allProduct = await Product.find()
            .limit(limit)
            .skip(limit * page);
         resolve({
            status: 'OK',
            message: 'GET ALL PRODUCT SUCCESS',
            total: totalProduct,
            pageCurrent: page + 1,
            totalPage: Math.ceil(totalProduct / limit),
            data: allProduct,
         });
      } catch (e) {
         reject(e);
      }
   });
};
module.exports = {
   createProduct,
   updateProduct,
   getDetailsProduct,
   deleteProduct,
   getAllProduct,
   deleteManyProduct,
};
