import { defineStore } from 'pinia'

interface State {

}

export const useStore = defineStore('main', {
  state: (): State => ({
    num: 22
  }),
  actions: {
    async getInfo({ }, { }) {
      // const res = await 
    }
  }
})