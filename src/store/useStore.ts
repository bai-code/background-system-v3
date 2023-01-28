import { defineStore } from 'pinia'
import axios from '@/tools/axios'

interface State {
  labelLeft: boolean,
  [prop: string]: string | number | boolean | object
}

export const useStore = defineStore('main', {
  state: (): State => ({
    labelLeft: true,
  }),
  actions: {
    // async getInfo(path: string, method: string = 'get', body?: object) {
    //   console.log(method, path);
    //   if (method === 'get' || method === 'put') {
    //     const res = await axios.get(path)
    //     console.log(res);
    //   } else {
    //     const res = await axios.put(path, body)
    //     console.log(res);

    //   }

    // }
  }
})