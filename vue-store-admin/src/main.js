import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './mock'
import axios from './axios' // 引入我们刚刚创建的axios实例

Vue.use(ElementUI)
Vue.config.productionTip = false
// 将axios实例挂载到Vue原型上
Vue.prototype.$axios = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 
