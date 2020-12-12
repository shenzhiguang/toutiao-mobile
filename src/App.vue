<template>
  <div id="app">
    App 组件
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <router-view/>

    <i class="toutiao toutiao-dianzan"></i>
  </div>
</template>

<script>
export default {
  // 方便调试
  name: 'App'
}
</script>

<style lang="less">
</style>
