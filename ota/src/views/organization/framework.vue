/*
 * @Author: dengdongming
 * @Date: 2018-10-10 17:04:57
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-10-19 17:20:47
 */
<template>
  <div class="orgStyle">
    <div style="width:30%;margin-left:300px;">
    </div>
    <el-container>
      <el-aside
        width="260px"
        class="asideBox">
        <el-tree
          ref="trees"
          :data="treeData"
          :props="defaultProps"
          :default-expanded-keys="[nowOrgObj.depId]"
          :highlight-current="true"
          :expand-on-click-node="false"
          :indent="8"
          node-key="depId"
          @node-click="handleNodeClick">
        </el-tree>
      </el-aside>
      <el-main>
        <div class="search-area">
          <el-input
            v-model="searchDepartment"
            placeholder="请输入部门名称"
            size="small"
            max-length="20"
            class="item-select"></el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            class="filter-item"
            @click.native="searchformData">查询</el-button>
          <el-button
            plain
            size="small"
            icon="el-icon-remove-outline"
            @click.native="searchParam('clear')">清空</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            class="filter-item"
            @click.native="addOrg">添加部门</el-button>
        </div>
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
                @click="editOrg(scope.row)">编辑</el-button>
            </el-row>
          </template>
        </GridUnit>
      </el-main>
    </el-container>
    <!-- 编辑、添加部门弹窗 -->
    <div class="editDep">
      <el-dialog
        :close-on-click-model="false"
        :visible.sync="layer_addOrg"
        :title="isEditOrg ? '编辑部门' : '添加部门'"
        width="500px"
        @close="layerClose">
        <el-form
          ref="orgForm"
          :model="orgForm"
          :rules="rules"
          label-position="left"
          label-width="80px"
          size="small">
          <el-form-item
            label="部门名称"
            prop="depName"
            class="item-select2">
            <el-input
              v-model="orgForm.depName"
              :disabled="depLevel"
              :maxlength="20"
              placeholder="请输入部门名称"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="上级部门"
            prop="superiorName">
            <el-select
              v-model="orgForm.superiorName"
              :disabled="depLevel"
              clearable
              placeholder="请选择上级部门"
              class="item-select2">
              <el-tree
                ref="overlayTree"
                :data="treeData"
                :props="defaultProps"
                :highlight-current="true"
                :expand-on-click-node="false"
                :default-expanded-keys="[parentOrg.depId]"
                node-key="depId"
                @node-click="editNodeclick"
                @current-change="editChangeclick"
              >
              </el-tree>
              <el-option
                style="display:none"
                value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="所在区域"
            prop="areaCode"
          >
            <area-select
              ref="areaSelect"
              :disabled="depLevel"
              v-model="orgForm.areaCode"
              :level="1"
              @input="searchZoneList(false)" />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button
            :loading="sureLoading"
            type="primary"
            size="small"
            @click="submitOrg">确定</el-button>
          <el-button
            size="small"
            @click="layer_addOrg = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 确定编辑部门弹窗 -->
  </div>
</template>

<script>
import GridUnit from '@/components/GridUnit/grid'
import areaSelect from '@/components/AreaSelect'
import { deepClone } from '@/utils'
import { getDepartmentInfo } from '@/api/organization'

