import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import DiscordCallback from '../views/DiscordCallback.vue'
import Login from '../views/services/login.vue'
import Register from '../views/services/register.vue'
import auth from '../services/auth.js'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/discord-callback', name: 'DiscordCallback', component: DiscordCallback },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },     // public
  { path: '/register', name: 'Register', component: Register }, // public
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// global guard: redirect to /login if route requires auth and user not logged in
router.beforeEach((to, from, next) => {
  // if user already logged in, don't allow visiting login/register
  if ((to.name === 'Login' || to.name === 'Register') && auth.isLoggedIn()) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
