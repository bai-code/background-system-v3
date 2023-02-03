import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginIn from '@/views/Login.vue'
import users from '@/views/user-management/users.vue'
import rights from '@/views/rights-management/rights.vue'
import roles from '@/views/rights-management/roles.vue'



const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'login' }
  }, {
    path: '/home',
    name: 'home',
    component: HomeView,
    redirect: { name: 'welcome' },
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/welcome.vue'),

      },
      {
        path: 'users',
        children: [
          {
            path: 'users',
            name: 'users',
            component: users,
          }
        ]
      },
      {
        path: 'rights',
        redirect: { name: 'roles' },
        children: [
          {
            path: 'roles',
            name: 'roles',
            component: roles
          },
          {
            path: 'rights',
            name: 'rights',
            component: rights
          },
        ]
      },
    ]
  }, {
    path: '/login',
    name: 'login',
    component: LoginIn
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token: string | null = sessionStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }

})

export default router
