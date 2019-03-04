<template>
  <div>
    <div>
      <el-form
        ref="certificationFrom"
        :model="certificationFrom"
        :rules="rules"
        label-width="80px"
        size="small"
        status-icon
        width="100%"
      >
        <el-form-item
          label="姓名"
          prop="userName">
          <el-input
            v-model="certificationFrom.userName"
            :disabled="unbindMode"
            clearable/>
        </el-form-item>
        <el-form-item
          label="身份证"
          prop="userId">
          <el-input
            v-model="certificationFrom.userId"
            clearable/>
        </el-form-item>
      </el-form>
    </div>
    <div class="text-center">
      <el-button
        type="primary"
        size="small"
        @click="goCertification()">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { certificationFromApi, certificationUnbindApi } from '@/api/user'

export default {
  data () {
    let validateUserID = (rule, value, callback) => {
      var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
      if (!value) {
        callback(new Error('请填写身份证号码'))
      } else if (!reg.test(value)) {
        callback(new Error('请填写正确的18位身份证号'))
      } else {
        callback()
      }
    }
    return {
      certificationFrom: {
        userName: this.$store.getters.name ? this.$store.getters.name : '',
        userId: ''
      },
      rules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        userId: [{ required: true, validator: validateUserID, trigger: 'blur' }]
      },
      unbindMode: !!this.$store.getters.name
    }
  },
  methods: {
    goCertification () {
      this.$refs.certificationFrom.validate(valid => {
        if (!valid) {
          return
        }
        let p = res => {
          this.$notify({
            title: '成功',
            message: this.unbindMode ? '实名认证解绑成功' : '实名认证成功',
            type: 'success',
            duration: 2000
          })
          this.$store.dispatch('GetInfo').then(res => {
            // 认证成功之后 的回调函数
          })
          // this.certificationFrom.userName = this.certificationFrom.userName
          this.$refs.certificationFrom.resetFields()
          this.$emit('realNameCertDlgClose')
        }
        if (this.unbindMode) {
          certificationUnbindApi({
            idcard: this.certificationFrom.userId
          }).then(p)
        } else {
          certificationFromApi({
            name: this.certificationFrom.userName,
            idcard: this.certificationFrom.userId
          }).then(p)
        }
      })
    }
  }
}
</script>
