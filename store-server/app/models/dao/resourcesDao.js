const db = require('./db.js');
module.exports = {
  // 连接数据库获取轮播图数据
  Carousel: async () => {
    const sql = 'select * from carousel';
    try {
      const result = await db.query(sql, []);
      console.log('SQL Query Result:', result); // 添加日志输出
      return result;
    } catch (error) {
      console.error('Error executing SQL query:', error); // 捕获并记录错误
      throw error;
    }
  }
};
