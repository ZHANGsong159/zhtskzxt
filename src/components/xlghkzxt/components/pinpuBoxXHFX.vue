<template>
    <div class="PPSMmain">
        <div class="leftList">
            <div class="leftListBox qjsm">
                <div class="leftPinpu-title">
                    <div class="leftText">
                        <img src="@/assets/img/组21_@1x.png" alt="" />
                        <span class="pinputext">分析频段</span>
                    </div>
                </div>
                <div class="line"></div>
                    <el-form label-width="170px" :inline="true">
                        <el-form-item label="起始频率(MHz)" class="inpotBox">
                            <el-input v-model.number="fxpdFrom.startRate" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox">
                            <el-input v-model.number="fxpdFrom.endRate" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="分辨率(KHz)" class="inpotBox">
                            <el-select v-model="fxpdFrom.resolution" placeholder="请选择">
                                <el-option
                                    v-for="device in SMfbl"
                                    :key="device.value"
                                    :label="device.label"
                                    :value="device.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" class="confimeButton" @click='StartFXFD'><i class="el-icon-check"></i> 确认</el-button>
                    </el-form>
            </div>
           
        </div>
        <div class="rightMain">
            <hightEchartsVue :shebeiID='PPSMshebeiID' :minvalue='minvalueZJ' :maxvalue="maxvalueZJ"></hightEchartsVue>       
        </div>
        <div class="rightBox">
            <el-collapse v-model="activeNames" @change="handleChange" v-for="(item,index) in collapseList" :key='index'>
                <el-collapse-item  :name="item.id">
                    <template slot="title">
                        <div class="COLLAPSEtitleleft">
                            <img src="@/assets/img/路径_@1x.png" class="titleicon" alt="">
                            <span>频率：{{item.value}}MHz</span>
                        </div>

                        <div class="rightButton">
                            <el-button type="primary" class="startButton" size="small" v-if="pdsmStart" @click="clickQJSM(item.id)"><i class="el-icon-video-play"></i> 开始</el-button>
                            <el-button type="primary" class="stopButton" size="small" v-else @click="clickQJSM(item.id)"><i class="el-icon-video-pause"></i> 终止</el-button>
                        </div>

                    </template>
                    <div class="collapseBox">
                        <el-form label-width="140px" :inline="true">
                            <el-form-item label="中心频率(MHz)" class="inpotBox">
                                <el-input v-model="pdsmFrom.qspl" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="分析带宽(MHz)" class="inpotBox">
                                <el-input v-model="pdsmFrom.zzpl" placeholder="请输入"></el-input>
                    
                            </el-form-item>
                        </el-form>
                        <div class="textBox">
                            <div>开始时间：2024-05-16 05:15:11</div>
                            <div>结束时间：2024-12-16 05:15:11</div>
                            <div>调制样式：调制样式调制样式调制样式</div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
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
            activeNames:'',
            PPSMshebeiID:'PPSM',
            pdsmStart:true,
            selectedDeviceQJSM:'',
            pdsmFrom:{
                qspl:'',
                zzpl:'',
            },
            fxpdFrom:{
                scanType:'rateBand',
                startRate:'',
                endRate:'',
                resolution:'',
            },
            collapseList:[
                {title:'1',content:'',id:'01',value:'122'},
                {title:'2',content:'',id:'02',value:'200'},
            ],
            SMfbl: [
                { value: 0, label: '1000K' },
                { value: 1, label: '2000K' },
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
            allFBL:'',
            fblbeishu:0,
            minvalueZJ:0,
            maxvalueZJ:100,
            messages:[],
            ymessages:[],
        }
    
    },
    methods: {
        handleChange(){

        },
         //发送频谱请求接口
        async getCmdRateFun(params){
            if(params.resolution){
                this.allFBL=params.resolution
            }else{
                this.allFBL=0
            }
            getCmdRate(params).then(res => {
                return res.data
            }).then(res=>{
                console.log(res,'getCmdRategetCmdRate');
            })
        },
        StartFXFD(){
            this.getCmdRateFun(this.fxpdFrom)
        },
        clickQJSM(){
        }
    },
    mounted() {
        this.$store.state.socket.on('message', (data) => {
                console.log(data,'message');
                let min=data.ratePushDTO.startRate
                let max=data.ratePushDTO.endRate
                this.allFBL=data.ratePushDTO.resolution
                if(data.ratePushDTO.segmentStartRate==min){
                    this.messages=[]
                    this.ymessages=[]
                    this.minvalueZJ=min
                    this.maxvalueZJ=max
                }
                data.ratePushDTO.values.forEach((item,index)=>{
                    this.messages.push([(index*this.fblbeishu/1000)+Number(data.ratePushDTO.segmentStartRate),item]);
                    this.ymessages.push(item)
                })
                this.$store.state.messages=this.messages
                this.$store.state.ymessages=this.ymessages
        }); 
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
        width: 20%;
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
            overflow: auto;
            .line{
                width: 100%;
                height: 1px;
                background-color: #FFFFFF4c;
                margin: 5px 0px;
            }

        }
    }
    .rightMain{
        width: 60%;
        height: 100%;
        padding: 0px 20px;
        box-sizing: border-box;
    }
    .rightBox{
        width: 20%;
        height: 100%;
        border-left: 1px solid #FFFFFF26;
        padding: 0px 10px;
        overflow: auto;
    }

}
.inpotBox{
    display: flex;
    background-color: #FFFFFF26;
    margin: 5px 0px;
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
.confimeButton{
    width: 100%;
    height: 40px;
    border: 1px solid #1C735E;
    background-color: #1C735E;
    border-radius: 0px;
}
.COLLAPSEtitleleft{
    display: flex;
    align-items: center;
    justify-content: center;
}
.titleicon{
    padding-right: 10px;
    padding-left: 10px;
    border-right: 1px solid #FFFFFF4c;
    margin-right: 10px;
    width: 20px;
    height: 20px;
}
.collapseBox{
    background: transparent;
    .textBox{
        // height: 116px;
        font-size: 16px;
        background: #FFFFFF26;
        border: 1px solid #FFFFFF4c;
        padding: 10px 10px;
        color: #fff;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;
    }
}

</style>