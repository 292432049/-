/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:11:02
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-09-25 14:21:36
 */

<template>
  <div class="layout-container">
    <p style="margin-top: 0;">{{ roles | rolesFilter }}{{ name }}</p>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  filters: {
    rolesFilter (value) {
      const valueMap = {
        'admin': '【超级管理员】',
        'global': '【普通用户】',
        'service': '【服务用户】'
      }
      return valueMap[value] || '【普通用户】'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {

  }
}

</script>

<style lang="scss" scoped>

</style>
