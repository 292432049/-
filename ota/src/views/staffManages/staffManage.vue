<template>
  <div>
    <div class="layout_pageHeader">
      <el-form class="model-search clearfix">
        <div class="item-flex">
          <el-form-item>
            <el-select
              v-model="selectDepName"
              filterable
              clearable
              size="small"
              class="item-select"
              placeholder="请选择部门">
              <el-tree
                ref="overlayTree"
                :data="treeData"
                :props="defaultProps"
                :highlight-current="true"
                :expand-on-click-node="false"
                :default-expanded-keys="[parentOrg.depId]"
                node-key="depId"
                @node-click="editNodeclick"
              >
              </el-tree>
              <el-option
                style="display:none"
                value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formData.keyword"
              placeholder="请输入姓名/部门"
              size="small"
              class="item-select"
              filterable
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left:10px;"
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="searchParam">查询</el-button>
            <el-button
              size="small"
              icon="el-icon-remove-outline"
              style="margin-left:10px"
              @click="searchParam('clear')"
            >清空</el-button>
            <el-button
              style="margin-left:10px;"
              type="primary"
              size="small"
              icon="el-icon-circle-plus-outline"
              @click="handleApply()">新增账号</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="layout-container">
      <GridUnit
        ref="refGridUnit"
        :form-options="formData"
        :data-method="method"
        :url="url"
        :is-mock="isMock"
        :columns="colModels"
        :show-pagination="false"
        list-field="data">
        <template
          slot="operateHosting"
          slot-scope="scope">
          <el-row>
            <el-button
              type="primary"
              size="mini"
              @click="assignHouse(scope.row)">分配房源</el-button>
            <el-button
              type="success"
              size="mini"
              @click="editAccount(scope.row)">编辑</el-button>
          </el-row>
        </template>
        <template
          slot="slot_role"
          slot-scope="scope">
          {{ scope.row.role | renderStatusValue }}
        </template>
        <template
          slot="accountStatusHosting"
          slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            :active-text="accountStatusText(scope.row.status)"
            class="accountSelectStatus"
            @change="changeAccountStatus(scope.row)"/>
        </template>
      </GridUnit>
    </div>
    <!-- 新增，编辑账号 -->
    <el-dialog
      :title="isEditAccount ? '编辑账号' : '新增账号'"
      :visible="layer_account"
      width="500px"
      @close="cancelAddAccount">
      <el-form
        ref="accountForm"
        :model="accountForm"
        :rules="rules"
        size="small"
        label-position="right"
        loading=""
        label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="姓名"
              prop="name">
              <el-input
                v-model="accountForm.name"
                :disabled="userDetails"
                placeholder="请输入姓名"
                filterable
                clearable
                maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="性别"
              label-width="60px"
              prop="gender">
              <el-select
                v-model="accountForm.gender"
                :disabled="userDetails"
                filterable
                clearable>
                <el-option
                  v-for="item in genderOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="手机号码"
              prop="mobile">
              <el-input
                v-model="accountForm.mobile"
                placeholder="请输入手机号码"
                filterable
                clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="所属部门"
              prop="depId">
              <el-select
                v-model="addAcountDepName"
                :disabled="userOrg"
                style="width: 100%">
                <el-tree
                  ref="overlayTree"
                  :data="treeData"
                  :props="defaultProps"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  :default-expanded-keys="[parentOrg.depId]"
                  node-key="depId"
                  @node-click="accountNodeclick"
                >
                </el-tree>
                <el-option
                  style="display:none"
                  value=""></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="房源管理"
              prop="hasAllRoomAuth">
              <el-select
                v-model="accountForm.hasAllRoomAuth"
                :disabled="userOrgRoom"
                style="width: 100%"
                clearable>
                <el-option
                  :value="0"
                  label="部门旗下部分房源"></el-option>
                <el-option
                  :value="1"
                  label="部门旗下所有房源"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="orgRoleEdit">
          <el-form-item
            label="部门负责人"
            prop="orgRole">
            <el-checkbox
              v-model="roleChecked"
              :true-label="1"
              @change="roleClick"></el-checkbox>
          </el-form-item>
        </el-row>
      </el-form>
      <div
        slot="footer"
        style="margin-top:-30px;"
        class="dialog-footer">
        <el-button
          :loading="sureLoading"
          type="primary"
          @click="submitAccount">确定</el-button>
        <el-button @click="cancelAddAccount">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="closeAddAccountTips_layer"
      title="新增账号成功"
      width="30%"
      @close="closeAddAccountTips">
      <p style="margin-bottom:40px;text-align:center">新增账号成功，记得给账号分配房源</p>
      <div
        slot="footer"
        style="margin-top:-30px;"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="goAssionRoom">去分配房源</el-button>
        <el-button @click="closeAddAccountTips">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import GridUnit from '@/components/GridUnit/grid'
