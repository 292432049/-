<template>
  <div>
    <el-badge
      v-if="estateRoomDetail.pictures.length"
      :value="estateRoomDetail.pictures.length">
      <el-button
        type="primary"
        size="mini"
        @click="openPicModel()">上传照片</el-button>
    </el-badge>
    <el-button
      v-else
      type="primary"
      size="mini"
      @click="openPicModel()">上传照片</el-button>
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
  </div>
</template>
<script>
import Preview from '@/components/Preview/Preview'
import ImageCropper from '@/components/ImageCropper/Cropper'
export default {
  name: 'UploadImg',
  components: {
    Preview,
    ImageCropper
  },
  data () {
    return {
      estateRoomDetail: {
        pictures: []
      },
      uploadPicsModelVisible: false, // 上传图片弹窗
      curPicListIndex: -1,
      currentPicList: [],
      cropperList: [],
      accept: 'image/png, image/jpeg, image/jpg'
    }
  },
  methods: {
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
      console.log('e.target.files', e.target.files)

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
      this.currentPicList = index === -1 ? this.estateRoomDetail.pictures : this.estateRoomDetail.hostingRooms[index].pictures
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
        v.imageName = v.title
        if (v.isBase64 === undefined) {
          v.isBase64 = 1
        }
      })
      console.log('list2', list)
      this.currentPicList = [...this.currentPicList, ...list]
      console.log('上传图片组件中的', this.currentPicList)
    },
    uploadModelClose () { // 关闭上传图片列表
      if (this.curPicListIndex === -1) { // 公寓的照片
        this.estateRoomDetail.pictures = this.currentPicList
        // this.$refs.estateRoomDetail.validateField('pictures')
      } else {
        this.estateRoomDetail.hostingRooms[this.curPicListIndex].pictures = this.currentPicList
        // this.$refs.estateRoomDetail.validateField('hostingRooms.' + this.curPicListIndex + '.pictures')
      }
      console.log('cc', this.estateRoomDetail.pictures)
      this.currentPicList = []
    }
  }
}
</script>
<style>

</style>
