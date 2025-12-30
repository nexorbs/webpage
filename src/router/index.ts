import { createRouter, createWebHistory } from 'vue-router'
import { AuthManager } from '@/helpers/authManager'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

/**
 *
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = AuthManager.isLoggedIn()

  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      next('/login')
      return
    }

    const isValid = await AuthManager.verifyToken()
    if (!isValid) {
      next('/login')
      return
    }

    if (to.meta.requiresAdmin) {
      const user = AuthManager.getUser()
      if (!user || user.role !== 'admin') {
        next('/dashboard')
        return
      }
    }
  }

  if (to.meta.guest && isLoggedIn) {
    next('/dashboard')
    return
  }

  next()
})
 */

export default router
