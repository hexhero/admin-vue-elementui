<template>
  <div>
    <h1>Home</h1>
    <!-- 退出 -->
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$message.info('退出成功!')
      this.$router.push('/login')
    },
  },
}
</script>

<style>
</style>