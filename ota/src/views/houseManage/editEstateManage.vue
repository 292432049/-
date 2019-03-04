<template>
  <div>
    <div class="layout-container">
      <el-form
        ref="roomTypeTabsForm"
        :model="hostingRooms"
        :rules="roomDetailRules"
        label-width="95px"
        size="small"
        class="room-detail-container hosting-room-detail">
        <!-- <el-row :gutter="0">
          <el-col
            :span="10"
            class="inline-item-label">
            <el-form-item
              prop="houseType"
              label="房间类型">
              <el-input
                v-model="hostingRooms.houseType"
                :disabled="true"
                placeholder="请输入房源类型"
                clearable/>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              prop="roomArea"
              label="房间面积"
              class="room-item-count">
              <el-input
                v-model="hostingRooms.roomArea"
                placeholder="请输入房间面积"
                min="0"
                clearable
                type="number"/>
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            class="inline-item-label">
            &nbsp;m
            <sup>2</sup>
          </el-col>
        </el-row>
        <el-row
          :gutter="10">
          <el-col
            :span="4">
            <el-form-item
              :rules="roomDetailRules.chamberCount"
              :show-message="false"
              label="户型"/>
          </el-col>
          <el-col :span="3">
            <el-form-item
              prop="chamberCount"
              style="margin-left:-15px;"
              label=""
              label-width="0"
              class="room-item-count">
              <el-select
                v-model="hostingRooms.chamberCount"
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
                v-model="hostingRooms.boardCount"
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
                v-model="hostingRooms.toiletCount"
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
              prop="roomDirection"
              label-width="0"
              class="room-item-count">
              <el-select
                v-model="hostingRooms.roomDirection"
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
        <el-row
          :gutter="10">
          <el-col
            :span="3">
            <el-form-item
              :rules="roomDetailRules.payOfPayment"
              :show-message="false"
              label="付款方式"
              prop="payOfPayment" />
          </el-col>
          <el-col
            :span="1"
            class="inline-item-label right">
            付
          </el-col>
          <el-col :span="4">
            <el-form-item
              prop="payOfPayment"
              label=""
              label-width="0"
              class="room-item-count">
              <el-select v-model="hostingRooms.payOfPayment">
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
            class="inline-item-label right">
            押
          </el-col>
          <el-col :span="4">
            <el-form-item
              prop="depositOfPayment"
              label=""
              label-width="0"
              class="room-item-count">
              <el-select
                v-model="hostingRooms.depositOfPayment"
                @change="handleDepositChange(hostingRooms)">
                <el-option
                  v-for="item in depositList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="rent"
              label="租金">
              <el-input
                v-model="hostingRooms.rent"
                style="width:100%"
                placeholder="请输入租金"
                clearable
                @change="handleRentChange(hostingRooms)" />
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            style="text-align: left"
            class="inline-item-label">
            &nbsp; &nbsp;元/月
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="deposit"
              label="押金">
              <el-input
                v-model="hostingRooms.deposit"
                :disabled="hostingRooms.depositOfPayment !== 13"
                type="number" />
            </el-form-item>
          </el-col>
          <el-col
            :span="1"
            class="inline-item-label">
            &nbsp; 元
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item
              label="房间设施"
              style="width:100%">
              <el-select
                v-model="facilityItemsList"
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
        <el-row>
          <el-col :span="7">
            <el-form-item
              prop="pictures"
              label="房间照片">
              <template v-if="hostingRooms.pictures.length > 0">
                <el-badge :value="hostingRooms.pictures.length">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openPicModel()">上传照片</el-button>
                </el-badge>
              </template>
              <template v-else>
                <el-button
                  type="primary"
                  size="mini"
                  @click="openPicModel()">上传照片</el-button>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </el-tabs> -->
      </el-form>
    </div>
    <!-- 上传图片弹窗 -->
    <el-dialog
      :visible.sync="uploadPicsModelVisible"
      append-to-body
      title="上传公寓照片"
      custom-class="upload-pics-model"
      width="600px"
      @close="uploadModelClose">
      <div class="previewItems">
        <Preview
          :pic-list="currentPicList"
          :delete-icon="true"
          :disabled="false"
          @emitDelete="emitDelete" />
        <label
          class="el-upload el-upload--picture-card uploadImage"
          for="uploadImages">
          <i class="el-icon-plus" />
          <input
            id="uploadImages"
            :accept="accept"
            type="file"
            multiple
            @change="uploadImg($event)">
        </label>
      </div>
      <p class="upload-pics-info">温馨提示： </p>
      <p class="upload-pics-info">1.请勿上传虚假、模糊、与房源信息无关、含有其他公司水印的照片； </p>
      <p class="upload-pics-info">2.房间照片最佳组合：卧室2~6张、公共区域1~4张、厨房1~3张、卫生间1-4张； </p>
      <p class="upload-pics-info">3.目前最多支持15张，支持JPG/JPEG/PNG，可以拖动图片进行排序，支持批量上传。</p>
      <!-- 图片裁剪 -->
      <ImageCropper
        :cropper-list="cropperList"
        @emitCropperData="emitCropperData" />
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="uploadPicsModelVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <div
      :style="{width: toolsWidth}"
      class="entry-house-bottom">
      <template>
        <el-button
          :loading="saveLoading"
          type="primary"
          size="small"
          @click="saveRoomDetailData(1)">保存</el-button>
        <el-button
          :loading="saveLoading"
          size="small"
          @click="saveRoomDetailData(2)">取消</el-button>
      </template>
    </div>
  </div>
