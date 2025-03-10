var mysql = require('mysql');
const { dbConfig } = require('../../../config');
var pool = mysql.createPool(dbConfig);

var db = {};

db.query = function (sql, params) {
  return new Promise((resolve, reject) => {
    // 取出链接
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, params, function (error, results, fields) {
        console.log(`${sql}=>${params}`);
        // 释放连接
        connection.release();
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
};

db.getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
};

// 导出对象
module.exports = db;
