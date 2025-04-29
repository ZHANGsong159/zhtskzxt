<template>
  <div class="mainBody">
    <div class="mask zIndex20"></div>
    <div class="tittle zIndex30">
      <xlghkzxtTittle :bosShow='bosShow'></xlghkzxtTittle>
    </div>
    <div class="body">
        <pinpuBOX></pinpuBOX>
    </div>
    
    
  </div>
</template>
<script>
import xlghkzxtTittle from "./components/xlghkzxtTittle.vue";
import pinpuBOX from "./components/pinpuBox.vue";


// import {getListAPI}  from "@/api/api.js"
export default {
  components: {
    xlghkzxtTittle,
    pinpuBOX,
  },

  data() {
    return {
      dialogVisible: false,
      dialogTitle:'',
      closeDiaLog:false,
      showSheBeiID:false,
      componentsment:'dialogPinPU',
      bosShow:false,
    };
  },
  methods:{
  },
  created(){ 

  },
  mounted() {
  
  },
};
</script>
<style lang="less" scoped>
.mainBody {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 0px;
  // background: radial-gradient(#02292000 1%, #022920 100%);
  display: flex;
  flex-flow: column;
  .tittle {
    width: 100%;
    // background-image: url("@/asstes/img/组28_@1x.png");
    position: absolute;
    top: 0;
    left: 0;
  }
  .body {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background:url('@/assets/img/5486320_2522435_@1x.png');
  }
  /* 渐变遮罩层 */
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* 关键代码：径向渐变遮罩 */
    mask: radial-gradient(
      closest-side,
      transparent 0%,
      transparent 40%,
      #00644Ce5 80%
    );
    -webkit-mask: radial-gradient(
      closest-side,
      transparent 0%,
      transparent 30%,
      #00644Ce5 80%
    );
    // background: radial-gradient(#02292000 1%, #022920 100%);
    // background: radial-gradient( circle at center,
    //   transparent 0%,
    //   transparent 40%,
    //   #022920e5 80%);
    background: #00644C4c;


    backdrop-filter: blur(5px);
    pointer-events: none; /* 允许点击穿透 */
  }
  //左侧频谱图片
  .leftPinpu {
    width: 320px;
    height: 90%;
    position: absolute;
    background: #00130f33;
    border: 1px solid #ffffff99;
    backdrop-filter: blur(10px);
    top: 80px;
    left: 3%;
    
  }
  .buttomMenu{
    width: 1540px;
    // height: 80px;
    position: absolute;
    bottom:30px;
    left: calc(50% - 770px);
    background-image: url("@/assets/img/组 18@1x.png");
    background-repeat: no-repeat;
    overflow: hidden;

  }
}
.dialog-title-with-image{
  color: #fff;
  font-family: Microsoft YaHei;
  font-size: 24px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: center;


}
::v-deep .el-dialog__body{
  padding:15px 0px !important;
}
</style>