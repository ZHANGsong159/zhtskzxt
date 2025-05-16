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
                         <el-button type="primary" class="stopButton" size="small" v-else @click="getCmdRateStop()"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form label-width="170px" :inline="true" v-model="qjsmFrom"  ref="qjsmFrom">
                        <el-form-item label="分辨率(KHz)" class="inpotBox" prop='resolution'>
                            <el-select v-model="qjsmFrom.resolution" placeholder="请选择">
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
                         <el-button type="primary" class="stopButton" size="small" v-else @click="getCmdRateStop()"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form label-width="170px" :inline="true" v-model="pdsmFrom"  ref="pdsmFrom">
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
                         <el-button type="primary" class="stopButton" size="small" v-else @click="getCmdRateStop()"><i class="el-icon-video-pause"></i> 终止</el-button>
                    </div>
                </div>
                <div class="line"></div>
                <el-form label-width="170px" :inline="true" v-model="dpksFrom"  ref="dpksFrom">
                        <el-form-item label="中心频率(MHz)" class="inpotBox" prop='centerRate'>
                            <el-input v-model.number="dpksFrom.centerRate" placeholder="请输入"></el-input>
                        </el-form-item>
                         <el-form-item label="带宽(MHz)" class="inpotBox" prop='band'>
                            <el-select v-model="dpksFrom.band" placeholder="请选择">
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
        </div>
        <div class="rightMain">
            <hightEchartsVue :shebeiID='PPSMshebeiID' :minvalue='minvalueZJ' :maxvalue="maxvalueZJ"></hightEchartsVue>       
        </div>

    </div>
</template>
<script>
import hightEchartsVue from './hightEcharts.vue';
import {getCmdRate,getCmdRateStop}  from "@/api/api.js"

export default {
    components: { hightEchartsVue },
    data() {
        return {
            PPSMshebeiID:'PPSM',
            qjsmStart:true,
            pdsmStart:true,
            dpksStart:true,
            selectedDeviceQJSM:'',
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
            fblbeishu:0,
            minvalueZJ:0,
            maxvalueZJ:100,
            messages:[],
            ymessages:[],



        }
    
    },
    methods: {
               // 生成随机数
        generateRandomNumbers(minvalue,maxvalue,fbl) {
            const result = [];
            const min = minvalue;
            const max = maxvalue;
            const step = fbl; // 设置步长为0.025
            const allstep = Math.floor((max - min) / step);
            // 计算可能的数值范围
            const minSteps = Math.ceil(min / step);
            const maxSteps = Math.floor(max / step);
            
            for (let i = 0; i < allstep; i++) {
            // 生成随机步数
            const randomSteps = Math.floor(Math.random() * (maxSteps - minSteps + 1)) + minSteps;
            
            // 计算对应的数值
            const randomNum = randomSteps * step;
            
            result.push(parseFloat(randomNum.toFixed(3))); // 保留3位小数避免浮点数精度问题
            }
            
            return result;
        },
        generateAndSortNumbers(min,max,step) {
            // 生成随机数
            const randomNumbers = this.generateRandomNumbers(min,max,step);
            // 排序（升序）
            let sortedRandomNumbers = randomNumbers.sort((a, b) => a - b);
            // this.pinlvji=this.sortedRandomNumbers
            return  sortedRandomNumbers
            
        },
        //停止发送接口
        getCmdRateStop(){
            getCmdRateStop().then(res => {
                return res.data
            }).then(res=>{
                console.log(res,'getCmdRateStop');
            })
        },
        //发送频谱请求接口
        async getCmdRateFun(params){
            // this.getCmdRateStop()
            if(params.resolution){
                this.allFBL=params.resolution
            }else{
                this.allFBL=0
            }
            // switch(this.allFBL){
            //     case 0:
            //         this.fblbeishu=1000
            //         break;
            //     case 1:
            //         this.fblbeishu=2000
            //         break;
            //     case 3:
            //         this.fblbeishu=12800
            //         break;
            //     case 4:
            //         this.fblbeishu=6400
            //         break;
            //     case  5:
            //         this.fblbeishu=3200
            //         break;
            //     case  6:
            //         this.fblbeishu=1600
            //         break;
            //     case  7:
            //         this.fblbeishu=800
            //         break;
            //     case 8:
            //         this.fblbeishu=400
            //         break;
            //     case   9:
            //         this.fblbeishu=200
            //         break;
            //     case  10:
            //         this.fblbeishu=100
            //         break;
            //     case  11:
            //         this.fblbeishu=50
            //         break;
            //     case  12:
            //         this.fblbeishu=25
            //         break;
            //     case  13:
            //         this.fblbeishu=12.5
            //         break;
            //     case  14:
            //         this.fblbeishu=6.25
            //         break;
            //     case  15:
            //         this.fblbeishu=3.125
            //         break;
            //     case  16:
            //         this.fblbeishu=1.5625
            //         break;

                    
            // }
            getCmdRate(params).then(res => {
                return res.data
            }).then(res=>{
                console.log(res,'getCmdRategetCmdRate');
            })
        },
        clickQJSM(parame){
            let parameFrom={}
            let parameName=''
            switch(parame){
                case 'qjsmStart':
                    // this.qjsmStart=!this.qjsmStart
                    parameFrom=this.qjsmFrom
                    parameName='qjsmFrom'
                    break;
                case 'pdsmStart':
                    // this.pdsmStart=!this.pdsmStart
                    parameFrom=this.pdsmFrom
                    parameName='pdsmFrom'
                    break;
                case 'dpksStart':
                    // this.dpksStart=!this.dpksStart
                    parameFrom=this.dpksFrom
                    parameName='dpksFrom'
                    break;
            }
            // this.submitForm(parameName,parameFrom)
            console.log(parameFrom,parameName,'parameFrom');
            
            this.getCmdRateFun(parameFrom)

        },
        submitForm(formName,parameFrom) {
            this.$refs[formName].validate((valid) => {
                console.log(valid,'submitForm');
                if (valid) {
                    this.getCmdRateFun(parameFrom)
                    console.log(' submit!!');

                } else {
                    console.log('error submit!!');
                    this.$message.error('表单验证未通过，请检查输入内容');
                }
            });
        },
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
                    console.log(min,max,'starttttt');
                    
                }
                data.ratePushDTO.values.forEach((item,index)=>{
                    this.messages.push([(index*this.fblbeishu/1000)+Number(data.ratePushDTO.segmentStartRate),item]);
                    this.ymessages.push(item)
                })
                this.$store.state.messages=this.messages
                this.$store.state.ymessages=this.ymessages



            //   let shujv=(max-min)/(this.fblbeishu/1000)
            //   let dataX=this.generateAndSortNumbers(data.ratePushDTO.startRate,data.ratePushDTO.endRate,1)
              console.log(this.fblbeishu,'dataX');
              

              
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
    text-align: center;
}

</style>