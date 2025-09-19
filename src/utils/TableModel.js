// 分页切换处理
export const handlePageChange = (page) => {
  this.currentPage = page
  this.fetchData()
}

// 每页条数变更处理
export const handlePageSizeChange = (size) => {
  this.pageSize = size
  this.currentPage = 1 // 重置页码为第一页
  this.fetchData()
}

// 搜索处理
export const handleSearch = () => {
  this.currentPage = 1 // 重置页码为第一页
  this.fetchData()
}

// 重置处理
export const handleReset = () => {
  this.queryForm.dateRange = ''
  this.queryForm.name = ''
  this.currentPage = 1 // 重置页码为第一页
  this.fetchData()
}