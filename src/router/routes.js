const routes = [
  {
    path: '/',
    name: 'index',
    meta: { title: '添加信息' },
    component: () => import('@/pages/Add.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    meta: { title: '信息详情' },
    component: () => import('@/pages/Detail.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
  {
    path: '/404',
    name: 'notFound',
    meta: { title: '404' },
    component: () => import('@/pages/NotFound.vue'),
  },
]
export default routes
