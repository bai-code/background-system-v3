import { defineStore } from 'pinia'

interface State {
  labelLeft:boolean,
  [prop:string]:string|number|boolean|object
}

export const useStore = defineStore('main', {
  state: (): State => ({
    labelLeft:true,
  }),
  actions: {
    async getInfo({ }, { }) {
      // const res = await 
    }
  }
})