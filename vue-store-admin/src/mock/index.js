import Mock from 'mockjs'

// 商品数据
Mock.mock('/api/products', 'get', {
  'data|10': [{
    'id|+1': 1,
    'name': '@ctitle(5, 10)',
    'price|100-1000.2': 100,
    'stock|10-100': 10,
    'status|1': [1, 0],  // 1: 上架, 0: 下架
    'description': '@cparagraph(1, 3)',
    'createTime': '@datetime',
    'image': '@image(200x200)'  // 添加图片字段
  }]
})

// 订单数据
Mock.mock('/api/orders', 'get', {
  'data|10': [{
    'id|+1': 1,
    'orderNo': /\d{16}/,
    'userId|1-100': 1,
    'totalAmount|1000-10000.2': 1000,
    'status|0-4': 0,  // 0: 待付款, 1: 待发货, 2: 已发货, 3: 已完成, 4: 已取消
    'createTime': '@datetime',
    'shipTime': null
  }]
})

// 订单发货接口
Mock.mock(/\/api\/orders\/\d+\/ship/, 'put', {
  code: 200,
  message: '发货成功'
})

// 商品相关接口
Mock.mock('/api/products', 'post', {
  code: 200,
  message: '添加成功'
})

Mock.mock(/\/api\/products\/\d+/, 'put', {
  code: 200,
  message: '更新成功'
})

Mock.mock(/\/api\/products\/\d+/, 'delete', {
  code: 200,
  message: '删除成功'
})

// 用户数据
Mock.mock('/api/users', 'get', {
  'data|10': [{
    'id|+1': 1,
    'username': '@cname',
    'email': '@email',
    'phone': /^1[3456789]\d{9}$/,
    'registerTime': '@datetime'
  }]
})

// 用户相关接口
Mock.mock('/api/users', 'post', {
  code: 200,
  message: '添加成功'
})

Mock.mock(/\/api\/users\/\d+/, 'put', {
  code: 200,
  message: '更新成功'
})

Mock.mock(/\/api\/users\/\d+/, 'delete', {
  code: 200,
  message: '删除成功'
})

// 登录接口
Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username === 'admin' && password === 'admin') {
    return {
      code: 200,
      data: {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          username: 'admin',
          avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
          role: 'admin'
        }
      },
      message: '登录成功'
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误'
    }
  }
}) 