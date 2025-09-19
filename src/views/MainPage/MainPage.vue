<script>
import MainPageMixin from '../../utils/MainPage.js'

export default {
  mixins: [MainPageMixin]
}
</script>

<style src="../../assets/css/MainPage.css"></style>

<style scoped>
/* 页面加载动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.el-main {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  animation: fadeInUp 0.8s ease-out;
}

.el-main.with-background {
  background-image: url('../../assets/main-background.svg');
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.el-main.with-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  backdrop-filter: blur(2px);
  pointer-events: none;
  animation: shimmer 3s ease-in-out infinite;
}

/* 容器动画 */
.el-container {
  animation: fadeInUp 1s ease-out;
}

/* 头部动画 */
.el-header {
  animation: slideInLeft 0.8s ease-out;
  transition: all 0.3s ease;
}

.el-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

/* 菜单项动画 */
.menu-container {
  animation: slideInLeft 1s ease-out 0.2s both;
}

/* 头像容器动画 */
.avatar-container {
  animation: slideInRight 1s ease-out 0.4s both;
  position: relative;
  margin-right: 20px;
}

.avatar-container .el-avatar {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: float 3s ease-in-out infinite;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.avatar-container .el-avatar:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%) border-box;
}

.avatar-container::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  animation: avatarPulse 2s infinite;
}

.avatar-container:hover::before {
  opacity: 0.3;
}

@keyframes avatarPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
}

/* 对话框动画 */
.el-dialog {
  animation: fadeInUp 0.5s ease-out;
}

.el-dialog__wrapper {
  backdrop-filter: blur(5px);
}

/* 表单动画 */
@keyframes formItemSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes inputFocus {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(102, 126, 234, 0);
  }
}

.el-form-item {
  animation: formItemSlideIn 0.6s ease-out;
  animation-delay: calc(var(--item-index, 0) * 0.1s);
}

.el-form-item:nth-child(1) { --item-index: 1; }
.el-form-item:nth-child(2) { --item-index: 2; }
.el-form-item:nth-child(3) { --item-index: 3; }
.el-form-item:nth-child(4) { --item-index: 4; }
.el-form-item:nth-child(5) { --item-index: 5; }

.el-input__wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.el-input__wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.el-input__wrapper:focus-within::before {
  left: 100%;
}

.el-input__wrapper:focus-within {
  animation: inputFocus 0.6s ease-out;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
}

.el-form-item:nth-child(1) { animation-delay: 0.1s; }
.el-form-item:nth-child(2) { animation-delay: 0.2s; }
.el-form-item:nth-child(3) { animation-delay: 0.3s; }
.el-form-item:nth-child(4) { animation-delay: 0.4s; }
.el-form-item:nth-child(5) { animation-delay: 0.5s; }

.el-form-item:hover {
  transform: translateX(5px);
}

/* 输入框动画 */
.el-input {
  transition: all 0.3s ease;
}

.el-input:hover {
  transform: scale(1.02);
}

.el-input__inner:focus {
  animation: pulse 0.6s ease-in-out;
}

/* 按钮动画 */
@keyframes buttonRipple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes buttonGlow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  }
}

@keyframes buttonShine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.el-button {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.el-button:hover::before {
  animation: buttonShine 0.6s ease;
}

.el-button:hover {
  transform: translateY(-3px) scale(1.05);
  animation: buttonGlow 1.5s ease-in-out infinite;
}

.el-button:active {
  transform: translateY(-1px) scale(1.02);
}

.el-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.el-button:hover::before {
  left: 100%;
}

/* 头像上传器动画 */
@keyframes uploadBorderDash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
}

@keyframes uploadIconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-10px) scale(1.1);
  }
  60% {
    transform: translateY(-5px) scale(1.05);
  }
}

@keyframes uploadGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(64, 158, 255, 0.3), 0 0 10px rgba(64, 158, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(64, 158, 255, 0.6), 0 0 30px rgba(64, 158, 255, 0.4);
  }
}

/* 用户信息对话框样式 */
.user-info-dialog .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.user-info-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
}

