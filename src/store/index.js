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
      // console.log(numbersOfImagesToSwitch)
      // перемещаем с начала массива в конец
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
    // dotsAction(state, [ind, offset]) {
    //   console.log(ind, offset)
    //   function move(from, to) {
    //     state.images.splice(to, 0, state.images.splice(from, 1)[0])
    //     return state.images
    //   }
    //   state.images = move(ind, offset)
    // },
  },
  actions: {
    next({ commit }, numbersOfImagesToSwitch) {
      commit('next', numbersOfImagesToSwitch)
    },
    prev({ commit }, numbersOfImagesToSwitch) {
      commit('prev', numbersOfImagesToSwitch)
    },
    // dotsAction({ commit }, [ind, offset]) {
    //   commit('dotsAction', [ind, offset])
    // },
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
