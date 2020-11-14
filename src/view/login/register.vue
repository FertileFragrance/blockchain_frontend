<template>
  <div class="wrap" id="wrap">
    <div class="logGet">
      <div class="logD logDtip">
        <p class="p1">Welcome to VBit</p>
      </div>
      <el-form ref="userForm" :model="userForm" :rules="rule" @keyup.native.enter="register('userForm')">
        <div class="lgD">
          <el-form-item prop="username">
            <img src="../../assets/login/login.png" width="20" height="20" alt=""/>
            <input type="text" v-model="userForm.username" placeholder="请输入你的用户名"/>
          </el-form-item>
        </div>
        <div class="lgD">
          <el-form-item prop="password">
            <img src="../../assets/login/password.png" width="20" height="20" alt=""/>
            <input type="password" v-model="userForm.password" placeholder="输入你的用户密码"/>
          </el-form-item>
        </div>
        <div class="lgD">
          <el-form-item prop="passwordCheck">
            <img src="../../assets/login/verify.png" width="20" height="20" alt=""/>
            <input type="password" v-model="userForm.passwordCheck" placeholder="请再次输入密码"/>
          </el-form-item>
        </div>
      </el-form>
      <div class="logC">
        <a>
          <button @click="register('userForm')">注 册</button>
        </a>
      </div>
      <p class="login" @click="gotoLogin">已有账号？立即登录</p>
    </div>
  </div>
</template>

<script>
import {registerReq} from '../../api/user'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入你的密码'))
      } else {
        if (this.userForm.passwordCheck !== '') {
          this.$refs.userForm.validateField('passwordCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再一次输入你的密码'))
      } else if (value !== this.userForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        username: '',
        password: '',
        passwordCheck: ''
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
            validator: validatePass,
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ],
        passwordCheck: [
          {
            validator: validatePassCheck,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    gotoLogin () {
      this.$router.push('/login')
    },
    register (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          registerReq(this.userForm.username, this.userForm.password).then((res) => {
            if (res.data.isSuccess) {
              this.$Message.success('注册成功')
              this.gotoLogin()
            } else {
              this.$Message.error('该用户已存在')
            }
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>

<style>
* {
  margin: 0 auto;
  padding: 0;
}

#wrap {
  height: 600px;
  width: 100%;
  background-position: center center;
  position: relative;
  display: flex;
  justify-content: center;
}

#wrap .logGet {
  height: 438px;
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

#wrap .logGet .logD.logDtip {
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

#wrap .logGet .lgD {
  width: 86%;
  position: relative;
  margin: 30px auto;
}

#wrap .logGet .logC {
  width: 86%;
  margin: 0 auto;
}

.login {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: center;
  text-indent: 8px;
}
</style>
