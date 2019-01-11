import request from '@/utils/request'
/**
 * 获取角色列表
 * @param {Object} data 过滤条件
 */
function roleList(data) {
  return request({
    url: 'role/getRole',
    method: 'post',
    data
  })
}
/**
 * 添加角色
 * @param {*} data
 */
function addRoleList(data) {
  return request({
    url: 'role/createRole',
    method: 'post',
    data
  })
}
/**
 * 编辑角色
 * @param data
 */
function updateRoleList(data) {
  return request({
    url: 'role/updateRole',
    method: 'PUT',
    data
  })
}
/**
 * 删除角色
 * @param data
 */
function deleteRoleList(data) {
  return request({
    url: 'role/deleteRole',
    method: 'DELETE',
    data
  })
}
export {
  roleList,
  addRoleList,
  updateRoleList,
  deleteRoleList
}
