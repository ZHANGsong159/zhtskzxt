<template>
  <div class="mainBody">
    <div class="mask zIndex20"></div>
    <div class="tittle zIndex30">
      <xlghkzxtTittle></xlghkzxtTittle>
    </div>
    <div class="body zIndex10">
      <xlghkzxtBodyVue :saveLngLatMAP='saveLngLatMAP'></xlghkzxtBodyVue>
    </div>
    <div class="leftPinpu zIndex40">
      <xlghkzxtPinpu @clickPinPu='clickPinPu'></xlghkzxtPinpu>
    </div>
    <div class="buttomMenu zIndex30">
      <xlghkzxtMenu @handleSelect='handleSelect'></xlghkzxtMenu>
    </div>
    <div class="dialog">
      <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
      v-if='dialogVisible'
      custom-class='DialogKong'
      :destroy-on-close="true"
      :before-close="handleClose">
        <template #title>
          <div class="dialog-title-with-image">
            <img src="@/assets/img/组21_@1x.png" alt="" />
            <span>{{dialogTitle}}</span>
            <img src="@/assets/img/组21Right_@1x.png" alt="" />
          </div>
        </template>
        <components :is='componentsment' :closeDiaLog='closeDiaLog' @closeDialogZD='closeDialogZD' @saveLngLat='saveLngLat'></components>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import xlghkzxtTittle from "@/components/xlghkzxtTittle.vue";
import xlghkzxtBodyVue from "@/components/xlghkzxtBody.vue";
import xlghkzxtPinpu from "@/components/xlghkzxtPinpu.vue";
import xlghkzxtMenu from "@/components/xlghkzxtMenu.vue";
import dialogPinPU from "@/components/xlghkzxt/components/PinPu/dialogPinPU.vue";
import sbglBOX  from "@/components/xlghkzxt/components/SystemManagement/sbgl/sbglBox.vue";
import xhmnmbBox from "@/components/xlghkzxt/components/TKmoban/MNmodle/xhmnmbBox.vue";
import leidaxhmnmbBox from "@/components/xlghkzxt/components/LKmoban/MNmodle/leidaxhmnmbBox.vue";

import xhgrmbBox from '@/components/xlghkzxt/components/TKmoban/RGmodle/xhgrmbBox.vue';
import leidaxhgrmbBox from '@/components/xlghkzxt/components/LKmoban/RGmodle/leidaxhgrmbBox.vue';

import bspzBOX from '@/components/xlghkzxt/components/SystemManagement/bspz/bspzBox.vue';
import bhpdBOX from '@/components/xlghkzxt/components/SystemManagement/bhpd/bhpdBox.vue';

import taskmanageBox from '@/components/xlghkzxt/components/Trainingplanning/rwgl/taskmanageBox.vue';
import plandesignvue from '@/components/xlghkzxt/components/Trainingplanning/fagh/plandesignBox.vue';
import plandesignTable from '@/components/xlghkzxt/components/Trainingplanning/fagh/plandesignTable.vue';


// import {getCmdRate}  from "@/api/api.js"
export default {
  components: {
    xlghkzxtTittle,
    xlghkzxtBodyVue,
    xlghkzxtPinpu,
    xlghkzxtMenu,
    dialogPinPU,
    sbglBOX,
    leidaxhmnmbBox,
    leidaxhgrmbBox,
    xhmnmbBox,
    xhgrmbBox,
    bspzBOX,
    bhpdBOX,
    taskmanageBox,
    plandesignvue,
    plandesignTable
  },

  data() {
    return {
      dialogVisible: false,
      dialogTitle:'',
      closeDiaLog:false,
      showSheBeiID:false,
      componentsment:'dialogPinPU',
      saveLngLatMAP:false,
    };
  },
  methods:{
    saveLngLat(){
      this.saveLngLatMAP=!this.saveLngLatMAP
      
    },
    closeDialogZD(){
      this.dialogVisible = false
    },
    handleSelect(key,keyPath){
      console.log(key,keyPath,'handleSelect');
      switch (key){
        case "1-2":
          this.dialogTitle = '任务管理'
          this.componentsment = 'taskmanageBox'
          this.dialogVisible = true
          break;
        case "1-3":
          this.dialogTitle = '方案规划'
          // this.componentsment = 'plandesignvue'
          this.componentsment = 'plandesignTable'
          this.dialogVisible = true
          break;
        case "1-4":
          this.dialogTitle = '系统回放'
          this.componentsment = 'taskmanageBox'
          this.dialogVisible = true
          break;






        
        case '2-1':
          this.dialogTitle = '信号干扰模板'
          this.componentsment = 'xhgrmbBox'
          this.dialogVisible = true
          break;
        case '2-2':
          this.dialogTitle = '信号模拟模板'
          this.componentsment = 'xhmnmbBox'
          this.dialogVisible = true
          break;




        //接口没调
        case '3-1':
          this.dialogTitle = '信号干扰模板'
          this.componentsment = 'leidaxhgrmbBox'
          this.dialogVisible = true
          break;
        case '3-2':
          this.dialogTitle = '信号模拟模板'
          this.componentsment = 'leidaxhmnmbBox'
          this.dialogVisible = true
          break;





        case '5-1':
          this.dialogTitle = '设备管理'
          this.componentsment = 'sbglBOX'
          this.dialogVisible = true
          break; 
        case '5-2':
          this.dialogTitle = '部署配置'
          this.componentsment = 'bspzBOX'
          this.dialogVisible = true
          break; 
        case '5-3':
          this.dialogTitle = '保护频段'
          this.componentsment = 'bhpdBOX'
          this.dialogVisible = true
          break; 
      }
    },
    clickPinPu(id){
      console.log(this.$store.state.tiemer,id,'clickPinPu');
      clearInterval(this.$store.state.tiemer)
      this.$router.push({
        name: 'pingputu',  // 必须用路由的 name（不能用 path）
        params: {
          id: id
        }
      })
    },
    handleClose(done) {
        done();
    },
  },
  created(){ 

  },
  mounted() {
    // console.log(sbglBOX,'sbglBOXsbglBOX');
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
      #022920e5 80%
    );
    -webkit-mask: radial-gradient(
      closest-side,
      transparent 0%,
      transparent 30%,
      #022920e5 80%
    );
    background: #022920e5;


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

</style>