<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="permissions" style="width: 100%" stripe>
        <el-table-column type='index'></el-table-column>  
        <el-table-column prop="name" label="权限名称"> </el-table-column>
        <el-table-column prop="permissionCode" label="权限编码">
        </el-table-column>
        <el-table-column prop="url" label="路径"> </el-table-column>
        <el-table-column prop="icon" label="图标"> </el-table-column>
        <el-table-column prop="permissionType" label="类型">
          <template slot-scope="scope">
            <el-tag type="danger" effect="dark" v-if="scope.row.permissionType == 1">菜单目录</el-tag>
            <el-tag type="waring" effect="dark" v-else-if="scope.row.permissionType == 2">功能按钮</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Permissions',
  data() {
    return {
      permissions: [],
    }
  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      const { data } = await this.$http.get('/permission')
      if (!data.success) return this.$message.error('列表数据获取失败!')
      this.permissions = data.data
    },
  },
}
</script>

<style lang="less" scoped>
</style>