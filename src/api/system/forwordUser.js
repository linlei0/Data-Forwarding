import request from '@/utils/request'
/**
 * 获取用户列表
 */
function forwordUserList() {
  return request({
    url: 'forwardUser/list',
    method: 'get'
  })
}
/**
 * 获取用户名称列表
 * @param {*} data
 */
function forwordUserNameList(data) {
  return request({
    url: 'forwardUserName/list',
    method: 'post',
    data
  })
}
/**
 * 获取添加转发用户列表
 * @param {*} data
 */
function addforwordUserNameList(data) {
  return request({
    url: 'getAddForwardUserName/list',
    method: 'post',
    data
  })
}
export {
  forwordUserList,
  forwordUserNameList,
  addforwordUserNameList
}
