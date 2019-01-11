import { param2Obj } from '@/utils'
import { Random } from 'mockjs'

const total = Math.floor(Math.random() * 30)
const roles = []
for (let i = 0; i < total; i++) {
  roles.push({
    id: i + 1,
    forwordname: Random.cname()
  })
}

export default {
  forwordUserList: config => {
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
