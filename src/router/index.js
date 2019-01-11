import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'

import { constantRouterMap } from './modules/constant'

import { errorRoute } from './modules/error'
Vue.use(Router)
// 页面导航路由
const pageRoute = [
  {
    path: '/system',
    icon: 'el-icon-menu',
    component: Layout,
    redirect: 'noredirect',
    name: 'System',
    meta: {
      title: 'system',
      icon: 'el-icon-menu'
    },
    children: [
      {
        path: 'menumanager',
        component: () => import('@/views/system/menuManager'),
        name: 'MenuManager',
        meta: { title: 'MenuManager' }
      },
      {
        path: 'user',
        component: () => import('@/views/system/user'),
        name: 'User',
        meta: { title: 'user' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'Role',
        meta: { title: 'role' }
      },
      {
        path: 'menuauthorize',
        component: () => import('@/views/system/menuAuthorize'),
        name: 'MenuAuthorize',
        meta: { title: 'menuAuthorize' }
      }
    ]
  }, {
    path: '/dataConfig',
    icon: 'el-icon-menu',
    component: Layout,
    redirect: 'noredirect',
    name: 'DataConfig',
    meta: {
      title: 'dataConfig',
      icon: 'el-icon-menu'
    },
    children: [{
      path: 'protocolData',
      component: () => import('@/views/dataConfig/protocolData'),
      name: 'ProtocolData',
      meta: { title: 'protocolData' }
    },
    {
      path: 'protocolConfig',
      component: () => import('@/views/dataConfig/protocolConfig'),
      name: 'ProtocolConfig',
      meta: { title: 'protocolConfig' }
    },
    {
      path: 'formulaConfig',
      component: () => import('@/views/dataConfig/formulaConfig'),
      name: 'FormulaConfig',
      meta: { title: 'FormulaConfig' }
    },
    {
      path: 'standardParams',
      component: () => import('@/views/dataConfig/standardParams'),
      name: 'StandardParams',
      meta: { title: 'StandardParams' }
    },
    {
      path: '401',
      component: () => import('@/views/errorPage/401'),
      name: 'Page401',
      meta: { title: 'page401', icon: 'el-icon-warning' }
    }]
  }
]

const routerMap = [
  errorRoute,
  ...pageRoute
]

/**
 * 通配路由
 */
const wildcard = [
  { path: '*', redirect: '/404', hidden: true }
]
const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export default router
export { constantRouterMap, routerMap, wildcard, pageRoute }
