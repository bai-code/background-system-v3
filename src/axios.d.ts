import * as axios from 'axios'

declare module axios {
  interface AxiosIntance {
    (config: AxiosRequestConfig): Promise<any>,
    set(headers):AxiosHeaders
  }
}