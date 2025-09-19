<!--<script setup>-->

<template>
  <div class="data-statistics-page fade-in-up">
    <div class="page-header theme-card">
      <h2 class="gradient-text">数据统计分析</h2>
      <el-button type="primary" @click="refreshData" class="theme-button-primary btn-ripple hover-lift">
        <i class="el-icon-refresh"></i> 刷新数据
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-overview fade-in-up delay-200">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card device-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number theme-primary">{{ statisticsData.deviceStats.total }}</div>
              <div class="stat-label theme-text-secondary">设备总数</div>
              <div class="stat-detail">
                <span class="online theme-status-success">在线: {{ statisticsData.deviceStats.online }}</span>
                <span class="offline theme-status-danger">离线: {{ statisticsData.deviceStats.offline }}</span>
              </div>
            </div>
            <i class="el-icon-monitor stat-icon theme-primary"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card cleaning-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--success-color)">{{ statisticsData.cleaningStats.totalCleanings }}</div>
              <div class="stat-label theme-text-secondary">清洁总次数</div>
              <div class="stat-detail">
                <span class="this-month theme-text-regular">本月: {{ statisticsData.cleaningStats.thisMonth }}</span>
                <span class="avg theme-text-regular">平均: {{ statisticsData.cleaningStats.avgPerDevice }}次/设备</span>
              </div>
            </div>
            <i class="el-icon-brush stat-icon" style="color: var(--success-color)"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card storage-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--warning-color)">{{ statisticsData.storageStats.usageRate }}</div>
              <div class="stat-label theme-text-secondary">存储使用率</div>
              <div class="stat-detail">
                <span class="theme-text-regular">已用: {{ statisticsData.storageStats.usedCapacity }}</span>
                <span class="theme-text-regular">总容量: {{ statisticsData.storageStats.totalCapacity }}</span>
              </div>
            </div>
            <i class="el-icon-folder stat-icon" style="color: var(--warning-color)"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card runtime-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--info-color)">{{ statisticsData.runtimeStats.uptimeRate }}</div>
              <div class="stat-label theme-text-secondary">运行时间率</div>
              <div class="stat-detail">
                <span class="theme-text-regular">总运行: {{ statisticsData.runtimeStats.totalRuntime }}</span>
                <span class="theme-text-regular">日均: {{ statisticsData.runtimeStats.avgDailyRuntime }}</span>
              </div>
            </div>
            <i class="el-icon-time stat-icon" style="color: var(--info-color)"></i>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据展示区域 -->
    <el-row :gutter="20" style="margin-top: 20px;" class="fade-in-up delay-400">
      <!-- 月度趋势数据 -->
      <el-col :span="12">
        <el-card class="theme-card hover-lift chart-container">
          <div slot="header">
            <span class="theme-text-primary">月度数据趋势</span>
          </div>
          <el-table :data="statisticsData.monthlyTrends" style="width: 100%" class="theme-table custom-scrollbar">
            <el-table-column prop="month" label="月份" width="80"></el-table-column>
            <el-table-column prop="devices" label="设备数量" width="100"></el-table-column>
            <el-table-column prop="cleanings" label="清洁次数" width="100"></el-table-column>
            <el-table-column prop="runtime" label="运行时间(小时)" width="120"></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 摄像头清洁记录 -->
      <el-col :span="12">
        <el-card class="theme-card hover-lift chart-container">
          <div slot="header">
            <span class="theme-text-primary">摄像头清洁记录</span>
          </div>
          <el-table :data="statisticsData.cleaningRecords" style="width: 100%" class="theme-table custom-scrollbar">
            <el-table-column prop="deviceId" label="设备ID" width="100"></el-table-column>
            <el-table-column prop="location" label="位置" width="120"></el-table-column>
            <el-table-column prop="cleanings" label="清洁次数" width="80"></el-table-column>
            <el-table-column prop="lastCleaning" label="最后清洁" width="100"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 运行时间详细统计 -->
    <el-card style="margin-top: 20px;" class="theme-card hover-lift fade-in-up delay-600">
      <div slot="header">
        <span class="theme-text-primary">运行时间详细统计</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="runtime-info theme-card hover-lift">
            <h4 class="theme-text-secondary">总运行时间</h4>
            <div class="runtime-value theme-primary">{{ statisticsData.runtimeStats.totalRuntime }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="runtime-info theme-card hover-lift">
            <h4 class="theme-text-secondary">日均运行时间</h4>
            <div class="runtime-value theme-primary">{{ statisticsData.runtimeStats.avgDailyRuntime }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="runtime-info theme-card hover-lift">
            <h4 class="theme-text-secondary">最长连续运行</h4>
            <div class="runtime-value theme-primary">{{ statisticsData.runtimeStats.longestRuntime }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="runtime-info theme-card hover-lift">
            <h4 class="theme-text-secondary">运行时间率</h4>
            <div class="runtime-value uptime" style="color: var(--success-color)">{{ statisticsData.runtimeStats.uptimeRate }}</div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 20px;">
        <el-progress
          :percentage="parseFloat(statisticsData.runtimeStats.uptimeRate)"
          :stroke-width="20"
          color="#67c23a"
          class="hover-lift"
        ></el-progress>
      </div>
    </el-card>

    <!-- 存储使用情况 -->
    <el-card style="margin-top: 20px;" class="theme-card hover-lift fade-in-up delay-800">
      <div slot="header">
        <span class="theme-text-primary">存储使用情况</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="storage-info theme-card hover-lift">
            <h4 class="theme-text-secondary">总容量</h4>
            <div class="storage-value theme-primary">{{ statisticsData.storageStats.totalCapacity }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="storage-info theme-card hover-lift">
            <h4 class="theme-text-secondary">已使用</h4>
            <div class="storage-value used" style="color: var(--warning-color)">{{ statisticsData.storageStats.usedCapacity }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="storage-info theme-card hover-lift">
            <h4 class="theme-text-secondary">剩余空间</h4>
            <div class="storage-value free" style="color: var(--success-color)">{{ statisticsData.storageStats.freeCapacity }}</div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 20px;">
        <el-progress
          :percentage="parseInt(statisticsData.storageStats.usageRate)"
          :stroke-width="20"
          :color="getStorageColor(parseInt(statisticsData.storageStats.usageRate))"
          class="hover-lift"
        ></el-progress>
      </div>
    </el-card>
  </div>
</template>

<script>
import mockData from '@/api/mockData/mockData.js'

export default {
  name: 'DataStatisticesPage',
  data () {
    return {
      statisticsData: mockData.statisticsData
    }
  },
  mounted () {
    // 页面加载完成
  },
  methods: {
    refreshData () {
      this.$message.success('数据已刷新')
      // 重新加载数据
      this.statisticsData = mockData.statisticsData
    },

    getStorageColor (percentage) {
      if (percentage < 60) return '#67c23a'
      if (percentage < 80) return '#e6a23c'
      return '#f56c6c'
    }
  }
}
</script>

<style scoped>
.data-statistics-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-content {
  position: relative;
  z-index: 2;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-detail {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.stat-detail span {
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 40px;
  opacity: 0.3;
  z-index: 1;
}

.device-card .stat-icon {
  color: #409eff;
}

.cleaning-card .stat-icon {
  color: #67c23a;
}

.storage-card .stat-icon {
  color: #e6a23c;
}

.runtime-card .stat-icon {
  color: #409eff;
}

.online {
  color: #67c23a;
}

.offline {
  color: #f56c6c;
}

.this-month {
  color: #409eff;
}

.avg {
  color: #67c23a;
}

.storage-info {
  text-align: center;
  padding: 20px;
}

.storage-info h4 {
  margin: 0 0 10px 0;
  color: #606266;
}

.storage-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.storage-value.used {
  color: #e6a23c;
}

.storage-value.free {
  color: #67c23a;
}

.runtime-info {
  text-align: center;
  padding: 20px;
}

.runtime-info h4 {
  margin: 0 0 10px 0;
  color: #606266;
}

.runtime-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.runtime-value.uptime {
  color: #67c23a;
}
</style>
