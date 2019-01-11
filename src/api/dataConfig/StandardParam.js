import request from '@/utils/request'
/**
 * 获取标准数据项参数
 * @param {*} data
 */
function getStandardParam(data) {
  return request({
    url: 'standardParam/getStandardParam',
    method: 'post',
    data
  })
}
/**
 * 添加标准数据项参数
 * @param {*} data
 */
function createStandardParam(data) {
  return request({
    url: 'standardParam/createStandardParam',
    method: 'post',
    data
  })
}
/**
 * 获取父级标准参数
 */
function getStandardParamParent() {
  return request({
    url: 'common/getStandardParamParent',
    method: 'get'
  })
}
export {
  getStandardParam,
  createStandardParam,
  getStandardParamParent
}
