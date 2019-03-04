<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="ruleFormRules"
    status-icon
    label-width="100px">
    <el-form-item
      label="闲鱼昵称"
      prop="nickname">
      <el-input
        v-model="ruleForm.nickname"
        disabled/>
    </el-form-item>
    <el-form-item
      :rules="ruleFormRules.verifyCode"
      label="验证码"
      prop="verifyCode">
      <el-input
        v-model="ruleForm.verifyCode"
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
    <div class="text-center">
      <el-button
        :loading="loading"
        type="primary"
        @click="unbindAccount">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import { sendVerifyCodeApi } from '@/api/user'
import { accountUnbindApi } from '@/api/houseManage'

export default {
  data () {
    return {
      ruleForm: {
        nickname: this.$store.state.user.userInfo.idlefishInfo.account,
        verifyCode: ''
      },
      ruleFormRules: {
        verifyCode: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ]
      },
      sendAuthCode: true,
      loading: false,
      authTime: 60
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
    unbindAccount () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        accountUnbindApi({
          platform: 'idlefish',
          checkCode: this.ruleForm.verifyCode
        }).then(res => {
          this.loading = false
          console.info(res)
          this.$message.success('解绑成功')
          this.$emit('idleFishUnbindSuccess')
          this.$store.dispatch('GetInfo').then(res => {
            console.info(res)
          })
        }).catch(e => {
          this.loading = false
          this.$message.error(e || '解绑失败')
        })
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
