/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:24:12
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-09-21 15:48:27
 */

<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>
<script>
export default {
  name: 'App',
  provide () {
    return {
      reloadPage: this.reloadPage
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reloadPage () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}

</script>
<style lang="scss">
@import './styles/index.scss';
</style>
