import { authAPI } from '../api/apiService'

export default {
  data () {
    return {
      isRegister: false,
      username: '',
      email: '',
      password: '',
      phone: '',
      verificationCode: '',
      loading: false,
      sendingCode: false
    }
  },
  methods: {
    handleSubmit () {
      if (this.isRegister) {
        this.handleRegister()
      } else {
        this.handleLogin()
      }
    },
    async handleRegister () {
      try {
        // 验证必填字段
        if (!this.username || !this.email || !this.password || !this.phone || !this.verificationCode) {
          this.$message.error('请填写完整信息')
          return
        }
        
        this.loading = true
        
        const response = await authAPI.register({
          username: this.username,
          email: this.email,
          password: this.password,
          phone: this.phone,
          verificationCode: this.verificationCode
        })
        
        if (response.data.success) {
          this.$message.success('注册成功')
          this.isRegister = false
          // 清空表单
          this.username = ''
          this.email = ''
          this.password = ''
          this.phone = ''
          this.verificationCode = ''
        } else {
          this.$message.error(response.data.message || '注册失败')
        }
      } catch (error) {
        console.error('注册失败:', error)
        this.$message.error('注册失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    async handleLogin () {
      try {
        // 验证必填字段
        if (!this.email || !this.password) {
          this.$message.error('请输入邮箱和密码')
          return
        }
        
        this.loading = true
        
        // 检查是否为测试账号，进行前端验证
        if (this.isTestAccount(this.email, this.password)) {
          this.handleTestAccountLogin()
          return
        }
        
        // 普通账号通过后端API验证
        const response = await authAPI.login({
          email: this.email,
          password: this.password
        })
        
        if (response.data.success) {
          // 保存token到localStorage
          localStorage.setItem('token', response.data.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.data.user))
          localStorage.removeItem('isTestAccount') // 确保清除测试账号标记
          
          this.$message.success('登录成功')
          this.navigateToMainPage()
        } else {
          this.$message.error(response.data.message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请检查您的用户名和密码')
      } finally {
        this.loading = false
      }
    },
    toggleForm () {
      this.isRegister = !this.isRegister
      this.username = ''
      this.email = ''
      this.password = ''
      this.phone = ''
      this.verificationCode = ''
    },
    async quickLogin (accountType) {
      try {
        this.loading = true
        
        let testAccount
        if (accountType === 'admin') {
          testAccount = {
            username: '管理员',
            password: 'admin123',
            email: 'admin@test.com',
            role: '管理员'
          }
        } else if (accountType === 'user') {
          testAccount = {
            username: '普通用户',
            password: 'user123',
            email: 'user@test.com',
            role: '用户'
          }
        } else {
          testAccount = {
            username: '测试用户',
            password: 'test123',
            email: 'test@test.com',
            role: '测试员'
          }
        }
        
        // 模拟生成测试token
        const testToken = this.generateTestToken(testAccount)
        
        // 创建测试用户信息
        const testUser = {
          id: `test_${accountType}_001`,
          username: testAccount.username,
          email: testAccount.email,
          role: testAccount.role,
          permissions: accountType === 'admin' ? ['all'] : ['monitoring:view'],
          loginTime: new Date().toISOString()
        }
        
        // 保存到localStorage
        localStorage.setItem('token', testToken)
        localStorage.setItem('user', JSON.stringify(testUser))
        localStorage.setItem('isTestAccount', 'true')
        
        this.$message.success(`${testAccount.username}登录成功`)
        this.navigateToMainPage()
        
      } catch (error) {
        console.error('快速登录失败:', error)
        this.$message.error('快速登录失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    async quickTestLogin () {
      try {
        this.loading = true
        
        // 前端验证测试账号逻辑
        const testAccount = {
          username: '测试用户',
          password: 'test123',
          email: 'test@test.com',
          role: '测试员'
        }
        
        // 模拟生成测试token
        const testToken = this.generateTestToken(testAccount)
        
        // 创建测试用户信息
        const testUser = {
          id: 'test_user_001',
          username: testAccount.username,
          email: testAccount.email,
          role: testAccount.role,
          permissions: ['monitoring:view'],
          loginTime: new Date().toISOString()
        }
        
        // 保存到localStorage
        localStorage.setItem('token', testToken)
        localStorage.setItem('user', JSON.stringify(testUser))
        localStorage.setItem('isTestAccount', 'true')
        
        this.$message.success('测试账号登录成功')
        this.navigateToMainPage()
        
      } catch (error) {
        console.error('测试账号登录失败:', error)
        this.$message.error('测试账号登录失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    isTestAccount (email, password) {
      // 定义测试账号的验证规则
      const testAccounts = [
        { email: 'test@test.com', password: 'test123', username: '测试用户' },
        { email: '测试用户', password: 'test123', username: '测试用户' } // 支持用户名登录
      ]
      
      return testAccounts.some(account => 
        (account.email === email || account.username === email) && 
        account.password === password
      )
    },
    handleTestAccountLogin () {
      // 处理测试账号登录
      const testAccount = {
        username: '测试用户',
        password: 'test123',
        email: 'test@test.com',
        role: '测试员'
      }
      
      // 模拟生成测试token
      const testToken = this.generateTestToken(testAccount)
      
      // 创建测试用户信息
      const testUser = {
        id: 'test_user_001',
        username: testAccount.username,
        email: testAccount.email,
        role: testAccount.role,
        permissions: ['monitoring:view'],
        loginTime: new Date().toISOString()
      }
      
      // 保存到localStorage
      localStorage.setItem('token', testToken)
      localStorage.setItem('user', JSON.stringify(testUser))
      localStorage.setItem('isTestAccount', 'true')
      
      this.$message.success('测试账号登录成功')
      this.navigateToMainPage()
    },
    generateTestToken (testAccount) {
      // 生成简单的测试token（仅用于前端测试）
      // 使用安全的Base64编码方法处理中文字符
      const safeBase64Encode = (str) => {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode('0x' + p1)
        }))
      }
      
      const header = safeBase64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = safeBase64Encode(JSON.stringify({
        id: 'test_user_001',
        username: testAccount.username,
        email: testAccount.email,
        role: testAccount.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24小时过期
        isTestAccount: true
      }))
      const signature = safeBase64Encode('test_signature_for_frontend_only')
      
      return `${header}.${payload}.${signature}`
    },
    navigateToMainPage () {
      if (this.$route.path !== '/MainPage') {
        this.$router.push('/MainPage').catch(err => {
          // 忽略 NavigationDuplicated 错误
          if (err.name !== 'NavigationDuplicated') throw err
        })
      }
    },
    async sendVerificationCode () {
      try {
        // 验证手机号格式
        if (!this.phone || this.phone.length !== 11) {
          this.$message.error('请输入正确的手机号码')
          return
        }
        
        this.sendingCode = true
        
        const response = await authAPI.sendVerificationCode({
          phone: this.phone
        })
        
        if (response.data.success) {
          this.$message.success('验证码已发送到您的手机')
        } else {
          this.$message.error(response.data.message || '验证码发送失败')
        }
      } catch (error) {
        console.error('发送验证码失败:', error)
        this.$message.error('验证码发送失败，请稍后重试')
      } finally {
        this.sendingCode = false
      }
    }
  },
  mounted () {
  }
}
