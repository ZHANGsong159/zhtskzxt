<template>
    <div>
            <div class="dialog-title-with-image">
              <img src="@/assets/img/组21_@1x.png" alt="" />
              <span>设备名称：{{ shebeiData.deviceName }}</span>
              <img src="@/assets/img/组21Right_@1x.png" alt="" />
            </div>
            <div class="dialogMainBody">
              <div class="XHMNinputBox">
                <el-form :inline="true">
                  <el-form-item label="模板名称">
                    <el-select
                      v-model="MNtopformAdd.name"
                      placeholder="请选择"
                      @change="changeMNMBname()"
                    >
                      <el-option
                        v-for="device in MNoption"
                        :key="device.id"
                        :label="device.name"
                        :value="device.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="生效时间">
                    <el-input
                      disabled
                      v-model="MNtopformAdd.time"
                      type="number"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="发射增益">
                      <el-input 
                      disabled
                      v-model="gain" 
                      type="number" 
                      placeholder="0~63db" 
                      oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>63)value=63;if(value<0  )value=null"
                      > </el-input>
                  </el-form-item>
                  <el-button type="primary" @click="clickMN()">下发</el-button>
                </el-form>
              </div>
              <div class="XHMNmainBox">
                <div class="XHMNmainBoxleft">
                  <div
                    class="XHMNBoxleftmain"
                    v-for="(item, index) in BoxleftList"
                    :key="index"
                    @click="BoxleftClick(item, index)"
                    :class="{ selected: selectedIndex === index }"
                  >
                    <div class="XHMNBoxleftmain-left">{{ index + 1 }}</div>
                    <div class="XHMNBoxleftmain-right">
                      <div class="XHMNBoxleftmain-right-top">
                        <!-- {{item}} -->
                        信号类型：{{item.signalType == 0? "定频": item.signalType == 1? "跳频": "扩频"}}
                        调制方式：{{TZFFChange(item.param.modStyle)}}
                      </div>
                      <div class="XHMNBoxleftmain-right-bottom">
                        信号频率：{{ item.param.signalRate }}MHZ 
                        码元速率：{{item.param.codeRate}}KHZ
                      </div>
                    </div>
                  </div>
                </div>
                <div class="XHMNmainBoxright">
                  <el-form :model="MNformAdd" :inline="true" v-if="Boxright" disabled>
                    <el-form-item label="信号类型">
                      <el-select
                        v-model="MNformAdd.signalType"
                        placeholder="请选择"
                        @change="optionSet(MNformAdd.signalType)"
                      >
                        <el-option
                          v-for="device in XHLXoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="调制方式">
                      <el-select
                        v-model="MNformAdd.param.modStyle"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in TZYSoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="信号频率(MHZ)">
                      <el-input
                        v-model.number="MNformAdd.param.signalRate"
                        type="number"
                        placeholder="1.5~3000"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="频率范围(MHZ)">
                      <el-select
                        v-model="MNformAdd.param.rateRange"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in MNPLFWoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="码元速率(MHZ)">
                      <el-select
                        v-model.number="MNformAdd.param.codeRate"
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
                      label="跳频开始频率(MHz)"
                      v-if="signalType == 1"
                    >
                      <el-input
                        v-model.number="MNformAdd.param.sweepStartRate"
                        @blur="changPL()"
                        type="number"
                        placeholder="跳频开始频率"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="跳频终止频率(MHz)"
                      v-if="signalType == 1"
                    >
                      <el-input
                        v-model.number="MNformAdd.param.sweepEndRate"
                        @blur="changPL();changeZZPL(formAdd.param.sweepEndRate);"
                        type="number"
                        placeholder="跳频终止频率"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="跳频点数(个)" v-if="signalType == 1">
                      <el-input
                        v-model.number="MNformAdd.param.sweepNum"
                        type="number"
                        @blur="handleTimeInput(formAdd.param.sweepNum,256,0,'tiaodian');changPL();
                        "
                        placeholder="0~256"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="跳速(H/S)" v-if="signalType == 1">
                      <el-input
                        v-model.number="MNformAdd.param.sweepSpeed"
                        type="number"
                        @blur="handleTimeInput(formAdd.param.sweepSpeed,2000,5,'tiaosu' )
                        "
                        placeholder="5~2000"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="码长" v-if="signalType == 2">
                      <el-select
                        v-model="MNformAdd.param.codeLength"
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
                    <el-form-item label="扩频系列" v-if="signalType == 2">
                      <el-select
                        v-model="MNformAdd.param.expandSeries"
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

                  <div class="PinLvJin" v-if="Boxright && signalType == 1">
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
    </div>
