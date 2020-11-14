<template>
  <div class="wrap1" id="wrap1">
    <div class="logGet">
      <div class="logD logDtip">
        <p class="p1">Welcome to VBit</p>
      </div>
      <el-form ref="userForm" :model="userForm" :rules="rule" @keyup.native.enter="login('userForm')">
        <div class="lgD">
          <el-form-item prop="username">
            <img src="../../assets/login/login.png" width="20" height="20" alt="" />
            <input type="text" v-model="userForm.username" placeholder="输入用户名" />
          </el-form-item>
        </div>
        <div class="lgD">
          <el-form-item prop="password">
            <img src="../../assets/login/password.png" width="20" height="20" alt="" />
            <input type="password" v-model="userForm.password" placeholder="输入用户密码" />
          </el-form-item>
        </div>
        <div class="lgD">
          <el-form-item prop="verifyCode">
            <img src="../../assets/login/verify.png" width="20" height="20" alt="" />
            <input type="text" v-model="userForm.verifyCode" placeholder="输入验证码" />
          </el-form-item>
        </div>
      </el-form>
      <div class="login-code" @click="refreshVerifyCode">
        <v-verify ref="verify"/>
      </div>
      <div class="logC">
        <a><el-button @click="login('userForm')" >登 录</el-button></a>
      </div>
      <p class="register" @click="gotoRegister">没有账号？立即注册</p>
    </div>
  </div>
</template>

<script>
import globalDefault from '../../Global'
import { loginReq } from '../../api/user'
import verify from './verify'
export default {
  data () {
    const checkVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.$refs.verify.identifyCode) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      rule: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            message: '密码长度不能少于6位',
            trigger: 'blur'
          }
        ],
        verifyCode: [
          {
            validator: checkVerifyCode,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    refreshVerifyCode () {
      this.$refs.verify.refreshCode()
    },
    gotoRegister () {
      this.$router.push('/register')
    },
    gotoMainPage () {
      this.$router.push('/mainPage')
    },
    login (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$parent.$data.showName = true
          loginReq(this.userForm.username, this.userForm.password).then((res) => {
            console.log(res)
            if (res.data.isSuccess) {
              globalDefault.user.username = res.data.data.username
              globalDefault.user.password = res.data.data.password
              this.$Message.success('登录成功')
              this.gotoMainPage()
            } else {
              this.refreshVerifyCode()
              this.$Message.error('用户名或密码错误')
            }
          })
        } else {
          this.refreshVerifyCode()
        }
      })
    }
  },
  components: {
    'v-verify': verify
  }
}
</script>

<style>
  * {
    margin: 0 auto;
    padding: 0;
  }
  #wrap1 {
    height: 600px;
    width: 100%;
    background-position: center center;
    position: relative;
    display: flex;
    justify-content: center;
  }
  #wrap1 .logGet {
    height: 478px;
    width: 368px;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.6);
    top: 50px;
  }
  .logC a button {
    width: 100%;
    height: 45px;
    background-color: #5cadff;
    border: none;
    color: white;
    font-size: 18px;
  }
  .logGet .logD.logDtip .p1 {
    display: inline-block;
    font-size: 28px;
    margin-top: 30px;
    width: 86%;
  }
  #wrap1 .logGet .logD.logDtip {
    width: 86%;
    border-bottom: 1px solid #5cadff;
    margin: 0 auto 60px;
  }
  .logGet .lgD img {
    position: absolute;
    top: 12px;
    left: 8px;
  }
  .logGet .lgD input {
    width: 100%;
    height: 42px;
    text-indent: 2.5rem;
  }
  #wrap1 .logGet .lgD {
    width: 86%;
    position: relative;
    margin: 30px auto;
  }
  #wrap1 .logGet .logC {
    width: 86%;
    margin: 0 auto;
  }
  .register {
    margin-top: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #1ab2ff;
    cursor: pointer;
    text-align: center;
    text-indent: 8px;
  }
</style>
