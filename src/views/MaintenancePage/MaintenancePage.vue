<template>
  <div class="maintenance-page fade-in-up">
    <div class="page-header theme-card">
      <h2 class="gradient-text">维护保养管理</h2>
      <el-button type="primary" @click="showAddMaintenanceDialog = true" class="theme-button-primary btn-ripple hover-lift">
        <i class="el-icon-plus"></i> 新建维护计划
      </el-button>
    </div>

    <!-- 维护统计卡片 -->
    <div class="stats-cards fade-in-up delay-200">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number theme-primary">{{ totalMaintenances }}</div>
              <div class="stat-label theme-text-secondary">总维护记录</div>
            </div>
            <i class="el-icon-setting stat-icon theme-primary"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--success-color)">{{ completedMaintenances }}</div>
              <div class="stat-label theme-text-secondary">已完成</div>
            </div>
            <i class="el-icon-check stat-icon" style="color: var(--success-color)"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--warning-color)">{{ inProgressMaintenances }}</div>
              <div class="stat-label theme-text-secondary">进行中</div>
            </div>
            <i class="el-icon-loading stat-icon" style="color: var(--warning-color)"></i>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card theme-card hover-lift floating-card">
            <div class="stat-content">
              <div class="stat-number" style="color: var(--info-color)">{{ totalCost }}</div>
              <div class="stat-label theme-text-secondary">总维护费用(元)</div>
            </div>
            <i class="el-icon-money stat-icon" style="color: var(--info-color)"></i>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section theme-card fade-in-up delay-400">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="维护状态" clearable class="hover-lift">
            <el-option label="全部" value=""></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="未维护" value="未维护"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterType" placeholder="维护类型" clearable class="hover-lift">
            <el-option label="全部" value=""></el-option>
            <el-option label="定期保养" value="定期保养"></el-option>
            <el-option label="故障维修" value="故障维修"></el-option>
            <el-option label="电池更换" value="电池更换"></el-option>
            <el-option label="大修" value="大修"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchKeyword" placeholder="搜索设备名称或技术员" clearable class="theme-input hover-lift">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters" class="btn-ripple hover-lift">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 维护记录列表 -->
    <el-table 
      :data="filteredMaintenances" 
      style="width: 100%" 
      stripe 
      class="theme-table fade-in-up delay-600 custom-scrollbar"
      :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
      max-height="600"
    >
      <el-table-column prop="maintenanceId" label="维护ID" width="140" fixed="left" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deviceName" label="设备名称" min-width="250" show-overflow-tooltip></el-table-column>
      <el-table-column prop="maintenanceType" label="维护类型" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.maintenanceType }}
        </template>
      </el-table-column>
      <el-table-column prop="maintenanceStatus" label="维护状态" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.maintenanceStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="scheduledDate" label="计划日期" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="technician" label="技术员" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cost" label="费用(元)" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: var(--warning-color); font-weight: bold;">¥{{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nextMaintenanceDate" label="下次维护" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <div class="action-buttons">
            <el-button 
              size="mini" 
              @click="viewMaintenanceDetail(scope.row)" 
              class="action-btn detail-btn btn-ripple hover-lift"
              icon="el-icon-view"
            >
              详情
            </el-button>
            <el-button 
              size="mini" 
              type="primary" 
              @click="editMaintenance(scope.row)" 
              v-if="scope.row.maintenanceStatus !== '已完成'" 
              class="action-btn edit-btn theme-button-primary btn-ripple hover-scale"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button 
              size="mini" 
              type="danger" 
              @click="deleteMaintenance(scope.row)" 
              v-if="scope.row.maintenanceStatus === '计划中'" 
              class="action-btn delete-btn btn-ripple hover-scale"
              icon="el-icon-delete"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建维护计划对话框 -->
    <el-dialog title="新建维护计划" :visible.sync="showAddMaintenanceDialog" width="600px" class="theme-modal scale-in">
      <el-form :model="newMaintenance" :rules="maintenanceRules" ref="maintenanceForm" label-width="120px" class="fade-in-up">
        <el-form-item label="设备" prop="deviceId">
          <el-select v-model="newMaintenance.deviceId" placeholder="选择设备" style="width: 100%" class="hover-lift">
            <el-option
              v-for="device in devices"
              :key="device.deviceId"
              :label="device.deviceName"
              :value="device.deviceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护类型" prop="maintenanceType">
          <el-select v-model="newMaintenance.maintenanceType" placeholder="选择维护类型" style="width: 100%" class="hover-lift">
            <el-option label="定期保养" value="定期保养"></el-option>
            <el-option label="故障维修" value="故障维修"></el-option>
            <el-option label="电池更换" value="电池更换"></el-option>
            <el-option label="大修" value="大修"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期" prop="scheduledDate">
          <el-date-picker
            v-model="newMaintenance.scheduledDate"
            type="date"
            placeholder="选择计划日期"
            style="width: 100%"
            class="hover-lift">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="技术员" prop="technician">
          <el-input v-model="newMaintenance.technician" placeholder="请输入技术员姓名" class="theme-input hover-lift"></el-input>
        </el-form-item>
        <el-form-item label="维护项目" prop="maintenanceItems">
          <el-select v-model="newMaintenance.maintenanceItems" multiple placeholder="选择维护项目" style="width: 100%" class="hover-lift">
            <el-option label="电池检查" value="电池检查"></el-option>
            <el-option label="履带润滑" value="履带润滑"></el-option>
            <el-option label="传感器校准" value="传感器校准"></el-option>
            <el-option label="软件更新" value="软件更新"></el-option>
            <el-option label="水泵检修" value="水泵检修"></el-option>
            <el-option label="压力表校准" value="压力表校准"></el-option>
            <el-option label="管路清洗" value="管路清洗"></el-option>
            <el-option label="螺旋桨检查" value="螺旋桨检查"></el-option>
            <el-option label="飞控系统测试" value="飞控系统测试"></el-option>
            <el-option label="主控系统检修" value="主控系统检修"></el-option>
            <el-option label="清洁模块更换" value="清洁模块更换"></el-option>
            <el-option label="安全系统升级" value="安全系统升级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预估费用" prop="cost">
          <el-input-number v-model="newMaintenance.cost" :min="0" :max="10000" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newMaintenance.remarks" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddMaintenanceDialog = false">取消</el-button>
        <el-button type="primary" @click="submitMaintenance">确定</el-button>
      </span>
    </el-dialog>

    <!-- 维护详情对话框 -->
    <el-dialog title="维护详情" :visible.sync="showDetailDialog" width="700px">
      <div v-if="selectedMaintenance" class="maintenance-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="维护ID">{{ selectedMaintenance.maintenanceId }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ selectedMaintenance.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="维护类型">
            <el-tag :type="getMaintenanceTypeColor(selectedMaintenance.maintenanceType)">{{ selectedMaintenance.maintenanceType }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="维护状态">
            <el-tag :type="getStatusColor(selectedMaintenance.maintenanceStatus)">{{ selectedMaintenance.maintenanceStatus }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="计划日期">{{ selectedMaintenance.scheduledDate }}</el-descriptions-item>
          <el-descriptions-item label="实际日期">{{ selectedMaintenance.actualDate || '未开始' }}</el-descriptions-item>
          <el-descriptions-item label="技术员">{{ selectedMaintenance.technician }}</el-descriptions-item>
          <el-descriptions-item label="费用">¥{{ selectedMaintenance.cost }}</el-descriptions-item>
          <el-descriptions-item label="下次维护日期">{{ selectedMaintenance.nextMaintenanceDate }}</el-descriptions-item>
          <el-descriptions-item label="维护项目" :span="2">
            <el-tag v-for="item in selectedMaintenance.maintenanceItems" :key="item" style="margin-right: 8px; margin-bottom: 4px;">{{ item }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ selectedMaintenance.remarks }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 维护进度图表 -->
    <div class="chart-section" style="margin-top: 30px;">
      <el-card>
        <div slot="header">
          <span>维护费用趋势</span>
        </div>
        <div class="chart-placeholder">
          <p style="text-align: center; color: #909399; padding: 40px;">维护费用趋势图表（可集成 ECharts 等图表库）</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import mockData from '@/api/mockData/mockData.js'

export default {
  name: 'MaintenancePage',
  data () {
    return {
      maintenances: mockData.maintenanceData.maintenanceList,
      devices: mockData.equipmentData.equipmentList,
      filterStatus: '',
      filterType: '',
      searchKeyword: '',
      showAddMaintenanceDialog: false,
      showDetailDialog: false,
      selectedMaintenance: null,
      newMaintenance: {
        deviceId: '',
        maintenanceType: '',
        scheduledDate: '',
        technician: '',
        maintenanceItems: [],
        cost: 0,
        remarks: ''
      },
      maintenanceRules: {
        deviceId: [{ required: true, message: '请选择设备', trigger: 'change' }],
        maintenanceType: [{ required: true, message: '请选择维护类型', trigger: 'change' }],
        scheduledDate: [{ required: true, message: '请选择计划日期', trigger: 'change' }],
        technician: [{ required: true, message: '请输入技术员', trigger: 'blur' }],
        maintenanceItems: [{ required: true, message: '请选择维护项目', trigger: 'change' }],
        cost: [{ required: true, message: '请输入预估费用', trigger: 'blur' }]
      }
    }
  },
  computed: {
    totalMaintenances () {
      return this.maintenances.length
    },
    completedMaintenances () {
      return this.maintenances.filter(m => m.maintenanceStatus === '已完成').length
    },
    inProgressMaintenances () {
      return this.maintenances.filter(m => m.maintenanceStatus === '进行中').length
    },
    totalCost () {
      return this.maintenances.reduce((sum, m) => sum + m.cost, 0)
    },
    filteredMaintenances () {
      let filtered = this.maintenances

      if (this.filterStatus) {
        filtered = filtered.filter(m => m.maintenanceStatus === this.filterStatus)
      }

      if (this.filterType) {
        filtered = filtered.filter(m => m.maintenanceType === this.filterType)
      }

      if (this.searchKeyword) {
        filtered = filtered.filter(m =>
          m.deviceName.includes(this.searchKeyword) ||
          m.technician.includes(this.searchKeyword)
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
        未维护: 'info'
      }
      return colorMap[status] || 'info'
    },
    getMaintenanceTypeColor (type) {
      const colorMap = {
        定期保养: 'primary',
        故障维修: 'danger',
        电池更换: 'warning',
        大修: 'success'
      }
      return colorMap[type] || 'primary'
    },
    resetFilters () {
      this.filterStatus = ''
      this.filterType = ''
      this.searchKeyword = ''
    },
    viewMaintenanceDetail (maintenance) {
      this.selectedMaintenance = maintenance
      this.showDetailDialog = true
    },
    editMaintenance (maintenance) {
      this.$message.info('编辑功能开发中')
    },
    deleteMaintenance (maintenance) {
      this.$confirm('确认删除该维护计划吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.maintenances.findIndex(m => m.maintenanceId === maintenance.maintenanceId)
        if (index > -1) {
          this.maintenances.splice(index, 1)
          this.$message.success('删除成功')
        }
      })
    },
    submitMaintenance () {
      this.$refs.maintenanceForm.validate((valid) => {
        if (valid) {
          const device = this.devices.find(d => d.deviceId === this.newMaintenance.deviceId)
          const newMaintenanceData = {
            maintenanceId: 'MAINT' + String(Date.now()).slice(-3),
            deviceId: this.newMaintenance.deviceId,
            deviceName: device ? device.deviceName : '',
            maintenanceType: this.newMaintenance.maintenanceType,
            maintenanceStatus: '计划中',
            scheduledDate: this.formatDate(this.newMaintenance.scheduledDate),
            actualDate: null,
            technician: this.newMaintenance.technician,
            maintenanceItems: this.newMaintenance.maintenanceItems,
            cost: this.newMaintenance.cost,
            nextMaintenanceDate: this.calculateNextMaintenanceDate(this.newMaintenance.scheduledDate, this.newMaintenance.maintenanceType),
            remarks: this.newMaintenance.remarks
          }

          this.maintenances.unshift(newMaintenanceData)
          this.showAddMaintenanceDialog = false
          this.resetMaintenanceForm()
          this.$message.success('维护计划创建成功')
        }
      })
    },
    resetMaintenanceForm () {
      this.newMaintenance = {
        deviceId: '',
        maintenanceType: '',
        scheduledDate: '',
        technician: '',
        maintenanceItems: [],
        cost: 0,
        remarks: ''
      }
      this.$refs.maintenanceForm.resetFields()
    },
    formatDate (date) {
      if (!date) return ''
      const d = new Date(date)
      return d.getFullYear() + '-' +
             String(d.getMonth() + 1).padStart(2, '0') + '-' +
             String(d.getDate()).padStart(2, '0')
    },
    calculateNextMaintenanceDate (currentDate, type) {
      if (!currentDate) return ''
      const date = new Date(currentDate)

      // 根据维护类型计算下次维护时间
      const intervalMap = {
        定期保养: 30, // 30天
        故障维修: 60, // 60天
        电池更换: 90, // 90天
        大修: 120 // 120天
      }
      const interval = intervalMap[type] || 30
      date.setDate(date.getDate() + interval)

      return this.formatDate(date)
    }
  }
}
</script>

<style scoped>
.maintenance-page {
  padding: 20px;
}

/* 维护类型标签样式 */
.maintenance-type-tag {
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.maintenance-type-tag:hover {
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

.maintenance-detail {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

.chart-section {
  margin-top: 30px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 4px;
}

.el-card {
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>
