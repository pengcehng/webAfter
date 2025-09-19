<style src="../../assets/css/LoginPage.css"></style>
<script src="../../utils/LoginPage.js"></script>
<template>
  <div class="login-container fade-in-up">
    <div class="login-box theme-card scale-in">
      <h2 class="login-title theme-text-primary">{{ isRegister ? '注册' : '登录' }}</h2>
      <form @submit.prevent="handleSubmit" class="fade-in-up delay-200">
        <div class="input-group" v-if="isRegister">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" required class="theme-input hover-lift" />
        </div>
        <div class="input-group" v-if="isRegister">
          <label for="phone">手机号</label>
          <input type="tel" id="phone" v-model="phone" required class="theme-input hover-lift" />
        </div>
        <div class="input-group" v-if="isRegister">
          <label for="verificationCode">验证码</label>
          <input type="text" id="verificationCode" v-model="verificationCode" required class="theme-input hover-lift" />
          <button type="button" class="verification-code-btn" @click="sendVerificationCode">发送验证码</button>
        </div>
        <div class="input-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="email" required class="theme-input hover-lift" />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" required class="theme-input hover-lift" />
        </div>
        <button type="submit" class="submit-btn theme-button-primary btn-ripple hover-lift">{{ isRegister ? '注册' : '登录' }}</button>
      </form>
      

      
      <p class="switch-form fade-in-up delay-600">
        <a href="#" @click.prevent="toggleForm" class="theme-primary hover-lift">{{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}</a>
      </p>
    </div>
  </div>
</template>
