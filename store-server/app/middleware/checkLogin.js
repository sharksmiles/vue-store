

/**
 * 校验用户是否登录
 * @param {Object} ctx
 * @param {int} user_id
 * @returns
 */
module.exports = function (ctx, user_id) {
  // 判断请求传递的用户id 与 session中的用户id是否一致
  if (user_id != ctx.session.user.user_id) {
    ctx.body = {
      code: '401',
      msg: '用户名没有登录，请登录后再操作'
    }
    return false;
  }
  return true;
}