.user-info-dialog .el-dialog__title {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.user-info-dialog .el-dialog__headerbtn .el-dialog__close {
  color: white;
  font-size: 20px;
}

.user-info-dialog .el-dialog__body {
  padding: 0;
}

.user-info-dialog .user-info {
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  background: white;
}
.user-info {
  padding: 20px;
  min-width: 320px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.95) 50%, 
    rgba(240, 245, 251, 0.92) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: popoverFadeIn 0.3s ease-out;
}

.user-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px 16px 0 0;
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-details {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.user-detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.user-detail-item:hover {
  background: rgba(103, 126, 234, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 4px -12px 8px -12px;
}

.user-detail-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  margin-right: 12px;
  font-size: 14px;
  flex-shrink: 0;
}

.user-detail-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.user-detail-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
  font-weight: 500;
}

.user-detail-value {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.user-details p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.user-details strong {
  color: #303133;
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.user-action-btn {
  flex: 1;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.user-action-btn.theme-button-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-action-btn.theme-button-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.user-action-btn.theme-button-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.user-action-btn.theme-button-danger:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e53e3e 100%);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.user-action-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.user-action-btn:hover:before {
  left: 100%;
}

.theme-button-danger {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  border: 1px solid #f56c6c;
  color: white;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

.theme-button-danger:hover {
  background: linear-gradient(135deg, #f78989 0%, #f56c6c 100%);
  border-color: #f78989;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
  transform: translateY(-1px);
}

.theme-button-danger:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
}
.theme-upload .el-upload {
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.8s ease-out;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-upload .el-upload::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 12px;
  background: linear-gradient(45deg, #409EFF, #67C23A, #E6A23C, #F56C6C);
  background-size: 300% 300%;
  animation: backgroundShift 3s ease infinite;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-upload .el-upload:hover {
  border-color: #409EFF;
  transform: scale(1.08) rotate(2deg);
  animation: uploadGlow 2s ease-in-out infinite;
}

.theme-upload .el-upload:hover::before {
  opacity: 1;
}

.avatar-uploader-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

.avatar-uploader-icon-container:hover {
  transform: scale(1.1);
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  margin-bottom: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: uploadIconBounce 2s ease-in-out infinite;
}

.upload-text {
  font-size: 12px;
  color: #8c939d;
  font-weight: 500;
  transition: color 0.3s ease;
}

.theme-upload .el-upload:hover .upload-text {
  color: #409EFF;
}

.theme-upload .el-upload:hover .avatar-uploader-icon {
  color: #409EFF;
  animation: uploadIconBounce 1s ease-in-out infinite;
}

.avatar {
  width: 178px;
  height: 178px;
  border-radius: 12px;
  object-fit: cover;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 主题按钮样式 */
.theme-button-secondary {
  background: linear-gradient(135deg, #909399 0%, #b3b6bb 100%);
  border: 1px solid #909399;
  color: white;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(144, 147, 153, 0.3);
}

.theme-button-secondary:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.theme-button-secondary:hover {
  background: linear-gradient(135deg, #b3b6bb 0%, #909399 100%);
  border-color: #b3b6bb;
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.4);
  transform: translateY(-1px);
}

.theme-button-secondary:hover:before {
  left: 100%;
}

.theme-button-secondary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(144, 147, 153, 0.3);
}

.avatar-uploader-icon:hover {
  color: #409EFF;
  animation: uploadIconBounce 1.2s ease-in-out infinite;
  transform: scale(1.1);
}

.avatar-uploader-icon:hover::before {
  width: 100px;
  height: 100px;
}

/* 弹出框动画 */
@keyframes popoverSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dialogBounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-50px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(0);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes routerViewFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.el-popover {
  animation: popoverSlideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.el-dialog {
  animation: dialogBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.el-dialog__wrapper {
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.3);
}

.router-view {
  animation: routerViewFadeIn 0.8s ease-out;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* 弹出框内容动画 */
.el-popover {
  animation: fadeInUp 0.3s ease-out;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* 路由视图动画 */
.router-view {
  animation: fadeInUp 0.8s ease-out;
}
</style>
<template>
  <el-container style="height: 100vh;" class="fade-in-up">
    <!-- 顶部菜单 -->
    <el-header class="theme-navbar">
      <div class="menu-container">
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo theme-navbar"
          mode="horizontal"
          @select="handleSelect"
          background-color="transparent"
          text-color="rgba(255, 255, 255, 0.9)"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/MainPage/EquipmentPage" class="theme-navbar-item hover-lift">摄像头清洁设备管理</el-menu-item>
          <el-menu-item index="/MainPage/CleaningTaskPage" class="theme-navbar-item hover-lift">
            清洁任务管理
          </el-menu-item>
          <el-menu-item index="/MainPage/MaintenancePage" class="theme-navbar-item hover-lift">
            维护保养
          </el-menu-item>
          <el-menu-item index="/MainPage/MonitoringPage" class="theme-navbar-item hover-lift">
            实时监控
          </el-menu-item>
          <el-menu-item index="/MainPage/VideoPage" class="theme-navbar-item hover-lift">
            视频管理
          </el-menu-item>
          <el-menu-item index="/MainPage/DataStatisticesPage" class="theme-navbar-item hover-lift">
            数据统计
          </el-menu-item>
        </el-menu>
      </div>
      <div class="avatar-container">
        <el-avatar :size="50" :src="circleUrl" @click="showUserDialog = true"></el-avatar>
      </div>

      <!-- 用户信息对话框 -->
      <el-dialog
        title="用户信息"
        :visible.sync="showUserDialog"
        width="400px"
        center
        :before-close="handleCloseUserDialog"
        class="user-info-dialog"
      >
        <div class="user-info theme-card">
          <div class="user-details">
            <div class="user-detail-item">
              <i class="el-icon-user user-detail-icon"></i>
              <div class="user-detail-content">
                <span class="user-detail-label">用户名</span>
                <span class="user-detail-value">{{ editForm.username }}</span>
              </div>
            </div>
            <div class="user-detail-item">
              <i class="el-icon-message user-detail-icon"></i>
              <div class="user-detail-content">
                <span class="user-detail-label">邮箱</span>
                <span class="user-detail-value">{{ userInfo.email }}</span>
              </div>
            </div>
            <div class="user-detail-item">
              <i class="el-icon-s-custom user-detail-icon"></i>
              <div class="user-detail-content">
                <span class="user-detail-label">角色</span>
                <span class="user-detail-value">{{ userInfo.role }}</span>
              </div>
            </div>
          </div>
          <div class="user-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="showEditForm = true; showUserDialog = false" 
              class="theme-button-primary btn-ripple hover-lift user-action-btn"
              icon="el-icon-edit"
            >
              编辑信息
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleLogout" 
              class="theme-button-danger btn-ripple hover-lift user-action-btn"
              icon="el-icon-switch-button"
            >
              退出登录
            </el-button>
          </div>
        </div>
      </el-dialog>
    </el-header>
    <el-main :class="{'with-background page-container fade-in-up delay-200': !hasChildComponent}">
      <router-view @componentRendered="handleComponentRendered"></router-view>
    </el-main>

    <!-- 编辑信息弹出表单 -->
    <el-dialog
      title="修改用户信息"
      v-model="showEditForm"
      width="30%"
      class="theme-modal scale-in"
    >
      <el-form :model="editForm" :rules="rules" ref="editForm" class="fade-in-up">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" class="theme-input hover-lift"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" style="width: 60%; margin-right: 10px;" class="theme-input hover-lift"></el-input>
          <el-button type="primary" @click="sendVerificationCode" :disabled="verificationCodeSent" class="theme-button-primary btn-ripple">
            {{ verificationCodeSent ? '已发送' : '发送验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item label="短信验证码" prop="verificationCode">
          <el-input v-model="editForm.verificationCode" class="theme-input hover-lift"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="passwordRules">
          <el-input type="password" v-model="editForm.password" class="theme-input hover-lift"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader theme-upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar hover-lift">
            <div v-else class="avatar-uploader-icon-container">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <span class="upload-text">点击上传头像</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditForm = false" class="theme-button-secondary btn-ripple hover-lift">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')" class="theme-button-primary btn-ripple hover-lift">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