import { validateMobile } from '@/utils/validate'
import { getDepartmentInfo } from '@/api/organization'
import { staffManageInfo } from '@/api/staffManage'
import { deepClone } from '@/utils'
export default {
  name: 'StaffManage',
  components: {
    GridUnit
  },
  filters: {
    renderStatusValue (status) {
      const statusStrData = ['', '负责人', '员工', '负责人']
      return statusStrData[status] || '未知'
    }
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (!validateMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateRoom = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择房源管理'))
      } else {
        callback()
      }
    }
    return {
      sureLoading: false,
      closeAddAccountTips_layer: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'depName',
        id: 'depId'
      },
      userOrgRoom: false,
      addDeName: '',
      roleChecked: '',
      selectDepName: '',
      inputDepart: '',
      isEditAccount: false,
      layer_account: false,
      userId: '', // 用户ID
      orgRoleEdit: true,
      cityId: '', // 组织架构中获取城市ID
      // orgRoomRole: '', // 房源管理
      addAcountDepName: '', // 新增账户所属部门
      editRole: false,
      accountForm: {
        mobile: '',
        name: '',
        gender: '',
        depId: '',
        role: '',
        hasAllRoomAuth: ''
      },
      rules: {
        depId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        hasAllRoomAuth: [
          { required: true, trigger: 'blur', validator: validateRoom }
        ]
      },
      userDetails: true,
      userOrg: false,
      nowOrgObj: {
        depId: '',
        depName: ''
      },
      genderOpts: [
        {
          value: 1,
          label: '男'
        }, {
          value: 2,
          label: '女'
        }
      ],
      parentOrg: {
        depId: '',
        depName: ''
      },
      goRoomData: {},
      formData: {
        depId: '',
        keyword: ''
      }, // 传到表格接口的参数
      colModels: [ // 表格数据
        {prop: 'name', label: '姓名', width: 300},
        {prop: 'role', label: '职位', width: 150, slotName: 'slot_role'},
        {prop: 'depName', label: '部门', width: 150},
        {
          prop: 'roomStatus',
          label: '状态',
          width: 150,
          slotName: 'accountStatusHosting',
          type: 'status'
        },
        {
          prop: 'operate',
          label: '操作',
          slotName: 'operateHosting'
        }
      ],
      url: getDepartmentInfo.requestPath,
      method: getDepartmentInfo.staffInfoMethod,
      isMock: getDepartmentInfo.isMock
    }
  },
  created () {
    this.getTree()
  },
  methods: {
    searchParam (type) {
      if (type === 'clear') {
        this.formData = {
          depId: '',
          keyword: ''
        }
        this.selectDepName = ''
      }
      this.$nextTick(() => {
        this.$refs.refGridUnit.searchHandler()
      })
    }, // 查询
    getTree () { // 获取组织架构名称并且默认表格数据
      getDepartmentInfo.queryDepartmentApi().then(res => {
        if (res.data) {
          // this.$refs.trees.setCurrentKey(id)
          this.parentOrg.depId = res.data.depId // 顶级部门
          this.parentOrg.depName = res.data.depName
          this.treeData = [{'depName': res.data.depName, 'depId': res.data.depId, children: res.data.children}]
          this.cityId = this.$refs.overlayTree.getNode(res.data.depId).data.cityId
        }
      }).catch(rej => {})
    },
    editNodeclick (data) {
      this.formData.depId = data.depId
      this.selectDepName = data.depName
      this.accountForm.depName = data.depName
    },
    accountNodeclick (data) {
      this.addAcountDepName = data.depName
      this.accountForm.depId = data.depId
      this.cityId = this.$refs.overlayTree.getNode(data.depId).data.cityId
    },
    handleApply () { // 新增账号
      this.accountForm = {
        mobile: '',
        name: '',
        gender: '',
        depId: '',
        role: ''
      }
      this.layer_account = true
      this.orgRoleEdit = true
      this.userDetails = false
      this.isEditAccount = false
      this.userOrg = false
      this.userOrgRoom = false
      this.accountForm.depId = this.parentOrg.depId
      this.addAcountDepName = this.parentOrg.depName
      this.roleChecked = ''
    },
    submitAccount () {
      this.accountForm.role = this.roleChecked || 2
      let param = deepClone(this.accountForm)
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          this.sureLoading = true
          if (this.isEditAccount) { // 编辑账户
            param.id = this.userId // 用户id
            staffManageInfo.editAccountApi(param).then((res) => {
              if (res.code * 1 === 0) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.layer_account = false
                this.searchParam()
                this.sureLoading = false
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
              }
            }).catch(() => {
              setTimeout(() => {
                this.sureLoading = false
              }, 2000)
            })
          } else {
            staffManageInfo.addAccountAPi(param).then((res) => {
              if (param.hasAllRoomAuth === 0 && !this.isEditAccount) {
                this.closeAddAccountTips_layer = true
                this.goRoomData = deepClone(param)// 去分配吧
                this.goRoomData.id = res.data
              } else {
                if (res.code * 1 === 0) {
                  this.$message({
                    message: '新增账户成功',
                    type: 'success'
                  })
                  this.layer_account = false
                  this.searchParam()
                  this.layer_account = false
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  })
                  this.layer_account = false
                }
              }
            }).catch(() => {
              setTimeout(() => {
                this.sureLoading = false
              }, 2000)
            })
          }
        }
      })
    },
    goAssionRoom () { // 新增成功后 去分配房源吧
      let param = deepClone(this.goRoomData)
      param.depName = this.$refs.overlayTree.getNode(this.goRoomData.depId).data.depName
      param.cityId = this.cityId // 需要从组织架构中获取
      this.$router.push({path: '/houseSource/allotroom', query: param})
    },
    closeAddAccountTips () {
      this.closeAddAccountTips_layer = false
      this.searchParam()
      this.layer_account = false
    },
    cancelAddAccount () {
      this.layer_account = false
      this.sureLoading = false
      this.$refs['accountForm'].clearValidate()
    },
    assignHouse (data) { // 房源管理
      if (data.role === 1 || data.role === 3) { // 部门负责人和 主账号拥有所有房源
        this.$message({
          message: '该账号拥有该部门下所有房源,无需设置',
          type: 'warning'
        })
        return false
      } else if (data.status * 1 === 2) {
        this.$message({
          message: '该账号已经停用，不能分配房源',
          type: 'warning'
        })
        return false
      } else {
        this.$router.push({path: '/houseSource/allotroom', query: data})
      }
    },
    roleClick (data) {
      if (this.roleChecked === 1) {
        this.userOrgRoom = true
        this.$set(this.accountForm, 'hasAllRoomAuth', 1)
      } else {
        this.userOrgRoom = false
      }
      this.accountForm.role = this.roleChecked
    },
    editAccount (data) {
      this.isEditAccount = true // 确定是点击的编辑
      this.userDetails = true
      if (data.role === 3) {
        this.userOrg = true
        this.userOrgRoom = true
        this.orgRoleEdit = false
      } else {
        this.userOrg = false
        this.userOrgRoom = false
        this.orgRoleEdit = true
      }
      this.$set(this, 'roleChecked', data.role)
      if (data.role === 1) {
        this.$set(this.accountForm, 'hasAllRoomAuth', 1)
        this.userOrgRoom = true
      }
      this.accountForm = {
        mobile: data.mobile,
        name: data.name,
        gender: data.gender,
        role: data.role
      }
      this.$set(this.accountForm, 'hasAllRoomAuth', data.hasAllRoomAuth)
      this.layer_account = true
      this.addAcountDepName = data.depName // 部门名称
      this.userId = data.id // 用户id
      this.accountForm.depId = data.depId // 部门ID
      this.accountForm.role = data.role
    },
    changeAccountStatusMethod (param) { // 员工启用 停用账号
      staffManageInfo.changeAccountStatusApi(param).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    },
    // 更改员工状态
    changeAccountStatus (data) {
      let param = {
        'userId': data.id,
        'status': data.status // 要改成的状态
      }
      let statusText = data.status === 1 ? '确认启用账号？' : '确定停用账号？该员工账号下所有房源将会解除绑定。'
      this.$confirm(statusText, ' 提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1 启用 2 停用
        this.changeAccountStatusMethod(param)
        this.searchParam()
      }).catch(() => {
        console.log('取消')
        this.searchParam()
      })
    },
    accountStatusText (status) {
      if (status === 1) {
        return '启用'
      } else if (status === 2) {
        return '停用'
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.item-flex {
    display: flex;
  }
.item-select {
  margin-right: 10px;
  }
.accountSelectStatus .el-switch__label *{
  font-size: 12px;
  color: #909399
}
.accountSelectStatus .el-switch__label.is-active span{
  color: #409DFF
}
</style>
<style>
.model-table-pagenation .el-switch__label *{
  font-size: 12px;
  color: #606266;
  }
</style>
