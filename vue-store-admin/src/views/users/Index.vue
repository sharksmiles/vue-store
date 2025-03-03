<template>
  <div class="users">
    <el-card>
      <div slot="header">
        <span>用户列表</span>
        <el-button style="float: right" type="primary" @click="handleAdd"
          >添加用户</el-button
        >
      </div>

      <el-table :data="users" border>
        <el-table-column
          prop="user_id"
          label="用户ID"
          width="80"
        ></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column
          prop="userPhoneNumber"
          label="手机号"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.userName === 'admin'"
            >
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
      @close="resetForm"
    >
      <el-form
        :model="userForm"
        :rules="rules"
        ref="userForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="isEdit && userForm.userName === 'admin'"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhoneNumber">
          <el-input v-model="userForm.userPhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'UsersList',
  data() {
    // 自定义手机号验证规则
    const validatePhone = (rule, value, callback) => {
      const phoneRegex = /^1[3456789]\d{9}$/;
      if (value && !phoneRegex.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };

    return {
      users: [],
      dialogVisible: false,
      isEdit: false,
      loading: false,
      userForm: {
        id: null,
        userName: '',
        userPhoneNumber: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        userPhoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑用户' : '添加用户';
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await this.$axios.get('/users/all');
        this.users = response.data.data;
      } catch (error) {
        this.$message.error('获取用户列表失败');
      }
    },
    handleAdd() {
      this.isEdit = false;
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.isEdit = true;
      this.userForm = { ...row };
      delete this.userForm.password; // 编辑时不显示密码字段
      this.dialogVisible = true;
    },
    async handleDelete(row) {
      if (row.userName === 'admin') {
        return this.$message.warning('不能删除管理员账号');
      }
      try {
        await this.$confirm('确认删除该用户?', '提示', {
          type: 'warning'
        });
        await this.$axios.post(`/users/delete`, {
          user_id: row.user_id
        });
        this.$message.success('删除成功');
        this.fetchUsers();
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },
    resetForm() {
      this.$refs.userForm?.resetFields();
      this.userForm = {
        id: null,
        userName: '',
        userPhoneNumber: '',
        password: '',
      };
    },
    submitForm() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            if (this.isEdit) {
              await this.$axios.post(`/users/change`, this.userForm);
              this.$message.success('更新成功');
            } else {
              await this.$axios.post('/users/register', this.userForm);
              this.$message.success('添加成功');
            }
            this.dialogVisible = false;
            this.fetchUsers();
          } catch (error) {
            this.$message.error(this.isEdit ? '更新失败' : '添加失败');
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
};
</script>
