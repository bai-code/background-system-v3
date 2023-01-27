import axios from 'axios'

const intance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

let token : string|null = ''

intance.interceptors.request.use(config => {
  if (!token) {
    token = sessionStorage.getItem('token')||''
    config.headers['Authorization'] = token
  }
  return config
})

intance.interceptors.response.use(res => {
  if (res && res.status === 200) {
    return res.data || {}
  }
  return {}
}, err => {
  console.log(err);

})

export default intance