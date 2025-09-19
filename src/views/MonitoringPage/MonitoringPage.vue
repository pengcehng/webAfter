<script src="../../utils/MonitoringPage.js"></script>
<style src="../../assets/css/MonitoringPage.css"></style>
<template>
  <el-container style="height: 100vh;" class="fade-in-up">
    <!-- 顶部工具栏 -->
    <el-header style="padding: 15px 25px; background-color: #fff;" class="theme-card">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="logo-container">
            <i class="el-icon-video-camera-solid theme-primary" style="font-size: 28px; margin-right: 10px;"></i>
          </div>
        </el-col>
        <el-col :span="18" style="text-align: right;">
          <el-button-group>
            <el-button type="info" @click="refreshVideoList" :loading="loading" class="theme-button-primary btn-ripple hover-lift">
              <i class="el-icon-refresh"></i> 刷新视频列表
            </el-button>
          </el-button-group>
          <el-tag v-if="isLocalMode" type="success" style="margin-left: 10px;" class="status-indicator hover-lift">
            <i class="el-icon-folder"></i> 本地模式: {{ videoFolder }}
          </el-tag>
        </el-col>
      </el-row>
    </el-header>

    <!-- 主体内容 -->
    <el-main class="page-container fade-in-up delay-200">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container fade-in-up">
        <i class="el-icon-loading theme-primary" style="font-size: 40px;"></i>
        <p style="margin-top: 15px; font-size: 16px;" class="theme-text-secondary">加载中...</p>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-else-if="monitorUrls.length === 0"
        description="暂无视频数据"
        :image-size="200"
        class="fade-in-up">
      </el-empty>

      <!-- 视频网格 -->
      <div v-if="!loading && monitorUrls.length > 0" class="video-grid fade-in-up delay-400">
        <transition-group name="fade-list" tag="div" class="video-container-grid">
          <el-card
            shadow="hover"
            class="video-card theme-card hover-lift floating-card"
            :body-style="{padding: '0px'}"
            v-for="(monitor, index) in displayedVideos"
            :key="`video-${index}`">
              <div class="card-content">
            <!-- 视频标题 -->
            <div class="video-card-header theme-card">
              <div class="video-title">
                <i class="el-icon-video-camera theme-primary" style="margin-right: 5px;"></i>
                <span class="video-name theme-text-primary">{{ monitor.monName }}</span>
              </div>
              <el-tag size="small" :type="isLocalMode ? 'success' : 'info'" effect="dark" class="status-indicator hover-lift">
                <i :class="isLocalMode ? 'el-icon-folder' : 'el-icon-connection'"></i>
                {{ isLocalMode ? '本地视频' : '在线视频' }}
              </el-tag>
            </div>

            <!-- 视频播放器 -->
            <div class="video-container">
              <div class="video-wrapper hover-lift">
                <!-- 状态指示器 -->
                <div class="status-indicator" :class="{
                  'status-online': monitor.status === 'online',
                  'status-offline': monitor.status === 'offline',
                  'status-maintenance': monitor.status === 'maintenance'
                }"></div>

                <video
                  :ref="el => { if (el) videoRefs[`videoRef${index}`] = el }"
                  :src="monitor.monList"
                  controls
                  autoplay
                  loop
                  muted
                  class="main-video"
                  :poster="getVideoPoster(monitor.status)"
                ></video>

                <!-- 监控信息覆盖层 -->
                <div class="video-overlay">
                  <div class="video-location theme-card">
                    <i class="el-icon-location"></i> {{ monitor.monLocation || '未知位置' }}
                  </div>
                  <div class="video-quality theme-card" :class="getQualityClass(monitor.qualityScore)">
                    <i class="el-icon-data-analysis"></i> 画质: {{ monitor.qualityScore || 'N/A' }}
                  </div>
                </div>

                <!-- 设备信息显示 -->
                <div class="device-info theme-card" v-if="monitor.deviceId">
                  <span class="device-id theme-text-primary">{{ monitor.deviceId }}</span>
                  <span class="resolution theme-text-secondary" v-if="monitor.resolution">{{ monitor.resolution }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="video-actions">
              <div class="action-buttons">
                <el-tooltip content="开始录像" placement="top" :disabled="isRecording && recordingIndex === index">
                  <el-button
                    type="primary"
                    size="small"
                    circle
                    @click="startRecording(index)"
                    :disabled="isRecording && recordingIndex === index">
                    <i class="el-icon-video-camera"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip content="停止录像" placement="top" :disabled="!isRecording || recordingIndex !== index">
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="stopRecording"
                    :disabled="!isRecording || recordingIndex !== index">
                    <i class="el-icon-video-pause"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip content="下载原始视频" placement="top">
                  <el-button
                    type="success"
                    size="small"
                    circle
                    @click="downloadVideo(monitor.monList)">
                    <i class="el-icon-download"></i>
                  </el-button>
                </el-tooltip>
              </div>
            </div>

            <!-- 录制的视频列表 -->
            <div v-if="recordedVideos[index] && recordedVideos[index].length > 0" class="recorded-videos">
              <el-divider content-position="center">
                <i class="el-icon-video-camera-solid" style="margin-right: 8px; color: #667eea;"></i>
                <span style="color: #4a5568; font-weight: 600;">录制的视频</span>
              </el-divider>

              <el-row :gutter="16">
                <el-col :span="24" v-for="(videoUrl, videoIndex) in recordedVideos[index]" :key="videoIndex" style="margin-bottom: 16px;">
                  <div class="recorded-video-item">
                    <video
                      :src="videoUrl"
                      controls
                      class="recorded-video"
                      preload="metadata"
                    ></video>
                    <div class="recorded-video-actions">
                      <div class="video-meta">
                        <span class="recorded-video-label">
                          <i class="el-icon-video-camera" style="margin-right: 4px;"></i>
                          录制片段 #{{ videoIndex + 1 }}
                        </span>
                        <span class="record-time" style="font-size: 0.75rem; color: #94a3b8;">
                          {{ new Date().toLocaleString() }}
                        </span>
                      </div>
                      <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="downloadRecordedVideo(videoUrl, index, videoIndex)"
                        style="border-radius: 0.5rem;">
                        <i class="el-icon-download"></i> 下载
                      </el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
              </div>
            </el-card>
        </transition-group>
      </div>
    </el-main>

    <!-- 底部页脚 -->
    <el-footer v-if="monitorUrls.length > 0">
      <div class="footer-content">
        <div class="footer-left">
          <span>视频 | 共 {{ totalVideos }} 个视频</span>
        </div>
        <div class="footer-center">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            :total="totalVideos"
            @current-change="handleCurrentChange"
            background
            class="pagination"
          />
        </div>
        <div class="footer-right">
          <span>© {{ new Date().getFullYear() }} 视频</span>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px 0;
}

