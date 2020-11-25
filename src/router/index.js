import Vue from 'vue'
import Router from 'vue-router'
import homePage from '../view/login/homePage'
import login from '../view/login/login'
import register from '../view/login/register'
import mainPage from '../view/mainpage/mainPage'
import firstPage from '../view/edusystem/firstPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: homePage
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/mainPage',
      component: mainPage
    },
    {
      path: '/firstPage',
      component: firstPage
    }
  ]
})
