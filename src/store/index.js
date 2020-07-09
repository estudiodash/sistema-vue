import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    isLoading: false,
  },
  mutations: {
    SET_TOKEN(state,token){
      state.token = token;
    },
    SET_USER(state,user){
      state.user = user;
    },
    UPDATE_LOADING(state, status){
      state.isLoading = status;
    }
  },
  actions: {
    SAVE_TOKEN({commit}, token){
      commit("SET_TOKEN", token);
      commit("SET_USER", decode(token));
      localStorage.setItem("token", token);
    },
    AUTOLOGIN({commit}){
      let token = localStorage.getItem('token');
      if(token){
        commit("SET_TOKEN", token);
        commit("SET_USER", decode(token));
      }
      router.push({name: 'home'})
    },
    LOGOUT({commit}){
      commit("SET_TOKEN", null);
      commit("SET_USER", null);
      localStorage.removeItem("token");
      router.push({name: 'login'})
    },
    LOADING({commit}, status){
      commit("UPDATE_LOADING", status);
    }
  },
  modules: {
  }
})
