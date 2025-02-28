const productDao = require('../models/dao/productDao');
const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * 获取商品分类
   * @param {Object} ctx
   */
  GetCategory: async (ctx) => {
    const category = await productDao.GetCategory();

    ctx.body = {
      code: '001',
      category
    };
  },
  /**
   * 根据商品分类名称获取首页展示的商品信息
   * @param {Object} ctx
   */
  GetPromoProduct: async (ctx) => {
    let { categoryName } = ctx.request.body;
    // 根据商品分类名称获取分类id
    const categoryID = await productDao.GetCategoryId(categoryName);
    // 根据商品分类id获取首页展示的商品信息
    const Product = await productDao.GetPromoProduct(categoryID);

    ctx.body = {
      code: '001',
      Product
    };
  },
  /**
   * 根据商品分类名称获取热门商品信息
   * @param {Object} ctx
   */
  GetHotProduct: async (ctx) => {
    let { categoryName } = ctx.request.body;
    const categoryID = [];

    for (let i = 0; i < categoryName.length; i++) {
      // 根据商品分类名称获取分类id
      const category_id = await productDao.GetCategoryId(categoryName[i]);
      categoryID.push(category_id);
    }
    // 根据商品分类id获取商品信息
    const Product = await productDao.GetProductByCategory(categoryID, 0, 7);

    ctx.body = {
      code: '001',
      Product
    };
  },
  /**
   * 分页获取所有的商品信息
   * @param {Object} ctx
   */
  GetAllProduct: async (ctx) => {
    let { currentPage, pageSize } = ctx.request.body;
    // 计算开始索引
    const offset = (currentPage - 1) * pageSize;
    const Product = await productDao.GetAllProduct(offset, pageSize);
    // 获取所有的商品数量,用于前端分页计算
    const total = (await productDao.GetAllProduct()).length;
    ctx.body = {
      code: '001',
      Product,
      total
    };
  },
  /**
   * 根据分类id,分页获取商品信息
   * @param {Object} ctx
   */
  GetProductByCategory: async (ctx) => {
    let { categoryID, currentPage, pageSize } = ctx.request.body;
    // 计算开始索引
    const offset = (currentPage - 1) * pageSize;
    // 分页获取该分类的商品信息
    const Product = await productDao.GetProductByCategory(
      categoryID,
      offset,
      pageSize
    );
    // 获取该分类所有的商品数量,用于前端分页计算
    const total = (await productDao.GetProductByCategory(categoryID)).length;

    ctx.body = {
      code: '001',
      Product,
      total
    };
  },
  /**
   * 根据搜索条件,分页获取商品信息
   * @param {Object} ctx
   */
  GetProductBySearch: async (ctx) => {
    let { search, currentPage, pageSize } = ctx.request.body;
    // 计算开始索引
    const offset = (currentPage - 1) * pageSize;
    // 获取分类列表
    const category = await productDao.GetCategory();

    let Product;
    let total;

    for (let i = 0; i < category.length; i++) {
      // 如果搜索条件为某个分类名称,直接返回该分类的商品信息
      if (search == category[i].category_name) {
        // 获取该分类的商品信息
        Product = await productDao.GetProductByCategory(
          category[i].category_id,
          offset,
          pageSize
        );
        // 获取该分类所有的商品数量,用于前端分页计算
        total = (await productDao.GetProductByCategory(category[i].category_id))
          .length;

        ctx.body = {
          code: '001',
          Product,
          total
        };
        return;
      }
    }
    // 否则返回根据查询条件模糊查询的商品分页结果
    Product = await productDao.GetProductBySearch(search, offset, pageSize);
    // 获取模糊查询的商品结果总数
    total = (await productDao.GetProductBySearch(search)).length;

    ctx.body = {
      code: '001',
      Product,
      total
    };
  },
  /**
   * 根据商品id,获取商品详细信息
   * @param {Object} ctx
   */
  GetDetails: async (ctx) => {
    let { productID } = ctx.request.body;

    const Product = await productDao.GetProductById(productID);

    ctx.body = {
      code: '001',
      Product
    };
  },
  /**
   * 根据商品id,获取商品图片,用于食品详情的页面展示
   * @param {Object} ctx
   */
  GetDetailsPicture: async (ctx) => {
    let { productID } = ctx.request.body;

    const ProductPicture = await productDao.GetDetailsPicture(productID);

    ctx.body = {
      code: '001',
      ProductPicture
    };
  },
  /**
   * 添加商品
   * @param {Object} ctx
   */
  AddProduct: async (ctx) => {
    let {
      product_name,
      product_price,
      product_num,
      product_status,
      product_picture,
      product_intro
    } = ctx.request.body;
    // 获取当前时间
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 添加商品
    const Product = await productDao.AddProduct({
      category_id: 1,
      product_name,
      product_price,
      product_num,
      product_selling_price: product_price,
      product_sales: product_num,
      product_status,
      product_picture,
      product_create_time: currentTime,
      product_intro,
      product_title: '商品'
    });
    ctx.body = {
      code: '001',
      data: Product
    };
  },
  /**
   * 修改商品
   * @param {Object} ctx
   */
  UpdateProduct: async (ctx) => {
    let {
      product_id,
      product_name,
      product_price,
      product_num,
      product_status,
      product_picture,
      product_intro
    } = ctx.request.body;
    // 获取当前时间
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // 修改商品
    const Product = await productDao.UpdateProduct({
      category_id: 1,
      product_id,
      product_name,
      product_price,
      product_num,
      product_sales: product_num,
      product_status,
      product_selling_price: product_price,
      product_picture,
      product_create_time: currentTime,
      product_intro,
      product_title: '商品'
    });
    ctx.body = {
      code: '001',
      data: Product
    };
  },
  /**
   * 删除商品
   * @param {Object} ctx
   */
  DeleteProduct: async (ctx) => {
    let { product_id } = ctx.request.body;
    // 删除商品
    const Product = await productDao.DeleteProduct(product_id);
    ctx.body = {
      code: '001',
      data: Product
    };
  },
  /**
   * 上传商品图片
   * @param {Object} ctx
   */
  UploadProductPicture: async (ctx) => {
    try {
      // 获取上传的文件
      const file = ctx.request.files.file;

      // 生成文件名
      const fileName = `${Date.now()}_${file.name}`;

      // 设置保存路径
      const uploadDir = path.join(__dirname, '../../public/upload');
      const filePath = path.join(uploadDir, fileName);
      console.log(uploadDir, 'uploadDir=====');

      // 检查目录是否存在，如果不存在则创建
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 创建可读流
      const reader = fs.createReadStream(file.path);
      // 创建可写流
      const writer = fs.createWriteStream(filePath);

      // 通过管道来传输流
      reader.pipe(writer);

      // 监听写入完成事件
      await new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log('文件写入完成');
          resolve();
        });

        writer.on('error', (err) => {
          console.error('文件写入出错:', err);
          reject(err);
        });
      });

      // 返回文件访问路径
      ctx.body = {
        code: '001',
        data: `public/upload/${fileName}`
      };
    } catch (error) {
      console.error('上传文件出错:', error);
      ctx.body = {
        code: '002',
        message: '上传文件出错'
      };
    }
  }
};
