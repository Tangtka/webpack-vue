import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import("./../view/index/Index.vue"),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import("./../view/about/About.vue"),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("./../view/login/Login.vue"),
  },
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})
