import axios from 'axios'
import qs from 'qs'
import LocalStore from '@/utils/localStore'

axios.defaults.baseURL = 'http://140.210.90.56:9008'
// axios.defaults.baseURL = 'http://212.64.13.141:8899'
// axios.defaults.baseURL = 'http://127.0.0.1:8898'
// axios.defaults.headers['Content-type'] =
//   'application/x-www-form-urlencoded;charset=UTF-8'

axios.defaults.headers['Content-type'] = 'application/json'

//设置超时
axios.defaults.timeout = 300000

axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    return Promise.reject(
      error && error.response && error.response.data ? error.response.data : ''
    )
  }
)

export default {
  post(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        // data: qs.stringify(data),
        data,
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  get(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
