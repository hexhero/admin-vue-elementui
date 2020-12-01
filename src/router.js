/**
 * 路由配置
 */

import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'

Vue.use(Router)

const router = new Router({
    mode:'history',
    routes:[
        {path:'/', redirect:'/login'},
        {path:'/login',component: Login},
        {
            path:'/home',
            component: Home,
            redirect:'/welcome',
            children:[
                {path:'/welcome',component: Welcome},
                {path:'/users',component: Users}
            ]
        }
    ]
})

/**
 * 路由前置守卫, 判断用户是否有权限访问路由
 * from 从哪来
 * to 到哪去
 * next 放行
 */
router.beforeEach((to, from, next) => {
    // 如果是登陆页, 放行
    if(to.path === '/login') return next();
    // 获取授权码
    const authentication = window.sessionStorage.getItem('token')
    // 没有授权吗, 跳转到登陆页
    if(!authentication) return next('/login');
    // 有授权码, 放行
    next()
})

export default router