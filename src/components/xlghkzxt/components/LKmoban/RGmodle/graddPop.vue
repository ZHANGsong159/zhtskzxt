<template>
  <div class="main">
    <div class="plandesignright">
      <div class="plandesignbox">
        <tittleBg :tittlename="tittlename"></tittleBg>
        <div class="plandesignbottom">
          <div class="boxleft">
            <el-form
              :inline="true"
              style="flex-flow: row warp; padding: 10px 20px"
            >
              <el-form-item label="模板名称">
                <el-input
                  v-model="formAdd.name"
                  placeholder="模板名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="生效时长(s)">
                <el-input
                  v-model="formAdd.time"
                  placeholder="生效时长(s)"
                ></el-input>
              </el-form-item>
              <el-form-item label="侦收开关">
                <!-- <el-input
                  v-model="formAdd.param.pdwReport"
                  placeholder="侦收开关"
                ></el-input> -->
                <el-switch
                  v-model="formAdd.param.pdwReport"
                  active-value="1"
                  inactive-value="0"
                  active-color="#1C735E"
                  class="custom-text-switch"
                />
              </el-form-item>
              <el-form-item label="接收衰减值">
                <el-input
                  v-model="formAdd.param.rxAtt"
                  placeholder="接收衰减值"
                ></el-input>
              </el-form-item>
              <el-form-item label="射频频率上限">
                <el-input
                  v-model="formAdd.param.maxRfFreq"
                  placeholder="射频频率上限"
                ></el-input>
              </el-form-item>
              <el-form-item label="射频频率下限">
                <el-input
                  v-model="formAdd.param.minRfFreq"
                  placeholder="射频频率下限"
                ></el-input>
              </el-form-item>
              <div class="radio-box">
                <el-radio-group v-model="formAdd.param.radio" @change="radioChange">
                  <el-radio  label="1">噪声干扰</el-radio>
                  <el-radio  label="2">相干干扰</el-radio>
                  <el-radio  label="3">组合干扰</el-radio>
                </el-radio-group>
               
              </div>
              <div class="selectbox">
                <el-select v-model="formAdd.param.leftselect" :disabled='formAdd.param.radio=="2"'>
                  <el-option v-for='(itme,index) in noiseTypeoptions' :key='index' :label="itme.label" :value="itme.value"></el-option>
                </el-select>
                <el-select v-model="formAdd.param.rightselect" :disabled='formAdd.param.radio=="1"'>
                  <el-option v-for='(itme,index) in coherentTypeoptions' :key='index' :label="itme.label" :value="itme.value"></el-option>
                </el-select>
              </div>
            </el-form>
          </div>
          <div class="boxright">
            <div class="boxrighttop">
              <el-tabs
                v-model="activeNametop"
                type="border-card"
                @tab-click="handleClicktop" 
                :aria-disabled="false"
              >
                <el-tab-pane label="宽带阻塞" name="1">
                  <el-form
                    :model="formAddtop"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledtop'

                  >
                    <el-form-item label="射频中心频率">
                      <el-input
                        v-model.number="formAddtop.rfCenter"
                        :oninput="xianzhi(25000,800)"
                        placeholder="800-25000MHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="噪声带宽">
                      <el-input
                        v-model.number="formAddtop.bandWidth"
                        :oninput="xianzhi(1000,1)"
                        placeholder="1-1000MHz"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="窄带瞄频" name="2">
                  <el-form
                    :model="formAddtop"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledtop'

                  >
                    <el-form-item label="侦收时长">
                      <el-input
                        v-model.number="formAddtop.recvTime"
                        :oninput="xianzhi(5000,1)"
                        placeholder="1-5000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="干扰时长">
                      <el-input
                        v-model.number="formAddtop.emitTime"
                        :oninput="xianzhi(12000,1)"
                        placeholder="1-12000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="噪声带宽">
                      <el-input
                        v-model="formAddtop.bandWidth"
                        :oninput="xianzhi(50,1)"
                        placeholder="1-50MHz"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="扫频" name="3">
                  <el-form
                    :model="formAddtop"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledtop'

                  >
                    <el-form-item label="起始频率">
                      <el-input
                        v-model="formAddtop.rfStart"
                        :oninput="xianzhi(25000,800)"
                        placeholder="800-25000MHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="终止频率">
                      <el-input
                        v-model="formAddtop.rfEnd"
                        :oninput="xianzhi(25000,800)"
                        placeholder="800-25000MHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="驻留时间">
                      <el-input
                        v-model="formAddtop.dwellTime"
                        :oninput="xianzhi(65535,0)"
                        placeholder="0-65535ms"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="扫频间隔">
                      <el-input
                        v-model="formAddtop.scanInterval"
                        :oninput="xianzhi(65535,0)"
                        placeholder="0-65535kHz"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="梳妆谱" name="4">
                  <el-form
                    :model="formAddtop"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledtop'
                  >
                    <el-form-item label="起始频率">
                      <el-input
                        v-model="formAddtop.rfStart"
                        :oninput="xianzhi(25000,800)"
                        placeholder="800-25000MHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="终止频率">
                      <el-input
                        v-model="formAddtop.rfEnd"
                        :oninput="xianzhi(25000,800)"
                        placeholder="800-25000MHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="谱线间隔">
                      <el-input
                        v-model="formAddtop.freqInterval"
                        :oninput="xianzhi(100,10)"
                        placeholder="10-100MHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="谱线宽度">
                      <el-input
                        v-model="formAddtop.width"
                        :oninput="xianzhi(10,0)"
                        placeholder="0-10MHz"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="杂乱脉冲" name="5">
                  <el-form
                    :model="formAddtop"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledtop'
                  >
                    <el-form-item label="最小脉冲">
                      <el-input
                        v-model="formAddtop.minPulseWidth"
                        :oninput="xianzhidouble(1000,0.3)"
                        placeholder="0.3-1000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="最大脉冲">
                      <el-input
                        v-model="formAddtop.maxPulseWidth"
                        :oninput="xianzhidouble(1000,0.3)"
                        placeholder="0.3-1000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="最小重周">
                      <el-input
                        v-model="formAddtop.minPulsePeriod"
                        :oninput="xianzhidouble(1000,0.3)"
                        placeholder="0.3-1000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="最大重周">
                      <el-input
                        v-model="formAddtop.maxPulsePeriod"
                        :oninput="xianzhidouble(1000,0.3)"
                        placeholder="0.3-1000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="干扰窗开始时间">
                      <el-input
                        v-model="formAddtop.startTime"
                        :oninput="xianzhi(3000,10)"
                        placeholder="10-3000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="干扰窗结束时间">
                      <el-input
                        v-model="formAddtop.endTime"
                        :oninput="xianzhi(12000,10)"
                        placeholder="10-12000us"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="boxrightbottom">
              <el-tabs
                v-model="activeNamebottom"
                type="border-card"

              >
                <el-tab-pane label="卷积噪声" name="1">
                  <el-form
                    :model="formAddbottom"
                    :inline="true"
                    @tab-click="handleClickbottom"
                    :disabled='disabledbottom'
                    style="flex-flow: row warp; padding: 10px 20px"
                  >
                    <el-form-item label="侦收时长">
                      <el-input
                        v-model="formAddbottom.recvTime"
                        :oninput="xianzhi(5000,1)"
                        placeholder="1-5000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="干扰时长">
                      <el-input
                        v-model="formAddbottom.emitTime"
                        :oninput="xianzhi(12000,1)"
                        placeholder="1-12000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="左边带带宽">
                      <el-input
                        v-model="formAddbottom.leftBand"
                        :oninput="xianzhidouble(10000,0)"
                        placeholder="0-10000kHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="右边带带宽">
                      <el-input
                        v-model="formAddbottom.rightBand"
                        :oninput="xianzhidouble(10000,0)"
                        placeholder="0-10000kHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="驻留时间">
                      <el-input
                        v-model="formAddbottom.dwellTime"
                        :oninput="xianzhi(65535,0)"
                        placeholder="0-65535us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="扫频时间">
                      <el-input
                        v-model="formAddbottom.scanInterval"
                        :oninput="xianzhi(65535,0)"
                        placeholder="0-65535kHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="间断重复时间">
                      <el-input
                        v-model="formAddbottom.cutTime"
                        :oninput="xianzhi(65535,0)"
                        placeholder="0-65535us"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane label="密集假目标" name="2">
                  <el-form
                    :model="formAddbottom"
                    :inline="true"
                    @tab-click="handleClickbottom"
                    :disabled='disabledbottom'

                    

                    style="flex-flow: row warp; padding: 10px 20px"
                  >
                    <el-form-item label="侦收时长">
                      <el-input
                        v-model="formAddbottom.recvTime"
                        :oninput="xianzhi(10000,1)"
                        placeholder="1-10000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="干扰时长">
                      <el-input
                        v-model="formAddbottom.emitTime"
                        :oninput="xianzhi(40000,1)"
                        placeholder="1-40000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="左边带带宽">
                      <el-input
                        v-model="formAddbottom.leftBand"
                        :oninput="xianzhidouble(10000,0)"
                        placeholder="0-10000kHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="右边带带宽">
                      <el-input
                        v-model="formAddbottom.rightBand"
                        :oninput="xianzhidouble(10000,0)"
                        placeholder="0-10000kHz"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="目标间隔">
                      <el-input
                        v-model="formAddbottom.targetInterval"
                        :oninput="xianzhi(1000,2)"
                        placeholder="2-1000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="随机抖动">
                      <el-input
                        v-model="formAddbottom.jitterTime"
                        :oninput="xianzhi(10000,0)"
                        placeholder="0-10000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="目标速度">
                      <el-input
                        v-model="formAddbottom.targetSpeed"
                        :oninput="xianzhi(3400,-3400)"
                        placeholder="-3400-3400m/s"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane label="多普勒噪声" name="3">
                  <el-form
                    :model="formAddbottom"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledbottom'

                  >
                    <el-form-item label="干扰窗开始时间">
                      <el-input
                        v-model="formAddbottom.startTime"
                        :oninput="xianzhi(3000,10)"
                        placeholder="10-3000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="干扰窗结束时间">
                      <el-input
                        v-model="formAddbottom.endTime"
                        :oninput="xianzhi(12000,10)"
                        placeholder="10-12000us"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="噪声带宽">
                      <el-input
                        v-model="formAddbottom.bandWidth"
                        :oninput="xianzhi(2000,0)"
                        placeholder="0-2000kHz"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane label="切片转发干扰" name="4">
                  <el-form
                    :model="formAddbottom"
                    :inline="true"
                    style="flex-flow: row warp; padding: 10px 20px"
                    :disabled='disabledbottom'
                  >
                    <el-form-item label="侦收时长">
                      <el-input
                        v-model="formAddbottom.recvTime"
                        :oninput="xianzhi(10000,1)"
                        placeholder="1-10000us"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="干扰时长">
                      <el-input
                        v-model="formAddbottom.emitTime"
                        :oninput="xianzhi(40000,1)"
                        placeholder="1-40000us"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="切片时间">
                      <el-input
                        v-model="formAddbottom.cutTime"
                        :oninput="xianzhidouble(1000,2)"
                        placeholder="2-1000us"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="目标速度">
                      <el-input
                        v-model="formAddbottom.targetSpeed"
                        :oninput="xianzhi(3400,-3400)"
                        placeholder="-3400~3400m/s"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmSave" >保存</el-button>
    </div>
  </div>
