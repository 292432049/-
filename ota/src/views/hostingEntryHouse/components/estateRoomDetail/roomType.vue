<template>
  <div class="addRoom">
    <el-tabs
      v-model="editableTabsValue"
      type="border-card"
      editable
      @edit="handleTabsEdit">
      <el-tab-pane
        v-for="(item, index) in estateRoomDetail.hostingRooms"
        :key="index"
        :label="item.roomName"
        :name="item.name">
        <!-- <span slot="label">
          {{ item.roomName }}
        </span> -->
        <el-form
          ref="roomTypeTabsForm"
          v-model="estateRoomDetail"
          :rules="estateRoomDetailRules"
          label-position="right"
          label-width="80px"
          size="small">
          <el-row :gutter="5">
            <el-col :span="10">
              <el-form-item
                :prop="'hostingRooms.' + index + '.houseType'"
                :rules="estateRoomDetailRules.roomDetail.houseType"
                label="房间类型">
                <el-input
                  v-model="estateRoomDetail.hostingRooms[index].houseType"
                  style="width:100%"
                  placeholder="如夏威夷"
                  clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="房间面积"
                class="room-item-count">
                <el-input
                  v-model="estateRoomDetail.hostingRooms[index].houseArea"
                  style="width:100%"
                  placeholder="请输入房间面积"
                  min="0"
                  clearable
                  type="number"/>
              </el-form-item>
            </el-col>
            <el-col
              :span="3"
              class="inline-item-label" >m<sup>2</sup></el-col>
          </el-row>
          <el-row
            :gutter="10">
            <el-col :span="3">
              <el-form-item
                prop="chamberCount"
                label="户型">
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                label=""
                style="margin-left:px"
                label-width="0"
                prop="chamberCount"
                class="room-item-count">
                <el-select
                  v-model="estateRoomDetail.hostingRooms[index].chamberCount"
                  placeholder="">
                  <el-option
                    v-for="(item, index) in 10"
                    :key="item"
                    :value="index" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
              class="inline-item-label">
              室
            </el-col>
            <el-col :span="3">
              <el-form-item
                label=""
                label-width="0"
                prop="boardCount"
                class="room-item-count">
                <el-select
                  v-model="estateRoomDetail.hostingRooms[index].boardCount"
                  placeholder="">
                  <el-option
                    v-for="(item, index) in 10"
                    :key="item"
                    :value="index" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
              class="inline-item-label">
              厅
            </el-col>
            <el-col :span="3">
              <el-form-item
                label=""
                label-width="0"
                prop="toiletCount"
                class="room-item-count">
                <el-select
                  v-model="estateRoomDetail.hostingRooms[index].toiletCount"
                  placeholder="">
                  <el-option
                    v-for="(item, index) in 10"
                    :key="item"
                    :value="index" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
              class="inline-item-label">
              卫
            </el-col>
            <el-col :span="4">
              <el-form-item
                label-width="0"
                prop="houseDirection"
                class="room-item-count">
                <el-select
                  v-model="estateRoomDetail.hostingRooms[index].houseDirection"
                  class="room-detail-select"
                  placeholder="朝向">
                  <el-option
                    v-for="item in roomDirectionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item
                label="房间设施"
                style="width:100%">
                <el-select
                  v-model="estateRoomDetail.hostingRooms[index].facilityItemsList"
                  class="room-detail-select"
                  style="width:82%"
                  multiple
                  placeholder="请选择">
                  <el-option-group
                    v-for="group in facilityGroup"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.facilitys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="10">
            <el-col
              :span="3">
              <el-form-item
                :show-message="false"
                label="付款方式"
                prop="chamberCount" />
            </el-col>
            <el-col
              :span="1"
              style="margin-left:-10px;"
              class="inline-item-label">
              付
            </el-col>
            <el-col :span="4">
              <el-form-item
                label=""
                label-width="0"
                prop="payOfPayment"
                class="room-item-count">
                <el-select v-model="estateRoomDetail.hostingRooms[index].payOfPayment">
                  <el-option
                    v-for="item in payList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
              class="inline-item-label">
              押
            </el-col>
            <el-col :span="4">
              <el-form-item
                label=""
                label-width="0"
                prop="depositOfPayment"
                class="room-item-count">
                <el-select
                  v-model="estateRoomDetail.hostingRooms[index].depositOfPayment"
                  @change="handleDepositChange(estateRoomDetail)">
                  <el-option
                    v-for="item in depositList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item
                label="租金">
                <el-input
                  v-model="estateRoomDetail.hostingRooms[index].rent"
                  placeholder="请输入租金"
                  type="number"
                  clearable
                  @change="handleRentChange(estateRoomDetail.hostingRooms[index])" />
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
              style="text-align: left"
              class="inline-item-label">
              元/月
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="押金">
                <el-input
                  v-model="estateRoomDetail.hostingRooms[index].deposit"
                  :disabled="estateRoomDetail.hostingRooms[index].depositOfPayment !== 13"
                  type="number" />
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
              class="inline-item-label">
              &nbsp; 元`
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              label="上传图片"
              prop="pictures"
              class="room-item-count">
              <uploadImg />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="房号配置">
              <el-button
                type="primary"
                size="small"
                @click="selectRoomNum">
                房间号配置
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="roomCheckbox"
      title="选择房间号">
      <room-check-group>
      </room-check-group>
    </el-dialog>
  </div>
</template>

<script>
// import roomCheckGroup from './roomCheckGroup'
import uploadImg from './uploadImg'
export default {
  name: 'RoomType',
  components: {
    // roomCheckGroup,
    uploadImg
  },
  props: {
    // estateRoomDetailRules: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  data () {
    return {
      tabIndex: 1,
      editableTabsValue: '1',
      estateRoomDetail: {
        hostingRooms: [
          {
            houseType: '夏威夷',
            houseArea: '20', // 面积
            roomName: '房型',
            houseDirection: '', // 朝向
            chamberCount: '1',
            boardCount: '0',
            toiletCount: '0',
            name: '1',
            rent: '',
            deposit: '',
            payOfPayment: '', // 付款
            depositOfPayment: '', // 押金
            facilityItemsList: [],
            pictures: []
          }
        ]
      },
      estateRoomDetailRules: {
        roomDetail: {
          houseType: [
            { required: true, message: '请输入房源类型', trigger: 'blur' }
          ]
        }
      },
      roomDirectionList: [
        {
          label: '朝南',
          value: 1
        },
        {
          label: '朝北',
          value: 2
        },
        {
          label: '朝东',
          value: 3
        },
        {
          label: '朝西',
          value: 4
        },
        {
          label: '东南',
          value: 5
        },
        {
          label: '西南',
          value: 6
        },
        {
          label: '东北',
          value: 7
        },
        {
          label: '西北',
          value: 8
        }
      ],
      facilityGroup: [ // 房间设施
        {
          label: '家电',
          facilitys: [{
            value: '2',
            label: '洗衣机'
          }, {
            value: '3',
            label: '空调'
          }, {
            value: '4',
            label: '冰箱'
          }, {
            value: '5',
            label: '电视'
          }]
        },
        {
          label: '家具',
          facilitys: [{
            value: '1',
            label: '床'
          }, {
            value: '7',
            label: '沙发'
          }, {
            value: '8',
            label: '茶几'
          }, {
            value: '10',
            label: '餐桌'
          }]
        },
        {
          label: '其他',
          facilitys: [{
            value: '6',
            label: '宽带'
          }]
        }
      ],
      roomCheckbox: false
    }
  },
  computed: {
    payList () {
      let list = []
      for (let i = 0; i < 13; i++) {
        list.push({
          value: i,
          label: i + ''
        })
      }
      return list
    },
    depositList () {
      let list = this.payList.slice(0)
      list.push({
        value: 13,
        label: '自定义'
      })
      return list
    }
  },
  methods: {
    handleTabsEdit (targetName, action) {
      if (action === 'add') {
        if (this.estateRoomDetail.hostingRooms.length > 25) {
          return
        }
        let curIndex = this.estateRoomDetail.hostingRooms.length
        let newTabName = ++this.tabIndex + ''
        this.estateRoomDetail.hostingRooms.push({
          houseType: '',
          houseArea: '', // 面积
          roomName: '房型' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[curIndex],
          houseDirection: '', // 朝向
          chamberCount: '1',
          boardCount: '0',
          toiletCount: '0',
          rent: '',
          deposit: '',
          name: newTabName,
          payOfPayment: '', // 付款
          depositOfPayment: '', // 押金
          facilityItemsList: [],
          pictures: []
        })
        this.editableTabsValue = newTabName
      }
      if (action === 'remove') {
        let tabs = this.estateRoomDetail.hostingRooms
        console.log(this.estateRoomDetail.hostingRooms)
        let activeName = this.editableTabsValue
        if (activeName === targetName) { // 如果当前显示的 === 点击要删除的
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.estateRoomDetail.hostingRooms = tabs.filter(tab => tab.name !== targetName)
      }
    },
    // 计算押金，保留2位精度
    handleDepositChange (target) {
      if (target.depositOfPayment !== 13) {
        if (target.rent === '') {
          target.deposit = ''
          return
        }
        target.deposit = target.rent * target.depositOfPayment
        target.deposit = target.deposit === 0 ? 0 : target.deposit.toFixed(2)
        if (target.roomName) {
          const index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(target.roomName.replace('房间', ''))
          this.$refs.estateRoomDetail.validateField('hostingRooms.' + index + '.deposit')
        } else {
          // this.$refs.estateRoomDetail.validateField('deposit')
        }
      }
    },
    selectRoomNum () { // 选择房间号
      this.roomCheckbox = true
    },
    // 计算租金，保留2位精度
    handleRentChange (target) {
      if (target.rent > 0) {
        target.rent = Math.min(100000, target.rent).toString()
        let list = target.rent.split('.')
        if (!list[1]) {
          target.rent = target.rent + '.00'
        } else {
          target.rent = Number(target.rent).toFixed(2)
        }
      } else {
        target.rent = 0
      }
      if (target.rent !== '' && target.depositOfPayment !== '' && target.depositOfPayment !== 13) {
        target.deposit = target.rent * target.depositOfPayment
        target.deposit = target.deposit === 0 ? 0 : target.deposit.toFixed(2)
      } else {
        target.deposit = ''
      }
      if (target.depositOfPayment !== '') {
        if (target.roomName) {
          const index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(target.roomName.replace('房型', ''))
          this.$refs.estateRoomDetail.validateField('hostingRooms.' + index + '.deposit')
        } else {
          this.$refs.estateRoomDetail.validateField('deposit')
        }
      }
    }
  }
}
</script>
<style>
.inline-item-label {
  /* text-align: center; */
  line-height: 32px;
  padding: 0 !important;
  font-size: 14px;
  color: #606266;
}
/* .room-count-row {
    padding-left: 90px;
  }
     .inline-item-label {
      display: flex;
    } */
 /* .addRoom .el-tabs__new-tab{margin-right:10px} */
</style>
