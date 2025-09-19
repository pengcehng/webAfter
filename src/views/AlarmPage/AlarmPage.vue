<!--<script setup>-->

<template>
  <div class="alarm-page">
    <div class="page-header">
      <h2>报警管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="refreshAlarms">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
        <el-button type="success" @click="markAllAsRead">
          <i class="el-icon-check"></i> 全部已读
        </el-button>
      </div>
    </div>

    <!-- 报警统计卡片 -->
    <div class="alarm-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card high-severity">
            <div class="stat-content">
              <div class="stat-number">{{ highSeverityCount }}</div>
              <div class="stat-label">高危报警</div>
            </div>
            <i class="el-icon-warning stat-icon"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card medium-severity">
            <div class="stat-content">
              <div class="stat-number">{{ mediumSeverityCount }}</div>
              <div class="stat-label">中危报警</div>
            </div>
            <i class="el-icon-info stat-icon"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card low-severity">
            <div class="stat-content">
              <div class="stat-number">{{ lowSeverityCount }}</div>
              <div class="stat-label">低危报警</div>
            </div>
            <i class="el-icon-bell stat-icon"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card total-alarms">
            <div class="stat-content">
              <div class="stat-number">{{ totalAlarms }}</div>
              <div class="stat-label">总报警数</div>
            </div>
            <i class="el-icon-document stat-icon"></i>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filterSeverity" placeholder="报警级别" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="高危" value="high"></el-option>
            <el-option label="中危" value="medium"></el-option>
            <el-option label="低危" value="low"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="处理状态" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="处理中" value="processing"></el-option>
            <el-option label="已解决" value="resolved"></el-option>
            <el-option label="已忽略" value="ignored"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchKeyword" placeholder="搜索报警类型或位置" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 报警列表 -->
    <el-table :data="filteredAlarms" style="width: 100%" stripe>
      <el-table-column prop="id" label="报警ID" width="100"></el-table-column>
      <el-table-column prop="type" label="报警类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="getAlarmTypeColor(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="severity" label="严重级别" width="100">
        <template slot-scope="scope">
          <el-tag :type="getSeverityColor(scope.row.severity)" size="small">
            {{ getSeverityText(scope.row.severity) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="位置" width="150"></el-table-column>
      <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
      <el-table-column prop="timestamp" label="发生时间" width="150"></el-table-column>
      <el-table-column prop="count" label="次数" width="80">
        <template slot-scope="scope">
          <el-badge :value="scope.row.count" :type="scope.row.count > 5 ? 'danger' : 'primary'">
            <span>{{ scope.row.count }}</span>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column prop="trend" label="趋势" width="80">
        <template slot-scope="scope">
          <i :class="getTrendIcon(scope.row.trend)" :style="{color: getTrendColor(scope.row.trend)}"></i>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusColor(scope.row.status)" size="small">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="viewAlarmDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="primary" @click="handleAlarm(scope.row)" v-if="scope.row.status === 'pending'">处理</el-button>
          <el-button size="mini" type="warning" @click="ignoreAlarm(scope.row)" v-if="scope.row.status === 'pending'">忽略</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 报警详情对话框 -->
    <el-dialog title="报警详情" :visible.sync="showDetailDialog" width="600px">
      <div v-if="selectedAlarm" class="alarm-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="报警ID">{{ selectedAlarm.id }}</el-descriptions-item>
          <el-descriptions-item label="报警类型">{{ selectedAlarm.type }}</el-descriptions-item>
          <el-descriptions-item label="严重级别">
            <el-tag :type="getSeverityColor(selectedAlarm.severity)">
              {{ getSeverityText(selectedAlarm.severity) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="设备ID">{{ selectedAlarm.deviceId }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ selectedAlarm.location }}</el-descriptions-item>
          <el-descriptions-item label="发生时间">{{ selectedAlarm.timestamp }}</el-descriptions-item>
          <el-descriptions-item label="报警次数">{{ selectedAlarm.count }}</el-descriptions-item>
          <el-descriptions-item label="趋势">
            <i :class="getTrendIcon(selectedAlarm.trend)" :style="{color: getTrendColor(selectedAlarm.trend)}"></i>
            {{ getTrendText(selectedAlarm.trend) }}
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getStatusColor(selectedAlarm.status)">
              {{ getStatusText(selectedAlarm.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ selectedAlarm.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 处理报警对话框 -->
    <el-dialog title="处理报警" :visible.sync="showHandleDialog" width="500px">
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="handleForm.action">
            <el-radio label="resolve">解决</el-radio>
            <el-radio label="ignore">忽略</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input v-model="handleForm.remark" type="textarea" placeholder="请输入处理说明"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showHandleDialog = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mockData from '@/api/mockData/mockData.js'

export default {
  name: 'AlarmPage',
  data () {
    return {
      alarms: mockData.alarmData.alarmList,
      filterSeverity: '',
      filterStatus: '',
      searchKeyword: '',
      showDetailDialog: false,
      showHandleDialog: false,
      selectedAlarm: null,
      handleForm: {
        action: 'resolve',
        remark: ''
      }
    }
  },
  computed: {
    filteredAlarms () {
      let filtered = this.alarms

      if (this.filterSeverity) {
        filtered = filtered.filter(alarm => alarm.severity === this.filterSeverity)
      }

      if (this.filterStatus) {
        filtered = filtered.filter(alarm => alarm.status === this.filterStatus)
      }

      if (this.searchKeyword) {
        filtered = filtered.filter(alarm =>
          alarm.type.includes(this.searchKeyword) ||
          alarm.location.includes(this.searchKeyword)
        )
      }

      return filtered
    },

    totalAlarms () {
      return this.alarms.length
    },

    highSeverityCount () {
      return this.alarms.filter(alarm => alarm.severity === 'high').length
    },

    mediumSeverityCount () {
      return this.alarms.filter(alarm => alarm.severity === 'medium').length
    },

    lowSeverityCount () {
      return this.alarms.filter(alarm => alarm.severity === 'low').length
    }
  },

  methods: {
    refreshAlarms () {
      this.$message.success('报警数据已刷新')
    },

    markAllAsRead () {
      this.$message.success('所有报警已标记为已读')
    },

    resetFilters () {
      this.filterSeverity = ''
      this.filterStatus = ''
      this.searchKeyword = ''
    },

    viewAlarmDetail (alarm) {
      this.selectedAlarm = alarm
      this.showDetailDialog = true
    },

    handleAlarm (alarm) {
      this.selectedAlarm = alarm
      this.handleForm.action = 'resolve'
      this.handleForm.remark = ''
      this.showHandleDialog = true
    },

    ignoreAlarm (alarm) {
      this.selectedAlarm = alarm
      this.handleForm.action = 'ignore'
      this.handleForm.remark = ''
      this.showHandleDialog = true
    },

    submitHandle () {
      const action = this.handleForm.action === 'resolve' ? '已解决' : '已忽略'
      this.$message.success(`报警${this.selectedAlarm.id}${action}`)

      // 更新报警状态
      const index = this.alarms.findIndex(alarm => alarm.id === this.selectedAlarm.id)
      if (index !== -1) {
        this.alarms[index].status = this.handleForm.action === 'resolve' ? 'resolved' : 'ignored'
      }

      this.showHandleDialog = false
    },

    getSeverityColor (severity) {
      const colors = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
      }
      return colors[severity] || 'info'
    },

    getSeverityText (severity) {
      const texts = {
        high: '高危',
        medium: '中危',
        low: '低危'
      }
      return texts[severity] || severity
    },

    getStatusColor (status) {
      const colors = {
        pending: 'danger',
        processing: 'warning',
        resolved: 'success',
        ignored: 'info'
      }
      return colors[status] || 'info'
    },

    getStatusText (status) {
      const texts = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已解决',
        ignored: '已忽略'
      }
      return texts[status] || status
    },

    getAlarmTypeColor (type) {
      const colors = {
        设备离线: 'danger',
        存储空间不足: 'warning',
        网络延迟: 'info',
        画质异常: 'warning',
        录像中断: 'danger',
        温度异常: 'warning',
        入侵检测: 'danger'
      }
      return colors[type] || 'info'
    },

    getTrendIcon (trend) {
      const icons = {
        up: 'el-icon-top',
        down: 'el-icon-bottom',
        stable: 'el-icon-minus'
      }
      return icons[trend] || 'el-icon-minus'
    },

    getTrendColor (trend) {
      const colors = {
        up: '#f56c6c',
        down: '#67c23a',
        stable: '#909399'
      }
      return colors[trend] || '#909399'
    },

    getTrendText (trend) {
      const texts = {
        up: '上升',
        down: '下降',
        stable: '稳定'
      }
      return texts[trend] || trend
    }
  }
}
</script>

<style scoped>
.alarm-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.alarm-stats {
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
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 40px;
  opacity: 0.3;
  z-index: 1;
}

.high-severity .stat-icon {
  color: #f56c6c;
}

.medium-severity .stat-icon {
  color: #e6a23c;
}

.low-severity .stat-icon {
  color: #409eff;
}

.total-alarms .stat-icon {
  color: #909399;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section .el-select,
.filter-section .el-input {
  width: 100%;
}

.alarm-detail {
  padding: 20px 0;
}
</style>
