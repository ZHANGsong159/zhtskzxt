<template>
  <div class="loginMain">
    <div class="loginMainLeft">
      <div class="loginLogo">
        <div class="logoTittle">Vigtel(任意logo)</div>
        <div class="logoTest">训练规划及电磁环境训练领域解决专家(任意标语)</div>
      </div>
    </div>
    <div class="loginMainRight">
      <div class="content">
        <div class="contentTittle">训练规划及电磁环境控制分系统</div>
        <div class="contentBody">
          <div class="contentBodyBox flexBox">
            <el-form
              :model="loginForm"
              :rules="rules"
              label-width="0px"
              class="login_form flexBox"
              ref="LoginFormRef"
            >
              <el-form-item prop="userCode" class="LonginInputBox">
                <el-input
                  v-model="loginForm.userCode"
                  class="inputBox"
                  placeholder="账号"
                ></el-input>
                <img class="input-icon-inside" src="@/assets/img/用户名 (1)@1x.png" alt="">
              </el-form-item>
              <el-form-item prop="password" class="LonginInputBox">
                <el-input
                  class="inputBox"
                  v-model="loginForm.password"
                  placeholder="密码"
                  type="password"
                ></el-input>
                <img class="input-icon-inside" src="@/assets/img/密码@1x.png" alt="">
              </el-form-item>

              <el-form-item class="btns">
                <el-button
                  type="primary"
                  style="background: #1c735e; border-radius: 4px; border: none;;height: 48px;"
                  @click="login"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <span class="accountLogin">使用账号密码登录</span>
        </div>
        <div class="contentFooter"></div>
      </div>
    </div>
  </div>
</template>
<script>
// import HttpRequte from '@/api/api.js'
import {postLogin} from '@/api/api'
export default {
  data() {
    return {
      loginForm: {
        userCode: "",
        password: "",
      },
      rules:{

      }
    };
  },
  methods:{
    login(){
        console.log("登录");
        postLogin(this.loginForm).then(res => {
          return res.data
        }).then(res=>{
          console.log(res,'postLogin')
          if(res.code==200){
            sessionStorage.setItem('userID', res.data.userId)
            sessionStorage.setItem('token', res.data.token)
            if (this.$router.currentRoute.path !== '/xlghkzxt') {
                this.$router.push('/xlghkzxt')
            }

          }
        })
        .catch(err => console.log(err))
        
    },
    test(){

      // postLogin(this.loginForm).then(res => {
      //   console.log(res,'postLogin')
      // })
      // .catch(err => console.log(err))
    },
    


  },
  mounted(){
    // this.test()

  }
}
</script>
<style lang="less" scoped>
.loginMain {
  width: 100%;
  height: 100%;
  min-height: 540px;
  min-width: 960px;
  background-image: url("@/assets/img/6407367@1x.jpg");
  background-size: cover;
  display: flex;
  flex-flow: wrap;
  .loginMainLeft {
    width: 72%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .loginLogo {
      width: 80%;
      // height: 16.8%;
      .logoTittle {
        opacity: 1;
        text-shadow: 0px 0px 10px 0px #ffffff66;
        font-family: YouSheBiaoTiHei;
        font-weight: bold;
        font-size: 64px;
        line-height: normal;
        letter-spacing: 0px;
        text-align: left;
        // font-style: italic
      }
      .logoTest {
        margin-top: 30px;
        opacity: 1;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 36px;
        line-height: normal;
        letter-spacing: 10px;
        text-align: left;
      }
    }
  }
  .loginMainRight {
    width: 28%;
    height: 100%;
    background-color: #093b2fcc;

    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      .contentTittle {
        font-family: YouSheBiaoTiYuan;
        font-weight: 600;
        font-size: 26px;
        line-height: normal;
        letter-spacing: 8px;
        text-align: center;
        margin-bottom: 80px;
      }
      .contentBody {
        width: 100%;
        // height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        .contentBodyBox {
          width: 80%;
          height: 356px;

          border-radius: 10px;
          background: #0b201bcc;
          border: 2px solid #0b715a;
          backdrop-filter: blur(10px);
          .login_form{
            flex-flow: column;
            ::v-deep .el-input__inner{
                background-color: transparent;
                border: none;
                border-radius: 0px;
                border-bottom: 1px solid #fff;
                width: 100%;
            }
          }
          .LonginInputBox{
            position: relative;
            border-bottom: 1px solid #ffffff;
            width: 80%;
            .inputBox{

              ::v-deep .el-input__inner{
                padding-left: 50px;
                font-size: 18px;
                color: #666666;

              }
            }
            .inputBox::placeholder {
              color: #666666; 
            }
            .input-icon-inside{
              position: absolute;
              left: 10px;
              top: 4px;
              // top: ;
            }
          }
          .btns{
            width: 80%;
            border: none !important;
            .el-button{
              width: 100%;
            }
          }
        }
        .accountLogin {
          margin-top: 20px;
          font-size: 16px;
        }
      }
    }
  }
}

::v-deep .el-form-item{
    border: none!important;
    border-bottom:1px solid #fff !important;
    padding: 0 !important;
    .el-form-item__content{
        width: 100% !important;
    }
}

::v-deep .el-form-item__content::after{
    width: 0px !important;
}
::v-deep .el-icon-user{
  color: #fff !important;
  font-size: 18px !important;
}

::v-deep .el-icon-lock {
  color: #fff!important;
  font-size: 18px !important;
}
</style>