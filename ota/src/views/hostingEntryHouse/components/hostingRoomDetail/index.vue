<template>
  <div>
    <div :class="{layout_pageHeader:!editFlag}">
      <div
        v-if="!editFlag"
        class="entry-house-title">
        {{ editFlag ? '编辑' : '新建' + `分散式${houseRentType === 1 ? '整租' : '合租'}` }}
      </div>
      <div
        v-if="outerHouseShow"
        class="codeFlex entry-house-container">
        <el-row class="codeLabelStyle">外部编码 </el-row>
        <el-row
          v-if="outerHouseShow"
          style="margin-right:10px;">
          <el-input
            v-model="outerHouseUuid"
            size="small"
            clearable
            placeholder="请输入外部编码"
            style="width:250px;">
          </el-input>
        </el-row>
        <el-row>
          <el-button
            type="primary"
            size="small"
            @click="checkOuterHouseUuid">确认</el-button>
        </el-row>
      </div>
    </div>
    <div class="layout-container">
      <div
        v-loading="saveLoading"
        class="entry-house-container">
        <el-form
          v-if="JSON.stringify(hostingRoomDetail) !== '{}'"
          ref="hostingRoomDetail"
          :model="hostingRoomDetail"
          :rules="hostingRoomDetailRules"
          label-width="90px"
          size="small"
          class="room-detail-container hosting-room-detail">
          <el-form-item
            label="归属部门"
            style="width: 50%"
            prop="depId">
            <el-select
              v-model="hostingRoomDetail.depName"
              :disabled="editFlag"
              clearable
              placeholder="请选择归属部门"
              class="room-detail-select">
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
          <el-form-item
            label="所在地区"
            prop="areaCode"
            style="width: 50%">
            <area-select
              ref="areaSelect"
              v-model="hostingRoomDetail.areaCode"
              :level="1"
              @input="searchZoneList(false)" />
          </el-form-item>
          <el-form-item
            :rules="{ required: zoneList.length > 0, message: '请选择所属板块', trigger: 'change' }"
            prop="zoneId"
            label="所属板块"
            style="width: 50%">
            <el-select
              v-model="hostingRoomDetail.zoneId"
              :placeholder="zoneList.length ? '请选择' : '无'"
              class="room-detail-select">
              <el-option
                v-for="item in zoneList"
                :key="item.zoneId"
                :label="item.zoneName"
                :value="item.zoneId" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="公寓/小区"
            prop="address"
            style="width: 50%">
            <map-select
              :area-code="hostingRoomDetail.areaCode"
              :value="hostingRoomDetail.address"
              @addressChange="addressChange" />
          </el-form-item>
          <el-form-item
            label="楼幢"
            prop="buildingName"
            style="width: 50%">
            <el-input v-model="hostingRoomDetail.buildingName" />
          </el-form-item>
          <el-form-item
            label="单元"
            style="width: 25%">
            <el-input v-model="hostingRoomDetail.unitCode" />
          </el-form-item>
          <el-form-item
            label="室"
            prop="roomNo"
            style="width: 25%">
            <el-input v-model="hostingRoomDetail.roomNo" />
          </el-form-item>
          <div style="position: relative">
            <el-form-item
              :show-message="false"
              label="户型"
              class="room-count room-count-container"
              prop="chamberCount" />
            <el-row
              :gutter="10"
              class="room-count-row">
              <el-col :span="3">
                <el-form-item
                  label=""
                  label-width="0"
                  prop="chamberCount"
                  class="room-item-count">
                  <el-select
                    v-model="hostingRoomDetail.chamberCount"
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
                    v-model="hostingRoomDetail.boardCount"
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
                    v-model="hostingRoomDetail.toiletCount"
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
              <el-col :span="3">
                <el-form-item
                  label=""
                  label-width="0"
                  prop="houseArea"
                  class="room-item-count">
                  <el-input
                    v-model="hostingRoomDetail.houseArea"
                    min="0"
                    type="number"
                    @change="setPrecision" />
                </el-form-item>
              </el-col>
              <el-col
                :span="1"
                class="inline-item-label">
                m
                <sup>2</sup>
              </el-col>
              <el-col
                v-if="houseRentType === 1"
                :span="4">
                <el-form-item
                  label-width="0"
                  prop="houseDirection"
                  class="room-item-count">
                  <el-select
                    v-model="hostingRoomDetail.houseDirection"
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
              <el-col
                :span="4">
                <el-form-item
                  label-width="0"
                  prop="decorationDegree"
                  class="room-item-count">
                  <el-select
                    v-model="hostingRoomDetail.decorationDegree"
                    class="room-detail-select"
                    placeholder="装修程度">
                    <el-option
                      v-for="item in decorationDegreeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                prop="contactName"
                label="看房电话">
                <el-input
                  v-model="hostingRoomDetail.contactName"
                  placeholder="联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label-width="0">
                <el-select v-model="hostingRoomDetail.contactGender">
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
                  v-model="hostingRoomDetail.contactMobile"
                  type="number"
                  placeholder="联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <div
            style="position: relative"
            class="room-detail-floor-container">
            <el-form-item
              :show-message="false"
              label="层高"
              class="room-count room-count-container"
              prop="chamberCount" />
            <el-row
              :gutter="0"
              class="room-count-row">
              <el-col :span="5">
                <el-form-item
                  label=""
                  label-width="0"
                  prop="floorName">
                  <el-input
                    v-model="hostingRoomDetail.floorName"
                    type="number"
                    class="room-detail-floor-input">
                    <template slot="prepend">所在层</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="0"
                  prop="floorAmount">
                  <el-input
                    v-model="hostingRoomDetail.floorAmount"
                    type="number"
                    class="room-detail-floor-input">
                    <template slot="prepend">总楼层</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="hostingRoomDetail.houseRentType === 1">
            <el-form-item
              label="房间照片"
              prop="pictures">
              <el-badge
                v-if="hostingRoomDetail.pictures.length"
                :value="hostingRoomDetail.pictures.length">
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
            <div style="position: relative">
              <el-form-item
                label="付款方式"
                prop="chamberCount"
                class="room-count room-count-container" />
              <el-row
                :gutter="10"
                class="room-count-row">
                <el-col
                  :span="1"
                  class="inline-item-label">
                  付
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label=""
                    label-width="0"
                    prop="payOfPayment"
                    class="room-item-count">
                    <el-select v-model="hostingRoomDetail.payOfPayment">
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
                      v-model="hostingRoomDetail.depositOfPayment"
                      @change="handleDepositChange(hostingRoomDetail)">
                      <el-option
                        v-for="item in depositList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item
                  label="租金"
                  prop="rent">
                  <el-input
                    v-model="hostingRoomDetail.rent"
                    type="number"
                    @change="handleRentChange(hostingRoomDetail)" />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                style="text-align: left"
                class="inline-item-label">
                元/月
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item
                  label="押金"
                  prop="deposit">
                  <el-input
                    v-model="hostingRoomDetail.deposit"
                    :disabled="hostingRoomDetail.depositOfPayment !== 13"
                    type="number" />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                style="text-align: left"
                class="inline-item-label">
                元
              </el-col>
            </el-row>
          </div>

          <el-row :gutter="20">
            <el-col :span="13">
              <el-form-item :label="hostingRoomDetail.houseRentType === 1 ? '公区设施' : '房间设施'">
                <el-select
                  v-model="hostingRoomDetail.facilityItemsList"
                  class="room-detail-select"
                  multiple
                  placeholder="请选择">
                  <el-option-group
                    v-for="group in facilityGroup"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.facilitys"
                      v-if="!(hostingRoomDetail.houseRentType === 2 && item.value === '1')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-form-item
          :label="hostingRoomDetail.houseRentType === 1 ? '公区设施' : '房间设施'">
          <service-list
            :list="hostingRoomDetail.facilityItemsList"
            @setFacilityItemsList="setFacilityItemsList" />
        </el-form-item> -->
          <el-row
            v-if="hostingRoomDetail.houseRentType !== 2"
            :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="房源描述"
                prop="houseDesc">
                <el-input
                  v-model="hostingRoomDetail.houseDesc"
                  :rows="5"
                  type="textarea"
                  placeholder="请描述一下房源的交通、装饰、周边设施场所等等…" />
                <span class="estate-iontro-length-tips">{{ hostingRoomDetail.houseDesc.length }}/150</span>
              </el-form-item>
            </el-col>
          </el-row>

          <template v-if="hostingRoomDetail.houseRentType === 2">
            <el-tabs
              v-model="activeRoomName"
              :addable="hostingRoomDetail.hostingRooms.length < 26"
              class="sub-room-info-list"
              type="border-card"
              @edit="handleTabsEdit">
              <el-tab-pane
                v-for="(item, index) in hostingRoomDetail.hostingRooms"
                :key="item.roomName"
                :name="item.name">
                <span slot="label">{{ item.roomName }}
                  <i
                    v-show="index === hostingRoomDetail.hostingRooms.length - 1 && index > 0"
                    class="el-icon-delete"
                    @click="deleteCurRoom(item, index)" />
                </span>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="房间名称">
                      <el-input
                        v-model="hostingRoomDetail.hostingRooms[index].roomPlaceName"
                        placeholder="如主卧/侧卧"
                        @change="handleRoomNameLength(hostingRoomDetail.hostingRooms[index])"
                        @keyup.native="handleRoomNameLength(hostingRoomDetail.hostingRooms[index])"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label-width="0"
                      class="room-count">
                      <el-row>
                        <el-col :span="19">
                          <el-form-item
                            :prop="'hostingRooms.' + index + '.roomArea'"
                            :rules="hostingRoomDetailRules.roomDetail.roomArea"
                            label="房间面积"
                            class="room-item-count">
                            <el-input
                              v-model="hostingRoomDetail.hostingRooms[index].roomArea"
                              min="0"
                              type="number"
                              @change="setPrecision(index)" />
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="5"
                          class="inline-item-label">
                          m
                          <sup>2</sup>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'hostingRooms.' + index + '.roomDirection'"
                      :rules="hostingRoomDetailRules.roomDetail.roomDirection"
                      label-width="0">
                      <el-select
                        v-model="hostingRoomDetail.hostingRooms[index].roomDirection"
                        class="room-detail-select"
                        placeholder="房间朝向">
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
                  <el-col :span="7">
                    <el-form-item
                      :prop="'hostingRooms.' + index + '.pictures'"
                      :rules="hostingRoomDetailRules.roomDetail.pictures"
                      label="房间照片">
                      <template v-if="hostingRoomDetail.hostingRooms[index].pictures.length > 0">
                        <el-badge :value="hostingRoomDetail.hostingRooms[index].pictures.length">
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
                  <el-col :span="14">
                    <el-form-item
                      label-width="0"
                      prop="">
                      <el-checkbox-group v-model="hostingRoomDetail.hostingRooms[index].roomAttributesList">
                        <el-checkbox
                          label="1"
                          class="room-attributes">独立卫生间</el-checkbox>
                        <el-checkbox
                          label="2"
                          class="room-attributes">独立阳台</el-checkbox>
                        <el-checkbox
                          label="3"
                          class="room-attributes">独立厨房</el-checkbox>
                        <el-checkbox
                          label="4"
                          class="room-attributes">飘窗</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="13">
                    <el-form-item label="房间设施">
                      <el-select
                        v-model="hostingRoomDetail.hostingRooms[index].facilityItemsList"
                        class="room-detail-select"
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
                <div style="position: relative">
                  <el-form-item
                    label="付款方式"
                    prop="chamberCount"
                    class="room-count room-count-container" />
                  <el-row
                    :gutter="10"
                    class="room-count-row">
                    <el-col
                      :span="1"
                      class="inline-item-label">
                      付
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        :prop="'hostingRooms.' + index + '.payOfPayment'"
                        :rules="hostingRoomDetailRules.roomDetail.payOfPayment"
                        label=""
                        label-width="0"
                        class="room-item-count">
                        <el-select v-model="hostingRoomDetail.hostingRooms[index].payOfPayment">
                          <el-option
                            v-for="(item, index) in payList"
                            :key="index"
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
                        :prop="'hostingRooms.' + index + '.depositOfPayment'"
                        :rules="hostingRoomDetailRules.roomDetail.depositOfPayment"
                        label=""
                        label-width="0"
                        class="room-item-count">
                        <el-select
                          v-model="hostingRoomDetail.hostingRooms[index].depositOfPayment"
                          style="width: 100%"
                          @change="handleDepositChange(hostingRoomDetail.hostingRooms[index])">
                          <el-option
                            v-for="(item, index) in depositList"
                            :key="index"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item
                      :prop="'hostingRooms.' + index + '.rent'"
                      :rules="hostingRoomDetailRules.roomDetail.rent"
                      label="租金">
                      <el-input
                        v-model="hostingRoomDetail.hostingRooms[index].rent"
                        type="number"
                        @change="handleRentChange(hostingRoomDetail.hostingRooms[index])" />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="2"
                    style="text-align: left"
                    class="inline-item-label">
                    元/月
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item
                      :prop="'hostingRooms.' + index + '.deposit'"
                      :rules="hostingRoomDetailRules.roomDetail.deposit"
                      label="押金">
                      <el-input
                        v-model="hostingRoomDetail.hostingRooms[index].deposit"
                        :disabled="hostingRoomDetail.hostingRooms[index].depositOfPayment !== 13"
                        type="number" />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="2"
                    style="text-align: left"
                    class="inline-item-label">
                    元
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item
                      :rules="hostingRoomDetailRules.roomDetail.roomDesc"
                      :prop="'hostingRooms.' + index + '.roomDesc'"
                      label="房间描述">
                      <el-input
                        v-model="hostingRoomDetail.hostingRooms[index].roomDesc"
                        :rows="5"
                        type="textarea"
                        placeholder="请描述一下房源的交通、装饰、周边设施场所等等…" />
                      <span class="estate-iontro-length-tips">{{ hostingRoomDetail.hostingRooms[index].roomDesc?hostingRoomDetail.hostingRooms[index].roomDesc.length:0 }}/150</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </template>

          <!-- 上传图片模态框 -->
          <el-dialog
            :visible.sync="uploadPicsModelVisible"
            append-to-body
            title="上传房间照片"
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
              @emitCropperList="emitCropperList"
              @emitCropperData="emitCropperData" />
            <span slot="footer">
              <el-button
                size="small"
                type="primary"
                @click="uploadPicsModelVisible = false">关 闭</el-button>
            </span>
          </el-dialog>
        </el-form>
      </div>
      <div
        :style="{width: toolsWidth}"
        class="entry-house-bottom">
        <template v-if="editFlag">
          <el-button
            :loading="saveLoading"
            type="primary"
            size="small"
            @click="saveRoomDetailData(2)">保存</el-button>
        </template>
        <template v-else>
          <el-button
            :loading="saveLoading"
            type="primary"
            size="small"
            @click="saveRoomDetailData(1)">保存并继续添加</el-button>
          <el-button
            :loading="saveLoading"
            size="small"
            @click="saveRoomDetailData(2)">确定</el-button>
        </template>
        <el-button
          :loading="saveLoading"
          size="small"
          @click="saveRoomDetailData(3)">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import areaSelect from '@/components/AreaSelect'
