
const Router = require('koa-router');
const productController = require('../../controllers/productController')

let productRouter = new Router();

productRouter
  .post('/product/getAllProduct', productController.GetAllProduct)
  .post('/product/getPromoProduct', productController.GetPromoProduct)
  .post('/product/getHotProduct', productController.GetHotProduct)
  .post('/product/getProductByCategory', productController.GetProductByCategory)
  .post('/product/getCategory', productController.GetCategory)
  .post('/product/getProductBySearch', productController.GetProductBySearch)
  .post('/product/getDetails', productController.GetDetails)
  .post('/product/getDetailsPicture', productController.GetDetailsPicture)
  .post('/product/addProduct', productController.AddProduct)
  .post('/product/updateProduct', productController.UpdateProduct)
  .post('/product/deleteProduct', productController.DeleteProduct)
  .post('/product/uploadPicture', productController.UploadProductPicture)
  
module.exports = productRouter;
