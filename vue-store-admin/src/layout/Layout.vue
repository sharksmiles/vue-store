<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :router="true"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/products">
          <i class="el-icon-goods"></i>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <i class="el-icon-s-order"></i>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">电商管理系统</div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar 
                size="small" 
                :src="currentUser.avatar">
              </el-avatar>
              {{ currentUser.username }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
    async handleCommand(command) {
      if (command === 'logout') {
        try {
          await this.$confirm('确认退出登录?', '提示', {
            type: 'warning'
          })
          await this.$store.dispatch('logout')
          this.$router.push('/login')
          this.$message.success('已退出登录')
        } catch (error) {
          // 取消退出时不做处理
        }
      }
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  height: 100vh;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #333;
  cursor: pointer;
}

.el-dropdown-link .el-avatar {
  margin-right: 8px;
}
</style> 