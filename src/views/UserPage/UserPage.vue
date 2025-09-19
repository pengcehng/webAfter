<style src="../../assets/css/EquipmentPage.css"></style>
<script src="../../utils/UserPage.js"></script>
<template>
  <el-container style="height: 100vh; position: relative;" class="fade-in-up">
    <!-- 主体内容 -->
    <el-main style="flex: 1; padding-bottom: 60px;">
      <el-form :model="queryForm" inline style="margin-bottom: 50px;" class="theme-card fade-in-up delay-200">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            class="hover-lift"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name" placeholder="请输入姓名" class="theme-input hover-lift" />
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="queryForm.installationLocation" placeholder="权限" style="width: 200px;" class="theme-input hover-lift" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="theme-button-primary btn-ripple hover-lift">查询</el-button>
          <el-button @click="handleReset" class="btn-ripple hover-lift">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="filteredTableData" border style="width: 100%" class="theme-table fade-in-up delay-400 custom-scrollbar">
        <el-table-column fixed prop="userId" label="编号" width="150" />
        <el-table-column prop="userName" label="姓名" width="120" />
        <el-table-column prop="age" label="年龄" width="120" />
        <el-table-column prop="gender" label="性别" width="120" />
        <el-table-column prop="userPower" label="管理权限" width="300" />
        <el-table-column prop="userPhone" label="电话" width="300" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column prop="updateTime" label="操作时间" width="150" />
        <el-table-column fixed="right" label="操作" width="450" align="center">
          <template #default="scope">
            <el-button type="success" size="mini" @click="handleEdit(scope.row)" class="btn-ripple hover-lift">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)" class="btn-ripple hover-scale">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑对话框 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" class="theme-modal scale-in">
        <el-form :model="currentDevice" label-width="100px" class="fade-in-up">
          <el-form-item label="权限">
            <el-input v-model="currentDevice.monitoringId" placeholder="权限" class="theme-input hover-lift" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="btn-ripple hover-lift">取 消</el-button>
          <el-button type="primary" @click="handleSave" class="theme-button-primary btn-ripple hover-lift">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>

    <!-- 底部页脚 -->
    <el-footer style="background-color: #f5f7fa; padding: 10px 20px;" class="theme-card fade-in-up delay-600">
      <div style="display: flex; justify-content: center; align-items: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <el-pagination
            :page-size="pageSize"
            :pager-count="11"
            layout="prev, pager, next, total"
            :total="monitorUrls.total"
            :current-page="currentPage"
            @current-change="handlePageChange"
            class="hover-lift"
          />
          <div style="display: flex;margin-left: 400px;margin-top: -10px">
            <span style="margin-right: 10px;" class="theme-text-secondary">每页显示:</span>
            <el-select v-model="pageSize" @change="handlePageSizeChange" style="width: 100px;" class="hover-lift">
              <el-option
                v-for="size in pageSizeOptions"
                :key="size"
                :label="size"
                :value="size"
              />
            </el-select>
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>
