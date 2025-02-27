<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="title">电商管理系统</div>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginForm"
        @keyup.enter.native="handleLogin">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            prefix-icon="el-icon-user"
            placeholder="用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading"
            class="login-button"
            @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tip">
        测试账号：admin / admin
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            await this.$store.dispatch('login', this.loginForm)
            this.$message.success('登录成功')
            const redirect = this.$route.query.redirect || '/products'
            this.$router.push(redirect)
          } catch (error) {
            this.$message.error(error.message)
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
}

.login-card {
  width: 400px;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.login-button {
  width: 100%;
}

.login-tip {
  text-align: center;
  color: #909399;
  font-size: 14px;
  margin-top: 20px;
}
</style> 