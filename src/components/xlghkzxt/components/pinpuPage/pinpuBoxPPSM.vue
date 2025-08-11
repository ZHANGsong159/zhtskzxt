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
                         <el-button type="primary" class="stopButton" size="small" v-else @click="getCmdRateStop('qjsmStart')"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form  :inline="true" v-model="qjsmFrom"  ref="qjsmFrom">
                        <el-form-item label="分辨率(KHz)" class="inpotBox" prop='resolution'>
                            <el-select v-model="qjsmFrom.resolution" placeholder="请选择" @change="fblChange(qjsmFrom.resolution)">
                                <el-option
                                    v-for="device in SMfbl"
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
                         <el-button type="primary" class="stopButton" size="small" v-else @click="getCmdRateStop('pdsmStart')"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form  :inline="true" v-model="pdsmFrom"  ref="pdsmFrom">
                        <el-form-item label="起始频率(MHz)" class="inpotBox" prop='startRate' >
                            <el-input v-model.number="pdsmFrom.startRate" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox" prop='endRate'>
                            <el-input v-model.number="pdsmFrom.endRate" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="分辨率(KHz)" class="inpotBox" prop='resolution'>
                            <el-select v-model="pdsmFrom.resolution" placeholder="请选择">
                                <el-option
                                    v-for="device in SMfbl"
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
                         <el-button type="primary" class="stopButton" size="small" v-else @click="getCmdRateStop('dpksStart')"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form  :inline="true" v-model="dpksFrom"  ref="dpksFrom">
                        <el-form-item label="中心频率(MHz)" class="inpotBox" prop='centerRate'>
                            <el-input v-model.number="dpksFrom.centerRate" placeholder="请输入"></el-input>
                        </el-form-item>
                         <el-form-item label="带宽(MHz)" class="inpotBox" prop='band'>
                            <el-input v-model.number="dpksFrom.band" placeholder="请输入"></el-input>
                        </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="rightMain">
            <hight-echarts-vue :fblbeishu='fblbeishu'></hight-echarts-vue>       
        </div>

    </div>
</template>
<script>
// import hightEchartsVue from '../PinPu/hightEchartsPop.vue';
import hightEchartsVue from '@/components/xlghkzxt/components/PinPu/hightEchartsPPSM.vue';

import {getCmdRate,getCmdRateStop}  from "@/api/api.js"

export default {
    components: { hightEchartsVue },
    data() {
        return {
            PPSMshebeiID:'',
            qjsmStart:true,
            pdsmStart:true,
            dpksStart:true,
            SMfbl: [
                { value: 3, label: '12800K' },
                { value: 4, label: '6400K' },
                { value: 5, label: '3200K' },
                { value: 6, label: '1600K' },
                { value: 7, label: '800K' },
                { value: 8, label: '400K' },
                { value: 9, label: '200K' },
                { value: 10, label: '100K' },
                { value: 11, label: '50K' },
                { value: 12, label: '25K' },
                { value: 13, label: '12.5K' },
                { value: 14, label: '6.25K' },
                { value: 15, label: '3.125K' },
                { value: 16, label: '1.5625K' },
            ],
            qjsmFrom:{
                scanType:'rateAll',
                resolution:'',
            },
            pdsmFrom:{
                scanType:'rateBand',
                startRate:'',
                endRate:'',
                resolution:'',
            },
            dpksFrom:{
                scanType:'rateSingle',
                centerRate:'',
                band:'',
            },
            allFBL:'',
            fblbeishu:0,//分辨率倍数
        }
    },
    methods: {
        //停止发送接口
        getCmdRateStop(dataparam){
            let params = {
                deviceId: this.PPSMshebeiID,
            };
            getCmdRateStop(params).then(res => {
                return res.data
            }).then(res=>{
                if(res.code==200){
                    switch(dataparam){
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
                }
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        },
        //发送频谱请求接口
        async getCmdRateFun(params){
            let deviceId = this.$route.params.id; 
            params.deviceId=deviceId
            if(params.resolution){
                this.allFBL=params.resolution
            }else{
                this.allFBL=0
            }
            getCmdRate(params).then(res => {
                return res.data
            }).then(res=>{
                if(res.code==200){
                    console.log(res);
                }
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        },
        clickQJSM(parame){
            let parameFrom={}
            let parameName=''
            switch(parame){
                case 'qjsmStart':
                    this.qjsmStart=!this.qjsmStart
                    parameFrom=this.qjsmFrom
                    parameName='qjsmFrom'
                    break;
                case 'pdsmStart':
                    this.pdsmStart=!this.pdsmStart
                    parameFrom=this.pdsmFrom
                    parameName='pdsmFrom'
                    break;
                case 'dpksStart':
                    this.dpksStart=!this.dpksStart
                    parameFrom=this.dpksFrom
                    parameName='dpksFrom'
                    break;
            }
            this.getCmdRateFun(parameFrom,parameName)
        },
        fblChange(val){
            this.allFBL=val
        },
    },
    mounted() {
        this.PPSMshebeiID=this.$route.params.id
    },
    beforeDestroy() {
        this.getCmdRateStop()
    },
    watch:{
        allFBL(){
            switch(this.allFBL){
                case 0:
                    this.fblbeishu=1000
                    break;
                case 1:
                    this.fblbeishu=2000
                    break;
                case 3:
                    this.fblbeishu=12800
                    break;
                case 4:
                    this.fblbeishu=6400
                    break;
                case  5:
                    this.fblbeishu=3200
                    break;
                case  6:
                    this.fblbeishu=1600
                    break;
                case  7:
                    this.fblbeishu=800
                    break;
                case 8:
                    this.fblbeishu=400
                    break;
                case   9:
                    this.fblbeishu=200
                    break;
                case  10:
                    this.fblbeishu=100
                    break;
                case  11:
                    this.fblbeishu=50
                    break;
                case  12:
                    this.fblbeishu=25
                    break;
                case  13:
                    this.fblbeishu=12.5
                    break;
                case  14:
                    this.fblbeishu=6.25
                    break;
                case  15:
                    this.fblbeishu=3.125
                    break;
                case  16:
                    this.fblbeishu=1.5625
                    break;

                    
            }
        }
    }
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
        width: 20%;
        height: 100%;
        padding: 0px 15px;
        border-right: 1px solid #FFFFFF26;
        overflow: auto;
        .leftListBox{
            width: 100%;
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
                margin: 5px 0px;
            }
        }
    }
    .rightMain{
        width: 80%;
        height: 100%;
        padding: 0px 20px;
        box-sizing: border-box;
    }

}
.rightButton{
    padding: 0px !important;
}

.leftPinpu-title{
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    font-size: 16px;

}
.el-form--inline .el-form-item{
    margin-right: 0px !important;
}
::v-deep .el-input__inner{
    color: #fff!important;
}
::v-deep .el-form-item__label{
    width: 135px;
}
::v-deep .el-form-item__content{
    width: calc(100% - 135px);
}

</style>