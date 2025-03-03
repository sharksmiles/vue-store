const db = require('./db.js');
const { GetAllOrder } = require('./orderDao.js');

module.exports = {
  // 连接数据库根据用户名和密码查询用户信息
  Login: async (userName, password) => {
    const sql = 'select * from users where userName = ? and password = ?';
    return await db.query(sql, [userName, password]);
  },
  // 连接数据库根据用户名查询用户信息
  FindUserName: async (userName) => {
    const sql = 'select * from users where userName = ?';
    return await db.query(sql, [userName]);
  },
  // 连接数据库插入用户信息
  Register: async (userName, password, userPhoneNumber) => {
    const sql = 'insert into users values(null,?,?,?)';
    return await db.query(sql, [userName, password, userPhoneNumber]);
  },
  GetAllUser: async () => {
    const sql = 'select * from users';
    return await db.query(sql, []);
  },
  DeleteUserId: async (user_id) => {
    const sql = 'delete from users where user_id = ?';
    return await db.query(sql, user_id);
  },
  ChangeUserInfo: async ({ user_id, password, userName, userPhoneNumber }) => {
    let sql;
    let values;

    if (password) {
      // 如果密码不为空，则更新密码、用户名和电话号码
      sql = `UPDATE users 
            SET  password =?, userName =?, 
                userPhoneNumber =?
            WHERE user_id =?`;
      values = [password, userName, userPhoneNumber, user_id];
    } else {
      // 如果密码为空，则只更新用户名和电话号码
      sql = `UPDATE users 
            SET  userName =?, 
                userPhoneNumber =?
            WHERE user_id =?`;
      values = [userName, userPhoneNumber, user_id];
    }
    try {
      const [result] = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error('更新用户信息时出错:', error);
      throw error;
    }
  }
};
