import request from '@/utils/request'
/**
 * 用户列表
 * @param {Object} data 过滤条件
 */
function userList(data) {
  return request({
    url: 'user/getUser',
    method: 'post',
    data
  })
}
/**
 * 添加用户
 * @param {object} data
 */
function addUserList(data) {
  return request({
    url: 'user/createUser',
    method: 'post',
    data
  })
}
/**
 * 编辑用户
 * @param {object} data
 */
function updateUserList(data) {
  return request({
    url: 'user/updateUser',
    method: 'PUT',
    data
  })
}
/**
 * 删除用户
 */
function deleteUserList(data) {
  return request({
    url: 'user/deleteUser',
    method: 'DELETE',
    data
  })
}
/**
 * 获取角色下拉框
 */
function getRoleComboBox() {
  return request({
    url: 'common/getAllRole',
    method: 'get'
  })
}
export {
  userList,
  addUserList,
  updateUserList,
  deleteUserList,
  getRoleComboBox

}
