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
import ForgetPasswordView from '@/views/ForgetPasswordView.vue'
import UserManageView from '@/views/UserManageView.vue'
import InstanceSettingsView from '@/views/InstanceSettingsView.vue'
import ProblemView from '@/views/ProblemView.vue'
import ProblemModifyView from '@/views/ProblemModifyView.vue'
import ProblemsetCreateView from '@/views/ProblemsetCreateView.vue'
import WorkView from '@/views/WorkView.vue'
import WorkshopCreateView from '@/views/WorkshopCreateView.vue'
import WorkModifyView from '@/views/WorkModifyView.vue'
import WorkEvaluateView from '@/views/WorkEvaluateView.vue'
import ProblemEvaluateView from '@/views/ProblemEvaluateView.vue'

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
      path: '/forget-password',
      name: 'forget-password',
      component: ForgetPasswordView
    },
    {
      path: '/problemset',
      name: 'problemset',
      component: ProblemsetView
    },
    {
      path: '/problemset/create',
      name: 'problemset-create',
      component: ProblemsetCreateView
    },
    {
      path: '/problem/:id',
      name: 'problem',
      component: ProblemView
    },
    {
      path: '/problem/:id/modify',
      name: 'problem-modify',
      component: ProblemModifyView
    },
    {
      path: '/problem/:id/evaluate',
      name: 'problem-evaluate',
      component: ProblemEvaluateView
    },
    {
      path: '/workshop',
      name: 'workshop',
      component: WorkshopView
    },
    {
      path: '/workshop/create',
      name: 'workshop-create',
      component: WorkshopCreateView
    },
    {
      path: '/work/:id',
      name: 'work',
      component: WorkView
    },
    {
      path: '/work/:id/modify',
      name: 'work-modify',
      component: WorkModifyView
    },
    {
      path: '/work/:id/evaluate',
      name: 'work-evaluate',
      component: WorkEvaluateView
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
      path: '/user/:id/manage',
      name: 'user-manage',
      component: UserManageView
    },
    {
      path: '/user/modify',
      name: 'user-modify',
      component: ModifyProfileView
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView
    },
    {
      path: '/instance-settings',
      name: 'instance-settings',
      component: InstanceSettingsView
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
