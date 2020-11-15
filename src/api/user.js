import request from '../utils/request'

export function registerReq (username, password) {
  return request.post('/register', {
    username: username,
    password: password
  })
}

export function loginReq (username, password) {
  return request.post('/login', {
    username: username,
    password: password
  })
}

export function addKeysReq (username) {
  return request.post('/addKeys', {
    username: username
  })
}

export function queryAllUsersReq () {
  return request.get('/queryAllUsers')
}

export function queryBalanceReq (username) {
  return request.get('/queryBalance', {
    username: username
  })
}
