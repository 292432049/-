<template>
  <div class="estate">
    <div
      v-if="!editFlag"
      class="layout_pageHeader">
      <div
        class="entry-house-title">
        新建集中式录入
      </div>
    </div>
    <div class="layout-container" >
      <div
        v-loading="saveEasteLoading"
        class="entry-house-container">
        <el-form
          ref="estateRoomDetail"
          :model="estateRoomDetail"
          :rules="estateRoomDetailRules"
          label-width="95px"
          size="small"
          class="room-detail-container hosting-room-detail">
          <div v-show="!addHouseType">
            <el-form-item
              label="归属部门"
              class="item-input"
              prop="depName" >
              <SelectTree
                :expanded-keys = "expendedKeys"
                :clear-dep-name = "clearDepName"
                :value = "estateRoomDetail.depName"
                node-key = "depId"
                @treeNodeClick = "clickTreeNode"
                @getParentDep = "getParentDep"
                @clearClick="clearClick"
              ></SelectTree>
            </el-form-item>
            <el-form-item
              label="所在地区"
              prop="areaCode"
              class="item-input"
            >
              <area-select
                ref="areaSelect"
                v-model="estateRoomDetail.areaCode"
                :level="1"
                @input="searchZoneList(false)" />
            </el-form-item>
            <el-form-item
              :rules="{ required: zoneList.length > 0, message: '请选择所属板块', trigger: 'change' }"
              prop="zoneId"
              label="所属板块">
              <el-select
                v-model="estateRoomDetail.zoneId"
                :placeholder="zoneList.length ? '请选择' : '无'"
                style="width:43%">
                <el-option
                  v-for="item in zoneList"
                  :key="item.zoneId"
                  :label="item.zoneName"
                  :value="item.zoneId" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="具体位置"
              prop="address"
              class="item-input">
              <map-select
                :area-code="estateRoomDetail.areaCode"
                :value="address"
                @addressChange="addressChange" />
            </el-form-item>
            <el-form-item
              label="品牌公寓"
              prop="estateName"
              class="item-input">
              <el-input
                v-model="estateRoomDetail.estateName"
                placeholder="请输入品牌公寓名称"/>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item
                  prop="contactName"
                  label="看房电话">
                  <el-input
                    v-model="estateRoomDetail.contactName"
                    placeholder="联系人" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="0">
                  <el-select v-model="estateRoomDetail.contactGender">
                    <el-option
                      :value="1"
                      label="先生" />
                    <el-option
                      :value="2"
                      label="女士" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  prop="contactMobile"
                  label-width="0">
                  <el-input
                    v-model="estateRoomDetail.contactMobile"
                    placeholder="联系电话" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="公寓照片"
              prop="pictures">
              <el-badge
                v-if="estateRoomDetail.pictures.length"
                :value="estateRoomDetail.pictures.length">
                <el-button
                  type="primary"
                  size="mini"
                  @click="openPicModel(-1)">上传照片</el-button>
              </el-badge>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="openPicModel(-1)">上传照片</el-button>
            </el-form-item>
            <el-form-item
              label="公寓楼层"
              prop="apartmentFloor">
              <el-input
                v-model="estateRoomDetail.apartmentFloor"
                style="width:300px"
                placeholder="请输入楼层"
                @blur="apartmentInput"
                @focus="apartmentFocus">
                <template slot="prepend">共</template>
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="编辑楼层"
              prop="floorName">
              <el-select
                v-model="estateRoomDetail.floorName"
                multiple
                allow-create
                style="width:43%"
                default-first-option
                placeholder="请选择楼层"
                @change="floorNameChange">
                <el-option
                  v-for="item in floorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="每层房间数"
              prop="floorRoomNum">
              <el-input
                v-model="estateRoomDetail.floorRoomNum"
                style="width:200px"
                placeholder="请输入内容">
                <template slot="append">间</template>
              </el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  label="公寓简介"
                  prop="houseDesc">
                  <el-input
                    v-model="estateRoomDetail.houseDesc"
                    :rows="5"
                    type="textarea"
                    placeholder="请描述一下房源的交通、装饰、周边设施场所等等…" />
                  <span class="estate-iontro-length-tips">{{ estateRoomDetail.houseDesc.length }}/150</span>
                </el-form-item>
              </el-col>
            </el-row>
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

        </el-form>
        <!-- 房型 start-->
        <el-form
          ref="roomTypeTabsForm"
          :model="addHostingRooms"
          :rules="roomDetailRules"
          label-width="95px"
          size="small"
          class="room-detail-container hosting-room-detail">
          <el-tabs
            v-if="addHouseType"
            v-model="editableTabsValue"
            type="border-card"
            class="sub-room-info-list"
            editable
            @edit="handleTabsEdit">
            <el-tab-pane
              v-for="(item, index) in addHostingRooms.hostingRooms"
              :key="index"
              :name="item.name">
              <span slot="label">{{ item.elTabName }}
                <i
                  v-show="index === addHostingRooms.hostingRooms.length - 1 && index > 0"
                  class="el-icon-delete"
                  @click="deleteCurRoom(item, index)" />
              </span>
              <el-row :gutter="0">
                <el-col
                  :span="10"
                  class="inline-item-label">
                  <el-form-item
                    :prop="'hostingRooms.' + index + '.styleName'"
                    :rules="roomDetailRules.styleName"
                    label="房间类型">
                    <el-input
                      v-model="addHostingRooms.hostingRooms[index].styleName"
                      placeholder="请输入房源类型"
                      clearable
                      @change="handleRoomNameLength(addHostingRooms.hostingRooms[index])"
                      @keyup.native="handleRoomNameLength(addHostingRooms.hostingRooms[index])" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    :prop="'hostingRooms.' + index + '.roomArea'"
                    :rules="roomDetailRules.roomArea"
                    label="房间面积"
                    class="room-item-count">
                    <el-input
                      v-model="addHostingRooms.hostingRooms[index].roomArea"
                      placeholder="请输入房间面积"
                      min="0"
                      clearable
                      type="number"
                      @change="setPrecision(index)" />
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
                  :span="3">
                  <el-form-item
                    :rules="roomDetailRules.chamberCount"
                    :show-message="false"
                    label="户型"/>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'hostingRooms.' + index + '.chamberCount'"
                    :rules="roomDetailRules.chamberCount"
                    style="margin-left:-8px;"
                    label=""
                    label-width="0"
                    class="room-item-count">
                    <el-select
                      v-model="addHostingRooms.hostingRooms[index].chamberCount"
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
                      v-model="addHostingRooms.hostingRooms[index].boardCount"
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
                      v-model="addHostingRooms.hostingRooms[index].toiletCount"
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
                    :prop="'hostingRooms.' + index + '.roomDirection'"
                    :rules="roomDetailRules.roomDirection"
                    label-width="0"
                    class="room-item-count">
                    <el-select
                      v-model="addHostingRooms.hostingRooms[index].roomDirection"
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
                    :prop="'hostingRooms.' + index + '.payOfPayment'"
                    :rules="roomDetailRules.payOfPayment"
                    :show-message="false"
                    label="付款方式" />
                </el-col>
                <el-col :span="7">
                  <el-col
                    :span="2"
                    style="margin-left:-10px;"
                    class="inline-item-label">
                    付
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      :prop="'hostingRooms.' + index + '.payOfPayment'"
                      :rules="roomDetailRules.payOfPayment"
                      label-width="0"
                      class="room-item-count">
                      <el-select v-model="addHostingRooms.hostingRooms[index].payOfPayment">
                        <el-option
                          v-for="item in payList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="3"
                    class="inline-item-label">
                    押
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      :prop="'hostingRooms.' + index + '.depositOfPayment'"
                      :rules="roomDetailRules.depositOfPayment"
                      label=""
                      label-width="0"
                      class="room-item-count">
                      <el-select
                        v-model="addHostingRooms.hostingRooms[index].depositOfPayment"
                        @change="handleDepositChange(addHostingRooms.hostingRooms[index])">
                        <el-option
                          v-for="item in depositList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :prop="'hostingRooms.' + index + '.rent'"
                    :rules="roomDetailRules.rent"
                    label="租金">
                    <el-input
                      v-model="addHostingRooms.hostingRooms[index].rent"
                      style="width:100%"
                      placeholder="请输入租金"
                      clearable
                      @change="handleRentChange(addHostingRooms.hostingRooms[index])" />
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
                    :prop="'hostingRooms.' + index + '.deposit'"
                    :rules="roomDetailRules.deposit"
                    label="押金">
                    <el-input
                      v-model="addHostingRooms.hostingRooms[index].deposit"
                      :disabled="addHostingRooms.hostingRooms[index].depositOfPayment !== 13"
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
                      v-model="facilityItemsList[index].facilityItems"
                      class="room-detail-select"
                      style="width:82%"
                      multiple
                      placeholder="请选择"
                      @change="getFacilityItems(index)">
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
                    :prop="'hostingRooms.' + index + '.pictures'"
                    :rules="roomDetailRules.pictures"
                    label="房间照片">
                    <template v-if="addHostingRooms.hostingRooms[index].pictures.length > 0">
                      <el-badge :value="addHostingRooms.hostingRooms[index].pictures.length">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="openPicModel(index)">上传照片</el-button>
                      </el-badge>
                    </template>
                    <template v-else>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="openPicModel(index)">上传照片</el-button>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item
                  :rules="roomDetailRules.roomCodes"
                  label="房号配置">
                  <template v-if="addHostingRooms.hostingRooms[index].roomCodes.length > 0">
                    <el-badge :value="addHostingRooms.hostingRooms[index].roomCodes.length">
                      <el-button
                        type="primary"
                        size="small"
                        @click="selectRoomNum(index)">
                        房间号配置
                      </el-button>
                    </el-badge>
                  </template>
                  <template v-else>
                    <el-button
                      type="primary"
                      size="small"
                      @click="selectRoomNum(index)">
                      房间号配置
                    </el-button>
                  </template>
                </el-form-item>
              </el-row>
              <!-- 房间号配置 start-->
              <el-dialog
                :visible.sync="copyItemToModelVisible"
                :modal="!editFlag"
                :close-on-click-modal="false"
                title="请选择要配置的房间">
                <room-list-select
                  ref="copyItemTo"
                  :room-list="curRoomList"
                  :checked-list="defaultCheckObj[index]"
                  :visible="copyItemToModelVisible"></room-list-select>
                <div
                  slot="footer"
                  style="margin:20px;"
                  class="dialog-footer">
                  <el-button
                    v-if="curRoomList"
                    size="small"
                    type="primary"
                    @click="getRoomNumData">确定</el-button>
                </div>
              </el-dialog>
              <!-- 房间号配置 end-->
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <!-- 房型 end-->
      </div>
    </div>
    <div
      v-if="!addHouseType"
      :style="{width: toolsWidth}"
      class="entry-house-bottom">
      <el-button
        v-if="!addHouseType"
        :loading="saveEasteLoading"
        type="primary"
        size="small"
        @click="addEstateRoomNext()">下一步</el-button>
    </div>
    <div
      v-if="addHouseType"
      :style="{width: toolsWidth}"
      class="entry-house-bottom">
      <template>
        <el-button
          :loading="saveLoading"
          type="primary"
          size="small"
          @click="addEstateRoomPrev()">上一步</el-button>
        <el-button
          v-if="!editFlag"
          :loading="saveLoading"
          type="primary"
          size="small"
          @click="saveRoomDetailData(1)">保存并继续添加</el-button>
        <el-button
          :loading="saveLoading"
          type="primary"
          size="small"
          @click="saveRoomDetailData(3)">确定</el-button>
        <el-button
          v-if="!editFlag"
          :loading="saveLoading"
          size="small"
          @click="saveRoomDetailData(2)">取消</el-button>
      </template>

    </div>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import Preview from '@/components/Preview/Preview'
