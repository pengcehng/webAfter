<style src="../../assets/css/EquipmentPage.css"></style>
<script src="../../utils/StatePage.js"></script>
<template>
  <el-container style="height: 100vh;">
    <!-- 顶部菜单 -->

    <!-- 主体内容 -->
    <el-main style="flex: 1;">
      <el-form :model="queryForm" inline style="margin-bottom: 50px;">
        <el-form-item label="设备名称">
          <el-input v-model="queryForm.stateName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="监控状态">
          <el-select v-model="queryForm.status" placeholder="请选择监控状态">
            <el-option label="运行" value="运行" />
            <el-option label="暂停" value="暂停" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="queryForm.stateLocation" placeholder="请输入设备安装位置" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="stateId" label="监控编号" width="150" />
        <el-table-column prop="stateName" label="安装位置" width="120" />
        <el-table-column prop="status" label="监控状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusColor(scope.row.status)" class="status-indicator">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stateLocation" label="覆盖范围" width="120" />
        <el-table-column prop="stateType" label="设备类型" width="300" />
        <el-table-column prop="storagePeriod" label="录像存储周期" width="120" />
        <el-table-column prop="maintenanceTime" label="最近维护时间" width="120" />
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleStart(scope.$index)">启动</el-button>
            <el-button type="warning" size="mini" @click="handlePause(scope.$index)">暂停</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 底部页脚 -->
    <el-footer>
      <el-pagination
        :page-size="6"
        :pager-count="11"
        layout="prev, pager, next"
        :total="tableData.length"
      />
    </el-footer>
  </el-container>
</template>
