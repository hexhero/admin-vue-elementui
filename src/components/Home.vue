<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" width="50px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">{{isCollapse?'&gt;&gt;&gt;':'&lt;&lt;&lt;'}}</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#1199CC"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          :default-active="$route.path"
          router
        >
          <el-submenu v-for="menu in menulist" :key="menu.id" :index="menu.id+''">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span>{{menu.name}}</span>
            </template>
            <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.url">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return {
      menulist:[],
      isCollapse: false
    }
  },
  created() {
    this.getMenulist()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$message.info('退出成功!')
      this.$router.push('/login')
    },
    async getMenulist(){
      const {data} = await this.$http.get('/api/menu')
      if(!data.success) return this.$message.error('菜单请求失败')
      this.menulist = data.data
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    }
  },
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: cneter;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      height: 100%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button{
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  line-height: 24px;
  background-color: #4a5064;
  font-size: 10px;
}
</style>