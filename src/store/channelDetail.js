export const state = () => ({
  payload: {},
  formattedAddress: '' // 地图数据，懒得建store，放在这里吧
})

export const mutations = {
  setPayload(state, payload) {
    state.payload = payload
  },
  formattedAddress(state, formattedAddress){
    state.formattedAddress = formattedAddress
  }
}

export const getters = {
  getPayload(state) {
    return state.payload
  },
  getAddress(state) {
    return state.formattedAddress
  },
}
