// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false


import 'element-ui/lib/theme-chalk/index.css';
import ElementUI , {Message} from 'element-ui';
Vue.use(ElementUI);


const dev = "http://127.0.0.1:6060/";
const prod = "http://cdns.gnnu.work/api/"
// const prod = "http://122.51.31.39:6060/"
// const prod = "http://127.0.0.1:6060/"

// 引入axios
import axios from 'axios' 
Vue.prototype.$axios = axios
axios.defaults.baseURL = prod // 默认连接地址 
Vue.prototype.$axios = axios
import QS from 'qs' // 使用qs对post传送的据序列化
Vue.prototype.qs = QS; 

//引入font-awesome  https://www.cnblogs.com/luziluck/p/10013474.html
// import 'font-awesome/css/font-awesome.min.css' 

//全局js
import globalFunctions from './assets/js/globalFunctions'
Vue.use(globalFunctions)

//引入全局css
import './assets/css/globecss.css'  

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
