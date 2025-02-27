<template>
  <div class="users">
    <el-card>
      <div slot="header">
        <span>用户列表</span>
        <el-button style="float: right" type="primary" @click="handleAdd">添加用户</el-button>
      </div>
      
      <el-table :data="users" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="mini" 
              type="danger" 
              @click="handleDelete(scope.row)"
              :disabled="scope.row.username === 'admin'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="userForm.username"
            :disabled="isEdit && userForm.username === 'admin'">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input 
            v-model="userForm.password" 
            type="password"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :disabled="userForm.username === 'admin'"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UsersList',
  data() {
    // 自定义邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    // 自定义手机号验证规则
    const validatePhone = (rule, value, callback) => {
      const phoneRegex = /^1[3456789]\d{9}$/
      if (value && !phoneRegex.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      users: [],
      dialogVisible: false,
      isEdit: false,
      loading: false,
      userForm: {
        id: null,
        username: '',
        email: '',
        phone: '',
        password: '',
        status: true
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑用户' : '添加用户'
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users')
        this.users = response.data.data.map(user => ({
          ...user,
          status: Math.random() > 0.5 // 随机状态，实际应从后端获取
        }))
      } catch (error) {
        this.$message.error('获取用户列表失败')
      }
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.userForm = { ...row }
      delete this.userForm.password // 编辑时不显示密码字段
      this.dialogVisible = true
    },
    async handleDelete(row) {
      if (row.username === 'admin') {
        return this.$message.warning('不能删除管理员账号')
      }
      try {
        await this.$confirm('确认删除该用户?', '提示', {
          type: 'warning'
        })
        await axios.delete(`/api/users/${row.id}`)
        this.$message.success('删除成功')
        this.fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    resetForm() {
      this.$refs.userForm?.resetFields()
      this.userForm = {
        id: null,
        username: '',
        email: '',
        phone: '',
        password: '',
        status: true
      }
    },
    submitForm() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            if (this.isEdit) {
              await axios.put(`/api/users/${this.userForm.id}`, this.userForm)
              this.$message.success('更新成功')
            } else {
              await axios.post('/api/users', this.userForm)
              this.$message.success('添加成功')
            }
            this.dialogVisible = false
            this.fetchUsers()
          } catch (error) {
            this.$message.error(this.isEdit ? '更新失败' : '添加失败')
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script> 