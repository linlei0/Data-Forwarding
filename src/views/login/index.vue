<template>
  <div class="login-con">
    <div class="login-logo"/>
    <div class="login-form-div">
      <div class="login-form-div-in">
        <el-row>
          <el-col :span="12">
            <div class="login-form-left"/>
          </el-col>
          <el-col :span="12">
            <div class="login-form-right">
              <div class="login-form-right-content">
                <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
                  <div class="title-text-box">
                    <p class="title-text">车辆数据配置转发系统</p>
                    <p class="title-welcome">Welcome!</p>
                  </div>

                  <div class="login-con-input">
                    <el-form-item prop="username">
                      <div class="svg-container">
                        <!-- <svg-icon icon-class="user" /> -->
                        <img src="../../assets/images/usename.png" alt="">
                      </div>
                      <el-input
                        v-model="loginForm.username"
                        :placeholder="$t('login.username')"
                        name="username"
                        type="text"
                        autocomplete="off" />
                    </el-form-item>

                    <el-form-item prop="password">
                      <div class="svg-container">
                        <img src="../../assets/images/password.png" alt="">
                      </div>
                      <el-input
                        :type="passwordType"
                        v-model="loginForm.password"
                        :placeholder="$t('login.password')"
                        name="password"
                        @keyup.enter.native="login('loginForm')" />
                      <span class="show-pwd" @click="showPwd">
                        <svg-icon icon-class="eye" />
                      </span>
                    </el-form-item>
                    <!-- <div class="lose-pwd">
                      <span @click="losePwd">忘记密码?</span>
                    </div> -->
                    <el-button :loading="loading" type="primary" @click.native.prevent="login('loginForm')">{{ $t('login.logIn') }}</el-button>
                  </div>
                </el-form>
              </div>

            </div>

          </el-col>
        </el-row>
      </div>

    </div>

  </div>
</template>

<script>
import { validPassword } from '@/utils/validate'
// import { claerLocalforage } from '@/utils/lfStore'
export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入用户名'))
      } else {
        cb()
      }
    }
    const validatePassword = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入密码'))
      }
      if (!validPassword(value)) {
        cb(new Error('密码格式错误'))
      } else {
        cb()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: route => {
        // console.log(route)
      //  this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm).then((obj) => {
            // console.log(obj)
            this.loading = false
            this.$router.push({ name: 'Home' })
          }).catch((error) => {
            console.log(error)
            this.loading = false
          })
        } else {
          console.log('error submit!!!')
          return false
        }
      })
    },
    losePwd() {
      this.$router.push({ path: '/losepwd' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    $dark_gray:#889aa4;
  $light_gray:#515a6e;
  $bj_white:#fff;
  $form_padding: 20px;

  .login-con {
    position: absolute;
    width: 100%;
    height: 100%;
    // background-color: #00070f;
    background-image: url(../../assets/images/login-bg.png);
    background-size: cover;
    background-position: center;
    .login-logo{
      width: 160px;
      height: 40px;
      position: absolute;
      top:20px;
      left: 20px;
      background: url(../../assets/images/logo-icon.png) no-repeat;
      background-size: contain;
    }
    .el-form-item {
      border-bottom: 1px solid #dcdee2;
      // border-radius: 5px;
      color: #515a6e;
    }
    .el-input {
      display: inline-block;
      width: 85%;
      input {
        background-color: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
      }
    }
    .login-form-div{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 60%;
      height: 60vh;

      border: 10px solid #A2C3FF;
      // background: #A2C3FF;
      border-radius: 4px;
      box-sizing: border-box;
      .login-form-div-in{
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background: transparent;
        box-sizing: border-box;
        .login-form-left{
          width: 100%;
          height: calc(60vh - 20px);
          background: url(../../assets/images/login-form-left.png) no-repeat;
          background-size: 50%;
          background-position: center;
        }
        .login-form-right{
          background: $bj_white;
          width: 100%;
          position: relative;
          height: calc(60vh - 20px);
          overflow: hidden;
          .login-form-right-content{
            height: 100%;
            background: $bj_white;
            // 使用弹性布局需要兼容写法
            display: flex;
            display: -webkit-flex;
            justify-content:center;
            -webkit-justify-content:center;
            -moz-justify-content:center;
            -ms-justify-content:center;
            align-items:center;
            -webkit-align-items:center;
            -moz-align-items:center;
            -ms-align-items:center;
            .login-form{
              width: 70%;
              .title-text-box{
                p{
                  margin: 8px;
                }
                .title-text{
                  color:#3e8bff;
                  margin-top: 0;
                  font-size: 20px;
                }
                .title-welcome{
                   color:#c1c1c1;
                  font-size: 20px;
                  margin: 0 8px 25px 8px;
                }
              }
            }
          }
        }
      }
    }
    .login-con-title {
      // position: relative;
    }
    .login-con-input {
      padding:  0;
      margin: 5px;
      .el-button {
        width: 100%;
      }
      .lose-pwd {
        font-size: 14px;
        color: $light_gray;
        padding-bottom: 10px;
        text-align: right;
        span{
          cursor: pointer;
        }
      }
    }
    .svg-container {
      // padding: 0 15px 0 5px;
      height: 36px;
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      img{
        width: 20px;
        height: 24px;

        //vertical-align: middle;
        position:absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .el-button--primary{
      background:linear-gradient(to  right, #6fb2ff, #095fff);
    }
  }
</style>

