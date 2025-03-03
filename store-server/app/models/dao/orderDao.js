const db = require('./db.js');

module.exports = {
  // 连接数据库获取所有的订单id
  GetOrderGroup: async (user_id) => {
    const sql =
      'select order_id from orders where user_id = ? group by order_id order by order_id desc';
    return await db.query(sql, [user_id]);
  },
  // 连接数据库获取所有的订单详细信息
  GetOrder: async (user_id) => {
    let sql = 'select * from orders where user_id =? order by order_time desc';
    return await db.query(sql, user_id);
  },
  // 连接数据库插入订单信息
  AddOrder: async (length, data) => {
    let sql = 'insert into orders values(null,?,?,?,?,?,?,?)';
    for (let i = 0; i < length - 1; i++) {
      sql += ',(null,?,?,?,?,?,?,?)';
    }
    return await db.query(sql, data);
  },
  // 获取全部订单
  GetAllOrder: async () => {
    const sql = `
    SELECT 
        o.id,
        o.user_id,
        o.order_id,
        u.userName,
        o.product_id,
        o.product_num,
        o.product_price,
        o.order_time,
        o.order_status
    FROM 
        orders o
    JOIN 
        users u ON o.user_id = u.user_id
    ORDER BY 
        o.order_time DESC;
`;
    return await db.query(sql, []);
  },
  //修改订单状态
  HandleOrderStatus: async (id, order_status) => {
    const sql = 'UPDATE orders SET order_status = ? WHERE id = ?';
    try {
      const result = await db.query(sql, [order_status, id]);
      return result;
    } catch (error) {
      console.error('修改订单状态出错:', error);
      throw error;
    }
  }
};
