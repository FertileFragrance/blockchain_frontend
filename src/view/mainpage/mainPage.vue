<template>
  <el-container>
    <el-aside width="120px"></el-aside>
    <el-aside width="360px">
      <h4>用户列表</h4>
      <el-table :data="usernames" stripe style="width: 100%" max-height="540">
        <el-table-column prop="index" label="序号" width="150" align="center">
        </el-table-column>
        <el-table-column prop="name" label="用户" width="210" align="center">
        </el-table-column>
      </el-table>
    </el-aside>
    <el-main>
      <div class="demo-avatar" align="right">
        <Avatar icon="ios-person" size="large" style="background-color: #87d068"/>
        用户：{{ this.currentUser.username }}
      </div>
      <el-button type="primary" round @click="queryBalance">查询余额</el-button>
      <br>
      <el-button type="danger" round @click="logout">退出登录</el-button>
    </el-main>
    <el-aside width="120px"></el-aside>
  </el-container>
</template>

<script>
import globalDefault from '../../Global'
import {queryAllUsersReq, queryBalanceReq} from '../../api/user'

export default {
  data () {
    return {
      currentUser: {},
      usernames: []
    }
  },
  methods: {
    gotoLogin () {
      this.$router.push('/login')
    },
    logout () {
      globalDefault.user.username = ''
      globalDefault.user.password = ''
      this.gotoLogin()
    },
    queryBalance () {
      queryBalanceReq(this.currentUser.username).then((res) => {
        console.log(res)
      })
    }
  },
  mounted () {
    if (globalDefault.user.username === '') {
      this.gotoLogin()
      return
    }
    this.currentUser = globalDefault.user
    queryAllUsersReq().then((res) => {
      for (let i = 0; i < res.data.data.length; i++) {
        this.usernames.push({
          index: i + 1,
          name: res.data.data[i]
        })
      }
    })
  }
}
</script>

<style>

</style>
