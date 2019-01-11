import { getToken } from '@/utils/auth'
const userMap = [{
  userid: 1,
  username: 'admin',
  token: 'header.payload-admin.sec',
  name: '管理员',
  roles: ['admin']
},
{
  userid: 2,
  username: 'user1',
  token: 'header.payload-user1.sec',
  name: '用户1',
  roles: ['user1']
}]

const routes = {
  admin: [
    {
      name: 'System',
      children: [{
        name: 'User'
      }, {
        name: 'Role'
      }, {
        name: 'MenuManager'
      }, {
        name: 'MenuAuthorize'
      }, {
        name: 'forwardUserAuthorize'
      }]
    }
  ],
  user1: [
    {
      name: 'System',
      children: [{
        name: 'User'
      }, {
        name: 'Role'
      }]
    }
  ]
}

export default {
  login: config => {
    const { username } = JSON.parse(config.body)
    const user = userMap.filter(u => {
      return u.username === username
    })[0]
    return user
  },
  getUserInfo: config => {
    const token = getToken()
    const user = userMap.filter(u => {
      console.log(u)
      return u.token === token
    })[0]
    return user
  },
  logout: () => 'success',
  getRoutes: () => {
    const token = getToken()
    const user = userMap.filter(u => {
      return u.token === token
    })[0]
    return routes[user.roles[0]]
    // return success(routes[user.roles[0]])
  }
}
