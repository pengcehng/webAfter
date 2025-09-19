import { alarmAPI } from '../api/apiService'

export default {
  name: 'AlarmPage',
  data() {
    return {
      activeIndex2: '6', // 设置默认激活的菜单项
      // 报警数据
      tableData: [],
      filteredTableData: [],
      // 查询表单
      queryForm: {
        alarmType: '',
        severity: '',
        status: '',
        dateRange: []
      },
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 对话框相关
      dialogVisible: false,
      dialogTitle: '报警详情',
      currentAlarm: {},
      // 严重程度选项
      severityOptions: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ],
      // 状态选项
      statusOptions: [
        { label: '未处理', value: 'pending' },
        { label: '处理中', value: 'processing' },
        { label: '已解决', value: 'resolved' },
        { label: '已忽略', value: 'ignored' }
      ],
      // 报警类型选项
      alarmTypeOptions: [
        { label: '设备离线', value: '设备离线' },
        { label: '存储空间不足', value: '存储空间不足' },
        { label: '网络延迟', value: '网络延迟' },
        { label: '画质异常', value: '画质异常' },
        { label: '录像中断', value: '录像中断' },
        { label: '温度异常', value: '温度异常' },
        { label: '入侵检测', value: '入侵检测' }
      ]
    }
  },
  mounted() {
    this.$emit('componentRendered');
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await alarmAPI.getAlarmList({
          page: this.currentPage,
          pageSize: this.pageSize,
          alarmType: this.queryForm.alarmType,
          severity: this.queryForm.severity,
          status: this.queryForm.status,
          startDate: this.queryForm.dateRange && this.queryForm.dateRange[0] ? this.queryForm.dateRange[0].toISOString() : null,
          endDate: this.queryForm.dateRange && this.queryForm.dateRange[1] ? this.queryForm.dateRange[1].toISOString() : null
        })
        this.tableData = response.data.data
        this.filteredTableData = response.data.data
        this.total = response.data.total
        this.$message.success('数据加载成功')
      } catch (error) {
        console.error('获取报警数据失败:', error)
        this.$message.error('获取报警数据失败')
      }
    },
    // 查询功能
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    // 重置查询
    handleReset() {
      this.queryForm = {
        alarmType: '',
        severity: '',
        status: '',
        dateRange: []
      };
      this.currentPage = 1
      this.fetchData()
      this.$message.info('查询条件已重置');
    },
    // 更新过滤数据
    updateFilteredData() {
      let filtered = [...this.tableData];
      
      // 按报警类型过滤
      if (this.queryForm.alarmType) {
        filtered = filtered.filter(item => 
          item.type === this.queryForm.alarmType
        );
      }
      
      // 按严重程度过滤
      if (this.queryForm.severity) {
        filtered = filtered.filter(item => 
          item.severity === this.queryForm.severity
        );
      }
      
      // 按状态过滤
      if (this.queryForm.status) {
        filtered = filtered.filter(item => 
          item.status === this.queryForm.status
        );
      }
      
      // 按日期范围过滤
      if (this.queryForm.dateRange && this.queryForm.dateRange.length === 2) {
        const [startDate, endDate] = this.queryForm.dateRange;
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
      }
      
      this.filteredTableData = filtered;
      this.total = filtered.length;
      this.currentPage = 1;
    },
    // 查看详情
    handleView(row) {
      this.dialogTitle = '报警详情';
      this.currentAlarm = { ...row };
      this.dialogVisible = true;
    },
    // 处理报警
    async handleProcess(row) {
      this.$confirm('确认处理该报警吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await alarmAPI.updateAlarm(row.id, {
            ...row,
            status: 'processing'
          })
          this.$message.success('报警已标记为处理中')
          this.fetchData()
        } catch (error) {
          console.error('处理报警失败:', error)
          this.$message.error('处理报警失败')
        }
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    // 解决报警
    async handleResolve(row) {
      this.$confirm('确认解决该报警吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async () => {
        try {
          await alarmAPI.updateAlarm(row.id, {
            ...row,
            status: 'resolved',
            resolvedTime: new Date().toISOString()
          })
          this.$message.success('报警已解决')
          this.fetchData()
        } catch (error) {
          console.error('解决报警失败:', error)
          this.$message.error('解决报警失败')
        }
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    // 忽略报警
    async handleIgnore(row) {
      this.$confirm('确认忽略该报警吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        try {
          await alarmAPI.updateAlarm(row.id, {
            ...row,
            status: 'ignored'
          })
          this.$message.success('报警已忽略')
          this.fetchData()
        } catch (error) {
          console.error('忽略报警失败:', error)
          this.$message.error('忽略报警失败')
        }
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    // 获取严重程度标签类型
    getSeverityType(severity) {
      const typeMap = {
        'high': 'danger',
        'medium': 'warning',
        'low': 'info'
      };
      return typeMap[severity] || 'info';
    },
    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        'pending': 'danger',
        'processing': 'warning',
        'resolved': 'success',
        'ignored': 'info'
      };
      return typeMap[status] || 'info';
    },
    // 获取状态文本
    getStatusText(status) {
      const textMap = {
        'pending': '未处理',
        'processing': '处理中',
        'resolved': '已解决',
        'ignored': '已忽略'
      };
      return textMap[status] || status;
    },
    // 分页相关
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchData()
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.fetchData()
    }
  },
  computed: {
    // 当前页显示的数据
    displayedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTableData.slice(start, end);
    }
  }
};