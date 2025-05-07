<template>
    <div class="PPSMmain">
        <div class="leftList">
            <div class="leftListBox qjsm">
                <div class="leftPinpu-title">
                    <div class="leftText">
                        <img src="@/assets/img/组21_@1x.png" alt="" />
                        <span class="pinputext">全景扫描</span>
                    </div>
                    <div class="rightButton">
                         <el-button type="primary" class="startButton" size="small" v-if="qjsmStart" @click="clickQJSM('qjsmStart')"><i class="el-icon-video-play"></i> 开始</el-button>
                         <el-button type="primary" class="stopButton" size="small" v-else @click="clickQJSM('qjsmStart')"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form label-width="120px" :inline="true">
                        <el-form-item label="分辨率(KHz)" class="inpotBox">
                            <el-select v-model="selectedDeviceQJSM" placeholder="请选择">
                                <el-option
                                    v-for="device in devicesQJSM"
                                    :key="device.value"
                                    :label="device.label"
                                    :value="device.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                </el-form>


            </div>
            <div class="leftListBox pdsm">



                <div class="leftPinpu-title">
                    <div class="leftText">
                        <img src="@/assets/img/组21_@1x.png" alt="" />
                        <span class="pinputext">频段扫描</span>
                    </div>
                    <div class="rightButton">
                         <el-button type="primary" class="startButton" size="small" v-if="pdsmStart" @click="clickQJSM('pdsmStart')"><i class="el-icon-video-play"></i> 开始</el-button>
                         <el-button type="primary" class="stopButton" size="small" v-else @click="clickQJSM('pdsmStart')"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form label-width="140px" :inline="true">
                        <el-form-item label="起始频率(MHz)" class="inpotBox">
                            <el-input v-model="pdsmFrom.qspl" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox">
                            <el-input v-model="pdsmFrom.zzpl" placeholder="请输入"></el-input>
                 
                        </el-form-item>
                        <el-form-item label="分辨率(KHz)" class="inpotBox">
                            <el-select v-model="selectedDeviceQJSM" placeholder="请选择">
                                <el-option
                                    v-for="device in devicesQJSM"
                                    :key="device.value"
                                    :label="device.label"
                                    :value="device.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                </el-form>

                
            </div>
            <div class="leftListBox dpks">

                <div class="leftPinpu-title">
                    <div class="leftText">
                        <img src="@/assets/img/组21_@1x.png" alt="" />
                        <span class="pinputext">单频控守</span>
                    </div>
                    <div class="rightButton">
                         <el-button type="primary" class="startButton" size="small" v-if="dpksStart" @click="clickQJSM('dpksStart')"><i class="el-icon-video-play"></i> 开始</el-button>
                         <el-button type="primary" class="stopButton" size="small" v-else @click="clickQJSM('dpksStart')"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form label-width="140px" :inline="true">
                        <el-form-item label="中心频率(MHz)" class="inpotBox">
                            <el-input v-model="qjsmFrom.zxpl" placeholder="请输入"></el-input>
    
                        </el-form-item>
                         <el-form-item label="带宽(MHz)" class="inpotBox">
                            <el-select v-model="selectedDeviceQJSM" placeholder="请选择">
                                <el-option
                                    v-for="device in devicesQJSM"
                                    :key="device.value"
                                    :label="device.label"
                                    :value="device.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                </el-form>
                
            </div>

        </div>
        <div class="rightMain">
            <hightEchartsVue :shebeiID='PPSMshebeiID'></hightEchartsVue>       
        </div>

    </div>
</template>
<script>
import hightEchartsVue from './hightEcharts.vue';
import {getCmdRate}  from "@/api/api.js"

export default {
    components: { hightEchartsVue },
    data() {
        return {
            PPSMshebeiID:'PPSM',
            qjsmStart:true,
            pdsmStart:true,
            dpksStart:true,
            selectedDeviceQJSM:'',
            devicesQJSM: [
                { label: '1920*1080', value: '1920*1080' },
                { label: '1280*720', value: '1280*720' },
                { label: '960*540', value: '960*540' },
                { label: '640*360', value: '640*360' },
                { label: '480*270', value: '480*270' },
            ],
            qjsmFrom:{
                fbl:'',

            },
            pdsmFrom:{
                qspl:'',
                zzpl:'',
                fbl:'',

            },
            dpksFrom:{
                zxpl:'',
                dl:'',

            }


        }
    
    },
    methods: {
        //发送频谱请求接口
        getCmdRateFun(){
          getCmdRate().then(res => {
            return res.data
          }).then(res=>{
            console.log(res,'getCmdRategetCmdRate');
          })
        },
        clickQJSM(parame){
            console.log(parame,'clickQJSM');
            this.getCmdRateFun()
            switch(parame){
                case 'qjsmStart':
                    this.qjsmStart=!this.qjsmStart
                    break;
                case 'pdsmStart':
                    this.pdsmStart=!this.pdsmStart
                    break;
                case 'dpksStart':
                    this.dpksStart=!this.dpksStart
                    break;
            }
            
            // if(this.qjsmStart){
            //     this.qjsmStart=false
            // }else{
            //     this.qjsmStart=true
            // }
        }
    },
    mounted() {
    },
    
}
</script>
<style lang="less" scoped>
.PPSMmain{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-flow: row;
    padding: 20px 0px;
    .leftList{
        width: 18%;
        height: 100%;
        padding: 0px 15px;
        border-right: 1px solid #FFFFFF26;
        .leftListBox{
            width: 100%;
            // height: 150px;
            box-sizing: border-box;
            background: #FFFFFF26;
            margin-bottom: 20px;
            border:1px solid #FFFFFF4c;
            padding: 10px;
            .line{
                width: 100%;
                height: 1px;
                background-color: #FFFFFF4c;
                margin: 5px 0px;
            }
            .inpotBox{
                display: flex;
                background-color: #FFFFFF26;
                margin: 5px 0px;
            }
        }
        .qjsm{
            height: 110px;
            
            .inpotBox{
                margin: 5px 0px !important;

            }
        }
        .pdsm{
            height: 216px;
        }
        .dpks{
            height: 163px;

        }
    }
    .rightMain{
        width: 80%;
        height: 100%;
        padding: 0px 20px;
        box-sizing: border-box;
    }

}

.leftPinpu-title{
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    font-size: 16px;
    .rightButton{
        button{
            background: #2CE5BA4c;
            border-color: #ffffff4c;
            border-radius: 0;
        }
        .stopButton{
            background: #FFFFFF19 !important;
        }
    }
}
.el-form--inline .el-form-item{
    margin-right: 0px !important;
}
::v-deep .el-input__inner{
    color: #fff!important;
}

</style>