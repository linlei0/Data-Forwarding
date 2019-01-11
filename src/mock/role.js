import { param2Obj } from '@/utils'
import Mock, { Random } from 'mockjs'

const total = 100
const roles = []
for (let i = 0; i < total; i++) {
  roles.push({
    id: i + 1,
    rolename: Random.word(),
    remakers: Mock.mock('@csentence'),
    isDataAdmin: Random.boolean() ? 1 : 0
  })
}

export default {
  roleList: config => {
    const { rolename, page, limit } = param2Obj(config.url)
    const result = rolename ? roles.filter(row => {
      return row.rolename.indexOf(rolename) > -1
    }) : roles
    return {
      total: result.length,
      list: result.slice((page - 1) * limit, page * limit)
    }
  }
}
