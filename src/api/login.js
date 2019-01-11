import request from '@/utils/request'

function login(username, password) {
  const data = {
    loginName: username,
    loginPassword: password
  }
  return request({
    url: 'login/login',
    method: 'POST',
    data
  })
}
function logout() {
  return request({
    url: 'login/logout',
    method: 'post'
  })
}
function getUserInfo(token) {
  return request({
    url: 'user/getCurrentUser',
    method: 'get'
  })
}
function getRoutes() {
  return request({
    url: 'user/getUserMenu',
    method: 'get'
  })
}
export { login, logout, getUserInfo, getRoutes }
