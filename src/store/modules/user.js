import { login, getUserInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userId: '',
    username: '',
    name: '',
    roles: []
  },
  mutations: {
    setUserName: (state, username) => {
      state.username = username
    },
    setToken: (state, token) => {
      state.token = token
    },
    setInfo: (state, data) => {
    //  console.log(data)
      state.userId = data.userId
      state.username = data.realName
      // state.name = name
      state.roles = [data.loginName]
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      const name = username.trim()
      return new Promise((resolve, reject) => {
        login(name, password).then(({ data }) => {
          const result = data.data
          commit('setToken', result.accessToken)
          setToken(result.accessToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(getToken()).then(({ data }) => {
          if (!data) {
            reject('error')
          }
          commit('setInfo', data.data)
          resolve(data)
        })
      })
    },
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('logout')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    fedLogout({ commit }) {
      return new Promise(resolve => {
        commit('setToken', '')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