</template>
<script>
import Preview from '@/components/Preview/Preview'
import ImageCropper from '@/components/ImageCropper/Cropper'
import { editEstateRoomInfoApi } from '@/api/houseManage'

export default {
  components: {
    ImageCropper,
    Preview
  },
  props: {
    toolsWidth: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      saveLoading: false,
      hostingRooms: {
        roomCode: '',
        boardCount: '0',
        chamberCount: '1',
        toiletCount: '0',
        floorId: '',
        roomArea: '', // 面积
        roomDirection: '', // 朝向
        roomTypeId: '',
        payOfPayment: '', // 付款
        depositOfPayment: '', // 押金
        rent: '',
        deposit: '',
        facilityItems: '',
        pictures: [],
        roomNo: ''
      },
      facilityItemsList: '',
      // },
      // 房型验证
      roomDetailRules: {
        roomArea: [
          { required: true, message: '请输入房源面积', trigger: 'blur' }
        ],
        chamberCount: [
          { required: true, message: '请输入室', trigger: 'blur' }
        ],
        // boardCount: [
        //   { required: true, message: '请输入厅', trigger: 'blur' }
        // ],
        // toiletCount: [
        //   { required: true, message: '请输入卫', trigger: 'blur' }
        // ],
        roomDirection: [
          { required: true, message: '请选择房屋朝向', trigger: 'change' }
        ],
        payOfPayment: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        depositOfPayment: [
          { required: true, message: '请选择押金方式', trigger: 'change' }
        ],
        rent: [
          { required: true, message: '请输入租金', trigger: 'blur' }
        ],
        deposit: [
          { required: true, message: '请输入押金', trigger: 'blur' }
        ],
        pictures: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback(new Error('请上传房间照片'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      floorOptions: [ // 楼层编辑
        {
          value: 1,
          label: '1层'
        },
        {
          value: 2,
          label: '2层'
        }
      ],
      allRoomByFangyuanCode: [], // 房间号
      // activeRoomstyleName: '1',
      tabIndex: 1,
      editableTabsValue: '1', // 当前展示tabs
      clearDepstyleName: true, // 是否清空归属部门
      expendedKeys: { // 默认展开的部门
        depId: Number,
        depstyleName: ''
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
      roomCheckbox: false,
      uploadPicsModelVisible: false, // 上传图片弹窗
      curPicListIndex: -1,
      currentPicList: [],
      cropperList: [],
      accept: 'image/png, image/jpeg, image/jpg'
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
    // 上传图片
    /* 选择图片 */
    async uploadImg (e) { // 点击input
      if (!e.target.value) {
        return false
      }
      const uploadList = []
      const readFileAsync = file => new Promise(resolve => {
        let reader = new FileReader()
        reader.onerror = function (e) {
          console.log('读取异常....')
        }
        reader.onload = e => {
          const img = (typeof e.target.result === 'object')
            // 把Array Buffer转化为blob 如果是base64不需要
            ? window.URL.createObjectURL(new Blob([e.target.result]))
            : e.target.result
          let imagestyleName = ''
          let type = 1
          if (!file.name) {
            imagestyleName = ''
          } else {
            imagestyleName = file.name.split('.')[0].length <= 30
              ? file.name.split('.')[0]
              : file.name.split('.')[0].substr(0, 30)
          }
          resolve({
            img,
            imagestyleName,
            type
          })
        }
        // 转化为base64
        reader.readAsDataURL(file)
      })
      const files = e.target.files
      let picList = this.currentPicList
      if (picList.length + files.length > 15) {
        this.$message.error(`您已上传${picList.length}张图片，最多还能上传${15 - picList.length}张图片`)
        e.target.value = null
        return false
      }
      for (let i = 0; i < files.length; i++) {
        if (!this.accept.includes(files[i].type)) {
          this.$message.error(`请上传${this.accept.replace(/image\//gi, '')}的图片`)
          e.target.value = null
          return false
        }
        uploadList.push(await readFileAsync(files[i]))
      }
      console.log('e.target.files', e.target.files)

      this.cropperList = uploadList.map((item, kindex) => {
        return {
          img: item.img,
          imagestyleName: item.imagestyleName,
          type: item.type
        }
      })
      e.target.value = null
    },
    openPicModel (index) { // 打开上传图片列表
      this.currentPicList = this.hostingRooms.pictures
      this.uploadPicsModelVisible = true
    },
    // 删除图片
    emitDelete (val) {
      this.currentPicList = val || []
    },
    // 裁剪后图片列表
    emitCropperData (list = []) {
      console.log('list1', list)
      list.forEach((v, i) => {
        v.type = 1
        v.imagestyleName = v.title
        if (v.isBase64 === undefined) {
          v.isBase64 = 1
        }
      })
      console.log('list2', list)
      this.currentPicList = [...this.currentPicList, ...list]
    },
    uploadModelClose () { // 关闭上传图片列表
      this.hostingRooms.pictures = this.currentPicList
      this.$refs.roomTypeTabsForm.validateField('pictures')
      this.currentPicList = []
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
        this.$refs.roomTypeTabsForm.validateField('deposit')
      }
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
        this.$refs.roomTypeTabsForm.validateField('deposit')
      }
    },
    setRoomDetailData (res) {
      console.log(res)
      // if (res.pictures.length) {
      //   res.pictures.forEach((item) => {
      //     item.title = item.imageName
      //     item.key = Math.random().toFixed(5)
      //     item.isBase64 = 0
      //   })
      // }
      this.hostingRooms = {
        roomCode: res.roomCode,
        boardCount: res.boardCount,
        chamberCount: res.chamberCount,
        toiletCount: res.toiletCount,
        floorId: res.floorId,
        roomArea: res.roomArea, // 面积
        roomDirection: res.roomDirection, // 朝向
        roomTypeId: res.roomTypeId,
        payOfPayment: res.payOfPayment, // 付款
        depositOfPayment: res.depositOfPayment, // 押金
        rent: res.rent,
        deposit: res.deposit,
        facilityItems: '',
        pictures: res.pictures || [],
        roomNo: res.roomNo
      }
      this.facilityItemsList = res.facilityItems ? res.facilityItems.split(',') : []
      if (this.hostingRooms.pictures.length) {
        this.hostingRooms.pictures.forEach((item) => {
          item.title = item.imageName
          item.key = Math.random().toFixed(5)
          item.isBase64 = 0
        })
      }
    },
    saveRoomDetailData (type) { // 1 保存  2,取消
      if (type === 2) {
        this.$emit('closeDialog')
        return false
      }
      if (type === 1) {
        this.$refs.roomTypeTabsForm.validate((valid) => {
          if (valid) {
            this.hostingRooms.facilityItems = this.facilityItemsList.join(',')
            console.log('编辑房间的参数', this.hostingRooms)
            let roomInfo = {
              roomInfo: JSON.stringify(this.hostingRooms)
            }
            editEstateRoomInfoApi(roomInfo).then((res) => { // 确认编辑
              this.$emit('closeDialog') // 编辑成功之后 关闭弹窗
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.entry-house-bottom {
    padding: 10px 0;
    box-shadow:0 -1px 4px rgba(0, 0, 0, .08);
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0;
    right: 0;
    background: #fff;
    z-index: 200;
  }
  .item-input{
    width:50%
  }
  .room-detail-container {
  max-width: 800px;
  min-width: 660px;
  overflow: hidden;
  margin-bottom: 15px;
  .estate-iontro-length-tips {
    position: absolute;
    bottom: 0px;
    right: 10px;
  }
  }
  .previewItems {
  margin-bottom: 10px;
  .el-upload--picture-card.uploadImage {
    width: 122px;
    height: 92px;
    line-height: 98px;
  }
}
.entry-house-bottom {
  padding: 10px 0;
  box-shadow:0 -1px 4px rgba(0, 0, 0, .08);
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  background: #fff;
  display:flex;
  justify-content: center;
  z-index: 200;
}
.right{
  text-align:right
  }
</style>
