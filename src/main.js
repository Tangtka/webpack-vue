import Vue from "vue";
import App from "./App";
import router from './router/index.js';
import store from './store/index.js';

new Vue({
  router,
  store,
  render:h=>h(App),
}).$mount('#app')
