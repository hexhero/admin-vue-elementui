<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParam.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="fullname" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status == 1"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserByid(scope.row.id)"
            ></el-button>
            <el-tooltip
              content="分配角色"
              placement="top"
              effect="light"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="resetForm"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input type="fullname" v-model="addForm.fullname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="mobile" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form
        :model="editForm"
        :rules="addRules"
        ref="editForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="editForm.fullname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确格式的邮箱'))
    }
    return {
      queryParam: {
        query: '',
        pageNum: 1,
        pageSize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: '',
        fullname: '',
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
      },
      editForm: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get('/user/query', {
        params: this.queryParam,
      })
      if (!data.success) return this.$message.error(data.message)
      this.userList = data.data.list
      this.total = data.data.total
      this.queryParam.pageNum = data.data.pageNum
      this.queryParam.pageSize = data.data.pageSize
    },
    handleSizeChange(size) {
      this.queryParam.pageSize = size
      this.getUserList()
    },
    handleCurrentChange(page) {
      this.queryParam.pageNum = page
      this.getUserList()
    },
    async userStateChange(row) {
      console.log(row)
      let status = row.status == 1 ? 0 : 1
      const { data } = await this.$http.post('/user/change', {
        id: row.id,
        status: status,
      })
      if (!data.success) return this.$message.error('用户状态修改失败')
      row.status = status
    },
    resetForm() {
      this.$refs.addForm.resetFields()
    },
    addUser() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.post('/user/add', this.addForm)
        if (!data.success) return this.$message.error('用户添加失败')
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data } = await this.$http.get('/user/' + id)
      console.log(data)
      if (!data.success) return this.$message.error('用户获取失败')
      this.editForm = data.data
    },
    editUser() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.post('/user/change', {
          id: this.editForm.id,
          fullname: this.editForm.fullname,
          mobile: this.editForm.mobile,
          email: this.editForm.email,
        })
        if (!data.success) return this.$message.error('修改失败')
        this.getUserList()
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功!')
      })
    },
    removeUserByid(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data } = await this.$http.get('/user/del/' + id)
          if (!data.success) return this.$message.error('删除失败!')
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getUserList()
          return
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
</style>