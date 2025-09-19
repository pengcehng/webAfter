<template>
  <div class="cleaning-task-page fade-in-up">
    <div class="page-header theme-card">
      <h2 class="gradient-text">清洁任务管理</h2>
      <el-button type="primary" @click="showAddTaskDialog = true" class="theme-button-primary btn-ripple hover-lift">
        <i class="el-icon-plus"></i> 新建清洁任务
      </el-button>
    </div>

    <!-- 任务统计卡片 -->
    <div class="stats-cards fade-in-up delay-200">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number theme-primary">{{ totalTasks }}</div>
              <div class="stat-label theme-text-secondary">总任务数</div>
            </div>
            <i class="el-icon-document stat-icon theme-primary"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--success-color)">{{ completedTasks }}</div>
              <div class="stat-label theme-text-secondary">已完成</div>
            </div>
            <i class="el-icon-check stat-icon" style="color: var(--success-color)"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--warning-color)">{{ inProgressTasks }}</div>
              <div class="stat-label theme-text-secondary">进行中</div>
            </div>
            <i class="el-icon-loading stat-icon" style="color: var(--warning-color)"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--info-color)">{{ pendingTasks }}</div>
              <div class="stat-label theme-text-secondary">待执行</div>
            </div>
            <i class="el-icon-time stat-icon" style="color: var(--info-color)"></i>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section theme-card fade-in-up delay-400">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="任务状态" clearable class="hover-lift">
            <el-option label="全部" value=""></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="待执行" value="待执行"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterType" placeholder="任务类型" clearable class="hover-lift">
            <el-option label="全部" value=""></el-option>
            <el-option label="定期清洁" value="定期清洁"></el-option>
            <el-option label="紧急清洁" value="紧急清洁"></el-option>
            <el-option label="维护清洁" value="维护清洁"></el-option>
            <el-option label="深度清洁" value="深度清洁"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchKeyword" placeholder="搜索任务名称或设备" clearable class="theme-input hover-lift">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters" class="btn-ripple hover-lift">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 任务列表 -->
    <el-table 
      :data="filteredTasks" 
      style="width: 100%" 
      stripe 
      class="theme-table fade-in-up delay-600 custom-scrollbar"
      :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
      height="auto"
    >
      <el-table-column prop="taskId" label="任务ID" width="120" fixed="left" show-overflow-tooltip></el-table-column>
      <el-table-column prop="taskName" label="任务名称" min-width="250" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deviceName" label="清洁设备" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="taskType" label="任务类型" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.taskType }}
        </template>
      </el-table-column>
      <el-table-column prop="taskStatus" label="任务状态" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.taskStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="scheduledTime" label="计划时间" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="duration" label="耗时" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cleaningQuality" label="清洁质量" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-rate :value="getQualityRating(scope.row.cleaningQuality)" disabled show-score class="hover-lift"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <div class="action-buttons">
            <el-button 
              size="mini" 
              @click="viewTaskDetail(scope.row)" 
              class="action-btn detail-btn btn-ripple hover-lift"
              icon="el-icon-view"
            >
              详情
            </el-button>
            <el-button 
              size="mini" 
              type="primary" 
              @click="editTask(scope.row)" 
              v-if="scope.row.taskStatus === '待执行'" 
              class="action-btn edit-btn theme-button-primary btn-ripple hover-scale"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button 
              size="mini" 
              type="danger" 
              @click="deleteTask(scope.row)" 
              v-if="scope.row.taskStatus === '待执行'" 
              class="action-btn delete-btn btn-ripple hover-scale"
              icon="el-icon-delete"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建任务对话框 -->
    <el-dialog title="新建清洁任务" :visible.sync="showAddTaskDialog" width="600px" class="theme-modal scale-in">
      <el-form :model="newTask" :rules="taskRules" ref="taskForm" label-width="120px" class="fade-in-up">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="newTask.taskName" placeholder="请输入任务名称" class="theme-input hover-lift"></el-input>
        </el-form-item>
        <el-form-item label="清洁设备" prop="deviceId">
          <el-select v-model="newTask.deviceId" placeholder="选择清洁设备" style="width: 100%" class="hover-lift">
            <el-option
              v-for="device in availableDevices"
              :key="device.deviceId"
              :label="device.deviceName"
              :value="device.deviceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="newTask.taskType" placeholder="选择任务类型" style="width: 100%" class="hover-lift">
            <el-option label="定期清洁" value="定期清洁"></el-option>
            <el-option label="紧急清洁" value="紧急清洁"></el-option>
            <el-option label="维护清洁" value="维护清洁"></el-option>
            <el-option label="深度清洁" value="深度清洁"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间" prop="scheduledTime">
          <el-date-picker
            v-model="newTask.scheduledTime"
            type="datetime"
            placeholder="选择计划执行时间"
            style="width: 100%"
            class="hover-lift">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作员" prop="operator">
          <el-input v-model="newTask.operator" placeholder="请输入操作员姓名" class="theme-input hover-lift"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newTask.remarks" type="textarea" placeholder="请输入备注信息" class="theme-input hover-lift"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddTaskDialog = false">取消</el-button>
        <el-button type="primary" @click="submitTask">确定</el-button>
      </span>
    </el-dialog>

    <!-- 任务详情对话框 -->
    <el-dialog title="任务详情" :visible.sync="showDetailDialog" width="700px">
      <div v-if="selectedTask" class="task-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务ID">{{ selectedTask.taskId }}</el-descriptions-item>
          <el-descriptions-item label="任务名称">{{ selectedTask.taskName }}</el-descriptions-item>
          <el-descriptions-item label="清洁设备">{{ selectedTask.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">
            <el-tag :type="getTaskTypeColor(selectedTask.taskType)">{{ selectedTask.taskType }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-tag :type="getStatusColor(selectedTask.taskStatus)">{{ selectedTask.taskStatus }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="计划时间">{{ selectedTask.scheduledTime }}</el-descriptions-item>
          <el-descriptions-item label="实际开始时间">{{ selectedTask.actualStartTime || '未开始' }}</el-descriptions-item>
          <el-descriptions-item label="实际结束时间">{{ selectedTask.actualEndTime || '未结束' }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ selectedTask.duration }}</el-descriptions-item>
          <el-descriptions-item label="清洁质量">{{ selectedTask.cleaningQuality }}</el-descriptions-item>
          <el-descriptions-item label="操作员">{{ selectedTask.operator }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ selectedTask.remarks }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mockData from '@/api/mockData/mockData.js'

export default {
  name: 'CleaningTaskPage',
  data () {
    return {
      tasks: mockData.cleaningTaskData.taskList,
      devices: mockData.equipmentData.equipmentList,
      filterStatus: '',
      filterType: '',
      searchKeyword: '',
      showAddTaskDialog: false,
      showDetailDialog: false,
      selectedTask: null,
      newTask: {
        taskName: '',
        deviceId: '',
        taskType: '',
        scheduledTime: '',
        operator: '',
        remarks: ''
      },
      taskRules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        deviceId: [{ required: true, message: '请选择清洁设备', trigger: 'change' }],
        taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        scheduledTime: [{ required: true, message: '请选择计划时间', trigger: 'change' }],
        operator: [{ required: true, message: '请输入操作员', trigger: 'blur' }]
      }
    }
  },
  computed: {
    totalTasks () {
      return this.tasks.length
    },
    completedTasks () {
      return this.tasks.filter(task => task.taskStatus === '已完成').length
    },
    inProgressTasks () {
      return this.tasks.filter(task => task.taskStatus === '进行中').length
    },
    pendingTasks () {
      return this.tasks.filter(task => task.taskStatus === '待执行').length
    },
    availableDevices () {
      return this.devices.filter(device => device.deviceStatus === '正常运行')
    },
    filteredTasks () {
      let filtered = this.tasks

      if (this.filterStatus) {
        filtered = filtered.filter(task => task.taskStatus === this.filterStatus)
      }

      if (this.filterType) {
        filtered = filtered.filter(task => task.taskType === this.filterType)
      }

      if (this.searchKeyword) {
        filtered = filtered.filter(task =>
          task.taskName.includes(this.searchKeyword) ||
          task.deviceName.includes(this.searchKeyword)
        )
      }

      return filtered
    }
  },
  methods: {
    getStatusColor (status) {
      const colorMap = {
        已完成: 'success',
        进行中: 'warning',
        待执行: 'info'
      }
      return colorMap[status] || 'info'
    },
    getTaskTypeColor (type) {
      const colorMap = {
        定期清洁: 'primary',
        紧急清洁: 'danger',
        维护清洁: 'warning',
        深度清洁: 'success'
      }
      return colorMap[type] || 'primary'
    },
    getQualityRating (quality) {
      const ratingMap = {
        优秀: 5,
        良好: 4,
        一般: 3,
        较差: 2,
        进行中: 0,
        待评估: 0
      }
      return ratingMap[quality] || 0
    },
    resetFilters () {
      this.filterStatus = ''
      this.filterType = ''
      this.searchKeyword = ''
    },
    viewTaskDetail (task) {
      this.selectedTask = task
      this.showDetailDialog = true
    },
    editTask (task) {
      // 编辑任务逻辑
      this.$message.info('编辑功能开发中')
    },
    deleteTask (task) {
      this.$confirm('确认删除该任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.tasks.findIndex(t => t.taskId === task.taskId)
        if (index > -1) {
          this.tasks.splice(index, 1)
          this.$message.success('删除成功')
        }
      })
    },
    submitTask () {
      this.$refs.taskForm.validate((valid) => {
        if (valid) {
          const device = this.devices.find(d => d.deviceId === this.newTask.deviceId)
          const newTaskData = {
            taskId: 'TASK' + String(Date.now()).slice(-3),
            taskName: this.newTask.taskName,
            deviceId: this.newTask.deviceId,
            deviceName: device ? device.deviceName : '',
            taskType: this.newTask.taskType,
            taskStatus: '待执行',
            scheduledTime: this.formatDateTime(this.newTask.scheduledTime),
            actualStartTime: null,
            actualEndTime: null,
            duration: '待执行',
            cleaningQuality: '待评估',
            operator: this.newTask.operator,
            remarks: this.newTask.remarks
          }

          this.tasks.unshift(newTaskData)
          this.showAddTaskDialog = false
          this.resetTaskForm()
          this.$message.success('任务创建成功')
        }
      })
    },
    resetTaskForm () {
      this.newTask = {
        taskName: '',
        deviceId: '',
        taskType: '',
        scheduledTime: '',
        operator: '',
        remarks: ''
      }
      this.$refs.taskForm.resetFields()
    },
    formatDateTime (date) {
      if (!date) return ''
      const d = new Date(date)
      return d.getFullYear() + '-' +
             String(d.getMonth() + 1).padStart(2, '0') + '-' +
             String(d.getDate()).padStart(2, '0') + ' ' +
             String(d.getHours()).padStart(2, '0') + ':' +
             String(d.getMinutes()).padStart(2, '0')
    }
  }
}
</script>

<style scoped>
.cleaning-task-page {
  padding: 20px;
}

/* 任务类型标签样式 */
.task-type-tag {
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-type-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 状态指示器样式 */
.status-indicator {
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-indicator:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 60px;
  height: 28px;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.action-btn:hover:before {
  left: 100%;
}

.detail-btn {
  background: linear-gradient(135deg, #909399 0%, #b3b6bb 100%);
  border: 1px solid #909399;
  color: white;
  box-shadow: 0 2px 6px rgba(144, 147, 153, 0.3);
}

.detail-btn:hover {
  background: linear-gradient(135deg, #b3b6bb 0%, #909399 100%);
  border-color: #b3b6bb;
  box-shadow: 0 4px 10px rgba(144, 147, 153, 0.4);
  transform: translateY(-1px);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  border: 1px solid #f56c6c;
  color: white;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #f78989 0%, #f56c6c 100%);
  border-color: #f78989;
  box-shadow: 0 4px 10px rgba(245, 108, 108, 0.4);
  transform: translateY(-1px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-content {
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  color: #E4E7ED;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.task-detail {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

.el-card {
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>