</template>
<script>
import {
  postControlCommandSimulation,
  getTongKangMN,
} from "@/api/api";
export default {
    props:{
        shebeiData:{
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data(){
        return{
            gain:0,
            Boxright: false,
            BoxleftList: [],
            // shebeiData: {},
            GRoption: [],
            MNoption: [],
            selectedIndex: 0,
            TZYSoption: [],
            XHDKoption: [],
            XHLXoption: [
                { value: 0, label: "定频" },
                { value: 1, label: "跳频" },
                { value: 2, label: "扩频" },
            ],
            MNPLFWoption: [
                { value: 0, label: "1.5-30MHZ" },
                { value: 1, label: "30-512MHZ" },
                { value: 2, label: "512-2000MHZ" },
                { value: 3, label: "2000-3000MHZ" },
            ],
            formAdd: {
                name: "",
                time: "",
                disturbDto: {
                disturbStyle: "",
                param: {
                    rateRange: "",
                    gain: "",
                    disturbPower: "",
                    disturbRate: "",
                    disturbBand: "",
                    sweepBand: "",
                    lineInterval: "",
                    lineNum: "",
                },
                },
            },
            MNtopformAdd: {
                name: "",
                time: "",
                disturbDto: {
                param: {},
                },
            },
            DPoption: {
                TZYSoption: [
                { value: 0, label: "AM" },
                { value: 1, label: "FM" },
                { value: 2, label: "FSK" },
                { value: 3, label: "BPSK" },
                { value: 4, label: "MSK" },
                { value: 5, label: "QPSK" },
                { value: 6, label: "8PSK" },
                { value: 8, label: "16QAM" },
                ],
                XHDKoption: [
                { value: 4, label: "16KHz" },
                { value: 5, label: "32KHz" },
                { value: 6, label: "64KHz" },
                { value: 7, label: "128KHz" },
                { value: 8, label: "256KHz" },
                { value: 9, label: "512KHz" },
                { value: 10, label: "1024KHz" },
                { value: 11, label: "2048KHz" },
                ],
            },
            TPoption: {
                TZYSoption: [{ value: 5, label: "QPSK" }],
                XHDKoption: [{ value: 4, label: "16KHz" }],
            },
            KPoption: {
                TZYSoption: [{ value: 5, label: "QPSK" }],
                XHDKoption: [
                { value: 0, label: "1KHz" },
                { value: 1, label: "2KHz" },
                { value: 2, label: "4KHz" },
                { value: 3, label: "8KHz" },
                { value: 4, label: "16KHz" },
                { value: 5, label: "32KHz" },
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
            MNformAdd: {
                signalType:'',
                param:{
                modStyle: "",
                signalRate: "",
                PLfanwei: "",
                signalBand: "",
                sweepStartRate: "",
                sweepEndRate: "",
                sweepNum: "",
                sweepSpeed: "",
                codeLength: "",
                expandSeries: "",
                }
            },
        }
    },
    created() { 
        this.getTongKangMN();
    },
    methods:{
      clickMN() {
        console.log(this.BoxleftList,this.MNformAdd,'BoxleftList');
        
        let params = {};
        this.BoxleftList[this.selectedIndex] = this.MNformAdd;
        switch (this.shebeiData.deviceType) {
          case "TK":
            params = {
              deviceId: this.shebeiData.deviceId,
              deviceType: this.shebeiData.deviceType,
              tkSimulateDTOList: this.BoxleftList,
              time: this.MNtopformAdd.time,
            };
            break;
          case "LK":
            params = {
              deviceId: this.shebeiData.deviceId,
              deviceType: this.shebeiData.deviceType,
              lkSimulateDTO: this.BoxleftList,
              time: this.MNtopformAdd.time,

            };
        }
        this.postControlCommandSimulation(params)
      },
      //下发模拟命令
      postControlCommandSimulation(params) {
        postControlCommandSimulation(params).then((res) => {
          console.log(res, "res");
        }).catch(err=>{
                  console.log(err);
                  
                })
      },


        TZFFChange(key){ 
            switch(key){
                case 0:
                   return 'AM'
                case 1:
                    return 'FM'
                case 2:
                    return 'FSK'
                case 3:
                    return 'BPSK'
                case 4:
                    return 'MSK'
                case 5:
                    return 'QPSK'
                case 6:
                    return '8PSK'
                case 7:
                    return '16QAM'
            }
        },
        optionSet(key) {
            this.signalType=key
            switch (key) {
                case 0:
                this.TZYSoption = this.DPoption.TZYSoption;
                this.XHDKoption = this.DPoption.XHDKoption;
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
        BoxleftClick(params, index) {
            if(this.MNformAdd.no){
                this.BoxleftList[this.selectedIndex] = this.MNformAdd;
            }
            this.selectedIndex = index;
            this.MNformAdd = JSON.parse(JSON.stringify(params));
            this.optionSet(this.MNformAdd.signalType)
            this.Boxright = true;
        },
        //模拟模版
        getTongKangMN() {
          let params = {pageNum:1,pageSize:1000}
            getTongKangMN(params)
                .then((res) => {
                  return res.data;
                })
                .then((res) => {
                    if(res.code==200){
                        this.MNoption = res.data.list;
                    }
                }).catch(err=>{
                  console.log(err);
                  
                })
        },
        //模拟模版name改变函数
        changeMNMBname() {
        this.MNoption.forEach((item) => {

          if (item.name == this.MNtopformAdd.name) {
            console.log(item,'changeMNMBname');
            
            this.MNtopformAdd = JSON.parse(JSON.stringify(item));
                this.BoxleftList = JSON.parse(this.MNtopformAdd.param);
                if(this.BoxleftList.length>0){
                  this.gain=this.BoxleftList[0].gain
                }
            }

        });
        this.Boxright=false
        },
    },
    
}
</script>
<style lang="less" scoped>
    .dialog-title-with-image {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 72px;
      border-bottom: 1px solid #00644c;
      span {
        color: #fff;
        font-size: 24px;
      }
    }
    .dialogMainBody {
      height: calc(100% - 72px);
      padding: 0px 20px;
      display: flex;
      flex-flow: column;
      align-items: flex-start;
      // padding: 20px 30px;
      border-bottom: 1px solid #00644c;
      .el-form {
        // display: flex;
        // justify-content: center;
        // align-items: center;
        width: 100%;
      }
      .el-form--inline {
        width: 100%;
      }
    }
    .dialogMainFoot {
      display: flex;
      justify-content: flex-end;
      padding: 30px;
      .el-button {
        border: #ffffff46;
        border-radius: 0px;
      }
      .xiafaing {
        .xifabutton {
          background: transparent !important;
          border: 1px solid #ffffff49;
        }
      }
    }

.XHMNinputBox {
  width: 80%;
  padding: 0px 20px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  .el-form-item{
    width: 25%;
  }
  .el-form--inline {
    width: 100%;
  }
  .el-button {
    border: 1px solid #ffffff4c;
  }
}

.XHMNmainBox {
  width: 100%;
  height: 548px;
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
    ::v-deep .el-form-item__label{
      width: 180px;
    }
    ::v-deep .el-form-item__content{
      width: calc(100% - 180px)
    }

  }
  ::v-deep .el-form-item{
    width: 45%;
    }

}


</style>