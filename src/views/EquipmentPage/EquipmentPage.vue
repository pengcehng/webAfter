<script src="../../utils/EquipmentPage.js"></script>
<style src="../../assets/css/EquipmentPage.css"></style>
<template>
  <el-container style="height: 100vh; position: relative;" class="fade-in-up">
    <!-- 主体内容 -->
    <el-main style="flex: 1; padding-bottom: 60px;" class="page-container">
      <el-form :model="queryForm" inline style="margin-bottom: 50px;" class="theme-card fade-in-up delay-200">
        <el-form-item label="更新时间">
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
        <el-form-item label="设备ID">
          <el-input v-model="queryForm.deviceId" placeholder="请输入设备ID" class="theme-input hover-lift" />
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="queryForm.installationLocation" placeholder="请输入设备安装位置" style="width: 200px;" class="theme-input hover-lift" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="theme-button-primary btn-ripple hover-lift">查询</el-button>
          <el-button @click="handleReset" class="btn-ripple hover-lift">重置</el-button>
          <el-button type="success" @click="handleAdd" class="btn-ripple hover-lift">新增</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" class="theme-table fade-in-up delay-400 custom-scrollbar">
        <el-table-column fixed prop="deviceId" label="设备ID" width="120" />
        <el-table-column prop="deviceName" label="设备名称" width="200" />
        <el-table-column prop="installationLocation" label="安装位置" width="180" />
        <el-table-column prop="deviceStatus" label="设备状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.deviceStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="lastCleaningTime" label="最后清洁时间" width="150" />
        <el-table-column prop="maintenanceStatus" label="维护状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.maintenanceStatus }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="450" align="center">
          <template #default="scope">
            <el-button type="success" size="mini" @click="handleEdit(scope.row)" class="btn-ripple hover-scale">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)" class="btn-ripple hover-scale">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑对话框 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" class="theme-modal scale-in">
        <el-form :model="currentDevice" label-width="120px" class="fade-in-up">
          <el-form-item label="设备ID">
            <el-input v-model="currentDevice.deviceId" placeholder="请输入设备ID" class="theme-input hover-lift" />
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="currentDevice.deviceName" placeholder="请输入设备名称" class="theme-input hover-lift" />
          </el-form-item>
          <el-form-item label="安装位置">
            <el-input v-model="currentDevice.installationLocation" placeholder="请输入安装位置" class="theme-input hover-lift" />
          </el-form-item>
          <el-form-item label="设备状态">
            <el-select v-model="currentDevice.deviceStatus" placeholder="请选择设备状态" class="hover-lift">
              <el-option label="运行中" value="运行中" />
              <el-option label="离线" value="离线" />
              <el-option label="维护中" value="维护中" />
              <el-option label="故障" value="故障" />
            </el-select>
          </el-form-item>
          <el-form-item label="清洁模式">
            <el-select v-model="currentDevice.cleaningMode" placeholder="请选择清洁模式" class="hover-lift">
              <el-option label="自动清洁" value="自动清洁" />
              <el-option label="手动清洁" value="手动清洁" />
              <el-option label="定时清洁" value="定时清洁" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="currentDevice.deviceType" placeholder="请选择设备类型" class="hover-lift">
              <el-option label="高压水枪清洁器" value="高压水枪清洁器" />
              <el-option label="超声波清洁器" value="超声波清洁器" />
              <el-option label="气压清洁器" value="气压清洁器" />
              <el-option label="刷式清洁器" value="刷式清洁器" />
            </el-select>
          </el-form-item>
          <el-form-item label="维护状态">
            <el-select v-model="currentDevice.maintenanceStatus" placeholder="请选择维护状态" class="hover-lift">
              <el-option label="正常" value="正常" />
              <el-option label="需要维护" value="需要维护" />
              <el-option label="维护中" value="维护中" />
            </el-select>
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
          />
          <div style="display: flex;margin-left: 400px;margin-top: -10px">
            <span style="margin-right: 10px;">每页显示:</span>
            <el-select v-model="pageSize" @change="handlePageSizeChange" style="width: 100px;">
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

<script>
import EquipmentPageLogic from '../../utils/EquipmentPage.js'

export default {
  ...EquipmentPageLogic,
  mounted() {
    // 组件挂载后获取数据
    this.fetchData()
  }
}
</script>