import mapSelect from '@/components/MapSelect'
import Preview from '@/components/Preview/Preview'
import ImageCropper from '@/components/ImageCropper/Cropper'
import ServiceList from './serviceList'
import { getDepartmentInfo } from '@/api/organization'
import { estateZoneListByAreaIdApi, queryHostingHouseByOuterHouseUuidApi, deleteRoomApi, hostingSaveHouseInfoApi, hostingEditHouseInfoApi } from '@/api/houseManage'
// eslint-disable-next-line
import { debounce, deepClone } from '@/utils'
export default {
  components: {
    areaSelect,
    Preview,
    ImageCropper,
    mapSelect,
    ServiceList
  },
  props: {
    houseRentType: {
      type: Number,
      default: 1 // 1.整租 2.合租
    },
    editFlag: {
      type: Boolean,
      default: false
    },
    toolsWidth: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'depName',
        id: 'depId'
      },
      parentOrg: { // 顶级部门id
        depName: '',
        depId: ''
      },
      outerHouseUuid: '', // 外部编码
      outerHouseShow: true, // 外部编码
      // mainHeight: 500,
      saveLoading: false,
      hostingRoomDetail: {},
      tempFormData: {},
      editRoomInfo: {},
      hostingRoomDetailRules: {
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
        depId: {required: true, message: '请选择归属部门', trigger: 'change'},
        address: [
          { required: true, message: '请输入公寓/小区', trigger: 'change' }
        ],
        buildingName: [
          { required: true, message: '请输入楼幢名', trigger: 'blur' }
        ],
        roomNo: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        chamberCount: [
          { required: true, message: '请输入室', trigger: 'blur' }
        ],
        boardCount: [
          { required: true, message: '请输入厅', trigger: 'blur' }
        ],
        toiletCount: [
          { required: true, message: '请输入卫', trigger: 'blur' }
        ],
        houseArea: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        houseDirection: [
          { required: this.houseRentType === 1, message: '请选择房屋朝向', trigger: 'change' }
        ],
        decorationDegree: [
          { required: true, message: '请选择装修程度', trigger: 'change' }
        ],
        floorName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入房源所在层'))
              } else if (!(value > 0 && (value === parseInt(value).toString()))) {
                callback(new Error('所在层必须为整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        floorAmount: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入总楼层数'))
              } else if (!(value > 0 && (value.toString() === parseInt(value).toString()))) {
                callback(new Error('总楼层必须为整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
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
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contactMobile: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        houseDesc: [
          { required: true, message: '请输入房间描述', trigger: 'blur' },
          { max: 150, message: '长度不能超过150个字符', trigger: 'change' }
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
        roomDetail: {
          roomArea: [
            { required: true, message: '请输入房间面积', trigger: 'blur' }
          ],
          roomDirection: [
            { required: true, message: '请选择房间朝向', trigger: 'change' }
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
          roomDesc: [
            { required: true, message: '请输入房间描述', trigger: 'blur' },
            { max: 150, message: '长度不能超过150个字符', trigger: 'change' }
          ]
        }
      },
      zoneList: [],
      orgList: [],
      loading: false,
      decorationDegreeList: [
        {
          label: '毛坯',
          value: 1
        },
        {
          label: '简装',
          value: 2
        },
        {
          label: '精装',
          value: 3
        },
        {
          label: '豪华',
          value: 4
        }
      ],
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
      uploadPicsModelVisible: false,
      facilityGroup: [
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
      activeRoomName: '1',
      tabIndex: 1,
      cityManagerList: [],
      filterManagerList: [],
      cropperList: [],
      accept: 'image/png, image/jpeg, image/jpg',
      curPicListIndex: -1,
      currentPicList: [],
      houseRentName: ''
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
  created () {
    this.getTree()
  },
  methods: {
    getTree () { // 获取组织架构名称并且默认表格数据
      getDepartmentInfo.queryDepartmentApi().then(res => {
        if (res.data) {
          this.treeData = [{'depName': res.data.depName, 'depId': res.data.depId, children: res.data.children}]
        }
      }).catch(rej => {})
    },
    editNodeclick (data) { // 归属部门选择
      console.log('data', data)
      this.hostingRoomDetail.depId = data.depId
      this.hostingRoomDetail.depName = data.depName
    },
    checkOuterHouseUuid () { // 查询外部编码
      this.houseRentName = this.houseRentType === 1 ? '整租' : '合租'
      queryHostingHouseByOuterHouseUuidApi({
        'outerHouseUuid': this.outerHouseUuid
      }).then((res) => {
        if (res.code * 1 === 0) {
          if (res.data) {
            if (this.houseRentType === res.data.houseRentType) {
              if (!res.data.decorationDegree) {
                res.data.decorationDegree = 3
              }
              if (!res.data.contactGender) {
                res.data.contactGender = 1
              }
              if (!res.data.boardCount) {
                res.data.boardCount = 0
              }
              if (!res.data.toiletCount) {
                res.data.toiletCount = 0
              }
              this.setRoomDetailData(res.data) // 调用编辑的
            } else {
              this.$message({
                message: '请输入' + this.houseRentName + '房源的外部编码',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '没有找到相应的数据',
              type: 'warning'
            })
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    searchZoneList (flag) { // 搜索板块列表
      [this.hostingRoomDetail.provinceId, this.hostingRoomDetail.cityId, this.hostingRoomDetail.regionId] = this.hostingRoomDetail.areaCode
      if (!flag) {
        this.hostingRoomDetail.address = ''
        this.hostingRoomDetail.zoneId = ''
      }
      if (this.hostingRoomDetail.areaCode[2] !== undefined) {
        estateZoneListByAreaIdApi({
          regionId: this.hostingRoomDetail.regionId
        }).then((res) => {
          this.zoneList = res.data.list
        })
      } else {
        this.zoneList = []
      }
    },
    addressChange (val) {
      this.hostingRoomDetail = Object.assign(this.hostingRoomDetail, val)
      this.$refs['hostingRoomDetail'].validateField('address')
      this.searchZoneList(true)
    },
    handleTabsEdit (targetName, action) {
      if (action === 'add') {
        if (this.hostingRoomDetail.hostingRooms.length > 25) {
          return
        }
        let curIndex = this.hostingRoomDetail.hostingRooms.length
        let newTabName = ++this.tabIndex + ''
        this.hostingRoomDetail.hostingRooms.push({
          roomPlaceName: '',
          roomName: '房间' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[curIndex],
          name: newTabName,
          roomArea: '',
          roomDesc: '',
          roomAttributesList: [],
          pictures: [],
          deposit: '',
          rent: '',
          depositOfPayment: '',
          payOfPayment: ''
        })
        this.activeRoomName = newTabName
      }
      if (action === 'remove') {
        let tabs = this.hostingRoomDetail.hostingRooms
        let activeName = this.activeRoomName
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index - 1] || tabs[index + 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.hostingRoomDetail.hostingRooms = tabs.filter(tab => tab.name !== targetName)
        this.hostingRoomDetail.hostingRooms.forEach((item, index) => {
          item.roomName = '房间' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[index]
        })
        this.$nextTick(() => {
          this.activeRoomName = activeName
        })
      }
    },
    // 计算押金，保留2位精度
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
          const index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(target.roomName.replace('房间', ''))
          this.$refs.hostingRoomDetail.validateField('hostingRooms.' + index + '.deposit')
        } else {
          this.$refs.hostingRoomDetail.validateField('deposit')
        }
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
          this.$refs.hostingRoomDetail.validateField('hostingRooms.' + index + '.deposit')
        } else {
          this.$refs.hostingRoomDetail.validateField('deposit')
        }
      }
    },
    // 房间面积保留2位精度
    setPrecision (index) {
      let val = typeof index === 'number' ? this.hostingRoomDetail.hostingRooms[index].roomArea : this.hostingRoomDetail.houseArea
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
      typeof index === 'number' ? this.hostingRoomDetail.hostingRooms[index].roomArea = val : this.hostingRoomDetail.houseArea = val
    },
    // 合租房间名称长度不能超过10位
    handleRoomNameLength (room) {
      if (room.roomPlaceName && room.roomPlaceName.length > 10) {
        room.roomPlaceName = room.roomPlaceName.substr(0, 10)
      }
    },
    // 初始化房间信息
    setRoomDetailData (val, editRoomInfo) {
      if (editRoomInfo) {
        this.outerHouseShow = false
      }
      if (val) {
        val.areaCode = [val.provinceId, val.cityId, val.regionId]
        val.address = val.subdistrictName ? (val.subdistrictName + ' - ' + val.subdistrictAddress) : ''
        val.facilityItemsList = val.facilityItems ? val.facilityItems.split(',') : []
        val.houseDesc = val.houseDesc || ''
        val.depName = val.depName
        if (val.depId) { // 编辑会传入depId 外部编码不会
          val.depId = val.depId
          this.parentOrg.depId = val.depId // 默认部门的数组
        }
        parseInt(val.houseArea) === val.houseArea && (val.houseArea = val.houseArea + '.00')
        val.zoneId = val.zoneId === 0 ? '' : val.zoneId
        if (this.houseRentType === 1) {
          parseInt(val.rent) === val.rent && (val.rent = val.rent + '.00')
          parseInt(val.deposit) === val.deposit && (val.deposit = val.deposit + '.00')
          val.pictures = val.pictures || []
          if (val.pictures.length) {
            val.pictures.forEach((item) => {
              item.title = item.imageName
              item.key = Math.random().toFixed(5)
              item.isBase64 = 0
            })
          }
        } else {
          val.hostingRooms.forEach((item, index) => {
            parseInt(item.roomArea) === item.roomArea && (item.roomArea = item.roomArea + '.00')
            parseInt(item.rent) === item.rent && (item.rent = item.rent + '.00')
            parseInt(item.deposit) === item.deposit && (item.deposit = item.deposit + '.00')
            item.name = ++index + ''
            item.facilityItemsList = item.facilityItems ? item.facilityItems.split(',') : []
            item.roomAttributesList = item.roomAttributes ? item.roomAttributes.split(',') : []
            item.pictures = item.pictures || []
            item.needCheck = true
            if (item.pictures.length) {
              item.pictures.forEach((n) => {
                n.title = n.imageName
                n.key = Math.random().toFixed(5)
                n.isBase64 = 0
              })
            }
          })
        }
      } else {
        val = {
          areaCode: ['', '', ''],
          provinceId: null,
          cityId: null,
          regionId: null,
          zoneId: null,
          zoneName: '',
          address: '',
          regionAddressId: '',
          buildingName: '',
          unitCode: '',
          roomNo: '',
          chamberCount: 1,
          boardCount: 0,
          toiletCount: 0,
          houseArea: null,
          houseDirection: null,
          decorationDegree: null,
          floorName: '',
          floorAmount: null,
          contactName: '',
          contactGender: 1,
          contactMobile: null,
          facilityItemsList: [],
          houseDesc: '',
          houseRentType: this.houseRentType,
          depId: ''
        }
        if (this.houseRentType === 1) {
          val = Object.assign(val, {
            pictures: [],
            houseRentType: 1,
            deposit: '',
            rent: '',
            depositOfPayment: '',
            payOfPayment: ''
          })
        } else {
          val.hostingRooms = [
            {
              roomPlaceName: '',
              roomArea: '',
              roomAttributesList: [],
              roomName: '房间A',
              roomDesc: '',
              name: '1',
              pictures: [],
              facilityItemsList: [],
              deposit: '',
              rent: '',
              depositOfPayment: '',
              payOfPayment: ''
            }
          ]
        }
      }

      if (this.houseRentType === 2) {
        this.tabIndex = val.hostingRooms.length
        if (editRoomInfo && this.tabIndex > 1) {
          val.hostingRooms.forEach((item, index) => {
            if (item.roomCode === editRoomInfo.roomCode) {
              this.activeRoomName = item.name
            }
          })
        } else {
          this.activeRoomName = '1'
        }
      }

      this.$nextTick(() => {
        this.$set(this, 'hostingRoomDetail', val)
        this.$set(this, 'tempFormData', deepClone(val))
        if (editRoomInfo) {
          this.$set(this, 'editRoomInfo', editRoomInfo)
        }
        if (this.editFlag && val.zoneId) {
          this.searchZoneList(true)
        } else {
          this.zoneList = []
        }
        this.$nextTick(() => {
          this.$refs.hostingRoomDetail.clearValidate()
        })
      })
    },
    checkEditFlag () {
      let differentFlag = false
      Object.keys(this.tempFormData).forEach((key) => {
        if (JSON.stringify(this.tempFormData[key]) !== JSON.stringify(this.hostingRoomDetail[key])) {
          if (key === 'pictures') {
            differentFlag = this.checkDiff(this.tempFormData[key], this.hostingRoomDetail[key])
          } else if (key === 'hostingRooms') {
            this.tempFormData['hostingRooms'].forEach((v, i) => {
              Object.keys(v).forEach((k) => {
                if (JSON.stringify(v[k]) !== JSON.stringify(this.hostingRoomDetail['hostingRooms'][i][k])) {
                  if (k === 'pictures') {
                    differentFlag = this.checkDiff(v[k], this.hostingRoomDetail['hostingRooms'][i]['pictures'])
                  } else {
                    differentFlag = true
                  }
                }
              })
            })
          } else {
            differentFlag = true
          }
        }
      })
      return differentFlag
    },
    checkDiff (a, b) {
      let diffCount = 0
      if (a.length !== b.length) {
        return true
      }
      a.forEach((item, index) => {
        if (item.imageName !== b[index].imageName) {
          diffCount++
        }
      })
      return diffCount > 0
    },
    returnRoomDetailData () { // 返回房间详情数据
      let roomDetailData = false
      this.$refs.hostingRoomDetail.validate((status) => {
        if (status) {
          roomDetailData = deepClone(this.hostingRoomDetail)
          roomDetailData.facilityItems = roomDetailData.facilityItemsList.join(',')
          if (roomDetailData.houseRentType === 2) {
            roomDetailData.hostingRooms.forEach((item, index) => {
              item.facilityItems = item.facilityItemsList.join(',')
              item.roomAttributes = item.roomAttributesList.join(',')
            })
          }
        } else {
          if (this.hostingRoomDetail.houseRentType === 2) {
            for (let index = 0; index < this.hostingRoomDetail.hostingRooms.length; index++) {
              this.$refs.hostingRoomDetail.validateField('hostingRooms.' + index + '.roomArea', (msg) => {
                if (msg) {
                  this.activeRoomName = this.hostingRoomDetail.hostingRooms[index].name
                  return false
                }
              })
              this.$refs.hostingRoomDetail.validateField('hostingRooms.' + index + '.roomDirection', (msg) => {
                if (msg) {
                  this.activeRoomName = this.hostingRoomDetail.hostingRooms[index].name
                  return false
                }
              })
              this.$refs.hostingRoomDetail.validateField('hostingRooms.' + index + '.pictures', (msg) => {
                if (msg) {
                  this.activeRoomName = this.hostingRoomDetail.hostingRooms[index].name
                  return false
                }
              })
            }
          }
          this.$message.error('您还有必填信息未填写完全，请全部填写好后再保存')
          return false
        }
      })
      return roomDetailData
    },
    // 保存
    saveRoomDetailData (type) {
      // type 1.保存并添加 2.保存 3.取消
      if (type === 3) {
        if (this.editFlag) {
          this.$emit('closeDialog')
        } else {
          this.$router.push({
            name: '房源管理',
            params: {
              curTab: this.hostingRoomDetail.houseRentType
            }
          })
        }
        return false
      }

      let roomDetailData = this.returnRoomDetailData()
      if (!roomDetailData) {
        return false
      }

      let api = this.editFlag ? hostingEditHouseInfoApi : hostingSaveHouseInfoApi
      console.log(roomDetailData)
      if (this.editFlag && (this.editRoomInfo.mailinStatus === 2 || this.editRoomInfo.mailinStatus === 5)) {
        this.$confirm('当前房源保存后将从APP下架，确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveLoading = true
          api({
            hostingHouseInfo: JSON.stringify(roomDetailData)
          }).then((res) => {
            this.saveLoading = false
            if (res.code === '0') {
              this.$emit('closeDialog')
            } else {
              this.$message({
                message: res.message || '保存失败',
                type: 'success'
              })
            }
          }).catch((err) => {
            console.log(err)
            this.saveLoading = false
          })
        })
      } else {
        this.saveLoading = true
        api({
          hostingHouseInfo: JSON.stringify(roomDetailData)
        }).then((res) => {
          this.saveLoading = false
          if (res.code === '0') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            if (type === 1) {
              this.setRoomDetailData()
            } else {
              if (this.editFlag) {
                this.$emit('closeDialog')
              } else {
                this.$router.push({
                  name: '分散式房源管理',
                  params: {
                    curTab: roomDetailData.houseRentType
                  }
                })
              }
            }
          }
        }).catch((err) => {
          console.log(err)
          this.saveLoading = false
        })
      }
    },
    openPicModel (index) { // 打开上传图片列表
      this.curPicListIndex = index
      this.currentPicList = index === -1 ? this.hostingRoomDetail.pictures : this.hostingRoomDetail.hostingRooms[index].pictures
      this.uploadPicsModelVisible = true
    },
    uploadModelClose () { // 关闭上传图片列表
      if (this.curPicListIndex === -1) {
        this.hostingRoomDetail.pictures = this.currentPicList
        this.$refs.hostingRoomDetail.validateField('pictures')
      } else {
        this.hostingRoomDetail.hostingRooms[this.curPicListIndex].pictures = this.currentPicList
        this.$refs.hostingRoomDetail.validateField('hostingRooms.' + this.curPicListIndex + '.pictures')
      }
      this.currentPicList = []
    },
    // 检查是否能删除当前房间
    deleteCurRoom (curRoom, index) {
      if (curRoom.needCheck) {
        deleteRoomApi({
          roomCodeList: [curRoom.roomCode]
        }).then((res) => {
          this.handleTabsEdit(curRoom.name, 'remove')
        }).catch((err) => { console.log(err) })
      } else {
        this.handleTabsEdit(curRoom.name, 'remove')
      }
    },
    // 删除图片
    emitDelete (val) {
      this.currentPicList = val || []
    },
    // 上传的图片列表
    emitCropperList (list = []) {
      this.cropperList = list
    },
    // 裁剪后图片列表
    emitCropperData (list = []) {
      list.forEach((v, i) => {
        v.type = 1
        v.imageName = v.title
        if (v.isBase64 === undefined) {
          v.isBase64 = 1
        }
      })
      this.currentPicList = [...this.currentPicList, ...list]
    },
    /* 选择图片 */
    async uploadImg (e) {
      if (!e.target.value) {
        console.log('取消上传...')
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
        // 转化为blob
        // reader.readAsArrayBuffer(file)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.room-detail-container {
  max-width: 800px;
  min-width: 660px;
  overflow: hidden;
  margin-bottom: 15px;
  .room-detail-select {
    width: 100%;
  }
  &.hosting-room-detail {
    .inline-item-label {
      text-align: center;
      line-height: 32px;
      padding: 0 !important;
      font-size: 14px;
      color: #606266;
    }
  }
  .room-count {
    .room-item-count {
      margin-bottom: 0;
      input {
        padding: 0 8px;
      }
    }
  }
  .estate-iontro-length-tips {
    position: absolute;
    bottom: 0px;
    right: 10px;
  }
  .room-attributes {
    & + .room-attributes {
      margin-left: 20px;
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
  .room-count-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
  }
  .room-count-row {
    padding-left: 90px;
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
  z-index: 200;
}
.previewItems {
  margin-bottom: 10px;
  .el-upload--picture-card.uploadImage {
    width: 122px;
    height: 92px;
    line-height: 98px;
  }
}
.upload-pics-info {
  margin: 0 0 5px;
}
</style>

<style lang="scss">
  .entry-house-title {
    font-size: 18px;
    line-height: 25px;
    padding-bottom: 20px;
  }
  .room-detail-container {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
    }
    input {
      padding: 0 8px;
    }
    .el-form-item__error {
      width: 114px;
    }
    .sub-room-info-list {
      .el-tabs__new-tab {
        margin-right: 15px;
        border: 1px solid #409EFF;
        color: #409EFF;
        background-color: #fff;
      }
    }
    .room-detail-floor-container {
      .el-col {
        &:first-child {
          input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
        &:last-child {
          .el-input-group__prepend {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: 0;
          }
        }
      }
      .el-input-group__prepend {
        padding: 0 8px;
      }
      .el-input__inner {
        padding: 0 8px;
      }
    }
  }
  .codeFlex {
    margin-left:50px;
    padding-bottom:20px;
    margin-bottom:30px;
    display: flex;
    }
    .codeLabelStyle {
      font-size: 14px;
      line-height:30px;
      margin-right:10px;
    }
</style>
