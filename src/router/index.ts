import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProblemsetView from '@/views/ProblemsetView.vue'
import WorkshopView from '@/views/WorkshopView.vue'
import SubmissionsView from '@/views/SubmissionsView.vue'
import UsersView from '@/views/UsersView.vue'
import UserView from '@/views/UserView.vue'
import ModifyProfileView from '@/views/ModifyProfileView.vue'
import ForumView from '@/views/ForumView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/problemset',
      name: 'problemset',
      component: ProblemsetView
    },
    {
      path: '/workshop',
      name: 'workshop',
      component: WorkshopView
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: SubmissionsView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView
    },
    {
      path: '/user/:id',
      name: 'user',
      component: UserView
    },
    {
      path: '/user/:id/modify',
      name: 'user-modify',
      component: ModifyProfileView
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
