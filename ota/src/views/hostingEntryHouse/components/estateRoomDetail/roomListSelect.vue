<template>
  <div>
    <el-row
      v-for="(val, key, index) in roomList"
      :key="index"
      :class="{checkRow:val.length}">
      <el-col :span="4">
        <el-checkbox
          v-if="val.length > 0"
          :label="key"
          v-model="checkedFloor[key]"
          @change="handleCheckFloorChange(key)"></el-checkbox>
      </el-col>
      <el-col
        :span="19"
        :offset="1">
        <el-checkbox-group
          v-model="checkedObj[key]"
          class="room-list-group">
          <el-checkbox
            v-for="v in val"
            v-if="v.roomCode"
            :key="v.roomCode"
            :label="v.roomCode"
            class="room-list-checkbox"
            @change="handleRoomChange(key)">
            {{ v.roomNo }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <!-- <div v-if="roomListLenght === 0">
      无房间号可以配置
    </div> -->
</div></template>
<script>
export default {
  name: 'Roomcheckgroup',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: () => {
      }
    },
    roomList: {
      type: [Object, Array],
      default: () => {
      }
    },
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultCheckObj: {
      type: [Object, Array],
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      isIndeterminate: false,
      allRoomList: {},
      checkedFloor: { },
      checkedObj: {}
      // roomListLenght: 0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler: function (val) {
        if (Array.isArray(this.roomList)) {
          if (!val) {
            this.roomListForm.checkedRoomList = []
          }
        } else {
          if (val) {
            console.log('checkedList', this.checkedList)
            const allRoomList = {}
            const checkedObj = {}
            const checkedFloor = {}
            Object.keys(this.roomList).forEach((key, index) => {
              checkedFloor[key] = false
              allRoomList[key] = {}
              allRoomList[key].allRoom = this.roomList[key].map(v => v.roomCode) // 获取房间code
              allRoomList[key].activeRoom = allRoomList[key].allRoom.filter((n) => !this.checkedList.includes(n))
              allRoomList[key].isDisabled = allRoomList[key].allRoom.filter((n) => !allRoomList[key].activeRoom.includes(n))
              checkedObj[key] = allRoomList[key].isDisabled
            })
            this.$set(this, 'allRoomList', allRoomList)
            this.$set(this, 'checkedObj', checkedObj)
            this.$set(this, 'checkedFloor', checkedFloor)
          }
          // console.log('this.allRoomList123123', this.allRoomList)
          Object.keys(this.checkedObj).forEach((key, index) => {
            this.handleRoomChange(key)
          })
        }
      }
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   for (let key in this.roomList) {
    //     this.roomListLenght += this.roomList[key].length
    //   }
    // })
  },
  methods: {
    handleCheckFloorChange (key) {
      this.$set(this.checkedObj, key, this.checkedFloor[key] ? this.allRoomList[key].allRoom : false)
      // console.log('选中的', this.checkedObj)
    },
    handleRoomChange (key) {
      const checkedCount = this.checkedObj[key].length
      this.checkedFloor[key] = checkedCount === this.allRoomList[key].allRoom.length
      // console.log('this.allRoomList[key]', this.allRoomList[key])
      // console.log('checkedCount', checkedCount)
    },
    returnCheckedList () { // 返回选中的码
      let saveRoomList = []
      if (Array.isArray(this.roomList)) {
        saveRoomList = this.roomListForm.checkedRoomList
      } else {
        Object.keys(this.checkedObj).forEach((key, index) => {
          if (this.checkedObj[key]) {
            saveRoomList = saveRoomList.concat(this.checkedObj[key])
          }
        })
      }
      console.log('checkedObj', saveRoomList)
      return { 'saveRoomList': saveRoomList, 'checkedObj': this.checkedObj }
    }
  }
}
</script>
<style lang="scss" scoped>
.checkRow{
  border-bottom: thin solid #ddd;
  margin-bottom: 10px;
  padding-bottom: 10px;
  }
 .room-list-group{
    display:flex;
   flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
  }
   .room-list-group label{
     width:10%;
     display: block;
     margin-left:10px;
     margin-bottom:10px;
   }
   .room-list-group .el-checkbox .el-checkbox{
    margin-left:30px;
    }
</style>
