<template>
  <div>
    <div class="XHMNinputBox">
      <el-form :inline="true">
        <el-form-item label="模板名称" style="flex-flow: row nowrap !important">
          <el-input v-model="localTopForm.name" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="生效时间">
          <el-input
            v-model="localTopForm.time"
            type="number"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="射频频率下限">
          <el-input
            v-model="localTopForm.param.minRfFreq"
            type="number"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="射频频率上限">
          <el-input
            v-model="localTopForm.param.maxRfFreq"
            type="number"
            placeholder="请输入"
          ></el-input>
        </el-form-item>



        <el-form-item label="频率模式">
          <el-select
            v-model="localTopForm.param.paramBody.freqType"
            @change="ganraoChange"
            placeholder="请选择"
          >
            <el-option label="射频频率" :value="0"></el-option>
            <el-option label="中频频率" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="信号类型">
          <el-select
            v-model.number="localTopForm.param.paramBody.signalType"
            @change="ganraoChange"
            placeholder="请选择"
          >
            <el-option label="脉冲" :value="0"></el-option>
            <el-option label="连续波" :value="1"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="连续波频率(MHz)" style="flex-flow: row nowrap !important">
          <el-input v-model="localTopForm.param.paramBody.cwFreq" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="连续波衰减值(dB)" style="flex-flow: row nowrap !important">
          <el-input v-model="localTopForm.param.paramBody.cwLevel" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="脉冲安全间隔(ns)" style="flex-flow: row nowrap !important">
          <el-input v-model="localTopForm.param.paramBody.pulseSafeDelay" placeholder="请输入"></el-input>
        </el-form-item>

        <div style="width: 100%; display: flex; justify-content: flex-end;">
          <el-button type="primary" @click="saveXinData('save')">保存</el-button>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addXinHao"
            >添加信号</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="XHMNmainBox">
      <div class="XHMNmainBoxleft">
        <div
          class="XHMNBoxleftmain"
          v-for="(item, index) in this.localTopForm.param.paramBody.signalCollection"
          :key="index"
          @click="BoxleftClick(item.trackParam[0], index)"
          :class="{ selected: selectedIndex === index }"
        >
          <div class="XHMNBoxleftmain-left">{{ index + 1 }}</div>
          <div class="XHMNBoxleftmain-right">
            <div class="XHMNBoxleftmain-right-top  XHMNBoxleftmain-right-box">
              <span>
              频率类型：{{optionChange(item.trackParam[0].freqType,'PLLX') }}
              </span>
              <span>
              重周类型：{{optionChange(item.trackParam[0].periodType,'ZZLX')}}
              </span>
            </div>
            <div class="XHMNBoxleftmain-right-bottom XHMNBoxleftmain-right-box">
              <span>
              脉宽类型：{{optionChange(item.trackParam[0].widthType,'MKLX')}}
              </span>
              <span>
              脉内类型：{{optionChange(item.trackParam[0].pulseType,'MNLX')}}
              </span>
            </div>
          </div>
          <i
            class="el-icon-close closeButton"
            @click.stop="deleteDataBoxright(item.trackParam, index)"
          ></i>
        </div>
      </div>
      <div class="XHMNmainBoxright">
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">
          <el-form-item label="频率类型">
            <el-select
              v-model.number="localFormAdd.freqType"
              placeholder="请选择"
            >
              <el-option
                v-for="device in PLoption"
                :key="device.value"
                :label="device.label"
                :value="Number(device.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>



          <el-form-item label="频率值" v-if='localFormAdd.freqType==0||localFormAdd.freqType==3||localFormAdd.freqType==4'>
            <!-- <el-input
              v-model.number="localFormAdd.freqValue"
              @input="handleInput"
              
              placeholder="1.5~3000"
            ></el-input> -->
            <comma-number-input 
              v-model="localFormAdd.freqValue"
              placeholder="1.5~3000"
            >
            </comma-number-input>
          </el-form-item>


          <el-form-item label="脉组频点个数" v-if='localFormAdd.freqType==2||localFormAdd.freqType==4'>
            <!-- <el-input
              v-model.number="localFormAdd.freqGroupNum"

            ></el-input> -->

            <comma-number-input
            v-model="localFormAdd.freqGroupNum"
            >
            </comma-number-input>
          </el-form-item>



          <el-form-item label="捷变带宽" v-if='localFormAdd.freqType==3||localFormAdd.freqType==4'>
            <el-input
              v-model.number="localFormAdd.jitterFreqBand"
            ></el-input>
          </el-form-item>
          <el-form-item label="捷变点个数" v-if='localFormAdd.freqType==3||localFormAdd.freqType==4'>
            <el-input
              v-model.number="localFormAdd.jitterFreqNum"
            ></el-input>
          </el-form-item>

        </el-form>
        <div class="line"></div>
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">
          <el-form-item label="重周类型">
            <el-select
              v-model.number="localFormAdd.periodType"
              placeholder="请选择"
            >
              <el-option
                v-for="device in ZZoption"
                :key="device.value"
                :label="device.label"
                :value="Number(device.value) "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重周值">
            <!-- <el-input
              v-model.number="localFormAdd.periodValue"
            ></el-input> -->
            <comma-number-input
            v-model="localFormAdd.periodValue"
            >
            </comma-number-input>
          </el-form-item>

          <el-form-item label="脉组重周个数">
            <!-- <el-input
              v-model.number="localFormAdd.periodGroupNum"
            ></el-input> -->

            <comma-number-input
            v-model="localFormAdd.periodGroupNum"
            >
            </comma-number-input>
            
          </el-form-item>

          <el-form-item label="重周抖动范围">
            <el-input
              v-model.number="localFormAdd.jitterPeriodBand"
            ></el-input>
          </el-form-item>

          <el-form-item label="重周抖动点个数">
            <el-input
              v-model.number="localFormAdd.jitterPeriodNum"
            ></el-input>
          </el-form-item>


          </el-form>
        <div class="line"></div>
        <el-form  :inline="true" v-if="Boxright">

          <el-form-item label="滑变范围">
            <el-input
              v-model.number="localFormAdd.slideRange"
            ></el-input>
          </el-form-item>

          <el-form-item label="滑变步进">
            <el-input
              v-model.number="localFormAdd.slideStep"
            ></el-input>
          </el-form-item>

          </el-form>
        <div class="line"></div>
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">
          <el-form-item label="脉宽类型">
            <el-select
              v-model.number="localFormAdd.widthType"
              placeholder="请选择"
            >
              <el-option
                v-for="device in MKoption"
                :key="device.value"
                :label="device.label"
                :value="Number(device.value)"
              ></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="脉宽值">
            <!-- <el-input
              v-model.number="localFormAdd.widthValue"
            ></el-input> -->

            <comma-number-input
            v-model="localFormAdd.widthValue"
            >
            </comma-number-input>
          </el-form-item>

          <el-form-item label="脉组脉宽个数">
            <!-- <el-input
              v-model.number="localFormAdd.widthGroupNum"
            ></el-input> -->
            <comma-number-input
            v-model="localFormAdd.widthGroupNum"
            >
            </comma-number-input>
          </el-form-item>


          <el-form-item label="脉宽抖动范围">
            <el-input
              v-model.number="localFormAdd.jitterWidthBand"
            ></el-input>
          </el-form-item>

          

          <el-form-item label="脉宽抖动点个数">
            <el-input
              v-model.number="localFormAdd.jitterWidthNum"
            ></el-input>
          </el-form-item>

          </el-form>
        <div class="line"></div>
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">

          <el-form-item label="脉内类型">
            <el-select
              v-model.number="localFormAdd.pulseType"
              placeholder="请选择"
            >
              <el-option
                v-for="device in MNoption"
                :key="device.value"
                :label="device.label"
                :value="Number(device.value)"
              ></el-option>
            </el-select>
          </el-form-item>



          <el-form-item label="调频带宽">
            <el-input
              v-model.number="localFormAdd.pulseBand"
            ></el-input>
          </el-form-item>

          <el-form-item label="调频方向">
            <el-select
              v-model.number="localFormAdd.fmDirection"
              placeholder="请选择"
            >
              <el-option label="上" :value="0"></el-option>
              <el-option label="下" :value="1"></el-option>

            </el-select>
          </el-form-item>


          <el-form-item label="码元宽度">
            <el-input
              v-model.number="localFormAdd.codeWidth"
            ></el-input>
          </el-form-item>


          <!-- <el-form-item label="本振码">
            <el-input
              v-model="localFormAdd.FreqCode"
              type="number"
            ></el-input>
          </el-form-item> -->

          </el-form>
        <div class="line"></div>
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">
          <el-form-item label="分集子脉冲宽度">
            <!-- <el-input
              v-model.number="localFormAdd.subPulseWidth"
            ></el-input> -->
            <comma-number-input
            v-model="localFormAdd.subPulseWidth"
            >
            </comma-number-input>
          </el-form-item>
          <el-form-item label="分集子脉冲频率">
            <!-- <el-input
              v-model.number="localFormAdd.subPulseFreq"
            ></el-input> -->
            <comma-number-input
            v-model="localFormAdd.subPulseFreq"
            >
            </comma-number-input>
          </el-form-item>

          </el-form>
        <div class="line"></div>
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">


          <el-form-item label="扫描类型">
            <el-select
              v-model.number="localFormAdd.scanType"
              placeholder="请选择"
            >
              <el-option
                v-for="device in SMoption"
                :key="device.value"
                :label="device.label"
                :value="Number(device.value)"
              ></el-option>
            </el-select>
          </el-form-item>


          <!-- <el-form-item label="扫描函数">
            <el-input
              v-model="localFormAdd.ScanFunction"
              type="number"
            ></el-input>
          </el-form-item> -->

          <el-form-item label="扫描周期">
            <el-input
              v-model.number="localFormAdd.scanPeriodValue"
            ></el-input>
          </el-form-item>

          <el-form-item label="主瓣驻留时间">
            <el-input
              v-model.number="localFormAdd.resideTime"
            ></el-input>
          </el-form-item>
          <el-form-item label="发射衰减">
            <!-- <el-input
              v-model.number="localFormAdd.level"
            ></el-input> -->

            <comma-number-input
            v-model="localFormAdd.level"
            >
            </comma-number-input>
          </el-form-item>

          <el-form-item label="单波位积累个数">
            <el-input
              v-model.number="localFormAdd.cpiPulseNum"
            ></el-input>
          </el-form-item>

        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/mbBox.less";