.card-content {
  padding: 0;
}

.video-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.video-title {
  display: flex;
  align-items: center;
  font-weight: 500;
  max-width: 70%;
}

.video-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-container {
  margin-bottom: 0;
  padding: 15px 20px 0;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
}

.main-video {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 允许点击穿透到视频 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%);
  z-index: 1;
}

.video-location {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 5px;
}

.video-quality {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 5px;
}

.quality-good {
  color: #67C23A;
}

.quality-medium {
  color: #E6A23C;
}

.quality-poor {
  color: #F56C6C;
}

.video-actions {
  display: flex;
  justify-content: center;
  padding: 15px 20px;
  background-color: #fafafa;
  border-top: 1px solid #ebeef5;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.recorded-videos {
  margin-top: 0;
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
}

.recorded-video {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.recorded-video-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fafafa;
}

.recorded-video-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
}

.recorded-video-label {
  font-size: 13px;
  color: #606266;
}

.footer-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}

.footer-left, .footer-right {
  font-size: 12px;
  flex: 1;
}

.footer-center {
  flex: 2;
  text-align: center;
}

.footer-left {
  text-align: left;
}

.footer-right {
  text-align: right;
}

.pagination {
  margin: 0;
  display: inline-block;
}

.video-grid {
  width: 100%;
}

/* 过渡动画效果 */
.fade-list-enter-active, .fade-list-leave-active {
  transition: all 0.5s;
}

.fade-list-enter, .fade-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-list-move {
  transition: transform 0.5s;
}
</style>
