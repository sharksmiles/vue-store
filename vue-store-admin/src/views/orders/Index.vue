<template>
  <div class="orders">
    <el-card>
      <div slot="header">
        <span>订单列表</span>
      </div>
      
      <el-table :data="orders" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额">
          <template slot-scope="scope">
            ¥{{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              @click="handleDetail(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="success"
              @click="handleShip(scope.row)">
              发货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      :visible.sync="detailDialogVisible"
      width="600px">
      <div v-if="currentOrder">
        <div class="detail-item">
          <span class="label">订单号：</span>
          <span>{{ currentOrder.orderNo }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户ID：</span>
          <span>{{ currentOrder.userId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单金额：</span>
          <span>¥{{ currentOrder.totalAmount }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单状态：</span>
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ getStatusText(currentOrder.status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span>{{ currentOrder.createTime }}</span>
        </div>
        <div class="detail-item" v-if="currentOrder.shipTime">
          <span class="label">发货时间：</span>
          <span>{{ currentOrder.shipTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

const ORDER_STATUS = {
  PENDING: 0,    // 待付款
  PAID: 1,       // 待发货
  SHIPPED: 2,    // 已发货
  COMPLETED: 3,  // 已完成
  CANCELLED: 4   // 已取消
}

export default {
  name: 'OrdersList',
  data() {
    return {
      orders: [],
      detailDialogVisible: false,
      currentOrder: null
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('/api/orders')
        this.orders = response.data.data
      } catch (error) {
        this.$message.error('获取订单列表失败')
      }
    },
    getStatusType(status) {
      const typeMap = {
        [ORDER_STATUS.PENDING]: 'info',
        [ORDER_STATUS.PAID]: 'warning',
        [ORDER_STATUS.SHIPPED]: 'primary',
        [ORDER_STATUS.COMPLETED]: 'success',
        [ORDER_STATUS.CANCELLED]: 'danger'
      }
      return typeMap[status] || 'info'
    },
    getStatusText(status) {
      const textMap = {
        [ORDER_STATUS.PENDING]: '待付款',
        [ORDER_STATUS.PAID]: '待发货',
        [ORDER_STATUS.SHIPPED]: '已发货',
        [ORDER_STATUS.COMPLETED]: '已完成',
        [ORDER_STATUS.CANCELLED]: '已取消'
      }
      return textMap[status] || '未知状态'
    },
    handleDetail(row) {
      this.currentOrder = row
      this.detailDialogVisible = true
    },
    async handleShip(row) {
      try {
        await this.$confirm('确认发货？', '提示', {
          type: 'warning'
        })
        // 这里添加实际的发货 API 调用
        await axios.put(`/api/orders/${row.id}/ship`)
        this.$message.success('发货成功')
        // 更新订单状态
        row.status = ORDER_STATUS.SHIPPED
        row.shipTime = new Date().toLocaleString()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('发货失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.detail-item {
  margin-bottom: 15px;
  line-height: 20px;
}

.detail-item .label {
  display: inline-block;
  width: 100px;
  color: #606266;
}
</style> 
