import { createStore } from 'vuex'

export default createStore({
  state: {
    images: arr(),
  },
  getters: {
    getImages(state) {
      return state.images
    },
  },
  mutations: {
    next(state, numbersOfImagesToSwitch) {
      async function goEnd() {
        let removedFromStart = await state.images.splice(
          0,
          numbersOfImagesToSwitch,
        )
        state.images = [...state.images, ...removedFromStart]
      }
      goEnd()
    },

    prev(state, numbersOfImagesToSwitch) {
      async function goStart() {
        let removedFromEnd = await state.images.splice(
          state.images.length - numbersOfImagesToSwitch,
          numbersOfImagesToSwitch,
        )
        state.images = [...removedFromEnd, ...state.images]
      }
      goStart()
    },
  },
  actions: {
    next({ commit }, numbersOfImagesToSwitch) {
      commit('next', numbersOfImagesToSwitch)
    },
    prev({ commit }, numbersOfImagesToSwitch) {
      commit('prev', numbersOfImagesToSwitch)
    },
  },
  modules: {},
})

function arr() {
  return [
    { id: 0, src: '1.jpg', text: 'Описание' },
    { id: 1, src: '2.jpg', text: 'Описание' },
    { id: 2, src: '3.jpg', text: 'Описание' },
    { id: 3, src: '4.jpg', text: 'Описание' },
    { id: 4, src: '5.jpg', text: 'Описание' },
    { id: 5, src: '6.jpg', text: 'Описание' },
    { id: 6, src: '7.jpg', text: 'Описание' },
    { id: 7, src: '8.jpg', text: 'Описание' },
    { id: 8, src: '9.jpg', text: 'Описание' },
  ]
}
