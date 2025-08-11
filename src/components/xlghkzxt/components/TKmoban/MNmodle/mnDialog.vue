<template>
  <div>
    <div class="XHMNinputBox">
      <el-form :inline="true">
        <el-form-item label="模板名称" style="flex-flow: row nowrap !important">
          <el-input v-model="localTopForm.name" maxlength="15" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="生效时间">
          <el-input
            v-model="localTopForm.time"
            @blur="localTopForm.time=handleTimeInput(localTopForm.time,3600,0,0)"
            type="number"
            placeholder="请输入0~3600秒"
          ></el-input>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-select
            v-model="localTopForm.signalType"
            :disabled="localTopForm.simulateList.length > 0"
            @change="ganraoChange"
            placeholder="请选择"
          >
            <el-option
              v-for="device in XHLXoption"
              :key="device.value"
              :label="device.label"
              :value="device.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发射增益">
          <el-input
            v-model="localTopForm.gain"
            type="number"
            :disabled="Boxright"
            @change="GainChange"
            @blur="localTopForm.gain=handleTimeInput(localTopForm.gain,63,0,'gain')"
            placeholder="0~63db"
          >
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="saveXinData('save')">保存</el-button>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addXinHao"
          >添加信号</el-button
        >
      </el-form>
    </div>
    <div class="XHMNmainBox">
      <div class="XHMNmainBoxleft">
        <div
          class="XHMNBoxleftmain"
          v-for="(item, index) in localTopForm.simulateList"
          :key="index"
          @click="BoxleftClick(item, index)"
          :class="{ selected: selectedIndex === index }"
        >
          <div class="XHMNBoxleftmain-left">{{ index + 1 }}</div>
          <div class="XHMNBoxleftmain-right">
            <div class="XHMNBoxleftmain-right-top">
              信号类型：{{item.signalType == 0? "定频": item.signalType == 1? "跳频": "扩频"}}
              调制方式：{{ TZFFChange(item.param.modStyle) }}
            </div>
            <div class="XHMNBoxleftmain-right-bottom" v-if="localTopForm.signalType != 1">
              信号频率：{{ item.param.signalRate }}MHz 
              码元速率：{{setMYSL(item.param.codeRate)}}
            </div>
            <div class="XHMNBoxleftmain-right-bottom" v-else>
              开始频率：{{ item.param.sweepStartRate}}MHz 
              终止速率：{{item.param.sweepEndRate}}MHz 
            </div>
          </div>
          <i
            class="el-icon-close closeButton"
            @click.stop="deleteDataBoxright(item, index)"
          ></i>
        </div>
      </div>
      <div class="XHMNmainBoxright">
        <el-form :model="localFormAdd" :inline="true" v-if="Boxright">
          <el-form-item label="调制方式">
            <el-select
              v-model="localFormAdd.param.modStyle"
              placeholder="请选择"
              @change="changeModStyle"
            >
              <el-option
                v-for="device in TZYSoption"
                :key="device.value"
                :label="device.label"
                :value="device.value"
              ></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="频率范围(MHz)">
            <el-select
              v-model="localFormAdd.param.rateRange"
              placeholder="请选择"
              @change="PLFWchange"
            >
              <el-option
                v-for="device in MNPLFWoption"
                :key="device.value"
                :label="device.label"
                :value="device.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="信号频率(MHz)" v-if="localTopForm.signalType != 1">
            <el-input
              v-model="localFormAdd.param.signalRate"
              type="number"
              placeholder="1.5~3000"
              maxlength="4"
              @blur="localFormAdd.param.signalRate=handleTimeInput(localFormAdd.param.signalRate, maxRfFreq,minRfFreq, 2)"
            ></el-input>
          </el-form-item>
          <el-form-item label="码元速率" v-if="localTopForm.signalType != 1">
            <el-select
              v-model="localFormAdd.param.codeRate"
              placeholder="请选择"
            >
              <el-option
                v-for="device in XHDKoption"
                :key="device.value"
                :label="device.label"
                :value="device.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="开始频率(MHz)"
            v-if="localTopForm.signalType == 1"
          >
            <el-input
              v-model.number="localFormAdd.param.sweepStartRate"
              @blur="
              changPL();
              changeKSPL(localFormAdd.param.sweepStartRate);

              localFormAdd.param.sweepStartRate=handleTimeInput(localFormAdd.param.sweepStartRate,maxRfFreq,minRfFreq,2) "

              type="number"
              placeholder="跳频开始频率"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="终止频率(MHz)"
            v-if="localTopForm.signalType == 1"
            
          >
            <el-input
              v-model="localFormAdd.param.sweepEndRate"
              @blur="
              changPL();
              changeZZPL(localFormAdd.param.sweepEndRate);
              localFormAdd.param.sweepEndRate=handleTimeInput(localFormAdd.param.sweepEndRate, maxRfFreq, minRfFreq, 2);"
              type="number"
              placeholder="跳频终止频率"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="跳频点数(个)"
            v-if="localTopForm.signalType == 1"
          >
            <el-input
              v-model.number="localFormAdd.param.sweepNum"
              type="number"
              @blur="
              localFormAdd.param.sweepNum=handleTimeInput(localFormAdd.param.sweepNum,256,0,0);"
              @change="changPL();"
              placeholder="0~256"
              maxlength="3"

            ></el-input>
          </el-form-item>
          <el-form-item label="跳速(H/S)" v-if="localTopForm.signalType == 1">
            <el-input
              v-model.number="localFormAdd.param.sweepSpeed"
              type="number"
              @blur="localFormAdd.param.sweepSpeed=handleTimeInput(localFormAdd.param.sweepSpeed,2000,5,0)"
              placeholder="5~2000"
              maxlength="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="码长" v-if="localTopForm.signalType == 2">
            <el-select
              v-model="localFormAdd.param.codeLength"
              placeholder="请选择"
            >
              <el-option
                v-for="device in KPoption.MCoption"
                :key="device.value"
                :label="device.label"
                :value="device.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扩频系列" v-if="localTopForm.signalType == 2">
            <el-select
              v-model="localFormAdd.param.expandSeries"
              placeholder="请选择"
            >
              <el-option
                v-for="device in KPoption.KPXLoption"
                :key="device.value"
                :label="device.label"
                :value="device.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="PinLvJin" v-if="Boxright && localTopForm.signalType == 1">
          <div class="pinlvjiMain">
            <div class="pinlvjiTittle">频率集（MHz）</div>
            <div class="pinlvjiMainsmall">
              <div
                class="mainBox"
                v-for="(item, index) in pinlvji"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/mbBox.less";
