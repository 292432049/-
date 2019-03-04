<template>
  <div class="authorize">
    <div class="dialog_apply">
      <el-steps
        :active="active_step"
        align-center
        finish-status="success"
        style="margin-bottom: 30px;">
        <el-step
          title="填写闲鱼昵称"
          description="打开闲鱼APP，点击【我的】，用户名即为闲鱼昵称，闲鱼昵称需要进行实名认证才可同步房源（闲鱼APP-我的-头像-实名认证）"/>
        <el-step
          title="扫码授权"
          description="打开闲鱼APP进行扫码授权"/>
      </el-steps>

      <div
        v-if="active_step === 0"
        class="text-center picture">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          size="small"
          status-icon
          style="width: 400px;">
          <el-form-item prop="account">
            <el-input
              v-model="temp.account"
              placeholder="请输入闲鱼昵称"
              clearable
              size="small"
              @keyup.enter="nextStep"
            >
              <template slot="prepend">闲鱼昵称</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div
        v-else
        class="text-center picture">
        <el-card
          :body-style="{ padding: '0px' }"
          style="max-width: 500px;">
          <img
            :src="picUrl"
            style="display: block; width: 100%;">
          <div style="padding: 14px;">
            <span>请用闲鱼APP进行扫码授权</span>
          </div>
        </el-card>
      </div>

      <div
        slot="footer"
        class="dialog-footer text-center">
        <el-button
          v-if="active_step === 0"
          type="primary"
          size="small"
          @click="nextStep">下一步</el-button>
        <el-button
          v-if="active_step === 1"
          size="small"
          @click="active_step = 0">上一步</el-button>
        <el-button
          v-if="active_step === 1"
          type="primary"
          size="small"
          @click="saveApplyInfo">确认授权</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { authorizeApi, authorizePictureApi, authorizeStatusApi } from '@/api/houseManage'
export default {
  name: 'Authorize',
  components: {
  },
  data () {
    return {
      layer_showApply: true,
      active_step: 0,
      dialogStatus: false,
      picUrl: '',
      temp: {
        account: ''
      },
      rules: {
        account: [
          { required: true, message: '请填写闲鱼昵称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    // 申请开通
    handleSetting (row, type, bindType) {
      this.dialogTitle = '闲鱼授权'
      // this.temp = {
      //   ...row,
      //   account: '',
      //   type,
      //   bindType
      // }
      this.layer_showApply = true
    },
    // 下一步
    nextStep () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let bindParams = {
            platform: 'idlefish',
            account: this.temp.account
          }
          console.log(bindParams)
          authorizeApi(bindParams).then(response => {
            authorizePictureApi({platform: 'idlefish'}).then(res => {
              this.picUrl = res.data.picUrl
              this.active_step = 1
            })
          })
        }
      })
    },
    // 确认授权
    saveApplyInfo () {
      authorizeStatusApi({platform: 'idlefish'}).then(response => {
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
        this.$emit('closeAuthorize', this.dialogStatus)
        this.$store.dispatch('GetInfo').then(res => {
          // 认证成功之后 的回调函数
        })
      })
    },
    dialogClose () {
      this.temp = {
        account: ''
      }
      this.active_step = 0
      if (this.$refs.dataForm) {
        this.$refs.dataForm.resetFields()
      }
      this.layer_showApply = false
    }
  },
  //  关闭弹窗
  dialogClose () {
    this.layer_showApply = false
  }
}
</script>
<style>
   .picture{display: flex; justify-content: center;margin-bottom:20px;}
   .authorize{background: #fff;padding: 30px;}
   .authorize .el-step.is-center .el-step__description{color:#c0c4cc}
</style>
