export const state = () => ({
  isDemoPlaying: false
})

export const mutations = {
  toggleDemo (state) {
    state.isDemoPlaying = !state.isDemoPlaying
  }
}

export const getters = {
  getPlayingState (state) {
    return state.isDemoPlaying
  }
}

// import Vuex from 'vuex'

// const store = () => {
//   return new Vuex.Store({
//     state: () => ({
//       isDemoPlaying: false
//     }),
//     mutations: {
//       changeDemoState (state, value) {
//         state.isDemoPlaying = value
//       }
//     },
//     actions: {
//       changeDemoState ({commit}, value) {
//         commit('changeDemoState', value)
//       }
//     }
//   })
// }

// export default store
