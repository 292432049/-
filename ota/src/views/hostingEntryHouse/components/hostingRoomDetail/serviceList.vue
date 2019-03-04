<template>
  <div>
    <el-row class="service-check-list">
      <el-col :span="24">
        <el-checkbox
          v-model="checkAll"
          label="全选"
          @change="handleCheckAllChange"
        />
      </el-col>
    </el-row>
    <el-row class="service-check-list">
      <el-col :span="24">
        <el-checkbox-group
          v-model="facilityList"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="item in facilityGroup"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      facilityGroup: [
        {
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
        },
        {
          value: '7',
          label: '沙发'
        }, {
          value: '8',
          label: '茶几'
        }, {
          value: '10',
          label: '餐桌'
        },
        {
          value: '6',
          label: '宽带'
        },
        {
          value: '1',
          label: '床'
        }
      ],
      facilityList: [],
      checkAll: false
    }
  },
  watch: {
    list: {
      immmediate: true,
      handler: function (val) {
        if (val) {
          this.facilityList = val
        }
      }
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.facilityList = val ? this.facilityGroup.map((item) => { return item.value }) : []
      this.$emit('setFacilityItemsList', this.facilityList)
    },
    handleCheckedChange (val) {
      this.checkAll = val.length === this.facilityGroup.length
      this.$emit('setFacilityItemsList', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.service-check-list {
  .el-checkbox-group {
    .el-checkbox {
      width: 10%;
      margin-left: 0;
      margin-right: 1%;
    }
  }
}
</style>
