const { default: axios } = require("axios")

const request = axios.create({
  baseURL: 'https://www.yuque.com/api/v2'
})

