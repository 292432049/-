<template>
  <div>
    <div class="layout_pageHeader">

      <el-form class="model-search clearfix">
        <div class="item-flex">
          <el-form-item>
            <el-cascader
              :options="options"
              v-model="selectedOpthons"
              placeholder="请选择城市区域"
              size="small"
              level="1"
              class="item-select"
              filterable
              clearable
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchParams.fangyuanCode"
              size="small"
              filterable
              placeholder="请选择公寓"
              clearable
              class="item-select"
            >
              <el-option
                v-for="(areaName,item) in selectedArea"
                :value="areaName.fangyuanCode"
                :key="item"
                :label="areaName.name"/>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="searchParams.roomNo"
              size="small"
              placeholder="请输入房间号"
              class="item-select"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchParams.roomStatus"
              size="small"
              placeholder="请选择出租状态"
              class="item-select"
              clearable
            >
              <el-option
                value="9"
                label="已出租"/>
              <el-option
                value="2"
                label="未出租"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="searchParam">查询</el-button>
            <el-button
              size="small"
              icon="el-icon-remove-outline"
              style="margin-left:10px"
              @click="searchParam('clear')">清空</el-button>
          </el-form-item>
        </div>
        <div class="item-flex">
          <el-form-item>
            <el-select
              v-model="searchParams.mailinStatus"
              size="small"
              placeholder="麦邻发布状态"
              class="item-select"
              clearable
            >
              <el-option
                value="1"
                label="麦邻未发布"/>
              <el-option
                value="2"
                label="麦邻已发布"/>
              <el-option
                value="5"
                label="麦邻申请中"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchParams.idlefishStatus"
              size="small"
              placeholder="闲鱼发布状态"
              class="item-select"
              clearable
            >
              <el-option
                value="1"
                label="闲鱼未发布"/>
              <el-option
                value="2"
                label="闲鱼已发布"/>
              <el-option
                value="5"
                label="闲鱼申请中"/>
              <el-option
                value="6"
                label="闲鱼下架中"/>
              <el-option
                value="9"
                label="闲鱼发布失败"/>
              <el-option
                value="10"
                label="闲鱼下架失败"/>
            </el-select>
          </el-form-item>
          <el-form-item style="width:260px;margin-right:40px;">
            <SelectTree
              :expanded-keys="expendedKeys"
              :clear-dep-name="clearDepName"
              :assios-room="true"
              node-key = "depId"
              @treeNodeClick="clickTreeNode"
              @clearClick="clearClick"
              @getParentDep = "getParentDep"
            ></SelectTree>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="success"
              icon="iconfont icon-publish_on"
              @click="syncItems('on')">{{ publishBtnText }}</el-button>
            <el-button
              size="small"
              type="danger"
              icon="iconfont icon-publish_off"
              style="margin-left:10px"
              @click="syncItems('off')">下架</el-button>
          </el-form-item>
        </div>
        <el-dialog
          :visible.sync="dialogVisible"
          :title="&quot;选择&quot;+dialogTitle+&quot;平台&quot;"
          class="select-dialog"
          width="450px">
          <div class="select-platform-container clearfix">
            <div>
              <input
                id="mlRent"
                v-model="publishSelect.mailin"
                type="checkbox"
              >
              <label for="mlRent">
                <div
                  :class="{changeBackground:publishSelect.mailin}"
                  class="ml-selectName">麦邻租房</div>
                <div class="ml-selectStatus">
                  <i
                    v-show="publishSelect.mailin"
                    class="el-icon-check"/>
                </div>
              </label>
            </div>
            <div>
              <input
                id="idleFishRent"
                v-model="publishSelect.idlefish"
                type="checkbox" >
              <label for="idleFishRent">
                <div
                  :class="{changeBackground:publishSelect.idlefish}"
                  class="ml-selectName">闲鱼租房</div>
                <div class="ml-selectStatus">
                  <i
                    v-show="publishSelect.idlefish"
                    class="el-icon-check"/>
                </div>
              </label>
            </div>
          </div>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="gotoHouseAsync">{{ dialogTitle === "下架"?"确定":"发布" }}</el-button>
          </span>
        </el-dialog>
      </el-form>
    </div>
    <div class="layout-container">
      <GridUnit
        ref="refGridUnit"
        :form-options="searchParams"
        :data-method="method"
        :url="url"
        :columns="colModels"
        :show-selection="true"
        :is-mock="isMock"
        list-field="data.houseList"
        total-field="data.record"
        @selection-change="handleSelectionChange"
      >
        <template
          slot="slot_idlefishStatus"
          slot-scope="scope">
          <el-popover
            v-if="scope.row.idlefishStatus === 9"
            trigger="hover"
            placement="top">
            <p>发布失败原因: {{ scope.row.idlefishfailMessage }}</p>
            <div slot="reference">
              <el-tag :type="(scope.row.idlefishStatus) | renderStatusType">
                {{ (scope.row.idlefishStatus) | renderStatusValue }}
              </el-tag>
            </div>
          </el-popover>
          <el-tag
            v-else
            :type="(scope.row.idlefishStatus) | renderStatusType">
            {{ scope.row.idlefishStatus | renderStatusValue }}
          </el-tag>
        </template>
        <template
          slot="slot_idlefish_refresh_status"
          slot-scope="scope">
          <span>
            {{ scope.row.idlefishStatus | renderIdlefishRefreshStatus }}
          </span>
        </template>
        <template
          slot="slot_mailinStatus"
          slot-scope="scope">
          <el-tag
            :type="( scope.row.mailinStatus) | renderStatusType">
            {{ scope.row.mailinStatus | renderStatusValue }}
          </el-tag>
        </template>
        <template
          slot="roomStatusHosting"
          slot-scope="scope">
          <el-switch
            v-model="scope.row.roomStatus"
            :active-value="9"
            :inactive-value="2"
            :active-text="roomStatusText(scope.row.roomStatus)"
            class="roomSelectStatus"
            @change="changeRoomStatus(scope.row)"/>
        </template>
        <template
          slot="operateHosting"
          slot-scope="scope">
          <el-row>
            <el-button
              type="primary"
              size="mini"
              @click="openRoomDetail(scope.row)">编辑房间</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteRoom(scope.row)">删除</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="openEditEstateHouse(scope.row)">编辑公寓</el-button>
          </el-row>
        </template>

      </GridUnit>
      <div class="editHouse">
        <el-dialog
          :visible.sync="roomDetailModelVisible"
          :width="roomDetailWidth"
          :show-close="false"
          title="编辑房间"
          top="0">
          <edit-estate-manage
            ref="editEstateManage"
            :tools-width="roomDetailWidth"
            @closeDialog="closeRoomDetailDialog">
          </edit-estate-manage>
          <!-- <hosting-room-detail
            ref="hostingRoomDetail"
            :house-rent-type="activeName === '分散式整租' ? 1 : 2"
            :edit-flag="true"
            :tools-width="roomDetailWidth"
            @closeDialog="closeRoomDetailDialog" /> -->
        </el-dialog>

        <el-dialog
          v-if="estateHouseModelVisible"
          :visible.sync="estateHouseModelVisible"
          :width="roomDetailWidth"
          :show-close="false"
          title="编辑公寓"
          top="0">
          <edit-estate-house
            :house-code="editHouseCode"
            :edit-flag="true"
            @showDelFloorTip="showDelFloorTip">
          </edit-estate-house>
        </el-dialog>
      </div>
      <el-dialog
        ref="authorizeDialog"
        :visible.sync="authorizeShow"
        title="闲鱼授权"
        @close="closeAuthorizeDialog('authorizeDialog')"
      >
        <authorize
          ref="authorzeUser"
          @closeAuthorize ="closeAuthorizeDialog"/></el-dialog>
      <el-dialog
        :visible.sync="goAuthorizeShow"
        title="授权提示"
        width="350px"
      >
        <div class="goAuthorize">
          <p>您需要完成闲鱼授权才能进行发布操作</p>
          <el-button
            type="primary"
            size="mini"
            @click="goAuthorize()">现在就去</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="certificationShow"
        title="完成实名认证方可发布房源"
        width="500px"
        @close="clearValidate('certificationFrom')">
        <real-name-cert
          v-if="certificationShow"
          @realNameCertDlgClose="closeRealNameCertDlg"/>
      </el-dialog>
    </div>

    <el-dialog
      :visible.sync="editFEstateTipVisible"
      class="dlg-del-tip"
      title="提示"
      width="30%">
      <span>请删除对应楼层的房源后再进行操作</span>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="editFEstateTipVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import GridUnit from '@/components/GridUnit/grid'
