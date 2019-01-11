import Mock from 'mockjs'
import loginApi from './login'
import userApi from './user'
import roleApi from './role'
import settingApi from './settingInfo'
import forwodApi from './forwordUser'
Mock.setup({
  timeout: 500
})

// 登录相关
Mock.mock(/login\/login/, 'post', loginApi.login)
Mock.mock(/login\/logout/, 'post', loginApi.logout)
Mock.mock(/user\/info/, 'get', loginApi.getUserInfo)
Mock.mock(/user\/routes/, 'get', loginApi.getRoutes)

// 用户管理
Mock.mock(/user\/list/, 'get', userApi.userList)
// 角色管理
Mock.mock(/role\/list/, 'get', roleApi.roleList)
// 设置相关
Mock.mock(/user\/getSettingInfo/, 'get', settingApi.getSettingInfo)
// 转发用户授权相关
Mock.mock(/forwordUser\/list/, 'get', forwodApi.forwordUserList)

export default Mock
