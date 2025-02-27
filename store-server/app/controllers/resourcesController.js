const resourcesDao = require('../models/dao/resourcesDao');
module.exports = {
  /**
   * 获取轮播图数据
   * @param {Object} ctx
   */
  Carousel: async ctx => {
    try {
      let carousel = await resourcesDao.Carousel();
      console.log('Carousel data:', carousel); // 添加日志输出
      ctx.body = {
        code: '001',
        carousel
      }
    } catch (error) {
      console.error('Error fetching carousel data:', error); // 捕获并记录错误
      ctx.body = {
        code: '002',
        message: 'Error fetching data'
      }
    }
  }
}
