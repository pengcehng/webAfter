// src/router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import EquipmentPage from '@/views/EquipmentPage/EquipmentPage.vue'
import MonitoringPage from '@/views/MonitoringPage/MonitoringPage.vue'
import VideoPage from '@/views/VideoPage/VideoPage.vue'
import StatePage from '@/views/StatePage/StatePage.vue'
import AlarmPage from '@/views/AlarmPage/AlarmPage.vue'
import LoginPage from '@/views/LoginPage/LoginPage.vue'
import DataStatisticesPage from '@/views/DataStatisticesPage/DataStatisticesPage.vue'
import MainPage from '@/views/MainPage/MainPage.vue'
import CleaningTaskPage from '@/views/CleaningTaskPage/CleaningTaskPage.vue'
import MaintenancePage from '@/views/MaintenancePage/MaintenancePage.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage // 设置为根路径
  },
  {
    path: '/MainPage', // 子路径，建议添加斜杠以符合路由规范
    name: 'MainPage',
    component: MainPage,
    redirect: '/MainPage/EquipmentPage', // 默认重定向到设备管理页面
    children: [
      {
        path: 'EquipmentPage',
        name: 'EquipmentPage',
        component: EquipmentPage
      },
      {
        path: 'MonitoringPage',
        name: 'MonitoringPage',
        component: MonitoringPage
      },
      {
        path: 'VideoPage',
        name: 'VideoPage',
        component: VideoPage
      },
      {
        path: 'CleaningTaskPage',
        name: 'CleaningTaskPage',
        component: CleaningTaskPage
      },
      {
        path: 'MaintenancePage',
        name: 'MaintenancePage',
        component: MaintenancePage
      },
      {
        path: 'StatePage',
        name: 'StatePage',
        component: StatePage
      },
      {
        path: 'AlarmPage',
        name: 'AlarmPage',
        component: AlarmPage
      },
      {
        path: 'DataStatisticesPage',
        name: 'DataStatisticesPage',
        component: DataStatisticesPage
      }
    ]
  }
]

const router = new Router({
  mode: 'hash',
  routes
})

export default router
