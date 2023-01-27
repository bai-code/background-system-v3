import axios from 'axios'


const intance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

intance.interceptors.request.use(req => {
  return req
})

intance.interceptors.response.use(res => {
  return res
})

export default intance