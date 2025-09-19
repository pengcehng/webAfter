<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式重置和基础设计系统 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: #f8fafc;
  color: #2d3748;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  overflow: hidden;
}

/* 统一的设计令牌 */
:root {
  /* 主色调 */
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --primary-light: #dbeafe;

  /* 成功色 */
  --success-color: #10b981;
  --success-hover: #059669;
  --success-light: #d1fae5;

  /* 警告色 */
  --warning-color: #f59e0b;
  --warning-hover: #d97706;
  --warning-light: #fef3c7;

  /* 危险色 */
  --danger-color: #ef4444;
  --danger-hover: #dc2626;
  --danger-light: #fee2e2;

  /* 中性色 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: var(--radius-md);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-400);
}

/* 通用动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Element UI 组件样式覆盖 */
.el-card {
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.el-button {
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-button--primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.el-button--primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.el-input__inner {
  border-radius: var(--radius-md);
  border-color: var(--gray-300);
  transition: all 0.2s ease;
}

.el-input__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.el-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.el-table th {
  background-color: var(--gray-50);
  color: var(--gray-700);
  font-weight: 600;
}
</style>
