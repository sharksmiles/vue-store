
const Koa = require('koa');
const cors = require('koa2-cors');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const Session = require('koa-session');

let { Port, staticDir } = require('./config');

let app = new Koa();

// 使用koa2-cors中间件
app.use(cors({
  origin: 'http://localhost:8080', // 允许的前端地址
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的HTTP方法
  allowHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));

// 处理异常
const error = require('./app/middleware/error');
app.use(error);

// 为静态资源请求重写url
const rewriteUrl = require('./app/middleware/rewriteUrl');
app.use(rewriteUrl);
// 使用koa-static处理静态资源
app.use(KoaStatic(staticDir));

// session
const CONFIG = require('./app/middleware/session');
app.keys = ['session app keys'];
app.use(Session(CONFIG, app));

// 判断是否登录
const isLogin = require('./app/middleware/isLogin');
app.use(isLogin);

app.use(async (ctx, next) => {
  ctx.state.user = ctx.session.user;
  await next();
});

// 处理请求体数据
const koaBodyConfig = require('./app/middleware/koaBodyConfig');
app.use(KoaBody(koaBodyConfig));

// 使用路由中间件
const Routers = require('./app/routers');
app.use(Routers.routes()).use(Routers.allowedMethods());

app.listen(Port, () => {
  console.log(`服务器启动在${ Port }端口`);
});
