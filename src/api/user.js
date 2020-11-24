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
  return request.get('/queryBalance' + '?' + 'username=' + username)
}

export function mineReq (username) {
  return request.post('/mine', {
    username: username
  })
}

export function transferAccountReq (senderName, recipients, moneys) {
  return request.post('/transferAccount', {
    senderName: senderName,
    recipients: recipients,
    moneys: moneys
  })
}

export function setDefaultAddressReq (username, indexNumber) {
  return request.post('/setDefaultAddress', {
    username: username,
    indexNumber: indexNumber
  })
}