</template>
<script>
import tittleBg from "@/components/chartBox/tittleBackground.vue";

import {postLeiKangGR,putLeiKangGR} from "@/api/api";
export default {
  name: "plandesignBox",
  components: {
    tittleBg,
  },
  props: {
    formAdddata: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data() {
    return {
      tittlename: "任务列表",
      formAdd:JSON.parse(JSON.stringify(this.formAdddata)),
      // formAdd:{
      //   name:'',
      //   time:'',
      //   param:{
      //     pdwReport:'',
      //     rxAtt:'',
      //     maxRfFreq:'',
      //     minRfFreq:'',
      //     radio:'1',
      //     leftselect:'',
      //     rightselect:'',
      //     paramBody:{},
      //   },
      // },

      formAddtop:{},
      formAddbottom:{},


      // formAddtop:this.formAdd.param.paramBody.noiseParam || {},
      // formAddbottom:this.formAdd.param.paramBody.coherentParam ||{} ,
      //噪声干扰
      noiseTypeoptions: [
        {label: "无", value: 0 },
        {label: "窄带瞄频", value: 1},
        {label: "宽带阻塞", value: 2},
        {label: "扫频", value: 3},
        {label: "梳状谱", value: 4},
        {label: "杂乱脉冲", value: 5},
      ],
      //相干干扰
      coherentTypeoptions: [
        {label: "无", value: 0 },
        {label: "密集假目标", value: 1},
        {label: "卷积噪声", value: 2},
        {label: "切片转发", value: 3},
        {label: "多普勒噪声", value: 4},
      ],
      disabledtop:true,
      disabledbottom:true,
      activeNametop:'1',
      activeNamebottom:'1',
    };
  },
  created() {
  },
  watch: {
    // formAdddata: {
    //   handler(val) {
    //     // this.formAdd = val;
    //     if(val.id){
    //       this.formAddtop=val.param.paramBody.noiseParam || {}
    //       this.formAddbottom=val.param.paramBody.coherentParam
    //       console.log(this.formAddtop,this.formAddbottom,'formAdddataformAdddata');

    //     }
        
    //   },
    // },
  },
  mounted() {
      this.radioChange(this.formAdd.param.radio);
      if(this.formAdddata.id){
            this.formAddtop=this.formAdddata.param.paramBody.noiseParam || {}
            this.formAddbottom=this.formAdddata.param.paramBody.coherentParam||{}

            this.activeNametop=JSON.stringify(this.formAdddata.param.paramBody.noiseType)==0?'1'
                  :JSON.stringify(this.formAdddata.param.paramBody.noiseType)

            this.activeNamebottom=JSON.stringify(this.formAdddata.param.paramBody.coherentType)==0?'1'
                  :JSON.stringify(this.formAdddata.param.paramBody.coherentType)

        }
  },
  methods: {

    xianzhi(maxvalue,minvalue){
      return "if(!/^[0-9]+$/.test(value)) value=value.replace(/\\D/g,'');if(value>"+maxvalue+")value="+maxvalue+";if(value<"+minvalue+")value="+minvalue
    },
    xianzhidouble(maxvalue,minvalue){ 
      return `value = value.replace(/[^\\d.]/g, ''); 
          if (value > ${maxvalue}) value = ${maxvalue};
          if (value < ${minvalue}) value = ${minvalue};`
    },
    handleTimeInput(value, maxvalue, minvalue) {
      // 修改正则表达式，允许小数点
      let num = String(value).replace(/[^\d.]/g, ""); // 只保留数字和小数点
      // 移除多余的小数点（最多保留一个）
      num = String(num).replace(/\.{2,}/g, ".");
      num = String(num).replace(/^\./g, "");

      // 转换为数字并限制范围
      let floatNum = parseFloat(num) || minvalue;
      if (floatNum < minvalue) floatNum = minvalue;
      if (floatNum > maxvalue) floatNum = maxvalue;
      value = floatNum;

      // // 更新对应字段
      // switch (key) {
      //   case "shpl":
      //     this.localFormAdd.param.signalRate = floatNum;
      //     break;
      //   // 其他情况...
      // }
    },
    radioChange(key){
      switch(key){
        case '1':
          this.disabledtop=false;
          this.disabledbottom=true;
          break;
        case '2':
          this.disabledtop=true;
          this.disabledbottom=false;
          break;
        case '3':
          this.disabledtop=false;
          this.disabledbottom=false;
          break;
      }
      console.log(key,this.disabledtop,this.disabledbottom,'radioChange');
    },
    handleClicktop(){

    },
    handleClickbottom(){
      
    },
    confirmSave(){
      // this.formAdd.param.radio
      let paramBody={
        noiseType:0,
        noiseParam:{},
        coherentType:0,
        coherentParam:{},
        txAtt:null,
      }
      switch (this.formAdd.param.radio) {
        case '1':
          paramBody.noiseType=Number(this.activeNametop)
          paramBody.noiseParam=this.formAddtop
          paramBody.coherentType=0
          paramBody.coherentParam={}
          break;
        case '2':
          paramBody.noiseType=0
          paramBody.noiseParam={}
          paramBody.coherentType=Number(this.activeNamebottom)
          paramBody.coherentParam=this.formAddbottom
          break;
        case '3':
          paramBody.noiseType=Number(this.activeNametop)
          paramBody.noiseParam=this.formAddtop
          paramBody.coherentType=Number(this.activeNamebottom)
          paramBody.coherentParam=this.formAddbottom
      }
      this.formAdd.param.paramBody=paramBody
      if(this.formAdd.id){
        this.updataputLeiKangGR(this.formAdd)
      }else{
        this.addpostLeiKangGR(this.formAdd)
      }
      console.log(this.formAdd,'confirmSave');
    },
    confirm() {},
    //添加规划方案
    addpostLeiKangGR(){
      let params = this.formAdd
      postLeiKangGR(params).then((res) => { 
        console.log(res.data, "res");
        if(res.data.code==200){
          this.$emit('changeList')
          this.$message.success('添加成功')
        }
      }).catch(error=>{
        console.error("请求失败:", error); // 避免 Uncaught Error
        this.$message.error("网络错误，请求失败");
      }) 
    },
    //修改规划方案
    updataputLeiKangGR(){
      let params = this.formAdd
      putLeiKangGR(params).then(res=>{
        if(res.data.code==200){
          this.$emit('changeList')
          this.$message.success('修改成功')
        }
      }).catch(error=>{
        console.log(error);
      })
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  box-sizing: border-box;
  padding: 0px 20px;
  overflow: hidden;
  // display: flex;
  // flex-flow: row nowrap;
  display: flex;
  flex-flow: column;
  height: 700px;
  .plandesignleft {
    width: 30%;
    border-right: 1px solid #ffffff4c;
    ::v-deep .el-form-item {
      width: 100%;
      margin-right: 0px;
      margin-bottom: 0px;
      text-align: left;
      background: transparent;
    }

    .leftPinpu {
      width: 100%;
      padding: 0px 20px;
      ::v-deep .el-table__header {
        width: 100%;
      }
    }
  }
  .plandesignright {
    width: 100%;
    height: 100%;

    overflow: hidden;
    padding: 0 20px;
    .plandesignbox {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      .plandesignbottom {
        display: flex;
        flex-flow: row;
        height: calc(100% - 40px);
        .boxleft {
          width: 30%;
          border-right: 1px solid #ffffff4c;
          .el-form--inline {
            justify-content: center;
          }
          .radio-box {
            margin-bottom: 20px;
            .el-radio {
              margin-right: 10px;
            }
          }
          .selectbox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-select {
              width: 45%;
              border: 1px solid #ffffff4c;
            }
          }

          .el-form-item {
            width: 100% !important;
            margin-right: 0;
          }


         
        }
        .boxright {
          width: 70%;
          padding: 10px 20px;
          .boxrighttop {
            height: 50%;
            width: 100%;
          }
          .boxrightbottom {
            height: 50%;
            width: 100%;
          }
          ::v-deep .el-form-item {
            width: 32%;
          }
          ::v-deep .el-form-item__content {
            width: calc(100% - 150px) !important;
          }
          ::v-deep .el-tabs--top {
            height: 100%;
          }
          ::v-deep .el-form-item__label {
            width: 150px;
          }
          ::v-deep .el-tabs__content {
            height: calc(100% - 50px);
          }
        }
      }
    }
  }
  .dialog-footer{
    width: 100%;
    text-align: right;
  }
}

/* 添加在组件的 <style> 部分 */
::v-deep .el-tabs--border-card {
  background: transparent !important;
  border: none;

  /* 标签页头部样式 */
  .el-tabs__header {
    background-color: transparent !important;
    border-bottom: none !important;

    /* 单个标签页样式 */
    .el-tabs__item {
      background: #ffffff26 !important;
      color: #fff !important;
      margin-right: 20px;
      font-size: 16px;
      border: 2px solid #ffffff4c;
      border-bottom: none;
      //   border-right: linear-gradient(180deg, #2CE5BA 0%, #2CE5BA00 100%) !important;

      /* 选中状态的样式 */
      &.is-active {
        background: #1c735e !important; /* 绿色背景 */
        color: white !important;
        border: 2px solid #2ce5ba;
        border-bottom-color: transparent !important;
      }

      /* 悬停效果 */
      &:hover {
        color: white !important;
      }
    }
  }

  /* 内容区域样式 */
  .el-tabs__content {
    padding: 15px;
    border: 1px solid #ffffff4c;
    height: 100%;
    background: rgba(0, 0, 0, 0); /* 半透明背景 */
  }
}

// ::v-deep .el-form-item {
//     width: 100% !important;
//     margin-right: 0;
// }

::v-deep .el-form-item__label {
  width: 130px;
  text-align: left;
  padding: 0 10px;
}
::v-deep .el-form-item__content {
  width: calc(100% - 130px);
}



::v-deep .custom-text-switch .el-switch__label {
  position: absolute;
  z-index: 1;
  color: white !important; /* 文本颜色 */
}
::v-deep .custom-text-switch .el-switch__label--left {
  right: 10px; /* 调整"关"文本位置 */
}
::v-deep .custom-text-switch .el-switch__label--right {
  left: 10px; /* 调整"开"文本位置 */
}

.custom-text-switch{
  margin-left: 20px;
  ::v-deep .el-switch__core{
    background: #ffffff26 !important;
    width: 60px !important;
    height: 30px;
    border-radius: 20px;
  }
  ::v-deep .el-switch__core:after{
    background: #2CE5BA !important;
    width: 25px;
    height: 25px;
  }
}

::v-deep .el-switch.is-checked .el-switch__core::after{
  margin-left: -28px !important;
}


</style>