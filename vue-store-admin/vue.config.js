module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.121.209:3600', // 本地后端地址
        // target: 'http://101.132.181.9:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

}
