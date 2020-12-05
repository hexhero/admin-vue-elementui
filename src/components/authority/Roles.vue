<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roles" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bdbottom', i1 == 0 ? 'bdtop' : '']"
              v-for="(p, i1) in scope.row.permissions"
              :key="p.id"
            >
              <el-col :span="5">
                <el-tag closable @close="delPermission(scope.row, p)">{{
                  p.name
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(p1, i2) in p.children"
                  :key="p1.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="delPermission(scope.row, p1)"
                      type="success"
                      >{{ p1.name }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="p2 in p1.children"
                      :key="p2.id"
                      type="danger"
                      closable
                      @close="delPermission(scope.row, p2)"
                      >{{ p2.name }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showConfigPermissionDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="40%"
      @close="closeAddRoleDialog"
    >
      <el-form
        :model="roleForm"
        :rules="roleRule"
        ref="roleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="40%">
      <el-form
        :model="editRoleForm"
        :rules="roleRule"
        ref="editRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="configPermissionVisible"
      width="40%"
      @close="permissionDialogClose"
    >
      <el-tree
        ref="permissionTree"
        :data="permissionTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkKey"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configPermissionVisible = false">取 消</el-button>
        <el-button type="primary" @click="configPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  data() {
    return {
      roles: [],
      addRoleVisible: false,
      editRoleVisible: false,
      configPermissionVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: '',
      },
      editRoleForm: {},
      roleRule: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      permissionTree: [],
      treeProps: {
        children: 'children',
        label: 'name',
      },
      checkKey: [],
      roleId:'',
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const { data } = await this.$http.get('/role')
      if (!data.success) return this.$message.error('数据获取失败')
      this.roles = data.data
    },
    addRole() {
      this.$refs.roleForm.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.put('/role', this.roleForm)
        if (!data.success) return this.$message.error('添加角色失败')
        this.addRoleVisible = false
        this.getRoles()
      })
    },
    async editRoleDialog(id) {
      const { data } = await this.$http.get('/role/' + id)
      if (!data.success) return this.$message.error('数据获取失败')
      this.editRoleForm = data.data
      this.editRoleVisible = true
    },
    editRole() {
      this.$refs.editRoleForm.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.put('/role', this.editRoleForm)
        if (!data.success) return this.$message.error('角色修改失败!')
        this.editRoleVisible = false
        this.getRoles()
        this.$message.success('角色修改成功!')
      })
    },
    async delRole(id) {
      const result = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (result == 'confirm') {
        const { data } = await this.$http.delete('/role/' + id)
        if (!data.success) return this.$message.error('删除失败!')
        this.$message.success('删除成功!')
        this.getRoles()
      }
    },
    closeAddRoleDialog() {
      this.$refs.roleForm.resetFields()
    },
    async delPermission(role, permission) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if ('confirm' == confirm) {
        let permissionIds = []
        this.checkPermissionIds(permission,permissionIds)
        let param = new FormData()
        param.append('roleId',role.id)
        param.append('permissionIds',permissionIds.join(','))
        const { data } = await this.$http.post(
          `/role/permission/delete`,
          param
        )
        if (!data.success) return this.$message.error('删除失败')
        role.permissions = data.data
        this.$message.success('权限成功解除!')
      }
    },
    checkPermissionIds(permission,permissionIds){
        permissionIds.push(permission.id)
        if(permission.children && permission.children.length>0){
            permission.children.forEach(item => {
                this.checkPermissionIds(item,permissionIds)
            })
        }
    },
    async showConfigPermissionDialog(role) {
      this.roleId = role.id
      this.configPermissionVisible = true
      const { data } = await this.$http.get('/role/permission/tree')
      if (!data.success) this.$message.error('获取权限数据失败!')
      this.permissionTree = data.data
      role.permissions.forEach((item) => {
        this.checkKeys(item, this.checkKey)
      })
    },
    permissionDialogClose(){
        this.checkKey = []
    },
    checkKeys(node, checkKey) {
      if (!node.children || node.children.length == 0) {
        checkKey.push(node.id)
      } else {
        node.children.forEach((item) => {
          this.checkKeys(item, checkKey)
        })
      }
    },
    async configPermission() {
        const keys = [
        ...this.$refs.permissionTree.getCheckedKeys(),
        ...this.$refs.permissionTree.getHalfCheckedKeys(),
        ]
        const loading = this.$loading({
          lock: true,
          text: '正在分配权限',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const {data} = await this.$http.post('/role/permission/add',`roleId=${this.roleId}&permissions=${keys.join(',')}`)
        loading.close()
        if(!data.success) return this.$message.error('保存失败!')
        this.$message.success('权限分配成功')
        this.getRoles()
        this.configPermissionVisible = false
    },
  },    
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>