import {postLeiKangMN,putLeiKangMN,deleteLeiKangMN} from "@/api/api";
import commaNumberInput from '@/components/chartBox/commaNumberInput.vue'
export default {
  props: {
    topForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    caozuotype: {
      type: String,
      default: "add",
    },
  },
  components:{
    commaNumberInput
  },
  data() {
    return {
      localFormAdd: {
        freqType: null,
        freqValue: [],
        freqGroupNum: [],
        jitterFreqBand: 0,
        jitterFreqNum: 0,
        periodType: null,
        periodValue: [],
        periodGroupNum: [],
        jitterPeriodBand: 0,
        jitterPeriodNum: 0,
        slideRange: null,
        slideStep: 0,
        widthType: null,
        widthValue: [],
        widthGroupNum: [],
        jitterWidthBand: null,
        jitterWidthNum: null,
        pulseType: null,
        pulseBand: null,
        fmDirection: null,
        codeWidth: null,
        freqCode: 0,
        subPulseWidth: [],
        subPulseFreq: [],
        scanType: null,
        scanFunction: 0,
        scanPeriodValue: null,
        resideTime: null,
        level: [],
        cpiPulseNum: null,
      },
      localFormParam: {
        modStyle: "",
        signalRate: "",
        codeRate: "",
        sweepStartRate: "",
        sweepEndRate: "",
        sweepNum: "",
        sweepSpeed: "",
        codeLength: "",
        expandSeries: "",
      },
      localTopForm:{
        id:'',
        name:'',
        time:'',
        param:{
          minRfFreq:null,
          maxRfFreq:null,
          paramBody:{
            freqType:null,
            signalType:null,
            cwFreq:null,
            cwLevel:null,
            pulseSafeDelay:null,
            signalCollection:[]
          }
        },
      },

      pinlvji: [],
      pageNum: 1,
      pageSize: 10,
      selectedIndex: "",
      Boxright: false,
      gain: 5,
      //频率类型
      PLoption: [
        { value: '0', label: "频率固定" },
        { value: '1', label: "脉间频率跳变" },
        { value: '2', label: "脉组频率跳变" },
        { value: '3', label: "脉间频率捷变" },
        { value: '4', label: "脉组频率捷变" },
      ],
      //重周类型
      ZZoption:[
        { value: 0, label: "重周固定" },
        { value: 1, label: "重频参差" },
        { value: 2, label: "重频抖动" },
        { value: 3, label: "重频脉组参差" },
        { value: 4, label: "重频滑变" },
      ],
      //脉宽类型
      MKoption: [
        { value: 0, label: "脉宽固定" },
        { value: 1, label: "脉宽参差" },
        { value: 2, label: "脉宽抖动" },
        { value: 3, label: "脉宽脉组参差" },
      ],
      //脉内类型
      MNoption:[
        { value: 0, label: "常规脉冲" },
        { value: 1, label: "线性调频" },
        { value: 2, label: "非线性调频" },
        { value: 3, label: "二相编码" },
        { value: 4, label: "四相编码" },
        { value: 5, label: "空" },
        { value: 6, label: "空" },
        { value: 7, label: "频率分集" },
        { value: 8, label: "空" },
      ],
      //扫描类型
      SMoption:[
        { value: 0, label: "固定功率" },
        { value: 1, label: "圆扫" },
        { value: 2, label: "跟踪" },
        { value: 3, label: "扇扫" },
        { value: 4, label: "锥扫" },
        { value: 5, label: "波位捷变" },
      ],
    };
  },

  watch: {
    // topForm(){
    //   console.log(this.topForm,'localTopFormlocalTopForm');
      
    //   this.localTopForm = JSON.parse(JSON.stringify(this.topForm));
    // }
  },
  methods: {
    // 处理输入变化
      handleInput(value) {
          // 过滤掉非数字、非逗号、非小数点的字符
          this.inputString = value.replace(/[^\d,.-]/g, '');
          // 将字符串分割为数组
          const stringArray = this.inputString.split(',');
          
          // 转换为数字数组（过滤无效值）
          this.numberArray = stringArray
            .map(str => {
              const trimmed = str.trim();
              if (trimmed === '') return null;
              
              // 尝试转换为数字
              const num = parseFloat(trimmed);
              return isNaN(num) ? null : num;
            })
            .filter(num => num !== null);
      },
    //变换码元速率
    setMYSL(key) {
      let label = "";
      let alldata = [
        { value: 7, label: "16KHz" },
        { value: 6, label: "32KHz" },
        { value: 5, label: "64KHz" },
        { value: 4, label: "128KHz" },
        { value: 3, label: "256KHz" },
        { value: 2, label: "512KHz" },
        { value: 1, label: "1024KHz" },
        { value: 0, label: "2048KHz" },
      ];
      alldata.forEach((item) => {
        if (item.value == key) {
          label = item.label;
        }
      });
      return label;
    },
    handleTimeInput(value, maxvalue, minvalue, key) {
      // 修改正则表达式，允许小数点
      let num = String(value).replace(/[^\d.]/g, ""); // 只保留数字和小数点
      // 移除多余的小数点（最多保留一个）
      num = String(num).replace(/\.{2,}/g, ".");
      num = String(num).replace(/^\./g, "");

      // 转换为数字并限制范围
      let floatNum = parseFloat(num) || minvalue;
      if (floatNum < minvalue) floatNum = minvalue;
      if (floatNum > maxvalue) floatNum = maxvalue;

      // 更新对应字段
      switch (key) {
        case "shpl":
          this.localFormAdd.param.signalRate = floatNum;
          break;
        // 其他情况...
      }
    },
    TZFFChange(key) {
      switch (key) {
        case 0:
          return "AM";
        case 1:
          return "FM";
        case 2:
          return "FSK";
        case 3:
          return "BPSK";
        case 4:
          return "MSK";
        case 5:
          return "QPSK";
        case 6:
          return "8PSK";
        case 7:
          return "16QAM";
      }
    },
    PLLXChange(key){
      switch (key){
        case 0:
          return '频率固定'
        case 1:
          return '脉间频率跳变'
        case 2:
          return '脉组频率跳变'
        case 3:
          return '脉间频率捷变'
        case 4:
          return '脉组频率捷变'
      }
    },
    // ZZLXoption(key){
    //   let newkey=null
    //   this.ZZoption.forEach(item=>{
    //     if(key==item.value){
    //       newkey=item.value
    //     }
    //   })
    //   return newkey
    // },
    optionChange(key,type){
      let option=[]
      let newkey=''
      switch(type){
        case 'PLLX':
          option=this.PLoption
          break;
        case 'ZZLX':
          option=this.ZZoption
          break;
        case 'MKLX':
          option=this.MKoption
          break;
        case 'MNLX':
          option=this.MNoption
          break;
      }
      option.forEach(item=>{
        if(item.value==key){
          newkey=item.label
        }
      })
      
      return newkey
    },
    optionSet() {
    },
    ganraoChange(key) {
      // console.log(key);
      
      this.optionSet(key);
    },
    BoxleftClick(params, index) {
        console.log(params,'BoxleftClickBoxleftClick');
        // this.pinlvji=params.param.hopRateList


        this.selectedIndex = index;
        this.localFormAdd = JSON.parse(JSON.stringify(params));
        this.Boxright = true;
        this.optionSet(params.signalType);

        // if (params.signalType === 1) {
        //     this.changPL();
        // }
    },




       //保存按钮
    saveXinData(save) {
      if (this.localTopForm.id == "") {
        if (this.caozuotype == "add") {
          this.createSave(this.localTopForm);
        } else {
          this.indculdeFuntion(save);
        }
      }
      else {
        if (this.localTopForm.signalType === "") {
          this.$message.error("请选择信号类型");
        } else {
            // if(this.localTopForm.signalType==1&&this.localTopForm.simulateList.length>0){
            //     this.$message.error('该类型只能选择一个信号')
            // }else{
            //     }
            this.indculdeFuntion(save);
        }
      }
    },

    //添加模拟数据模版
    indculdeFuntion(save) {
        //无选中左侧选项
      if (this.selectedIndex === "") {
        console.log(this.Boxright,'this.Boxright');
        //右侧数据输入框
        if (this.Boxright) {
          // this.localFormAdd.signalType = this.localTopForm.signalType;
          // this.localFormAdd.gain = this.localTopForm.gain;
          // let param = JSON.parse(JSON.stringify(this.localFormAdd));
          // if (this.localFormAdd.signalType == 1 && this.pinlvji.length > 0) {
          //   param.param.hopRateList = this.pinlvji;
          // }
          // console.log(param,this.localTopForm,'localTopForm');
          let trackParam=[]
          trackParam[0]=this.localFormAdd 
          // trackParam.push(trackParam)

          this.localTopForm.param.paramBody.signalCollection=[]
          this.localTopForm.param.paramBody.signalCollection.push({trackParam:trackParam})
          console.log(this.localTopForm,'localTopForm');
          // console.log(this.localFormAdd,'localFormAdd');
          this.putLeiKangMN(this.localTopForm)

          
          // this.localTopForm.simulateList.push(param);
          // this.AddLeiKangMN(this.localTopForm, save);

        }else{
            if(this.localTopForm.simulateList.length>0){
                this.$message.error('此类型只能添加一个信号---');
            }else{
                console.log('此类型wei添加一个信号');
            }
        }


      } else {
        let param = JSON.parse(JSON.stringify(this.localFormAdd));
        // console.log(param,this.localTopForm.param.paramBody.signalCollection,this.selectedIndex,save,'BoxleftClickBoxleftClick');
        this.localTopForm.param.paramBody.signalCollection[this.selectedIndex]=param

        // this.localTopForm.simulateList[this.selectedIndex].param = param.param;

        // if (this.localTopForm.signalType == 1 && this.pinlvji.length > 0) {
        //   this.localTopForm.simulateList[this.selectedIndex].param.hopRateList =this.pinlvji;
        // }
        // this.localTopForm.simulateList[this.selectedIndex].gain = this.gain;
        // this.selectedIndex = "";

        this.AddLeiKangMN(this.localTopForm, save);

      }
    },
    //初始保存
    createSave(param) {
      postLeiKangMN(param)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("保存成功");
            console.log(res,'paramsnew');
            this.$emit("getShebeiList");
          }
        })
        .catch((error) => {
          console.error("请求失败:", error); // 避免 Uncaught Error
          this.$message.error("网络错误，请求失败");
        });
    },
 
    async addXinHao() {
      this.Boxright=true
      if (this.localTopForm.id == "") {
        this.$message.error("请先保存信息");
      } else {
        this.optionSet(this.localTopForm.signalType);

        if (this.Boxright) {
            console.log(this.Boxright, this.localTopForm.signalType == 1 ,
            this.localTopForm.simulateList.length > 0,'this.Boxrightthis.Boxright');
            
          if (this.localTopForm.signalType == 1 &&this.localTopForm.simulateList.length > 0) {
            this.Boxright = false;
            this.$message.error("此类型只能添加一个信号");
          } else {
            console.log('此类型只能添加一个信号+++++++++++++');
            
            await this.saveXinData("save");
            this.localFormAdd.param = this.localFormParam;
          }
        } else {
          switch (this.localTopForm.signalType) {
            case "":
              this.$message.error("请选择信号类型");
              break;
            case 0:
              this.Boxright = true;
              this.selectedIndex = "";
              this.localFormAdd.param = this.localFormParam;
              break;
            case 1:
                if(this.localTopForm.simulateList.length>0){
                    this.Boxright = false;
                    this.$message.error("此类型只能添加一个信号");
                }else{
                    this.Boxright = true;
                    this.localFormAdd.param = this.localFormParam;
                }
              break;
            case 2:
              this.Boxright = true;
              this.selectedIndex = "";
              this.localFormAdd.param = this.localFormParam;
              break;
          }
        }
      }
    },

    //更新数据
    putLeiKangMN(params){
      putLeiKangMN(params).then(res => { 
        console.log(res, "res");
        if(res.data.code==200){
          this.$message.success('保存成功')
        }
        
      });
    },

    //删除数据条数
    deleteDataBoxright(key, index) {
      this.localTopForm.param.paramBody.signalCollection.splice(index, 1);
      this.AddLeiKangMN(this.localTopForm, "delete");
    },
    // 新增
    AddLeiKangMN(foram, save) {
      postLeiKangMN(foram).then((res) => {
        if (res.data.code == 200) {
          switch (save) {
            case "add":
              this.$message.success("新增成功");
              break;
            case "save":
              this.Boxright = false;
              this.$message.success("保存成功");
              break;
            case "delete":
              this.Boxright = false;
              this.$message.success("删除成功");
              break;
          }
          this.$emit("getShebeiList");
        } else if (res.data.code == 4000) {
          this.localFormAdd = {
            signalType: "",
            param: {
              modStyle: "",
              signalRate: "",
              codeRate: "",
              sweepStartRate: "",
              sweepEndRate: "",
              sweepNum: "",
              sweepSpeed: "",
              codeLength: "",
              expandSeries: "",
            },
          };
          this.localTopForm.param.paramBody.signalCollection.splice(-1, 1);
          this.$message.error(res.data.message);
        } else {
          this.localTopForm.simulateList.splice(1);
          this.$message.error(res.data.message);
        }
      });
    },
    deleteLeiKangMN(id){
      deleteLeiKangMN(id).then(res=>{
        console.log(res);
      }).catch(error=>{
        console.log(error);
      })
    },

    changPL() {
      let min = this.localFormAdd.param.sweepStartRate;
      let max = this.localFormAdd.param.sweepEndRate;
      let step = this.localFormAdd.param.sweepNum;
      this.generateAndSortNumbers(min, max, step);
    },
    changeZZPL(value) {
      console.log(
        value,
        this.localFormAdd.param.sweepStartRate,
        "changeZZPLchangeZZPL"
      );
      if (this.localFormAdd.param.sweepStartRate) {
        let minnumber = value - this.localFormAdd.param.sweepStartRate;
        if (minnumber > 20) {
          this.localFormAdd.param.sweepEndRate =
            this.localFormAdd.param.sweepStartRate + 20;
          this.$message.error("开始频率差值大于20MHz");
        }
        this.changPL();
      } else {
        this.$message.error("请先填写开始频率");
      }
    },
    // 生成随机数
    generateRandomNumbers(minvalue, maxvalue, allstep) {
      const result = [];
      const min = minvalue;
      const max = maxvalue;
      const step = 0.025; // 设置步长为0.025
      // 计算可能的数值范围
      const minSteps = Math.ceil(min / step);
      const maxSteps = Math.floor(max / step);

      for (let i = 0; i < allstep; i++) {
        // 生成随机步数
        const randomSteps =
          Math.floor(Math.random() * (maxSteps - minSteps + 1)) + minSteps;

        // 计算对应的数值
        const randomNum = randomSteps * step;

        result.push(parseFloat(randomNum.toFixed(3))); // 保留3位小数避免浮点数精度问题
      }

      return result;
    },
    generateAndSortNumbers(min, max, step) {
      // 生成随机数
      const randomNumbers = this.generateRandomNumbers(min, max, step);
      // 排序（升序）
      this.sortedRandomNumbers = randomNumbers.sort((a, b) => a - b);
      this.pinlvji = this.sortedRandomNumbers;
    },
  },
  mounted() {
    if(this.caozuotype=='update'){
      this.localTopForm = JSON.parse(JSON.stringify(this.topForm));
      console.log(this.localTopForm,'localTopForm');
    }
  },
};
</script>
<style lang="less" scoped>

