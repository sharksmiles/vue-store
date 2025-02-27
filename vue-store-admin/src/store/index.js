import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_USER(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/api/login', credentials)
        if (response.data.code === 200) {
          const { token, user } = response.data.data
          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          return user
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || '登录失败')
      }
    },
    logout({ commit }) {
      commit('CLEAR_USER')
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user || {}
  }
}) 