<template>
  <div class="modify-pwd">
    <el-form
      ref="modifyPwdForm"
      :rules="modifyPwdRules"
      :model="modifyPwdForm"
      label-width="100px">
      <el-form-item
        :rules="modifyPwdRules.verifyCode"
        label="验证码"
        prop="verifyCode">
        <el-input
          v-model="modifyPwdForm.verifyCode"
          class="modify-pwd-input"
          type="number"
          placeholder="请输入短信验证码"
          auto-complete="new-password"></el-input>
        <el-button
          v-if="sendAuthCode"
          type="primary"
          class="modify-pwd-btn-code"
          @click="sendVerifyCode">获取验证码</el-button>
        <span
          v-else
          class="modify-pwd-countdown">{{ authTime }}s后重新发送</span>
      </el-form-item>
      <el-form-item
        :rules="modifyPwdRules.password"
        label="密码"
        prop="password">
        <el-input
          v-model="modifyPwdForm.password"
          class="modify-pwd-input"
          type="password"
          placeholder="请输入6-12位密码"
          auto-complete="new-password"></el-input>
      </el-form-item>
      <div class="text-center">
        <el-button
          :loading="loading"
          type="primary"
          @click="modify">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { sendVerifyCodeApi, loginApi } from '@/api/user'
import { SHA2 } from '@/utils/sha'

export default {
  data () {
    return {
      modifyPwdForm: {
        verifyCode: '',
        password: ''
      },
      modifyPwdRules: {
        verifyCode: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, max: 12, message: '长度在6到12个字符' }
        ]
      },
      sendAuthCode: true,
      authTime: 0,
      authTimer: null,
      loading: false
    }
  },
  methods: {
    sendVerifyCode () {
      let mobile = localStorage.getItem('CURRENT_ACCOUNT')
      sendVerifyCodeApi({ mobile }).then(res => {
        this.$message.success('验证码发送成功')
        this.countDown()
      })
    },
    countDown () {
      this.sendAuthCode = false
      this.authTime = 60
      this.authTimer = setInterval(() => {
        this.authTime--
        if (this.authTime <= 0) {
          this.sendAuthCode = true
          clearInterval(this.authTimer)
        }
      }, 1000)
    },
    modify () {
      this.$refs.modifyPwdForm.validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        let param = {
          'account': this.$store.state.user.mobile,
          'newPassword': this.modifyPwdForm.password,
          'verifyCode': this.modifyPwdForm.verifyCode
        }
        loginApi.retrievePassword({
          ...param,
          newPassword: SHA2(param.newPassword)
        }).then(res => {
          this.loading = false
          if (res.code === '0') {
            this.$message.success('密码修改成功')
            this.$emit('modifyPwdSuccess')
          } else {
            this.$message.error(res.message || '修改密码失败')
          }
        }).catch(e => {
          this.loading = false
        })
      })
    },
    handleClose () {
      this.modifyPwdForm = {}
      this.$refs.modifyPwdForm.clearValidate()
      this.sendAuthCode = true
      clearInterval(this.authTimer)
    }
  }
}
</script>

<style lang="scss">
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset;
  -webkit-box-shadow: 0 0 0px 1000px white inset;
}

.modify-pwd-input {
  display: inline-block;
  width: 300px !important;
}

.modify-pwd-btn-code, .modify-pwd-countdown {
  margin-left: 10px !important;
}
</style>
