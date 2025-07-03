<template>
    <div class="mainbody">
        <div class="dialogMainBody">
              <el-form :model="formAdd" :inline="true" >
                <el-form-item label="模板名称">
                  <el-select
                    v-model="formAdd.name"
                    placeholder="请输入模板名称"
                    @change="changePL()"
                  >
                    <el-option
                      v-for="device in GRoption"
                      :key="device.id"
                      :label="device.name"
                      :value="device.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="生效时间(秒)">
                  <el-input
                    v-model="formAdd.time"
                    type="number"
                    placeholder="范围0~3600"
                  ></el-input>
                </el-form-item>
                <el-form-item label="干扰样式">
                  <el-select
                    v-model="formAdd.disturbDto.disturbStyle"
                    placeholder="请输入干扰样式"
                  >
                    <el-option
                      v-for="device in GRYSoption"
                      :key="device.value"
                      :label="device.label"
                      :value="device.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="干扰频率范围">
                  <!-- <el-input
                    v-model="formAdd.disturbDto.param.rateRange"
                    placeholder="请输入干扰频率范围"
                  ></el-input> -->
                  <el-select v-model="formAdd.disturbDto.param.rateRange" @change="GRPLchange"  placeholder="请选择">
                    <el-option
                        v-for="device in GRPLFWoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="发射增益">
                  <el-input
                    v-model="formAdd.disturbDto.param.gain"
                    placeholder="请输入发射增益"
                  ></el-input>
                </el-form-item>
                <el-form-item label="干扰频率(KHZ)">
                  <el-input
                    v-model="formAdd.disturbDto.param.disturbRate"
                    type="number"
                    placeholder="范围0~3600"
                  ></el-input>
                </el-form-item>
                <el-form-item label="干扰带宽(KHZ)" v-if='formAdd.disturbDto.disturbStyle==0 || formAdd.disturbDto.disturbStyle==1'>
                  <el-input
                    v-model="formAdd.disturbDto.param.disturbBand"
                    type="number"
                    placeholder="范围0~3600"
                  ></el-input>
                </el-form-item>
                <!-- {{formAdd.disturbDto.param}} -->
                <el-form-item label="扫频带宽" v-if='formAdd.disturbDto.disturbStyle==2'>
                  <el-select v-model="formAdd.disturbDto.param.sweepBand" placeholder="请选择">
                      <el-option
                          v-for="device in SPDKoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                      ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="谱线间隔" v-if='formAdd.disturbDto.disturbStyle==3'>
                  <el-select v-model="formAdd.disturbDto.param.lineInterval"  placeholder="请选择">
                      <el-option
                          v-for="device in PXJGoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                      ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="谱线数量" v-if='formAdd.disturbDto.disturbStyle==3'>
                  <el-select v-model="formAdd.disturbDto.param.lineNum"  placeholder="请选择">
                      <el-option
                          v-for="device in PXSLoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                      ></el-option>
                  </el-select>
              </el-form-item>
              </el-form>
            </div>
    </div>
</template>
<script>
import {
  getShebeiList,
  postControlCommandInterference,
  getTongKangGR,
} from "@/api/api";
export default {
    props:{
        shebeiData:{
            type: Object,
            default: function () {
                return {}
            }
        },
         QRXH:{
            type: Boolean,
            default: false
        },
        Grdata:{
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data(){
        return{
            xiafa:false,
            GRoption: [],
            GRYSoption: [
                { value: 0, label: "窄带噪声干扰" },
                { value: 1, label: "宽带噪声干扰" },
                { value: 2, label: "宽带扫频干扰" },
                { value: 3, label: "梳状谱干扰" },
            ],
            GRPLFWoption:[
                { value: 0, label: '1.5-30MHZ' },
                { value: 1, label: '30-512MHZ' },
                { value: 2, label: '512-2000MHZ' },
                { value: 3, label: '2000-3000MHZ' },
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
            SPDKoption:[
                { value: 0, label: '1MHz' },
                { value: 1, label: '2MHz' },
                { value: 2, label: '5MHz' },
                { value: 3, label: '10MHz' },
                { value: 4, label: '20MHz' },
                { value: 5, label: '40MHz' },
            ],
            PXJGoption:[
                { value: 0, label: '0.2MHz' },
                { value: 1, label: '0.5MHz' },
                { value: 2, label: '1MHz' },

            ],
            PXSLoption:[
                { value: 0, label: '8' },
                { value: 1, label: '16' },
                { value: 2, label: '32' },
                { value: 3, label: '64' },
            ],
        }
    },
    watch:{
        QRXH: function () {
            this.$emit('QRXH',this.formAdd)
        },
        Grdata: function () { 
            this.formAdd=this.Grdata;
        },
    },
    created() { 
        this.getTongKangGR();
    },
    methods:{
      GRPLchange(){},

        //干扰模块
        getTongKangGR() {
            getTongKangGR()
                .then((res) => {
                console.log(res, "resresresresGR");
                // if(res.status==200){
                    
                // }
                return res.data;
                })
                .then((res) => {
                if(res.code==200){
                    this.GRoption = res.data.list;
                }
                });
        },
            //获取设备列表
        getShebeiList() {
            getShebeiList()
                .then((res) => {
                return res.data;
                })
                .then((res) => {
                if (res.data.list.length > 0) {
                    this.shebeiList = res.data.list;
                    this.shebeiList.forEach((item) => {
                    this.addLabel(item);
                    });
                }
            });
        },
        //干扰模块名称改变函数
        changePL() {
            this.GRoption.forEach((item) => {
                if (item.name == this.formAdd.name) {
                // console.log(item, "itemresresresresGR");
                this.formAdd = JSON.parse(JSON.stringify(item));
                }
            });
        },
          //下发干扰命令
      postControlCommandInterference(params) {
        postControlCommandInterference(params).then((res) => {
          console.log(res, "res");
          this.xiafa = false;
        });
      },
    },
    
}
</script>
<style lang="less" scoped>
.mainbody{
    height: 100%;
    .dialogMainBody{
        height: 100%;
    }
}

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
.el-form-item__label { 
    width: 140px;
}

</style>