export default {
  name: 'FrameWork',
  components: {
    GridUnit,
    areaSelect
  },
  data () {
    return {
      // nodeKey: 'depId',
      userDepId: '',
      closeTree: false,
      depLevel: false,
      sureLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'depName',
        id: 'depId'
      },
      searchDepartment: '', // 搜索部门
      nowOrgObj: { // 默认展开选中  保存第一次加载的ID
        depName: '',
        depId: ''
      },
      parentOrg: { // 顶级部门id
        depName: '',
        depId: ''
      },
      formData: { // 表格数据
        depName: '',
        depId: ''
      },
      orgName: '',
      orgId: '',
      orgForm: { // 添加部门 编辑部门 表单字段
        depName: '',
        depId: '',
        superiorName: '', // 上级部门
        parentDepId: '',
        areaCode: []
      },
      editParentId: '', // 上一级别ID
      rules: { // 添加部门验证
        depName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        superiorName: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
        ],
        areaCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value[0]) {
                callback(new Error('请选择所在地区'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      treeChangeStatus: false,
      currentPreDepName: '',
      layer_addOrg: false, // 添加部门弹窗
      isEditOrg: false, // 为true 编辑  false  增加部门
      colModels: [ // 表格数据
        {prop: 'depName', label: '部门名称', width: 300},
        {prop: 'parent', label: '上级部门', width: 150},
        {prop: 'createTimeStr', label: '创建时间', width: 150},
        {prop: 'managedHouse', label: '管理房源数量'},
        {
          prop: 'operate',
          label: '操作',
          fixed: 'right',
          width: 200,
          slotName: 'operateHosting'
        }
      ],
      url: getDepartmentInfo.requestPath,
      method: getDepartmentInfo.queryMethod,
      isMock: getDepartmentInfo.isMock
    }
  },
  created () {
    this.getTree()
  },
  mounted () {

  },
  methods: {
    getTree () { // 获取组织架构名称并且默认表格数据
      getDepartmentInfo.queryDepartmentApi().then(res => {
        if (res.data) {
          this.treeData = [{'depName': res.data.depName, 'depId': res.data.depId, children: res.data.children}]
          // 初始化表格数据
          this.formData.depId = res.data.depId
          this.formData.depName = res.data.orgName
          this.userDepId = this.treeData[0].depId
          this.getFirstNode(this.userDepId)
        }
      }).catch(rej => {})
    },
    getFirstNode (id) {
      this.$nextTick(() => { // 设置tree的默认选中节点 0是node-key设置的参数对应的值
        this.$refs.trees.setCurrentKey(id) // 设置当前选中装填
        const obj = this.$refs.trees.getNode(id)
        this.nowOrgObj = deepClone(obj.data)
        this.parentOrg = obj.parent.data instanceof Array ? deepClone(obj.parent.data[0]) : deepClone(obj.parent.data)
        this.formData.depId = this.nowOrgObj.depId
        this.formData.depName = '' // 表格开始加载时候 只能传depId
        this.searchParam()
      })
    },
    searchParam (type) { // 表格数据
      if (type === 'clear') { // 清空就是查询总部数据
        this.formData.depId = this.nowOrgObj.depId
        this.formData.depName = ''
        this.searchDepartment = ''
      }
      this.$nextTick(() => {
        this.$refs.refGridUnit.searchHandler()
      })
    },
    searchformData () { // 查询  查询的时候 传depName
      if (this.searchDepartment) {
        this.formData = {
          depName: this.searchDepartment,
          depId: ''
        }
      } else {
        this.formData = {
          depName: '',
          depId: this.nowOrgObj.depId
        }
      }
      this.searchParam()
    },
    handleNodeClick (node, data) { // 点击tree节点函数
      this.nowOrgObj = deepClone(data.data)
      // this.parentOrg = data.parent.data instanceof Array ? deepClone(data.parent.data[0]) : deepClone(data.parent.data)
      this.formData.depId = this.nowOrgObj.depId
      this.formData.depName = ''
      this.$nextTick(() => {
        this.searchParam()
      })
    },
    editNodeclick (data) { // 编辑部门  增加部门   tree被点击时候的回调
      this.parentOrg.depName = data.depName
      this.editParentId = data.depId
      this.orgForm.superiorName = data.depName
    },
    editChangeclick (data, node) { //  节点改变时候变化
      if (this.isEditOrg && this.currentPreDepName !== data.depName) {
        this.treeChangeStatus = true
      } else {
        this.treeChangeStatus = false
      }
    },
    addOrg () { // 添加部门
      this.depLevel = false
      this.isEditOrg = false
      this.layer_addOrg = true
      this.orgForm.superiorName = this.nowOrgObj.depName // 上级部门
      this.editParentId = this.nowOrgObj.depId
      this.orgForm.areaCode = []
    },
    editOrg (data) { // 编辑部门
      this.isEditOrg = true
      this.orgForm = { // 添加部门 编辑部门 表单字段
        depName: data.depName, // 当前部门
        depId: data.depId,
        superiorName: data.parent, // 上级部门  根据id去查
        parentDepId: data.parentId,
        areaCode: [data.provinceId, data.cityId, data.distinctId]
      }
      this.editParentId = data.parentId
      this.currentPreDepName = data.parent
      this.layer_addOrg = true
      if (data.depLevel === 0) {
        this.depLevel = true
      } else {
        this.depLevel = false
      }
    },
    layerClose () { // 部门弹框关闭
      this.$refs['orgForm'].resetFields() // 对表单进行重置
      this.orgForm.depName = ''
    },
    assignHouse (data) { // 分配房源
      if (data.depId === this.userDepId) {
        this.$message({
          message: '该部门拥有本部门所有房源,无需设置',
          type: 'warning'
        })
        return false
      } else {
        this.$router.push({path: '/houseSource/allotroom', query: data})
      }
    },
    submitOrg () { // 提交添加部门 或者编辑部门
      this.$refs['orgForm'].validate((valid) => {
        if (valid) {
          let param = {
            'depName': this.orgForm.depName,
            'parentDepId': this.editParentId, // 上一级ID
            'provinceId': this.orgForm.areaCode[0],
            'cityId': this.orgForm.areaCode[1],
            'districtId': this.orgForm.areaCode[2]
          }
          if (this.isEditOrg) { // 编辑部门
            param.depId = this.orgForm.depId // 编辑部门比新建部门多个字段
            // 判断是否更改了上级部门
            if (this.treeChangeStatus) {
              this.$confirm('确定更换上级部门吗?上级部门变动后，当前部门旗下的所有部门都会迁移，包括旗下的人员', '更换部门提醒', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.sureLoading = true
                this.editSubmitSure(param)
                this.layer_addOrg = false
              }).catch(() => {
                this.layer_addOrg = true
              })
            } else {
              this.editSubmitSure(param)
            }
          } else { // 创建部门的接口
            this.sureLoading = true
            getDepartmentInfo.createDepartmentApi(param).then((res) => {
              if (res.code * 1 === 0) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.layer_addOrg = false
                this.sureLoading = false
                this.searchParam()// 增加成功后 刷新当前页面
                this.getTree()
              } else {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    editSubmitSure (param) { // 编辑确定上传
      getDepartmentInfo.editDepartmentApi(param).then((res) => {
        if (res.code * 1 === 0) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.layer_addOrg = false
          this.sureLoading = false
          this.searchParam()// 编辑成功后 刷新当前页面
          this.getTree()
        } else {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    searchZoneList () { // 区域

    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .con-f {background:#fff;margin:-10px;}
  .asideBox {
      // border: 1px solid #ddd;
      background:#fff;
      height: auto;
      padding-top:10px;
      // margin:20px 0 20px 20px;
    }
  .item-select {
      width: 250px;
      margin-right:10px;
    }
    .item-select2{width:100%}
  .currentOr {
    border-bottom: thin solid #ddd;
    font-size: 14px;
    margin: 10px;
    line-height: 40px;
    color: #606266
  }
  .search-area {
    margin-bottom: 10px;
  }
  .tipsStyle{
    margin-left: -50px;
  }

</style>
<style>
 .model-table {
    border: 1px solid #e6ebf5;
    border-bottom:none
  }
 .orgStyle .el-main{
   padding: 10px 10 0 10px;
   background :#fff;
   margin-left: 10px
   }
   .orgStyle .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
     color:#0070FF;
     background:#fff;
   }
</style>
