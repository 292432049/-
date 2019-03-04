/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:22:52
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-15 08:15:05
 */

<template>
  <div class="login-container">
    <section class="login_logo">
      <img src="../../assets/login_fill.png" />
    </section>
    <section class="login_container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="card-box login-form">
        <h3 class="title">{{ resetPwdMode?"忘记密码":"欢迎登录小麦快租" }}</h3>
        <el-form-item
          class="login_item"
          prop="mobile">
          <el-input
            v-model="loginForm.mobile"
            type="text"
            clearable
            placeholder="请输入账号">
            <i
              slot="prefix"
              class="iconfont icon-user-fill" />
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="resetPwdMode"
          :rules="loginRules.verifyCode"
          class="login_item"
          prop="verifyCode">
          <el-input
            v-model="loginForm.verifyCode"
            type="text"
            maxlength="6"
            placeholder="请输入验证码">
            <i
              slot="prefix"
              class="iconfont icon-codev" />
          </el-input>
          <div class="login_code_wrap">
            <el-button
              v-if="sendAuthCode"
              ref="sendVerifyRef"
              type="primary"
              @click="sendVerifyCode">发送验证码</el-button>
            <span
              v-else
              slot="append"
              class="disabled">{{ auth_time }}s后重新发送</span>
          </div>
        </el-form-item>
        <el-form-item
          v-show="resetPwdMode"
          :rules="loginRules.newPassword"
          class="login_item"
          prop="newPassword">
          <el-input
            v-model="loginForm.newPassword"
            type="password"
            clearable
            auto-complete="new-password"
            placeholder="请输入新密码"
            @keyup.enter.native="handleLogin">
            <i
              slot="prefix"
              class="iconfont icon-lock-fill-open" />
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="!resetPwdMode"
          :rules="loginRules.password"
          class="login_item"
          prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            clearable
            auto-complete="new-password"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin">
            <i
              slot="prefix"
              class="iconfont icon-lock-fill-open" />
          </el-input>
        </el-form-item>
        <div class="login_reset_pwd">
          <a @click="toggleLoginResetMode">{{ resetPwdMode?"返回":"忘记密码" }}</a>
        </div>
        <el-form-item class="login_handle">
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            class="btn_login"
            @click.native.prevent="handleLogin">
            {{ resetPwdMode?"重置":"登录" }}
          </el-button>
        </el-form-item>
        <div
          v-if="!resetPwdMode"
          class="login-call-tip">
          新用户请联系<span>400-882-7099</span>为您开通账号
        </div>
      </el-form>
    </section>
    <el-dialog
      :visible.sync="modifyPassLayer"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="修改初始密码"
      width="500px"
      @close="handleClose">
      <el-form
        ref="modifyPassForm"
        :model="modifyPassData"
        :rules="modifyPassRules"
        label-width="80px">
        <el-form-item label="手机">
          <el-input
            v-model="modifyPassData.account"
            :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="verifyCode">
          <el-row>
            <el-input
              v-model="modifyPassData.verifyCode"
              placeholder="请输入验证码">
              <el-button
                v-if="sendAuthCode"
                ref="sendVerifyRef"
                slot="append"
                class="sendCode"
                @click="sendVerifyCode">发送验证码</el-button>
              <span
                v-else
                slot="append"
                class="disabled">{{ auth_time }}s后重新发送</span>
            </el-input>
          </el-row>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="modifyPassword">
          <el-input
            v-model="modifyPassData.modifyPassword"
            type="password"
            placeholder="请输入6-12位密码"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="sureModifyPass">确 定</el-button>
        <el-button
          @click="modifyPassLayer = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { loginApi, sendVerifyCodeApi } from '@/api/user'
import { SHA2 } from '@/utils/sha'

