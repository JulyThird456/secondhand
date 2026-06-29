<template>
  <div class="container">

    <div style="width: 25%; height: 40%; display: flex;background-color: rgba(255,255,255,0.9); ">
      <div style="flex: 1;width: 50%;padding: 40px;display: flex;flex-direction: column;justify-content: center;" >
        <div style="text-align: center; font-size: 28px; margin-bottom: 30px; color: #333">校园二手集市</div>
        <el-form ref="form" :model="userForm">
          <el-input placeholder="请输入手机号..." v-model="userForm.accountNumber" class="login-input">
            <template slot="prepend">
              <div class="el-icon-user-solid"></div>
            </template>
          </el-input>
          <el-input placeholder="请输入密码..." v-model="userForm.userPassword" class="login-input"
                    @keyup.enter.native="login"  show-password>
            <template slot="prepend">
              <div class="el-icon-lock"></div>
            </template>
          </el-input>
          <div class="login-submit">
            <el-button type="primary" style="width: 100px" @click="login">登录</el-button>
          </div>
          <div class="other-submit">
            <router-link to="/sign-in" class="sign-in-text">注册</router-link>
            <router-link to="/login-admin" class="sign-in-text">管理员登录</router-link>
          </div>
        </el-form>
      </div>



    </div>



  </div>




</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                userForm: {
                    accountNumber: '',
                    userPassword: ''
                }
            };
        },

        methods: {
            login() {
                this.$api.userLogin({
                    accountNumber: this.userForm.accountNumber,
                    userPassword: this.userForm.userPassword
                }).then(res => {
                    console.log(res);
                    if (res.status_code === 1) {
                        res.data.signInTime=res.data.signInTime.substring(0,10);
                        this.$globalData.userInfo = res.data;
                        this.$router.replace({path: '/index'});
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            toIndex() {
                this.$router.replace({path: '/index'});
            }
        }
    }
</script>

<style scoped>


.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("../../img/login-back.png");
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        background-color: #1d1fff;
    }

    .login-body {
        padding: 30px;
        width: 400px;
        height: 100%;
    }

    .login-title {
        padding-bottom: 30px;
        text-align: center;
        font-weight: 600;
        font-size: 20px;
        color: #409EFF;
        cursor: pointer;
    }

    .login-input {
        margin-bottom: 20px;
    }

    .login-submit {
        display: flex;
        justify-content: center;
    }

    .sign-in-container {
        padding: 0 10px;
    }

    .sign-in-text {
        color: #409EFF;
        font-size: 16px;
        text-decoration: none;
        line-height:28px;
    }
    .other-submit{
        display:flex;
        justify-content: space-between;
        margin-top: 10px;
    }
</style>
