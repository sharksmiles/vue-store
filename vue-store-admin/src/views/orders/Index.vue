<template>
  <div class="orders">
    <el-card>
      <div slot="header">
        <span>订单列表</span>
      </div>

      <el-table :data="orders" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="order_id" label="订单号"></el-table-column>
        <el-table-column prop="user_id" label="用户ID"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="product_price" label="总金额">
          <template slot-scope="scope">
            ¥{{ scope.row.product_price }}
          </template>
        </el-table-column>
        <el-table-column prop="order_status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.order_status)">
              {{ getStatusText(scope.row.order_status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_time" label="创建时间">
          <template slot-scope="scope">
            <span>{{ formatTimestamp(scope.row.order_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.order_status === 0 || !scope.row.order_status"
              size="mini"
              type="success"
              @click="handleShip(scope.row)"
            >
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
      width="600px"
    >
      <div v-if="currentOrder">
        <div class="detail-item">
          <span class="label">订单号：</span>
          <span>{{ currentOrder.order_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户ID：</span>
          <span>{{ currentOrder.user_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单金额：</span>
          <span>¥{{ currentOrder.product_price }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单状态：</span>
          <el-tag :type="getStatusType(currentOrder.order_status)">
            {{ getStatusText(currentOrder.order_status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span>{{ formatTimestamp(currentOrder.order_time) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const ORDER_STATUS = {
  PAID: 0, // 待发货
  SHIPPED: 1, // 已发货
  COMPLETED: 2 // 已完成
};

export default {
  name: 'OrdersList',
  data() {
    return {
      orders: [],
      detailDialogVisible: false,
      currentOrder: null
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    },
    async fetchOrders() {
      try {
        const response = await this.$axios.get('/all/order');
        this.orders = response.data.orders;
      } catch (error) {
        this.$message.error('获取订单列表失败');
      }
    },
    getStatusType(status) {
      const typeMap = {
        [ORDER_STATUS.PAID]: 'warning',
        [ORDER_STATUS.SHIPPED]: 'primary',
        [ORDER_STATUS.COMPLETED]: 'success'
      };
      return typeMap[status] || 'info';
    },
    getStatusText(status) {
      const textMap = {
        [ORDER_STATUS.PAID]: '待发货',
        [ORDER_STATUS.SHIPPED]: '已发货',
        [ORDER_STATUS.COMPLETED]: '已完成'
      };
      return textMap[status] || '待发货';
    },
    handleDetail(row) {
      this.currentOrder = row;
      this.detailDialogVisible = true;
    },
    async handleShip(row) {
      try {
        await this.$confirm('确认发货？', '提示', {
          type: 'warning'
        });
        // 这里添加实际的发货 API 调用
        await this.$axios.post(`/updateOrderStatus`, {
          id: row.id,
          order_status: 1
        });
        this.$message.success('发货成功');
        // 更新订单状态
        row.order_status = ORDER_STATUS.SHIPPED;
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('发货失败');
        }
      }
    }
  }
};
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