import areaSelect from '@/components/AreaSelect'
import mapSelect from '@/components/MapSelect'
import SelectTree from '@/components/SelectTree/'
import { estateZoneListByAreaIdApi, saveEstateInfoApi, allRoomByFangyuanCodeApi, saveRoomTypesApi, cancleSaveEstateApi, queryEstateDetailApi, editEstateInfoApi, queryEstateTypeApi } from '@/api/houseManage'
import { validateMobile } from '@/utils/validate'
import ImageCropper from '@/components/ImageCropper/Cropper'
import roomListSelect from './roomListSelect'
import roomType from './roomType'

export default {
  name: 'EstateRoomDetail',
  components: {
    mapSelect,
    areaSelect,
    SelectTree,
    ImageCropper,
    Preview,
    roomType,
    validateMobile,
    roomListSelect
  },
  inject: ['reloadPage'],
  props: {
    editFlag: {
      type: Boolean,
      default: false
    },
    houseCode: {
      type: String, // 房源code
      default: ''
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
    const validateDepName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择归属部门'))
      } else {
        callback()
      }
    }
    const validateAdress = (rule, value, callback) => {
      if (!this.address) {
        callback(new Error(' 请输入关键字 '))
      } else {
        callback()
      }
    }
    const validateapartmentFloor = (rule, value, callback) => {
      if (!this.estateRoomDetail.apartmentFloor) {
        callback(new Error(' 请输入楼层数'))
      } else if (this.estateRoomDetail.apartmentFloor === '0') {
        callback(new Error('楼层数不能为0'))
      } else {
        callback()
      }
    }
    return {
      copyItemToModelVisible: false, // 房间配置弹窗
      copyItemRoomList: {}, // 房间号配置数据
      curRoomList: {},
      roomTotal: 0,
      currentRoomIndex: null,
      zoneList: [], // 所属板块列表
      saveLoading: false, // 是否加载中
      saveEasteLoading: false,
      addHouseType: false, // 展示添加房型
      defaultCheckObj: [],
      cancelDefaultCheckObj: [],
      checkedRoomList: [], // 选中的房间号
      toRouter: false,
      estateRoomDetail: { // form 数据
        fangyuanCode: '',
        contactName: '', // 联系人
        contactGender: 1, // 联系人性别
        contactMobile: '', // 联系人电话
        estateName: '', // 品牌公寓
        areaCode: [],
        houseDesc: '', // 公寓简介
        zoneId: '', // 所属板块
        pictures: [], // 公寓照片
        floorName: [], // 编辑楼层
        floorRoomNum: '', // 每层房间数
        apartmentFloor: null
      },
      estateRoomDetailOriginal: null, // 编辑房源之前获取到的原始数据

      address: '',
      addHostingRooms: {
        depId: null,
        fangyuanCode: '',
        hostingRooms: [
          {
            styleName: '',
            roomArea: '', // 面积
            elTabName: '房型A',
            roomDirection: '', // 朝向
            chamberCount: '1',
            boardCount: '0',
            toiletCount: '0',
            name: '1',
            rent: '',
            deposit: '',
            payOfPayment: '', // 付款
            depositOfPayment: '', // 押金
            // facilityItemsList: [],
            facilityItems: '',
            pictures: [],
            roomCodes: []
          }
        ]
      },
      facilityItemsList: [{
        facilityItems: ''
      }
      ],
      estateRoomDetailRules: { // 表单验证
        depName: [
          { required: true, trigger: ['change'], validator: validateDepName }
        ],
        address: [
          { required: true, trigger: 'change', validator: validateAdress }
        ],
        estateName: [
          { required: true, message: '请输入品牌公寓', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contactMobile: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        houseDesc: [
          { required: true, message: '请输入房源描述', trigger: 'blur' },
          { max: 150, message: '长度不能超过150个字符', trigger: 'change' }
        ],
        apartmentFloor: [
          { required: true, trigger: 'blur', validator: validateapartmentFloor }
        ],
        floorRoomNum: [
          { required: true, message: '请输入每层房间数', trigger: 'blur' }
        ],
        floorName: [
          { required: true, message: '请选择楼层', trigger: 'change' }
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
            trigger: 'change'
          }
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
      // 房型验证
      roomDetailRules: {
        styleName: [
          { required: true, message: '请输入房源类型', trigger: 'blur' }
        ],
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
          { required: true, message: '请输入付款方式', trigger: 'change' }
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
        ],
        roomCodes: [
          {
            required: true
          }
        ]
      },
      floorOptions: [], // 楼层编辑
      allRoomByFangyuanCode: [], // 房间号
      activeRoomName: '1',
      tabIndex: 1,
      editableTabsValue: '1', // 当前展示tabs
      clearDepName: true, // 是否清空归属部门
      expendedKeys: { // 默认展开的部门
        depId: Number,
        depName: ''
      },
      toolsWidth: {
        type: String,
        default: '100%'
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
      accept: 'image/png, image/jpeg, image/jpg',
      estateModel: {}, // 房间号
      changeEditFloor: false,
      storedFloors: [], // 编辑模式下,从服务器获取到的floor信息
      editFEstateTipVisible: false // 楼层较少或者房间数较少时候，点击下一步给出提示
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
    },
    apartmentFloor () {
      return this.estateRoomDetail.apartmentFloor
    }
  },
  watch: {
    apartmentFloor (val, oldVal) {
      this.changeEditFloor = true
    }
  },
  mounted () {
    if (this.editFlag) {
      this.getInitData()
    }
  },
  methods: {
    getInitData () { // 编辑公寓 获取详情
      queryEstateDetailApi({ 'fangyuanCode': this.houseCode }).then(res => {
        if (!res.data) {
          return
        }
        let data = res.data
        this.estateRoomDetailOriginal = deepClone(data)
        this.estateRoomDetail = {
          fangyuanId: data.fangyuanId,
          fangyuanCode: data.fangyuanCode,
          contactName: data.contactName,
          contactGender: data.contactGender,
          contactMobile: data.contactMobile,
          estateName: data.estateName,
          areaCode: [data.provinceId, data.cityId, data.regionId],
          houseDesc: data.houseDesc,
          zoneId: data.zoneId,
          zoneName: data.zoneName,
          pictures: data.pictures,
          floorRoomNum: data.defaultRoomCount,
          depName: data.depName
        }
        this.storedFloors = data.floors
        // let floorName = []
        this.estateRoomDetail.floorName = []
        for (let index in data.floors) {
          this.estateRoomDetail.floorName.push(parseInt(data.floors[index].floorName))
        }
        this.estateRoomDetail.apartmentFloor = data.defaultFloorCount
        // this.estateRoomDetail['floorName'] = floorName
        this.apartmentInput()

        this.searchZoneList(false)
        this.estateRoomDetail['zoneId'] = data.zoneId
        this.estateRoomDetail['regionAddressId'] = data.regionAddressId
        this.address = data.subdistrictAddress
        this.addHostingRooms.depId = data.depId
        // 服务器需要isBase64为0
        data.pictures.forEach(item => {
          item.isBase64 = 0
        })
      })
    },
    apartmentFocus () {
      this.changeEditFloor = false
    },
    floorNameChange (v) {
      this.apartmentInput()
      this.estateRoomDetail.floorName = []
      for (let index in v) {
        this.estateRoomDetail.floorName.push(v[index])
      }
    },
    // 输入总共楼层数遍历出每层
    apartmentInput () {
      this.floorOptions = []
      if (this.estateRoomDetail.apartmentFloor) {
        for (let i = 1; i <= this.estateRoomDetail.apartmentFloor; i++) {
          this.floorOptions.push(
            {
              value: i,
              label: i + '层'
            }
          )
        }
      }
      if (this.changeEditFloor) { // 楼层改变了 就清空
        this.estateRoomDetail.floorName = []
      }
    },
    // 点击树节点
    clickTreeNode (data) {
      // this.estateRoomDetail.depName = data.depName
      console.log(data)
      this.$set(this.estateRoomDetail, 'depName', data.depName)
      this.addHostingRooms.depId = data.depId
    },
    // 获取树结构顶级元素
    getParentDep (data) {
      this.expendedKeys = deepClone(data)
    },
    //  清除织架构
    clearClick () {
      this.$set(this.estateRoomDetail, 'depName', '')
    },
    searchZoneList (flag) { // 搜索板块列表
      [this.estateRoomDetail.provinceId, this.estateRoomDetail.cityId, this.estateRoomDetail.regionId] = this.estateRoomDetail.areaCode
      if (!flag) {
        this.estateRoomDetail.regionAddressId = ''
        this.estateRoomDetail.zoneId = ''
        this.address = ''
      }
      if (this.estateRoomDetail.areaCode[2] !== undefined) {
        estateZoneListByAreaIdApi({
          regionId: this.estateRoomDetail.regionId
        }).then((res) => {
          this.zoneList = res.data.list
        })
      } else {
        this.zoneList = []
      }
    },
    addressChange (val) { // 选择具体位置
      console.log(val)
      if (val.areaCode) {
        this.estateRoomDetail.areaCode = val.areaCode
      }
      this.estateRoomDetail.regionAddressId = val.regionAddressId
      this.address = val.address
      this.$refs['estateRoomDetail'].validateField('address')
      this.searchZoneList(true)
    },
    // tab-pane
    handleTabsEdit (targetName, action, item, fi) {
      if (action === 'add') {
        if (this.addHostingRooms.hostingRooms.length > 25) {
          return
        }
        let curIndex = this.addHostingRooms.hostingRooms.length
        let newTabName = ++this.tabIndex + ''
        let temp = {
          styleName: '',
          roomArea: '', // 面积
          elTabName: '房型' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[curIndex],
          roomDirection: '', // 朝向
          chamberCount: '1',
          boardCount: '0',
          toiletCount: '0',
          rent: '',
          deposit: '',
          name: newTabName,
          payOfPayment: '', // 付款
          depositOfPayment: '', // 押金
          facilityItems: '',
          pictures: [],
          roomCodes: []
          // facilityItemsList: []
        }
        if (this.editFlag && item) {
          temp.styleName = item.styleName
          temp.roomArea = item.roomArea
          temp.roomDirection = item.roomDirection
          temp.chamberCount = item.chamberCount
          temp.boardCount = item.boardCount
          temp.toiletCount = item.toiletCount
          temp.rent = item.rent
          temp.deposit = item.deposit
          temp.payOfPayment = item.payOfPayment
          temp.depositOfPayment = item.depositOfPayment
          temp.pictures = item.pictures
          temp.roomCodes = item.roomCodes
          temp.facilityItems = item.facilityItems
          if (this.facilityItemsList.length === 1 && this.facilityItemsList[0].facilityItems === '') {
            this.facilityItemsList.splice(0, 1)
          }
          this.facilityItemsList.push({
            'facilityItems': fi.split(',')
          })
          this.defaultCheckObj.push(item.roomCodes)
        } else {
          this.facilityItemsList.push({
            'facilityItems': ''
          })
        }
        this.addHostingRooms.hostingRooms.push(temp)
        this.editableTabsValue = newTabName
      }
      if (action === 'remove') {
        let tabs = this.addHostingRooms.hostingRooms
        let activeName = this.editableTabsValue
        if (activeName === targetName) { // 如果当前显示的 === 点击要删除的
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              this.defaultCheckObj.splice(index, 1)
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.addHostingRooms.hostingRooms = tabs.filter(tab => tab.name !== targetName)
        this.addHostingRooms.hostingRooms.forEach((item, index) => {
          item.elTabName = '房型' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[index]
        })
        this.$nextTick(() => {
          this.activeRoomName = activeName
          this.editableTabsValue = activeName
        })
      }
    },
    // 房间类型长度不能超过10位
    handleRoomNameLength (room) {
      if (room.styleName && room.styleName.length > 10) {
        room.styleName = room.styleName.substr(0, 10)
      }
    },
    // 检查是否能删除当前房间
    deleteCurRoom (curRoom, index) {
      console.log(curRoom.name)
      this.handleTabsEdit(curRoom.name, 'remove')
    },
    // 房间面积保留2位精度
    setPrecision (index, data) {
      let val = typeof index === 'number' ? this.addHostingRooms.hostingRooms[index].roomArea : ''
      if (val > 0) {
        let list = val.split('.')
        if (!list[1]) {
          val = val + '.00'
        } else {
          val = Number(val).toFixed(2)
        }
      } else {
        val = 0
      }
      this.addHostingRooms.hostingRooms[index].roomArea = val
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
        if (target.elTabName) {
          const index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(target.elTabName.replace('房型', ''))
          this.$refs.roomTypeTabsForm.validateField('hostingRooms.' + index + '.deposit')
        }
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
        if (target.elTabName) {
          const index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(target.elTabName.replace('房型', ''))
          this.$refs.roomTypeTabsForm.validateField('hostingRooms.' + index + '.deposit')
        }
      }
    },
    // 获取房间设施
    getFacilityItems (index) {
      console.log('房间设施', this.facilityItemsList[index].facilityItems)
      this.addHostingRooms.hostingRooms[index].facilityItems = this.facilityItemsList[index].facilityItems.join(',')
    },
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
          let imageName = ''
          let type = 1
          if (!file.name) {
            imageName = ''
          } else {
            imageName = file.name.split('.')[0].length <= 30
              ? file.name.split('.')[0]
              : file.name.split('.')[0].substr(0, 30)
          }
          resolve({
            img,
            imageName,
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
      this.cropperList = uploadList.map((item, kindex) => {
        return {
          img: item.img,
          imageName: item.imageName,
          type: item.type
        }
      })
      e.target.value = null
    },
    openPicModel (index) { // 打开上传图片列表
      this.curPicListIndex = index
      this.currentPicList = index === -1 ? this.estateRoomDetail.pictures : this.addHostingRooms.hostingRooms[index].pictures
      this.uploadPicsModelVisible = true
    },
    // 删除图片
    emitDelete (val) {
      this.currentPicList = val || []
    },
    // 裁剪后图片列表
    emitCropperData (list = []) {
      // console.log('list1', list)
      list.forEach((v, i) => {
        v.type = 1
        v.imageName = v.title
        if (v.isBase64 === undefined) {
          v.isBase64 = 1
        }
      })
      // console.log('list2', list)
      this.currentPicList = [...this.currentPicList, ...list]
      // console.log(this.currentPicList)
    },
    uploadModelClose () { // 关闭上传图片列表
      if (this.curPicListIndex === -1) { // 公寓的照片
        this.estateRoomDetail.pictures = this.currentPicList
        this.$refs.estateRoomDetail.validateField('pictures')
      } else {
        this.addHostingRooms.hostingRooms[this.curPicListIndex].pictures = this.currentPicList
        this.$refs.roomTypeTabsForm.validateField('hostingRooms.' + this.curPicListIndex + '.pictures')
      }
      this.currentPicList = []
    },
    // 下一步
    addEstateRoomNext () {
      let floors = []

      this.$refs.estateRoomDetail.validate((valid) => {
        if (valid) {
          // 编辑模式下判断楼层数和房间数是否减少，减少需要给出对应提示 (暂时前端不做校验)
          // if (this.editFlag) {
          //   if (this.estateRoomDetail.floorRoomNum < this.estateRoomDetailOriginal.defaultFloorCount ||
          //     this.estateRoomDetail.floorRoomNum < this.estateRoomDetailOriginal.defaultRoomCount ||
          //     this.estateRoomDetail.floorName.length < this.estateRoomDetailOriginal.floors.length) {
          //     this.$emit('showDelFloorTip')
          //     debugger
          //     return
          //   }
          //   return
          // }

          this.saveEasteLoading = true
          this.estateRoomDetail.floorName.forEach((item, index) => {
            let floor = {
              floorName: item,
              roomNum: this.estateRoomDetail.floorRoomNum
            }
            if (this.editFlag) {
              this.storedFloors.forEach(f => {
                if (f.floorName * 1 === item) {
                  floor['floorId'] = f.floorId
                }
              })
            }
            floors.push(floor)
          })
          let param = {
            fangyuanId: this.estateRoomDetail.fangyuanId,
            fangyuanCode: this.estateRoomDetail.fangyuanCode,
            contactGender: this.estateRoomDetail.contactGender,
            contactMobile: this.estateRoomDetail.contactMobile,
            contactName: this.estateRoomDetail.contactName,
            estateName: this.estateRoomDetail.estateName,
            regionAddressId: this.estateRoomDetail.regionAddressId,
            houseDesc: this.estateRoomDetail.houseDesc,
            zoneId: this.estateRoomDetail.zoneId,
            floors: floors,
            pictures: this.estateRoomDetail.pictures,
            defaultFloorCount: this.estateRoomDetail.apartmentFloor,
            defaultRoomCount: this.estateRoomDetail.floorRoomNum
          }
          console.log('提交公寓的参数', param)
          let estateInfo = JSON.stringify(param)

          let method = this.editFlag ? editEstateInfoApi : saveEstateInfoApi
          method({estateInfo: estateInfo}).then((res) => { // 保存公寓接口
            if (res.code * 1 === 0) {
              let code
              if (this.editFlag) {
                code = this.estateRoomDetail.fangyuanCode
              } else {
                code = res.data
                this.estateRoomDetail.fangyuanCode = code
              }
              this.roomTotal = this.estateRoomDetail.floorName.length * this.estateRoomDetail.floorRoomNum // 总房间数
              // 公寓保存之后 获取房间号
              allRoomByFangyuanCodeApi({fangyuanCode: code}).then((response) => {
                this.copyItemRoomList = response.data
                this.addHouseType = true
                this.saveEasteLoading = false
              })

              if (this.editFlag) {
                // 获取所有房型
                this.handleTabsEdit('1', 'remove')
                queryEstateTypeApi({fangyuanCode: code}).then(res => {
                  res.data.forEach((item, index) => {
                    // 服务器需要isBase64为0
                    item.pictures.forEach(t => {
                      t.isBase64 = 0
                    })
                    this.handleTabsEdit('', 'add', item, item.facilityItems)
                  })
                })
              }
            } else {
              this.fullscreenLoading = false
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          }).catch(() => {
            this.saveEasteLoading = false
          })
        }
      })
    },
    // 上一步
    addEstateRoomPrev () {
      this.addHostingRooms.hostingRooms = [
        {
          roomTypes: '',
          roomArea: '', // 面积
          elTabName: '房型A',
          roomDirection: '', // 朝向
          chamberCount: '1',
          boardCount: '0',
          toiletCount: '0',
          name: '1',
          rent: '',
          deposit: '',
          payOfPayment: '', // 付款
          depositOfPayment: '', // 押金
          facilityItems: '',
          pictures: [],
          roomCodes: []
          // facilityItemsList: []
        }
      ]
      this.facilityItemsList = [{
        facilityItems: ''
      }
      ]
      this.editableTabsValue = '1'
      this.tabIndex = 1
      this.$refs.estateRoomDetail.clearValidate()
      this.defaultCheckObj = []
      for (let i = 0; i < this.addHostingRooms.hostingRooms.length; i++) {
        this.addHostingRooms.hostingRooms[i].roomCodes = []
      }
      this.addHostingRooms.hostingRooms.splice(2, this.addHostingRooms.hostingRooms.length)
      this.addHouseType = false
    },
    // 选择房间号弹窗
    selectRoomNum (index) { // 选择房间号
      this.copyItemToModelVisible = true
      let cancelArray = []
      this.currentRoomIndex = index
      this.cancelDefaultCheckObj = deepClone(this.defaultCheckObj) // 需要删除的选项
      this.cancelDefaultCheckObj.splice(index, 1)
      this.cancelDefaultCheckObj.filter((item, i) => {
        item.forEach((key, j) => {
          cancelArray.push(key)
        })
      })
      this.curRoomList = deepClone(this.copyItemRoomList)
      if (cancelArray.length) {
        for (let item in this.curRoomList) {
          this.curRoomList[item].map((key, index) => {
            cancelArray.forEach((obj) => {
              if (obj === key.roomCode) {
                this.curRoomList[item][index] = 0
              }
            })
          })
        }
      }
      for (let key in this.curRoomList) {
        this.curRoomList[key] = this.curRoomList[key].filter((index) => this.curRoomList[key][index] !== 0)
      }
      // console.log('this.curRoomList', this.curRoomList)
    },
    getRoomNumData () { // 获取房间号falsecopyItemToModelVisible
      this.checkedRoomList = this.$refs.copyItemTo[this.currentRoomIndex].returnCheckedList().saveRoomList
      this.defaultCheckObj[this.currentRoomIndex] = this.checkedRoomList || [] // 默认选中d
      // console.log('默认选项', this.defaultCheckObj)
      this.addHostingRooms.hostingRooms[this.currentRoomIndex].roomCodes = deepClone(this.checkedRoomList)
      this.copyItemToModelVisible = false
    },
    // 提交时候获取已经配置的房间号
    defaultCheckObjNum (type) { // type==1 为配置的   type==2  判断是否配置完
      let num = 0
      for (let i = 0; i < this.defaultCheckObj.length; i++) {
        num += this.defaultCheckObj[i].length
      }
      if (num !== this.roomTotal) {
        return true
      } else {
        return false
      }
    },
    // 提交form表单
    saveRoomDetailData (type) {
      let param = {}
      param.depId = this.addHostingRooms.depId
      param.fangyuanCode = this.estateRoomDetail.fangyuanCode
      console.log('保存房型参数', this.addHostingRooms.hostingRooms)
      param.roomTypes = JSON.stringify(this.addHostingRooms.hostingRooms)

      // console.log('保存房型参数', param)
      this.$refs.roomTypeTabsForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.defaultCheckObjNum(1)) {
            this.$message({
              message: '部分房间还未配置,请继续配置剩余房间号',
              type: 'warning'
            })
            this.saveLoading = false
          } else {
            if (type === 1) {
              saveRoomTypesApi(param).then((res) => {
                console.log('跳转1')
                this.saveLoading = false
                this.reloadPage() // 添加成功后刷新页面
                this.toRouter = true
              }).catch(() => {
                this.saveLoading = false
              })
            } else if (type === 3) { // 确定 跳转房源管理
              saveRoomTypesApi(param).then((res) => {
                console.log('跳转2')
                this.saveLoading = false
                this.toRouter = true
                if (this.editFlag) {
                  this.reloadPage()
                } else {
                  this.$router.push({name: '集中式房源管理'})
                }
              }).catch(() => {
                this.saveLoading = false
              })
            }
          }
        }
      })
      if (type === 2) { // 点击取消的时候
        cancleSaveEstateApi({fangyuanCode: this.estateRoomDetail.fangyuanCode}).then((res) => {
          // 取消保存房型
          this.$router.push({name: '集中式房源管理'})
        })
      }
    }
  },
  beforeRouteLeave (to, from, next) { // 离开页面  取消  公寓保存
    if (this.estateRoomDetail.fangyuanCode !== '' && !this.toRouter) {
      cancleSaveEstateApi({fangyuanCode: this.estateRoomDetail.fangyuanCode}).then((res) => {
        // 取消保存房型
        next()
      })
    } else {
      next()
    }
  }
}
</script>
<style  lang="scss" scoped>
.estate .inline-item-label {
      text-align: center;
      line-height: 32px;
      padding: 0 !important;
      font-size: 14px;
      color: #606266;
    }
  .entry-house-title {
    font-size: 18px;
    line-height: 25px;
    padding-bottom: 20px;
    background:#fff
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
  .el-form-item__error{
    width:1114px;
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
.sub-room-info-list {
    margin-bottom: 18px;
    box-shadow: 0 0;
    .el-tabs__item {
      .el-icon-delete {
        margin-left: 5px;
        color: red;
      }
    }
  }

</style>
<style lang="scss">
 .sub-room-info-list {
    margin-bottom: 18px;
    box-shadow: 0 0;
     .el-tabs__item {
      .el-icon-delete {
        margin-left: 5px;
        color: red;
      }
    }
  }
  .estate .el-tabs__new-tab{margin-right:10px;}
  .estate .el-tabs__item .el-icon-close{
    display:none
  }
  .estate .el-dialog__wrapper {z-index:3000!important}

  .dlg-del-tip .el-dialog{
    position: relative;
  }
</style>
