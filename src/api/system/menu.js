import request from '@/utils/request'
/**
 * 角色列表
 * @param {Object} query 过滤条件
 */
function getMenu() {
  return request({
    url: 'menu/getMenu',
    method: 'get'

  })
}
/**
 * 新增角色
 * @param {*} o
 */
function addMenu(o) {
  const data = {
    menuName: o.menuName,
    menuPathName: o.pathName,
    menuParentId: o.parentId,
    isDisabled: o.isDisabled * 1,
    orderNo: o.orderNo
  }
  return request({
    url: 'menu/createMenu',
    method: 'post',
    data
  })
}
/**
 * 修改角色
 * @param {*} o
 */
function updateMenu(o) {
  const data = {
    menuName: o.menuName,
    menuPathName: o.pathName,
    menuId: o.id,
    isDisabled: o.isDisabled * 1,
    orderNo: o.orderNo
  }
  return request({
    url: 'menu/updateMenu',
    method: 'PUT',
    data
  })
}
/**
 * 删除角色
 * @param {*} o
 */
function deleteMenu(o) {
  console.log(o)
  const data = {
    menuId: o.id
  }
  return request({
    url: 'menu/deleteMenu',
    method: 'DELETE',
    data
  })
}
export {
  getMenu,
  addMenu,
  updateMenu,
  deleteMenu
}