import { postTongKangMN } from "@/api/api";
import {handleTimeInput} from '@/utils/numberUtils'

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
  data() {
    return {
      localFormAdd: {
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

      maxRfFreq: 0,
      minRfFreq: 1000,
      localTopForm: JSON.parse(JSON.stringify(this.topForm)),
      pinlvji: [],
      pageNum: 1,
      pageSize: 10,
      selectedIndex: "",
      Boxright: false,
      gain: 5,
      XHLXoption: [
        { value: 0, label: "定频" },
        { value: 1, label: "跳频" },
        { value: 2, label: "扩频" },
      ],

      TZYSoption: [],
      XHDKoption: [],
      XHDKoptionNew:[
                { value: 0, label: "2048kHz" },
            ],
      DPoption: {
        TZYSoption: [
          { value: 0, label: "AM" },
          { value: 1, label: "FM" },
          { value: 2, label: "BPSK" },
          { value: 3, label: "QPSK" },
          { value: 4, label: "8PSK" },
          { value: 5, label: "16QAM" },
          { value: 6, label: "FSK" },
          { value: 7, label: "MSK" },
        ],
        XHDKoption: [
          { value: 7, label: "16kHz" },
          { value: 6, label: "32kHz" },
          { value: 5, label: "64kHz" },
          { value: 4, label: "128kHz" },
          { value: 3, label: "256kHz" },
          { value: 2, label: "512kHz" },
          { value: 1, label: "1024kHz" },
          { value: 0, label: "2048kHz" },
        ],
      },
      TPoption: {
        TZYSoption: [{ value: 3, label: "QPSK" }],
        XHDKoption: [{ value: 7, label: "16KHz" }],
      },
      KPoption: {
        TZYSoption: [{ value: 3, label: "QPSK" }],
        XHDKoption: [
          { value: 7, label: "16KHz" },
          { value: 6, label: "32KHz" },
          { value: 5, label: "64KHz" },
          { value: 4, label: "128KHz" },
          { value: 3, label: "256KHz" },
          { value: 2, label: "512KHz" },
          { value: 1, label: "1024KHz" },
          { value: 0, label: "2048KHz" },
        ],
        MCoption: [
          { value: 0, label: "63" },
          { value: 1, label: "127" },
          { value: 2, label: "255" },
          { value: 3, label: "511" },
          { value: 4, label: "1023" },
          { value: 5, label: "2047" },
        ],
        KPXLoption: [
          { value: 0, label: "m序列" },
          { value: 1, label: "gold序列" },
          { value: 2, label: "Walsh序列" },
        ],
      },
      MNPLFWoption: [
        { value: 0, label: "1.5-30MHZ" },
        { value: 1, label: "30-512MHZ" },
        { value: 2, label: "512-2000MHZ" },
        { value: 3, label: "2000-3000MHZ" },
      ],
    };
  },

  watch: {
    topForm: {
      deep: true,
      handler(newVal) {
        this.localTopForm = JSON.parse(JSON.stringify(newVal));
      },
    },
  },
  methods: {
    handleTimeInput,
    GainChange(val){
      this.localTopForm.simulateList.forEach(item => {
        console.log(item,'GainChange');
        item.gain = Number(val)
      });
    },
    changeModStyle(val){
      console.log(val,'changeModStyle');
        if(val==0||val==1){
          this.XHDKoption=this.XHDKoptionNew
        }else{
          this.XHDKoption=this.DPoption.XHDKoption
        }
    },

    PLFWchange(key){
      switch(key){
        case 0: 
          this.maxRfFreq=30
          this.minRfFreq=1.5
          break;
        case 1: 
          this.maxRfFreq=512
          this.minRfFreq=30
          break;
        case 2: 
          this.maxRfFreq=2000
          this.minRfFreq=512
          break;
        case 3: 
          this.maxRfFreq=3000
          this.minRfFreq=2000
          break;
      }
      // this.localFormAdd.param.signalRate=this.minRfFreq
    },
    //变换码元速率
    setMYSL(key) {
      let label = "";
      let alldata = [
        { value: 7, label: "16kHz" },
        { value: 6, label: "32kHz" },
        { value: 5, label: "64kHz" },
        { value: 4, label: "128kHz" },
        { value: 3, label: "256kHz" },
        { value: 2, label: "512kHz" },
        { value: 1, label: "1024kHz" },
        { value: 0, label: "2048kHz" },
      ];
      alldata.forEach((item) => {
        if (item.value == key) {
          label = item.label;
        }
      });
      return label;
    },
    
    TZFFChange(key) {
      switch (key) {
        case 0:
          return "AM";
        case 1:
          return "FM";
        case 2:
          return "BPSK";
        case 3:
          return "QPSK";
        case 4:
          return "8PSK";
        case 5:
          return "16QAM";
        case 6:
          return "FSK";
        case 7:
          return "MSK";
      }
    },
    optionSet(key) {
      switch (key) {
        case 0:
          this.TZYSoption = this.DPoption.TZYSoption;
          if(this.localFormAdd.param.modStyle==0||this.localFormAdd.param.modStyle==1){
            this.XHDKoption = this.XHDKoptionNew;
          }else{
            this.XHDKoption = this.DPoption.XHDKoption;
          }
          break;
        case 1:
          this.TZYSoption = this.TPoption.TZYSoption;
          this.XHDKoption = this.TPoption.XHDKoption;
          break;
        case 2:
          this.TZYSoption = this.KPoption.TZYSoption;
          this.XHDKoption = this.KPoption.XHDKoption;
          break;
      }
    },
    ganraoChange(key) {
      this.optionSet(key);
    },
    BoxleftClick(params, index) {
        this.pinlvji=params.param.hopRateList
        this.selectedIndex = index;
        this.localFormAdd = JSON.parse(JSON.stringify(params));
        this.Boxright = true;
        this.optionSet(params.signalType);
        this.PLFWchange(params.param.rateRange)
    },




       //保存按钮
    saveXinData(save) {
      if (this.localTopForm.id == "") {
        if (this.caozuotype == "add") {
          this.createSave();
        } else {
          this.indculdeFuntion(save);
        }
      }
      else {
        if (this.localTopForm.signalType === "") {
          this.$message.error("请选择信号类型");
        } else {
            this.indculdeFuntion(save);
        }
      }
    },













    //添加模拟数据模版
    indculdeFuntion(save) {
        //无选中左侧选项
      if (this.selectedIndex === "") {
        //右侧数据输入框
        if (this.Boxright) {
          this.localFormAdd.signalType = this.localTopForm.signalType;

          this.localFormAdd.gain = this.localTopForm.gain;
          let param = JSON.parse(JSON.stringify(this.localFormAdd));
          if (this.localFormAdd.signalType == 1 && this.pinlvji.length > 0) {
            param.param.hopRateList = this.pinlvji;
          }
          this.localTopForm.simulateList.push(param);
          this.AddTongKangMN(this.localTopForm, save);
        }
        else{
            // this.$message.warning('无需要保存的数据');
            this.AddTongKangMN(this.localTopForm, save);
        }
      } else {
        let param = JSON.parse(JSON.stringify(this.localFormAdd));
        this.localTopForm.simulateList[this.selectedIndex].param = param.param;
        if (this.localTopForm.signalType == 1 && this.pinlvji.length > 0) {
          this.localTopForm.simulateList[this.selectedIndex].param.hopRateList =this.pinlvji;
        }
        this.localTopForm.simulateList[this.selectedIndex].gain = this.gain;
        this.AddTongKangMN(this.localTopForm, save);
        this.selectedIndex = "";
      }
    },
    //初始保存
    createSave() {
      let param = {
        name: this.localTopForm.name,
        time: this.localTopForm.time,
      };
      postTongKangMN(param)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("保存成功");
            this.localTopForm.id = res.data.id;
            this.$emit("getShebeiList");
          }
        })
        .catch((error) => {
          console.error("请求失败:", error); // 避免 Uncaught Error
          this.$message.error("网络错误，请求失败");
        });
    },
 
    async addXinHao() {
      if (this.localTopForm.id == "") {
        this.$message.error("请先保存信息");
      } else {
        this.optionSet(this.localTopForm.signalType);
        if (this.Boxright) {
          if (this.localTopForm.signalType !==0 &&this.localTopForm.simulateList.length > 0) {
            this.Boxright = false;
            this.$message.error("此类型只能添加一个信号");
          } else {
            await this.saveXinData("save");
            this.localFormAdd.param = this.localFormParam;
            
            this.Boxright = true;
            console.log('this.Boxrightthis.Boxright',this.Boxright);
          }
        } else {
          switch (this.localTopForm.signalType) {
            case "":
              this.$message.error("请选择信号类型");
              break;
            case 0:
              this.Boxright = true;
              this.selectedIndex = "";
              this.localFormAdd.param = {
                modStyle: "",
                signalRate: "",
                codeRate: "",
                sweepStartRate: "",
                sweepEndRate: "",
                sweepNum: "",
                sweepSpeed: "",
                codeLength: "",
                expandSeries: "",
              }
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
              if(this.localTopForm.simulateList.length>0){
                    this.Boxright = false;
                    this.$message.error("此类型只能添加一个信号");
              }else{
                    this.Boxright = true;
                    this.selectedIndex = "";
                    this.localFormAdd.param = this.localFormParam;
              }
              break;
          }
        }
      }
    },

    //删除数据条数
    deleteDataBoxright(key, index) {
      this.localTopForm.simulateList.splice(index, 1);
      this.AddTongKangMN(this.localTopForm, "delete");
    },
    // 新增
    AddTongKangMN(foram, save) {
      postTongKangMN(foram).then((res) => {
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
          this.localTopForm.simulateList.splice(-1, 1);

          this.$message.error(res.data.message);
        } else {
          this.localTopForm.simulateList.splice(1);
          this.$message.error(res.data.message);
        }
      }).catch(err=>{
        console.log(err);
        
      })
    },

    changPL() {
      let min = this.localFormAdd.param.sweepStartRate;
      let max = this.localFormAdd.param.sweepEndRate;
      let step = this.localFormAdd.param.sweepNum;
      this.generateAndSortNumbers(min, max, step);
    },
    changeKSPL(value){
      if (this.localFormAdd.param.sweepEndRate) {
        let maxnumber =this.localFormAdd.param.sweepEndRate - value;
        if (maxnumber > 20) {
          this.localFormAdd.param.sweepStartRate = this.localFormAdd.param.sweepEndRate - 20;
          this.$message.error("终止频率差值大于20MHz");
        }
        this.changPL();
      } else {
        this.$message.error("请先填写开始频率");
      }
    },
    changeZZPL(value) {
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
      // this.sortedRandomNumbers = randomNumbers.sort((a, b) => a - b);
      // this.pinlvji = this.sortedRandomNumbers;
      this.pinlvji =randomNumbers

    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
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
  ::v-deep .el-form-item__label {
    width: 90px;
  }
}
.XHMNmainBox {
  width: 100%;
  height: 648px;
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
    width: 60%;
    height: 100%;
    display: flex;
    flex-flow: column;
    ::v-deep .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      align-self: start;
      padding-left: 50px;
    }
    ::v-deep .el-form-item {
      width: 45%;
      background: #ffffff26;
      box-sizing: border-box;
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