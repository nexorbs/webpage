export const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/LandingPage/LandingPage.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        meta: { guest: true },
        component: () => import('../views/LoginView.vue'),
      },
      {
        path: '',
        // meta: { requiresAuth: true },
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'users',
        name: 'user-management',
        // meta: { requiresAuth: true, requiresAdmin: true }, // Commented for debug
        component: () => import('../views/UserManagementView.vue'),
      },
      {
        path: 'projects',
        name: 'project-management',
        // meta: { requiresAuth: true }, // Commented for debug
        component: () => import('../views/ProjectManagementView.vue'),
      },
      {
        path: 'tickets',
        name: 'ticket-management',
        // meta: { requiresAuth: true }, // Commented for debug
        component: () => import('../views/TicketManagementView.vue'),
      },
    ],
  },
]
