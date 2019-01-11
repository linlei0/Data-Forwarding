import { setTheme, getTheme } from '@/utils/lfStore'

const themeList = [
  {
    title: '经典',
    name: 'default'
  },
  {
    title: '蓝色',
    name: 'blue'
  }
]
const defaultTheme = themeList[0].name
const theme = {
  namespaced: true,
  state: {
    list: themeList,
    activeName: defaultTheme
  },
  getters: {
    activeSetting(state) {
      return state.list.find(theme => theme.name === state.activeName)
    }
  },
  mutations: {
    set(state, theme) {
      state.activeName = theme
      document.body.className = `theme-${state.activeName}`
    }
  },
  actions: {
    load({ commit }) {
      return new Promise(async resolve => {
        const theme = await getTheme()
        commit('set', theme || defaultTheme)
        resolve()
      })
    },
    set({ commit }, theme) {
      commit('set', theme)
      return setTheme(theme)
    }
  }
}
export default theme