.line{
  width: 80%;
  height: 0px;
  background: #ffffff26;
}
.buttonStyle {
  color: #fff10d !important;
}
.deleteStyle {
  color: #fa5151 !important;
}

.PinPuPopor {
  width: 100%;
  .PinPuPopor-title {
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid #1c735e;
    justify-content: left;
  }
}

.inpotBox {
  background-color: #ffffff26;
  color: #fff;
  border: 1px solid #ffffff4c;
  // width: 320px;
}

// ::v-deep .el-dialog__body{
//     padding: 0 !important;
// }
.XHMNinputBox {
  width: 100%;
  padding: 20px 20px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  .el-form--inline {
    width: 100%;
    // flex-flow: row nowrap;
  }
  ::v-deep .el-form-item{
    width: 32%;
  }
  ::v-deep .el-form-item__label {
    width: 160px;
  }
  ::v-deep .el-form-item__content {
    width: calc(100% - 160px);
    .el-select{
      width: 100%;
    }
  }
}
.XHMNmainBox {
  width: 100%;
  height: 468px;
  border-top: 1px solid #1c735e;
  padding: 30px 20px;
  display: flex;
  .XHMNmainBoxleft {
    width: 35%;
    height: 100%;
    color: #fff;
    overflow: auto;
    border-right: 1px solid #ffffff4c;
    .XHMNBoxleftmain.selected {
      background: #1c735e;
    }
    .XHMNBoxleftmain {
      width: 470px;
      height: 78px;
      color: #fff;
      display: flex;
      flex-flow: row;
      justify-content: center;
      align-items: center;
      background: #ffffff26;
      border: 1px solid #ffffff4c;
      margin-bottom: 20px;
      position: relative;
      .XHMNBoxleftmain-left {
        width: 40px;
        height: 80%;
        font-size: 18px;
        border-right: 1px solid #ffffff4c;
        // text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .XHMNBoxleftmain-right {
        padding-left: 20px;
        width: calc(100% - 40px);
        font-size: 18px;
        .XHMNBoxleftmain-right-box{
          width: 100%;
          display: flex;
          justify-content: space-between;
          span{
            width: 50%;
          }

        }

      }
      .closeButton {
        position: absolute;
        font-size: 16px;
        cursor: pointer;
        right: 10px;
        top: 10px;
      }
    }
  }
  .XHMNmainBoxright {
    width: 65%;
    height: 100%;
    display: flex;
    flex-flow: column;
    overflow: auto;
    ::v-deep .el-form {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      align-self: start;
      padding-left: 50px;
      gap: 20px;
      border-bottom: 1px solid #ffffff4c;

    }
    ::v-deep .el-form-item {
      width:30%;
      background: #ffffff26;
      box-sizing: border-box;
      .el-form-item__label { 
        width: 140px;
      }
      .el-form-item__content { 
        width: calc(100% - 140px);
      }
    }
    .PinLvJin {
      width: 100%;
      flex-grow: 1;
      padding-left: 50px;
      max-height: 50%;
      box-sizing: border-box;
      .pinlvjiMain {
        background: #ffffff26;
        width: 100%;
        height: 100%;
        // height: calc(100% - 40px);
        padding: 20px 20px;
        border: 1px solid #ffffff4c;

        .pinlvjiTittle {
          font-size: 18px;
          color: #fff;
          margin-bottom: 10px;
        }
        .pinlvjiMainsmall {
          display: flex;
          flex-flow: row wrap;
          max-height: calc(100% - 30px);
          justify-content: flex-start;
          align-items: flex-start;
          overflow: auto;
          .mainBox {
            width: 80px;
            height: 30px;
            background: #ffffff26;
            border: 1px solid #ffffff4c;
            color: #fff;
            text-align: center;
            line-height: 30px;
          }
        }
      }
    }
  }
}
::v-deep .el-form-item {
  margin: 10px 0;
}
</style>