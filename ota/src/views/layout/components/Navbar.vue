/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:22:27
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-15 08:40:30
 */

<template>
  <div class="layout-header clearfix">
    <el-menu
      class="navbar"
      mode="horizontal">
      <hamburger
        :toggle-click="toggleSideBar"
        :is-active="sidebar.opened"
        class="hamburger-container"
      />
      <tags-view/>
      <div class="right_container">
        <div class="right-menu">
          <el-tooltip
            effect="dark"
            content="全屏"
            placement="bottom">
            <screenfull class="screenfull right-menu-item"/>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="换肤"
            placement="bottom">
            <theme-picker class="theme-switch right-menu-item"/>
          </el-tooltip>
          <el-dropdown
            class="avatar-container right-menu-item"
            trigger="click">
            <div class="avatar-wrapper">
              <img
                :src="avatar"
                class="user-avatar">
              <span class="user-name">{{ name }}</span>
              <i class="el-icon-arrow-down"/>
            </div>
            <el-dropdown-menu
              slot="dropdown"
              class="user-dropdown">
              <!-- <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="layer_showUserInfo = true">个人信息</span>
              </el-dropdown-item>-->
              <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="goAuthorize">
                  <i
                    :class="{'icon-access': !idlefished, 'icon-idlefish': idlefished}"
                    class="iconfont"
                  />
                  <span v-if="!idlefished">闲鱼授权</span>
                  <span v-else>闲鱼已授权</span>
                </span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  class="inlineBlock"
                  @click="modifyLoginPwd">
                  <i class="iconfont icon-lock"/>
                  修改密码
                </span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  class="inlineBlock"
                  @click="showRealNameCert">
                  <i class="iconfont icon-autonym"/>
                  实名认证
                </span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span
                  style="display:block;"
                  @click="logout">
                  <i class="iconfont icon-quit"/>
                  退出
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-menu>
    <!-- 个人信息 -->
    <el-dialog
      :visible.sync="layer_showUserInfo"
      title="个人信息"
      width="600px"
      @close="dialogClose">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        label-width="100px">
        <el-form-item
          label="用户名"
          prop="name">
          <el-input
            v-model="ruleForm.name"
            disabled/>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="authorizeShow"
      title="闲鱼授权"
      @close="closeAuthorizeDialog('authorzeUser')"
    >
      <authorize
        ref="authorzeUser"
        @closeAuthorize="closeAuthorizeDialog"/>
    </el-dialog>
    <el-dialog
      :visible.sync="idlefishUnbindDlgVisible"
      width="600px"
      title="闲鱼账号解绑">
      <idle-fish-unbind
        @idleFishUnbindSuccess="closeUnbindDialog"/>
    </el-dialog>
    <el-dialog
      :visible.sync="modifyPwdShow"
      width="600px"
      title="修改密码"
      @close="closeModifyPwdDlg">
      <modify-pwd
        ref="modifyPwd"
        @modifyPwdSuccess="closeModifyPwdDlg"/>
    </el-dialog>
    <el-dialog
      :visible.sync="realNameCertDlgVisible"
      :title="this.$store.getters.authed?'实名认证解绑':'实名认证'"
      width="400px"
      @close="closeRealNameCertDlg">
      <real-name-cert
        v-if="realNameCertDlgVisible"
        @realNameCertDlgClose="closeRealNameCertDlg"/>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { default as TagsView } from './TagsView'
import Hamburger from '@/components/Hamburger'
import ThemePicker from '@/components/ThemePicker'
import Screenfull from '@/components/Screenfull'
import authorize from '@/components/Authorize'
import IdleFishUnbind from '@/components/IdleFishUnbind'
import ModifyPwd from '@/components/ModifyPwd'
import RealNameCert from '@/components/RealNameCert'

export default {
  components: {
    Hamburger,
    ThemePicker,
    Screenfull,
    TagsView,
    authorize,
    ModifyPwd,
    RealNameCert,
    IdleFishUnbind
  },
  inject: ['reloadPage'],
  data () {
    return {
      layer_showUserInfo: false,
      ruleForm: {
        name: this.$store.getters.name
      },
      authorizeShow: false,
      modifyPwdShow: false,
      realNameCertDlgVisible: false,
      idlefishUnbindDlgVisible: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'idlefished'])
  },
  created () {},
  methods: {
    closeAuthorizeDialog (status) {
      this.authorizeShow = false
      // if (this.$refs.authorzeUser.$refs.dataForm) {
      //   this.$refs.authorzeUser.$refs.dataForm.clearValidate()
      // }
    },
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    logout () {
      this.$msgbox({
        message: `确定退出系统么？`,
        title: '提示',
        showCancelButton: true,
        confirmButtonText: '退出',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        .catch(() => {
          console.log('cancle')
        })
    },
    dialogClose () {
      this.$refs.ruleForm.resetFields()
    },
    goAuthorize () {
      if (this.idlefished) {
        // this.$message.info('该账号已完成闲鱼授权，无需重新授权')
        this.idlefishUnbindDlgVisible = true
        return
      }
      this.authorizeShow = true
    },
    gotoHomePage () {
      if (this.$route.meta.isHomePage) {
        this.reloadPage()
      } else {
        this.$router.push('/')
      }
    },
    modifyLoginPwd () {
      this.modifyPwdShow = true
    },
    closeModifyPwdDlg () {
      this.modifyPwdShow = false
      this.$refs.modifyPwd.handleClose()
    },
    showRealNameCert () {
      // 实名认证
      this.realNameCertDlgVisible = true
    },
    closeRealNameCertDlg () {
      this.realNameCertDlgVisible = false
    },
    closeUnbindDialog () {
      this.idlefishUnbindDlgVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 100%;
  border-radius: 0px !important;
  display: flex;
  align-content: center;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  .hamburger-container {
    padding: 0 10px;
  }
  .right_container {
    position: absolute;
    right: 20px;
    z-index: 1;
  }
  .right-menu {
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 5px;
    }
    .screenfull {
      height: 40px;
      padding: 4px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
    }
    .avatar-container {
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        height: 40px;
        display: flex;
        align-items: center;
      }
      .user-name {
        position: relative;
        margin: 0 5px;
        max-width: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
