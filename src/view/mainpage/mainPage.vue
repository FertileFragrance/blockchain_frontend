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
      <el-button type="primary" round @click="mine(); dialogMineVisible = true">挖矿</el-button>
      <el-dialog title="提示" :visible.sync="dialogMineVisible" width="30%" :before-close="handleClose">
        <span>挖矿中...请稍候</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMineVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogMineVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogMineFinishedVisible" width="30%" :before-close="handleClose">
        <span>新挖到的区块是：XXX</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMineFinishedVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogMineFinishedVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <br>
      <el-button type="primary" round @click="addKeys(); dialogAddKeysVisible = true">增加密钥对</el-button>
      <el-dialog title="提示" :visible.sync="dialogAddKeysVisible" width="30%" :before-close="handleClose">
        <span>增加的公钥是：{{ newPublicKey }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAddKeysVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogAddKeysVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <br>
      <el-button type="primary" round @click="queryBalance(); dialogQueryBalanceVisible = true">查询余额</el-button>
      <el-dialog title="提示" :visible.sync="dialogQueryBalanceVisible" width="30%" :before-close="handleClose">
        <span>你的账户余额为{{ balance }}比特币</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogQueryBalanceVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogQueryBalanceVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <br>
      <el-button type="danger" round @click="logout">退出登录</el-button>
    </el-main>
    <el-aside width="120px"></el-aside>
  </el-container>
</template>

<script>
import globalDefault from '../../Global'
import {queryAllUsersReq, queryBalanceReq, mineReq, addKeysReq} from '../../api/user'

export default {
  data () {
    return {
      currentUser: {},
      usernames: [],
      newPublicKey: '',
      balance: -1,
      dialogMineVisible: false,
      dialogMineFinishedVisible: false,
      dialogAddKeysVisible: false,
      dialogQueryBalanceVisible: false
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
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
        // TODO
        this.balance = res.data.data.balance
      })
    },
    mine () {
      mineReq(this.currentUser.username).then((res) => {
        this.dialogMineVisible = false
        this.dialogMineFinishedVisible = true
        console.log(res)
        // TODO
      })
    },
    addKeys () {
      addKeysReq(this.currentUser.username).then((res) => {
        this.newPublicKey = res.data.data.wallet.publicKeys[res.data.data.wallet.publicKeys.length - 1]
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
