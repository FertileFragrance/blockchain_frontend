<template>
  <el-container>
    <el-aside width="120px"></el-aside>
    <el-aside width="360px">
      <h4>用户列表</h4>
      <el-table :data="usernames" stripe style="width: 100%" max-height="540">
        <el-table-column prop="index" label="序号" width="150">
        </el-table-column>
        <el-table-column prop="name" label="用户" width="210">
        </el-table-column>
      </el-table>
    </el-aside>
    <el-main>
      <div class="demo-avatar" align="right">
        <Avatar icon="ios-person" size="large" style="background-color: #87d068"/>
        用户：{{ this.currentUser.username }}
      </div>
      <el-button type="primary" round @click="mine(); dialogMineVisible = true">挖矿</el-button>
      <br>
      <el-button type="primary" round @click="addKeys(); dialogAddKeysVisible = true">增加密钥对</el-button>
      <br>
      <el-button type="primary" round @click="dialogSetDefaultAddressVisible = true">设置默认地址</el-button>
      <br>
      <el-button type="primary" round @click="dialogQueryBalanceVisible = true">查询余额</el-button>
      <br>
      <el-button type="primary" round @click="dialogTransferAccountVisible = true">给其他用户转账</el-button>
      <br>
      <el-button type="danger" round @click="logout">退出登录</el-button>
      <el-dialog title="提示" :visible.sync="dialogMineVisible" width="30%" :before-close="handleClose">
        <span>挖矿中...请稍候</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMineVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogMineVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogMineFinishedVisible" width="30%" :before-close="handleClose">
        <span>新挖到的区块是：{{ this.newBlockNonce }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMineFinishedVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogMineFinishedVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogAddKeysVisible" width="30%" :before-close="handleClose">
        <span>增加的公钥是：{{ newPublicKey }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAddKeysVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogAddKeysVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogQueryBalanceVisible" width="30%" :before-close="handleClose">
        <span>你的账户余额为{{ balance }}比特币</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogQueryBalanceVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogQueryBalanceVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogTransferAccountVisible" width="40%" :before-close="handleClose">
        <el-form :model="transferAccountForm" ref="transferAccountForm" label-width="100px"
                 class="demo-dynamic" :inline="true" @keyup.native.enter="transferAccount('transferAccountForm')">
          <el-row type="flex" class="row-bg">
            <el-col>
              <el-form-item v-for="(item, index) in transferAccountForm.items"
                            :key="item.key" :prop="'items.' + index + '.recipientName'"
                            :rules="{required: true, message: '用户名不能为空', trigger: 'blur'}">
                <el-input v-model="item.recipientName" placeholder="输入用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item v-for="(item, index) in transferAccountForm.items"
                            :key="item.key" :prop="'items.' + index + '.money'"
                            :rules="[{required: true, message: '金额不能为空', trigger: 'blur'},
                            {type: 'number', message: '请输入数字', trigger: 'blur'}]">
                <el-input v-model.number="item.money" placeholder="输入金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item v-for="item in transferAccountForm.items"
                            :key="item.key" :prop="'item'">
                <el-button @click.prevent="removeItem(item)">删除</el-button>
              </el-form-item>
            </el-col>
            <el-col><br></el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="transferAccount('transferAccountForm')">提交</el-button>
            <el-button @click="addItem">增加收款人</el-button>
            <el-button @click="resetForm('transferAccountForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogSetDefaultAddressVisible" width="30%" :before-close="handleClose">
        <el-input v-model.number="defaultAddressIndexNumber" placeholder="输入地址索引"
                  @keyup.native.enter="setDefaultAddress"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMineVisible = false">取 消</el-button>
          <el-button type="primary" @click="setDefaultAddress">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-aside width="120px"></el-aside>
  </el-container>
</template>

<script>
import globalDefault from '../../Global'
import {
  queryAllUsersReq,
  queryBalanceReq,
  mineReq,
  addKeysReq,
  transferAccountReq,
  setDefaultAddressReq
} from '../../api/user'

export default {
  data () {
    return {
      currentUser: {},
      usernames: [],
      newPublicKey: '',
      newBlockNonce: '',
      balance: -1,
      transferAccountForm: {
        items: [{
          recipientName: '',
          money: ''
        }]
      },
      defaultAddressIndexNumber: '',
      dialogMineVisible: false,
      dialogMineFinishedVisible: false,
      dialogAddKeysVisible: false,
      dialogQueryBalanceVisible: false,
      dialogTransferAccountVisible: false,
      dialogSetDefaultAddressVisible: false
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
    removeItem (item) {
      let index = this.transferAccountForm.items.indexOf(item)
      if (index !== -1) {
        this.transferAccountForm.items.splice(index, 1)
      }
    },
    resetForm (name) {
      this.$refs[name].resetFields()
    },
    addItem () {
      this.transferAccountForm.items.push({
        recipientName: '',
        money: '',
        key: Date.now()
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
        // this.balance = res.data.data.balance
      })
    },
    mine () {
      mineReq(this.currentUser.username).then((res) => {
        this.dialogMineVisible = false
        this.dialogMineFinishedVisible = true
        console.log(res.data.data)
        // TODO
        this.newBlockNonce = res.data.data
      })
    },
    addKeys () {
      addKeysReq(this.currentUser.username).then((res) => {
        this.newPublicKey = res.data.data.wallet.publicKeys[res.data.data.wallet.publicKeys.length - 1]
      })
    },
    transferAccount (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let recipientNames = []
          let moneys = []
          for (let i = 0; i < this.transferAccountForm.items.length; i++) {
            recipientNames.push(this.transferAccountForm.items[i].recipientName)
            moneys.push(this.transferAccountForm.items[i].money)
          }
          for (let i = 0; i < recipientNames.length; i++) {
            let isFound = false
            for (let j = 0; j < this.usernames.length; j++) {
              if (recipientNames[i] === this.usernames[j].name) {
                isFound = true
                break
              }
            }
            if (!isFound) {
              this.$Message.error('请输入正确的用户名')
              return
            }
          }
          let sum = 0
          for (let i = 0; i < moneys.length; i++) {
            if (moneys[i] <= 0) {
              this.$Message.error('请输入合法的金额')
              return
            }
            sum += moneys[i]
          }
          if (sum < this.balance) {
            this.$Message.error('余额不足')
            return
          }
          transferAccountReq(this.currentUser.username, recipientNames, moneys).then((res) => {
            // TODO
            console.log(res)
            this.resetForm(name)
            this.dialogTransferAccountVisible = false
            this.$Message.success('转账成功')
          })
        }
      })
    },
    setDefaultAddress () {
      if (Math.round(this.defaultAddressIndexNumber) !== this.defaultAddressIndexNumber) {
        this.$Message.error('请输入整数')
        return
      }
      setDefaultAddressReq(this.currentUser.username, this.defaultAddressIndexNumber).then((res) => {
        if (res.data.isSuccess) {
          this.$Message.success('设置成功')
          this.dialogSetDefaultAddressVisible = false
        } else {
          this.$Message.error('请输入正确范围的索引')
        }
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
    this.queryBalance()
  }
}
</script>

<style>

</style>
