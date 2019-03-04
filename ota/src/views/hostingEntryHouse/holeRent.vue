<template>
  <div>
    <hosting-room-detail
      ref="hostingRoomDetail"
      :edit-flag="false"
      :house-rent-type="1" />

  </div>
</template>

<script>
import hostingRoomDetail from './components/hostingRoomDetail'
export default {
  components: {
    hostingRoomDetail
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$refs.hostingRoomDetail.setRoomDetailData()
  }
}
</script>