export default {
  name: 'Login',
  data () {
    const validateAccount = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateNewPass = (rule, value, callback) => {
      if (this.resetPwdMode && !value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const modifyValidatePass = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error('请输入密码'))
      }
      setTimeout(() => {
        if (value.length < 6 || value.lenght > 12) {
          callback(new Error('请输入6-12位密码'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      loginForm: {
        mobile: localStorage.getItem('CURRENT_ACCOUNT'),
        password: '',
        newPassword: '', // 忘记密码功能中的密码
        verifyCode: ''
      },
      loginRules: {
        mobile: [
          { required: true, trigger: 'blur', message: '请输入账号', validator: validateAccount }
        ],
        verifyCode: [
          { required: true, trigger: 'blur', message: '请输入验证码' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        newPassword: [
          { required: true, trigger: 'blur', validator: validateNewPass }
        ]
      },
      modifyPassRules: {
        modifyPassword: [
          { required: true, trigger: 'blur', validator: modifyValidatePass }
        ],
        verifyCode: [
          { required: true, trigger: 'blur', message: '请输入验证码' }
        ]
      },
      loading: false,
      modifyPassLayer: false,
      modifyPassData: {
        'account': '',
        'modifyPassword': '',
        'verifyCode': '',
        'mobile': ''
      },
      sendAuthCode: true,
      auth_time: 0,
      auth_timetimer: null,
      resetPwdMode: false
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.resetPwdMode) {
          this.sureModifyPass(this.loginForm.mobile)
        } else {
          this.doLogin(this.loginForm.password)
        }
      })
    },
    doLogin (password) {
      this.loading = true
      this.$store.dispatch('Login', {
        mobile: this.loginForm.mobile,
        password
      }).then((res) => {
        this.loading = false
        this.modifyPassData.account = this.loginForm.mobile
        localStorage.setItem('CURRENT_ACCOUNT', this.loginForm.mobile)
        if (res.firstLogin) {
          this.modifyPassLayer = true
        } else {
          this.$router.push({ path: '/' })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleClose () {
      this.modifyPassData = {}
      this.$refs.modifyPassForm.clearValidate()
      this.sendAuthCode = true
      clearInterval(this.auth_timetimer)
    },
    sureModifyPass (mobile) { // 确认提交修改密码
      let param
      if (mobile) { // 忘记密码
        param = {
          'account': mobile,
          'newPassword': this.loginForm.newPassword,
          'verifyCode': this.loginForm.verifyCode
        }
        loginApi.retrievePassword({
          ...param,
          newPassword: SHA2(param.newPassword)
        }).then(() => {
          this.$message.success('密码修改成功')
          this.doLogin(param.newPassword)
        })
      } else { // 修改初始密码
        param = {
          'account': this.modifyPassData.account,
          'newPassword': this.modifyPassData.modifyPassword,
          'verifyCode': this.modifyPassData.verifyCode
        }
        this.$refs.modifyPassForm.validate(valid => {
          if (valid) {
            loginApi.modifyPassword({
              ...param,
              newPassword: SHA2(param.newPassword)
            }).then(() => {
              this.$message.success('密码修改成功')
              this.doLogin(param.newPassword)
            })
          }
        })
      }
    },
    getAuthCode () { // 倒计时
      this.sendAuthCode = false
      this.auth_time = 60
      this.auth_timetimer = setInterval(() => {
        this.auth_time--
        if (this.auth_time <= 0) {
          this.sendAuthCode = true
          clearInterval(this.auth_timetimer)
        }
      }, 1000)
    },
    sendVerifyCode () { // 发送验证码
      if (this.resetPwdMode) {
        this.$refs.loginForm.validateField('mobile', validMessage => {
          if (validMessage) {
            return
          }
          this.handleSendVerifyCode(this.loginForm.mobile)
        })
      } else {
        this.handleSendVerifyCode(this.modifyPassData.account)
      }
    },
    handleSendVerifyCode (mobile) {
      sendVerifyCodeApi({
        mobile
      }).then((res) => {
        this.$message.success('验证码发送成功')
        this.getAuthCode()
      })
    },
    toggleLoginResetMode () {
      this.resetPwdMode = !this.resetPwdMode
      this.$refs.loginForm.clearValidate()
    }
  }
}
</script>
<style lang="scss">
@import "src/styles/mixin.scss";

input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px transparent inset;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color:rgba(14, 14, 14, 1);
  background-image: url(../../assets/bg_login.png);
  background-size: cover;
  background-position: center center;
  // input:-webkit-autofill {
  //   box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset !important;
  //   -webkit-box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset !important;
  //   -webkit-text-fill-color: #fff !important;
  // }
  .login-form input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 8px 40px;
    &.el-input__inner {
      padding-left: 40px;
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition-delay: 999999s;
      transition: color 999999s ease-out, background-color 999999s ease-out;
      -webkit-transition-delay: 999999s;
      -webkit-transition: color 999999s ease-out, background-color 999999s ease-out;
    }
  }
  .login-form {
    width: 450px;
    padding: 50px;
    background: rgba(255, 255, 255, 0.83);
    border-radius: 12px;
    font-size: 16px;
    color: #333;
    .login_item {
      border-bottom: 1px solid #CFCFCF;
      margin-bottom: 30px;
      .el-input {
        display: inline-block;
        height: 100%;
        width: 100%;
        font-size: 16px;
      }
      .el-form-item__error {
        padding-top: 10px;
      }
    }
    .login_handle {
      margin-bottom: 0;
      padding-top: 20px;
      .btn_login {
        height: 50px;
        font-size: 18px;
        background: #4680FF;
        border-radius: 8px;
        border-color: #4680ff;
      }
    }
    .title {
      font-size: 28px;
      color: #333;
      text-align: center;
      font-weight: normal;
    }
    .iconfont {
      width: 25px;
      font-size: 22px;
      color: #999;
    }
  }
  .login_logo {
    position: absolute;
    top: 50px;
    left: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .sendCode{
    background: #66b1ff;
    border-color: #66b1ff;
    border-radius: 0;
    color: #fff;
  }
  .disabled {
    cursor: not-allowed;
  }

  .login_reset_pwd {
    text-align: right;
    font-size: 14px;
  }

  .login-call-tip {
    margin-top: 10px;
    text-align: center;
    span {
      font-size: 15px;
      color: #4680FF;
    }
  }

  .login_code_wrap {
    position: absolute;
    right: 0;
    top: -4px;
  }
}

</style>
