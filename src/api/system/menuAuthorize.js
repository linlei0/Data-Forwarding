import request from '@/utils/request'

/**
 * 获取角色
 */
function getRoleList() {
  return request({
    url: 'common/getAllRole',
    method: 'get'
  })
}
/**
 * 获取菜单列表
 */
function getRoleMenu() {
  return request({
    url: 'roleMenu/getRoleMenu',
    method: 'get'
  })
}
/**
 * 获取用户的权限
 * @param {data}
 */
function getRoleMenuSetting(data) {
  return request({
    url: 'roleMenu/getRoleMenuSetting',
    method: 'get',
    data
  })
}
/**
 * 设置用户权限
 */
function setRoleMenuSetting(data) {
  return request({
    url: 'roleMenu/setRoleMenuRight',
    method: 'post',
    data
  })
}
export {
  getRoleList,
  getRoleMenu,
  getRoleMenuSetting,
  setRoleMenuSetting
}
