import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
// 引入elementUI相关内容
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';






Vue.config.productionTip = false
// 在当前项目中使用elementUI
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
/* 与上一段相同
new Vue({
  el: '#app',
  render: h => h(App)
}); */