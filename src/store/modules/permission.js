import { constantRouterMap, routerMap, wildcard } from '@/router'
import { getRoutes } from '@/api/login'

function filterAsyncRoute(routeNames, routes) {
  const asyncRoutes = []
  // console.log(asyncRoutes)
  routeNames.forEach(r => {
    const sourceRoute = routes.filter(sr => {
      // console.log(asyncRoutes)
      if (sr.name === r.pathName) {
        sr.menuName = r.menuName
        return sr
      }
    })[0]
    if (sourceRoute) {
      const targetRoute = Object.assign({}, sourceRoute)
      if (r.children) {
        targetRoute.children = filterAsyncRoute(r.children, sourceRoute.children)
      }
      asyncRoutes.push(targetRoute)
    }
  })
  return asyncRoutes
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    setRoutes: (state, routes) => {
      state.addRouters = routes
      state.routers = constantRouterMap.concat(routes)
    //  console.log(state)
    }
  },
  actions: {
    generateRoutes({ commit }, data) {
      return new Promise(resolve => {
        getRoutes().then(res => {
          // console.log(res.data.data)
          commit('setRoutes', filterAsyncRoute(res.data.data, routerMap).concat(wildcard))
          resolve()
        })
      })
    }
  }
}

export default permission
