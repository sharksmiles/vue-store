<template>
  <div class="products">
    <el-card>
      <div slot="header">
        <span>商品列表</span>
        <el-button style="float: right" type="primary" @click="handleAdd"
          >添加商品</el-button
        >
      </div>

      <el-table :data="products" height="70vh">
        <el-table-column
          prop="product_id"
          label="ID"
          width="80"
        ></el-table-column>
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image
              :src="`http://localhost:3600/${scope.row.product_picture}`"
              :preview-src-list="[
                `http://localhost:3600/${scope.row.product_picture}`
              ]"
              fit="cover"
              style="width: 50px; height: 50px"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="商品名称"></el-table-column>
        <el-table-column prop="product_price" label="价格">
          <template slot-scope="scope">
            ¥{{ scope.row.product_price }}
          </template>
        </el-table-column>
        <el-table-column prop="product_num" label="库存"></el-table-column>
        <el-table-column prop="product_status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.product_status === 1 ? 'success' : 'info'">
              {{ scope.row.product_status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="product_create_time" label="创建时间">
          <template slot-scope="scope">
            {{
              scope.row.product_create_time
                ? new Date(scope.row.product_create_time).toLocaleString()
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑商品弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        :model="productForm"
        :rules="rules"
        ref="productForm"
        label-width="80px"
      >
        <el-form-item label="商品图片">
          <el-upload
            class="product-uploader"
            action="/api/upload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
          >
            <img
              v-if="productForm.product_picture"
              :src="`http://localhost:3600/${productForm.product_picture}`"
              class="product-image"
            />
            <i v-else class="el-icon-plus product-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="productForm.product_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="product_price">
          <el-input-number
            v-model="productForm.product_price"
            :precision="2"
            :step="0.1"
            :min="0"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="product_num">
          <el-input-number
            v-model="productForm.product_num"
            :min="0"
            :precision="0"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="product_status">
          <el-switch
            v-model="productForm.product_status"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="描述" prop="product_intro">
          <el-input
            type="textarea"
            v-model="productForm.product_intro"
            :rows="3"
          >
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
  name: 'ProductsList',
  data() {
    return {
      products: [],
      dialogVisible: false,
      isEdit: false,
      loading: false,
      productForm: {
        product_id: null,
        product_name: '',
        product_price: 0,
        product_num: 0,
        product_status: 1,
        product_intro: '',
        product_picture: ''
      },
      rules: {
        product_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        product_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        product_num: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑商品' : '添加商品';
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await this.$axios.post('/product/getAllProduct');
        this.products = response.data.Product;
      } catch (error) {
        this.$message.error('获取商品列表失败');
      }
    },
    handleAdd() {
      this.isEdit = false;
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.isEdit = true;
      this.productForm = { ...row };
      this.dialogVisible = true;
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该商品?', '提示', {
          type: 'warning'
        });
        await this.$axios.post('/product/deleteProduct', {
          product_id: row.product_id
        });
        this.$message.success('删除成功');
        this.fetchProducts();
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!');
        return false;
      }
      return true;
    },
    async handleUpload(options) {
      try {
        // 这里使用 FormData 模拟文件上传
        const formData = new FormData();
        formData.append('file', options.file);

        // 实际项目中这里应该调用真实的上传接口
        const response = await this.$axios.post('/product/uploadPicture', formData);
        this.productForm.product_picture = response.data.data;

        // 使用 FileReader 在本地预览图片
        // const reader = new FileReader()
        // reader.onload = (e) => {
        //   this.productForm.product_picture = e.target.result
        // }
        // reader.readAsDataURL(options.file);
      } catch (error) {
        this.$message.error('上传失败');
      }
    },
    resetForm() {
      this.$refs.productForm?.resetFields();
      this.productForm = {
        product_id: null,
        product_name: '',
        product_price: 0,
        product_num: 0,
        product_status: 1,
        product_intro: '',
        product_picture: ''
      };
    },
    submitForm() {
      this.$refs.productForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            if (this.isEdit) {
              await this.$axios.post(
                '/product/updateProduct',
                this.productForm
              );
              this.$message.success('更新成功');
            } else {
              await this.$axios.post('/product/addProduct', this.productForm);
              this.$message.success('添加成功');
            }
            this.dialogVisible = false;
            this.fetchProducts();
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

<style scoped>
.el-input-number {
  width: 100%;
}

.product-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.product-uploader:hover {
  border-color: #409eff;
}

.product-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.product-image {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
