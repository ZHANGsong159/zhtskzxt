<template>
    <div class="PPSMmain">
        <div class="leftList">
            <div class="leftListBox qjsm">
                <div class="leftPinpu-title">
                    <div class="leftText">
                        <img src="@/assets/img/组21_@1x.png" alt="" />
                        <span class="pinputext">全景扫描</span>
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
                        <el-button type="primary" class="confimeButton"><i class="el-icon-check"></i> 确认</el-button>
                </el-form>
            </div>
           
        </div>
        <div class="rightMain">
            <hightEchartsVue :shebeiID='PPSMshebeiID'></hightEchartsVue>       
        </div>
        <div class="rightBox">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title=" 一致性 Consistency" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="2">
                    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency" name="3">
                    <div>简化流程：设计简洁直观的操作流程；</div>
                    <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                    <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                </el-collapse-item>
                <el-collapse-item title="可控 Controllability" name="4">
                    <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                    <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
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
        handleChange(){

        },
        //发送频谱请求接口
        getCmdRateFun(){
          getCmdRate().then(res => {
            return res.data
          }).then(res=>{
            console.log(res,'getCmdRategetCmdRate');
          })
        },
        clickQJSM(){
          
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
            // height: 110px;
            
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
.confimeButton{
    width: 100%;
    height: 40px;
    border: 1px solid #1C735E;
    background-color: #1C735E;
    border-radius: 0px;
}

</style>