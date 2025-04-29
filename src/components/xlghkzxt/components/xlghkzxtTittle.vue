<template>
  <div class="tittlemain ">
    <div class="tittleText">训练规划及电磁环境控制分系统</div>
    <div class="tittelImg">
      <img src="@/assets/img/组28_@1x.png" alt="">  
      <div class="currentTime" v-show="bosShow">
        <div class="currentTimeText">天文时间：{{ currentTime }}</div>
        <div class="currentTimeText">作战时间：{{ currentTime }}</div>

      </div>
    </div>
    <el-tooltip class="item" effect="dark" content="注销" placement="bottom" v-show="bosShow">
      <!-- <el-button>下边</el-button> -->
      <div class="tittleClose" @click="closeUser()">
        <img src="@/assets/img/退出_@1x.png" alt="">
      </div>
    </el-tooltip>
 
  </div>
</template>
<script>
import moment from 'moment';
import {postLoginOut} from '@/api/api.js'
// import { format } from 'date-fns';
export default {
  props: {
    bosShow:{
      type: Boolean,
      default: true,
      }
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      currentTime: '',
    };
  },
  methods: {
    getFormattedTime() {
      return moment().format('YYYY-MM-DD HH:mm:ss');
      // return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    updateTime() {
      this.currentTime = this.getFormattedTime()
      // 或者使用更详细的格式
      // this.currentTime = new Date().toLocaleTimeString();
    },
    closeUser(){
      this.$confirm('是否注销当前用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postLoginOut().then(res=>{
            console.log(res,'postLoginOut')
            if(res.data.code==200){
              this.$router.push('/login');
              localStorage.removeItem('token')
              this.$message({
                type: 'success',
                message: '注销成功!'
              });
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
    }
  },
  mounted() {
      this.updateTime();
      // 每秒更新一次时间
      this.timer = setInterval(this.updateTime, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
::v-deep .el-menu-demo {
    font-size: 18px;
}
::v-deep .el-menu.el-menu--horizontal{
    border-bottom: 0 !important;
}

.tittlemain {
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  flex-flow: column;
  align-content: center;
  position: relative;
  padding-bottom: 30px;
  z-index: 40;
  .tittleText {
    width: 100%;
    font-weight: 600;
    font-style: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    text-shadow: 0px 0px 10px 0px #2CE5BA4C;
    font-family: YouSheBiaoTiYuan;
    font-size: 50px;
    letter-spacing: 0px;
  }
  .tittelImg{
    width: 80%;
    position: absolute;
    left: 10%;
    bottom:-20px;
    img{
      width: 100%;
    }
  }
  .tittleClose{
    position: absolute;
    top: 30px;
    right: 3%;
    cursor:pointer;
  }
  .tittleSelect {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    .selectButton {
      width: 80%;
    }
    .closeButton {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.currentTime{
  position:absolute;
  top: 55px;
  right: -45px;
  .currentTimeText{
      opacity: 1;
      color: #FFFFFF;
      font-family: Microsoft YaHei;
      font-weight: regular;
      font-size: 18px;
      line-height: normal;
      letter-spacing: 0px;
      text-align: left;
  }

}
</style>