import areaSelect from '@/components/AreaSelect'
import authorize from '@/components/Authorize'
import SelectTree from '@/components/SelectTree/'
import RealNameCert from '@/components/RealNameCert'
import editEstateManage from './editEstateManage'
import editEstateHouse from '@/views/hostingEntryHouse/components/estateRoomDetail/index'
import { queryEstateListApi, changeRoomStatusApi, estateDeleteRoomApi, publishHouseApi, unPublishHouseApi, queryCityAreaPlotApi, queryOneEstateRoomApi } from '@/api/houseManage'

export default {
  name: 'HouseSync',
  components: {
    GridUnit,
    areaSelect,
    authorize,
    editEstateManage,
    editEstateHouse,
    SelectTree,
    RealNameCert
  },
  filters: {
    // 麦邻 闲鱼发布状态
    renderStatusType (status) {
      const statusMap = {
        '1': 'info', // 未发布
        '2': 'success', // 已发布
        '5': 'danger', // 申请中
        '6': 'primary', // 下架中
        '9': 'warning', // 发布失败
        '10': 'warning', // 下架失败
        '11': 'success', // 今日未擦亮
        '12': 'success' // 今日已擦亮
      }
      return statusMap[status] || 'info'
    },
    renderStatusValue (status) {
      if (status === 11 || status === 12) {
        return '已发布'
      }
      const statusStrData = ['', '未发布', '已发布']
      statusStrData[5] = '申请中'
      statusStrData[6] = '下架中'
      statusStrData[9] = '发布失败'
      statusStrData[10] = '下架失败'
      return statusStrData[status] || '未知'
    },
    renderIdlefishRefreshStatus (status) {
      return status === 12 ? '今日已擦亮' : '今日未擦亮'
    }
  },

  data () {
    var validateUserID = (rule, value, callback) => {
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
      expendedKeys: {
        depId: Number,
        depName: ''
      },
      roomDetailWidth: '1100px', // 房间信息弹窗宽度
      certificationFrom: {
        userName: '',
        userId: ''
      },
      clearDepName: false,
      rzErrorTips: '',
      selectedOpthons: [],
      options: [],
      residential: [], // 小区
      selectedArea: [],
      selectedItems: [],
      filterManagerList: [],
      authorizeShow: false,
      dialogTitle: '',
      roomStatusArry: [],
      goAuthorizeShow: false,
      certificationShow: false,
      authorizeStatus: false, // 判断是否授权的参数
      userAuthentication: false, // 判断实名认证的参数
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        userId: [
          { required: true, validator: validateUserID, trigger: 'blur' }
        ]
      },
      colModels: [
        {slot: 'selection', width: 30},
        {prop: 'estateName', label: '公寓', width: 200},
        {prop: 'roomNo', label: '房间号', width: 100},
        {prop: 'roomTypeName', label: '房型', width: 150},
        {prop: 'chamberCount',
          label: '户型',
          width: 100,
          render (row) {
            return (row.chamberCount || 0) + '室' + (row.boardCount || 0) + '厅' + (row.toiletCount || 0) + '卫'
          }
        },
        {prop: 'roomArea',
          label: '房间面积',
          width: 100,
          render (row) {
            return (row.roomArea || 0) + 'm²'
          }
        },
        {prop: 'rentPrice',
          label: '推广价格',
          width: 100,
          render (row) {
            return (row.rentPrice || 0) + '元'
          }
        },
        {prop: 'depName',
          label: '部门',
          width: 100
        },
        {
          prop: 'mailinStatus',
          label: '麦邻租房',
          width: 100,
          type: 'status',
          slotName: 'slot_mailinStatus'
        },
        { prop: 'idlefishStatus',
          label: '闲鱼租房',
          type: 'status',
          slotName: 'slot_idlefishStatus'
        },
        {
          prop: 'roomStatus',
          label: '出租状态',
          slotName: 'roomStatusHosting',
          width: 100,
          type: 'status',
          fixed: 'right'
        },
        {
          prop: 'idlefishStatus',
          label: '擦亮状态',
          slotName: 'slot_idlefish_refresh_status'
        },
        {
          prop: 'managers',
          label: '管家',
          width: 100
        },
        {
          prop: 'operate',
          label: '操作',
          slotName: 'operateHosting',
          width: 260,
          fixed: 'right'
        }
      ],
      publishSelect: {
        mailin: true,
        idlefish: true
      },
      dialogVisible: false,
      searchParams: {
        pageNo: 1,
        pageSize: 20,
        cityId: '',
        regionId: '',
        fangyuanCode: '',
        roomStatus: '', // 2-未出租，9-已出租
        roomNo: '',
        mailinStatus: '', // 1-未发布，2-已发布，5：发布失败 ，9：处理中
        idlefishStatus: '',
        depId: ''
      },
      url: queryEstateListApi.requestPath,
      method: queryEstateListApi.queryMethod,
      isMock: queryEstateListApi.isMock,
      roomDetailModelVisible: false,
      estateHouseModelVisible: false,
      editHouseCode: '', // 编辑中的房源code
      editFEstateTipVisible: false, // 楼层较少或者房间数较少时候，点击下一步给出提示
      publishBtnText: '发布'
    }
  },
  watch: {

  },
  created () {
    if (this.$route.params.curTab) {
      this.activeName = this.$route.params.curTab === 1 ? '分散式整租' : '分散式合租'
      this.searchParam()
    }
  },
  mounted () {
    this.authorizeStatus = this.$store.getters.idlefished // 判断是否授权的参数
    this.userAuthentication = this.$store.getters.authed // 判断实名认证的参数
    this.getCityName()
  },
  methods: {
    // 查询数据
    searchParam (type) {
      if (type === 'clear') {
        this.searchParams = {
          pageNo: 1,
          pageSize: 20,
          cityId: '',
          regionId: '',
          fangyuanCode: '',
          roomStatus: '', // 2-未出租，9-已出租
          roomNo: '',
          mailinStatus: '', // 1-未发布，2-已发布，5：发布失败 ，9：处理中
          idlefishStatus: '',
          depId: ''
        }
        this.selectedOpthons = []
        this.selectedArea = []
        this.clearDepName = true
      }

      console.log('查询数据', this.searchParams)
      // 解决watch执行顺序
      this.$nextTick(() => {
        this.$refs.refGridUnit.searchHandler()
      })
    },
    closeAuthorizeDialog (status) {
      if (this.$refs.authorzeUser.$refs.dataForm) {
        this.$refs.authorzeUser.$refs.dataForm.clearValidate()
      }
      this.$refs.authorzeUser.$refs.dataForm.clearValidate()
      this.authorizeShow = false
    },
    // 关闭编辑弹窗
    closeRoomDetailDialog () {
      this.$refs.editEstateManage.$refs.roomTypeTabsForm.clearValidate()
      this.roomDetailModelVisible = false
      this.searchParam()
    },
    // 城市区域
    getCityName () {
      let params = {
        'resource': 3
      }
      let cityData = []
      queryCityAreaPlotApi(params).then(res => {
        this.residential = res.data.subdistrictList || []
        cityData = res.data.cityList || []
        if (cityData.length > 0) {
          cityData.forEach((backData, index) => {
            cityData[index].value = backData.cityId
            cityData[index].label = backData.cityName

            if (cityData[index].regionList.length > 0) {
              cityData[index].regionList.forEach((cityArea, item) => {
                cityArea.value = cityArea.areaId
                cityArea.label = cityArea.areaName
              })
            }
          })
          this.options = deepClone(JSON.parse(JSON.stringify(cityData).replace(/regionList/g, 'children')))
        }
      })
    },
    handleChange (value) {
      this.selectedArea = []
      this.searchParams.fangyuanCode = ''
      this.searchParams.cityId = value[0]
      this.searchParams.regionId = value[1]
      this.residential.filter((cityName, index) => {
        if (cityName.cityId === value[0] && cityName.areaId === value[1]) {
          this.selectedArea.push(cityName)
        }
      })
      console.log(this.selectedArea)
    },
    roomStatusText (status) {
      if (status === 2) {
        return '未出租'
      } else if (status === 9) {
        return '已出租'
      }
    },
    // 改变出租状态
    changeRoomStatus (scope) {
      var params =
      {
        'roomCode': scope.roomCode,
        'roomStatus': scope.roomStatus,
        'resource': 3
      }
      changeRoomStatusApi(params).then(response => {
        if (response.code * 1 === 0) {
          if (response.message) {
            this.$message({
              message: response.message,
              type: 'warning'
            })
          } else {
            this.$message({
              message: '状态修改成功',
              type: 'success'
            })
          }
        } else {
          this.$message.error(response.message)
        }
        this.searchParam()
      })
    },
    // 删除房间
    deleteRoom (row) {
      const h = this.$createElement
      this.$msgbox({
        title: '确认消息',
        type: 'warning',
        message: h('p', null, [
          h('span', null, '确定删除房间吗？ '),
          h('span', { style: 'color: red' })
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        estateDeleteRoomApi({
          'roomCodes': [row.roomCode]
        }).then((res) => {
          if (res.code === '0') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.searchParam()
          }
        }).catch(err => { console.log(err) })
      })
    },
    // tabs切换
    // handleClickTab (tab) {
    //   this.searchParam('clear')
    //   this.getCityName(this.searchParams.houseRentType)
    // },
    // 选择列表
    handleSelectionChange (list) {
      this.selectedItems = list
      let btnText = list && list.length > 0 ? '擦亮' : '发布'
      for (let item of list) {
        if (item.idlefishStatus !== 11 && item.idlefishStatus !== 12) {
          btnText = '发布'
          break
        }
      }
      this.publishBtnText = btnText
    },
    // 发布 或者 下架房源  弹窗显示
    syncItems (type = 'on') {
      // 验证是否认证
      if (!this.$store.getters.authed && type === 'on') {
        this.certificationShow = true
        return false
      }
      const typeConfig = {
        'on': {
          title: '发布'
        },
        'off': {
          title: '下架'
        }
      }
      if (this.selectedItems.length === 0) {
        this.$message.error(`请选择需要${typeConfig[type].title}的房源`)
        return false
      }
      this.dialogVisible = true
      this.dialogTitle = typeConfig[type].title
      if (type === 'off') {
        this.publishSelect.mailin = false
      } else {
        this.publishSelect.mailin = true
      }
      this.publishSelect.idlefish = false
    },
    goAuthorize () {
      this.authorizeShow = true
      this.goAuthorizeShow = false
    },
    // 发布 下架
    gotoHouseAsync () {
      const roomCodes = this.selectedItems.map(item => item.roomCode)
      const platform = []
      for (var i in this.publishSelect) {
        if (this.publishSelect[i]) {
          platform.push(i)
        }
      }
      let params = {
        platform: platform,
        roomCodes: roomCodes
      }
      let callback = response => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.searchParam()
      }
      if (this.dialogTitle === '发布') {
        for (let i = 0; i < params.platform.length; i++) {
          if (params.platform[i] === 'idlefish' && !this.$store.getters.idlefished) {
            this.dialogVisible = false
            this.goAuthorizeShow = true
            return false
          }
        }
        publishHouseApi(params).then(callback)
      } else if (this.dialogTitle === '下架') {
        unPublishHouseApi(params).then(callback)
      }
    },
    // 添加修改房间信息
    openRoomDetail (params) {
      this.roomDetailModelVisible = true
      queryOneEstateRoomApi({
        roomCode: params.roomCode
      }).then((res) => {
        this.roomDetailModelVisible = true
        this.$nextTick(() => {
          this.$refs.editEstateManage.setRoomDetailData(res.data)
        })
      }).catch(err => console.log(err))
    },
    openEditEstateHouse (params) {
      this.editHouseCode = params.fangyuanCode
      this.estateHouseModelVisible = true
    },
    // 移除校验结果
    clearValidate (ref) {
      this.$refs[ref].clearValidate()
    },
    // 点击树的结构
    clickTreeNode (data) {
      this.searchParams.depId = data.depId
      this.clearDepName = false
    },
    // 获取组织架构最顶级部门的ID
    getParentDep (data) {
      this.expendedKeys = deepClone(data)
    },
    clearClick () { // 清空树结构的ID
      this.searchParams.depId = ''
    },
    showDelFloorTip () {
      this.editFEstateTipVisible = true
    },
    closeRealNameCertDlg () {
      this.certificationShow = false
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
.app-container{margin-top:10px;}
  .model-search{
    margin-bottom: 20px;
  }
  .item-select {
    width: 140px;
    margin-right:10px;
  }

  .item-flex{
    display: flex;
  }
  .select-dialog {
    .dialog-footer {
      .tips {
        position: absolute;
        bottom: 15px;
        left: 15px;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .select-platform-container {
    display:flex;
    justify-content: space-between;
    .left {
      margin-left: 30px;
    }
    .right {
      margin-right: 30px;
    }
    input[type="checkbox"] {
      display: none;
    }
    label {
      display: block;
      width: 120px;
      height: 30px;
      margin-bottom: 15px;
    }
  }
  .ml-selectStatus {
    width: 40px;
    height: 30px;
    margin-top: -30px;
    font-size: 25px;
    color: #ffa500;
    float: right;
    border: 0.5px solid #e4e7ed;
    text-align: center;
    line-height: 30px;
  }
  .ml-selectName {
    background-color: #ebeef5;
    width: 80px;
    height: 30px;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
  }
  .changeBackground {
    background-color: #ffa500;
    color: #ffffff;
  }
.goAuthorize{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  padding-bottom:20px;
}
.user-button{
  display: block;
  margin-left: 95px;
  }
.errorTip{
  margin: 10px;
  color: red;
  font-style: 12px;
  padding-left: 80px;
}
</style>
<style>
.editHouse .el-dialog{
  margin: 0;
  position: fixed;
  top: 0;
  left: auto;
  right: 0;
  height: 100%;
  overflow: auto;
}
.roomSelectStatus .el-switch__label *{
  font-size:12px;
  color:#909399
}
.roomSelectStatus .el-switch__label.is-active span{
  color:#409DFF
}
</style>
