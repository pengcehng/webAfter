<template>
  <div class="video-page fade-in-up">
    <!-- 搜索表单 -->
    <el-card class="theme-card fade-in-up delay-200">
      <el-form :model="queryForm" ref="queryForm" :inline="true" class="search-form">
        <el-form-item label="设备ID">
          <el-input 
            v-model="queryForm.deviceId" 
            placeholder="请输入设备ID" 
            clearable
            style="width: 200px;"
            class="theme-input hover-lift"
          />
        </el-form-item>
        <el-form-item label="文件名">
          <el-input 
            v-model="queryForm.fileName" 
            placeholder="请输入文件名" 
            clearable
            style="width: 200px;"
            class="theme-input hover-lift"
          />
        </el-form-item>
        <el-form-item label="录制时间">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 350px;"
            class="hover-lift"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading" class="theme-button-primary btn-ripple hover-lift">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="handleReset" class="btn-ripple hover-lift">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 视频列表 -->
    <el-card class="theme-card fade-in-up delay-400">
      <div slot="header" class="card-header">
        <span class="card-title theme-text-primary">
          <i class="el-icon-video-camera theme-primary"></i> 本地视频列表
        </span>
        <div class="header-actions">
          <el-button 
            type="success" 
            size="small" 
            @click="refreshData"
            :loading="loading"
            class="btn-ripple hover-lift"
          >
            <i class="el-icon-refresh"></i> 刷新
          </el-button>
        </div>
      </div>
      
      <el-table 
        :data="tableData" 
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
        class="theme-table custom-scrollbar"
        height="600"
        :default-sort="{prop: 'recordTime', order: 'descending'}"
      >
        <el-table-column prop="fileName" label="文件名" min-width="250" show-overflow-tooltip fixed="left">
          <template slot-scope="scope">
            <div class="file-info">
              <i class="el-icon-video-play file-icon theme-primary"></i>
              <span class="file-name theme-text-primary">{{ scope.row.fileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceId" label="设备ID" width="120" show-overflow-tooltip />
        <el-table-column prop="deviceName" label="设备名称" width="180" show-overflow-tooltip />
        <el-table-column prop="location" label="安装位置" width="150" show-overflow-tooltip />
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="fileSize" label="文件大小" width="120" />
        <el-table-column prop="quality" label="画质" width="80">
          <template slot-scope="scope">
            {{ scope.row.quality }}
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" label="录制时间" width="160" sortable />
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="mini" 
                class="action-btn preview-btn theme-button-primary btn-ripple hover-lift"
                @click="handlePreview(scope.row)"
                icon="el-icon-view"
              >
                预览
              </el-button>
              <el-button 
                type="success" 
                size="mini" 
                class="action-btn download-btn theme-button-success btn-ripple hover-lift"
                @click="handleDownload(scope.row)"
                icon="el-icon-download"
              >
                下载
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container theme-card fade-in-up delay-600">
        <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          class="hover-lift"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 视频预览对话框 -->
    <el-dialog 
      title="视频预览" 
      :visible.sync="previewDialogVisible" 
      width="80%"
      :before-close="handleClosePreview"
      class="theme-modal scale-in"
    >
      <div class="video-preview-container fade-in-up">
        <video 
          v-if="currentVideo"
          ref="videoPlayer"
          :src="currentVideo.filePath"
          controls
          width="100%"
          height="400"
          :poster="getVideoPoster()"
          class="hover-lift"
        >
          您的浏览器不支持视频播放。
        </video>
        <div v-if="currentVideo" class="video-info theme-card">
          <h4 class="theme-text-primary">{{ currentVideo.fileName }}</h4>
          <p><strong class="theme-text-secondary">设备:</strong> {{ currentVideo.deviceName }} ({{ currentVideo.deviceId }})</p>
          <p><strong class="theme-text-secondary">位置:</strong> {{ currentVideo.location }}</p>
          <p><strong class="theme-text-secondary">录制时间:</strong> {{ currentVideo.recordTime }}</p>
          <p><strong class="theme-text-secondary">时长:</strong> {{ currentVideo.duration }}</p>
          <p><strong class="theme-text-secondary">文件大小:</strong> {{ currentVideo.fileSize }}</p>
          <p><strong class="theme-text-secondary">分辨率:</strong> {{ currentVideo.resolution }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script src="../../utils/VideoPage.js"></script>
<style src="../../assets/css/VideoPage.css"></style>