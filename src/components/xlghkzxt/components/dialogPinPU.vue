<template>
<div class="PinPuPopor">
    <div class="PinPuPopor-title flexBox">
        <div class="inputBoxBig">
            <el-form label-width="80px" :inline="true">
                <el-form-item label="设备名称" class="inpotBox">
                    <el-select v-model="selectedDevice" placeholder="请选择设备">
                        <el-option
                            v-for="device in devices"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                  <el-form-item label="设备名称" class="inpotBox">
                    <el-select v-model="selectedDevice" placeholder="请选择设备">
                        <el-option
                            v-for="device in devices"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                  <el-form-item label="设备名称" class="inpotBox">
                    <el-select v-model="selectedDevice" placeholder="请选择设备">
                        <el-option
                            v-for="device in devices"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="buttonBox">
            <el-button type="primary" @click="handleClose">
                <div class="buttonBoxImge flexBox">
                    <img src="@/assets/img/search_2_line_@1x.png" alt="">
                    <div>确定</div>
                </div>
            </el-button> 
            <el-button type="primary" @click="handleClose">定频识别</el-button>
            <el-button type="primary" @click="handleClose">跳频识别</el-button>


        </div>
    </div>
    <div class="PinPuPopor-content">
        <div class="PinPuPopor-content-left">
            <hightEcharts :shebeiID="shebeiBoxId" ></hightEcharts>
        </div>
        <div class="PinPuPopor-content-right ">
            <div class="PinPuPopor-content-righ-title leftPinpu-title">
                <div class="titleJianBian">
                    <img src="@/assets/img/组21_@1x.png" alt="" />
                    <span class="pinputext">识别结果</span>
                    <!-- <span class="pinputext pintutextEnglish">Spectrum</span> -->
                </div>
            </div>
            <template>
                <el-table
                :data="tableData"
                style="width: 100%;hight: 100%;">
                <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                </el-table-column>
                </el-table>
            </template>

        </div>



    </div>
</div>
    
</template>
<script>
import hightEcharts from "./hightEcharts.vue";


export default {
    components:{hightEcharts},
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    data() {
        return {
            selectedDevice: '',
            shebeiBoxId:'dialogPinPu',
            
            devices: [
                { value: '选项1', label: '黄金糕' },
                { value: '选项2', label: '双皮奶' },
                { value: '选项3', label: '蚵仔煎' },
                { value: '选项4', label: '龙须面' },
                { value: '选项5', label: '北京烤鸭' }
            ],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    
    },
    methods:{
        handleClose(){

        },
    },
    watch(){
 
    },
    
}
</script>
<style lang="less" scoped>
.PinPuPopor{
    width: 100%;
    // border: 1px solid #0B715A;

    .PinPuPopor-title{
        width: 100%;
        padding-bottom: 15px;
        border-bottom: 1px solid #1C735E;

        .inputBoxBig{
            width: 70%;
            .el-form{
                width: 100%;
                display: flex;
                justify-content: space-around;
            }
        }
        .buttonBox{
            width: 30%;
            display: flex;
            justify-content: space-around;

            .el-button{
                width: 104px;
                height: 44px;
                border-radius: 0;
                background-color: #1C735E;
                border: 1px solid #FFFFFF4C;
                display: flex;
                justify-content: center;
                align-items: center;
                .buttonBoxImge{
                    img{
                        width: 24px;
                        height: 24px;
                        margin-right: 10px;
                    }

                }
            }
        }
    }
    .PinPuPopor-content{
        width: 100%;
        height: 636px;
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 20px 10px;

        .PinPuPopor-content-left{
            width: 60%;
            height: 100%;
            padding: 0px 20px;
            box-sizing: border-box;
            border-right: 1px solid #FFFFFF4C;
            // display: flex;
           
        }
        .PinPuPopor-content-right{
            width: 40%;
            height: 100%;
            padding: 0px 20px;
            background: transparent;


        }
    }
}

.inpotBox{
    background-color: #FFFFFF26;
    color: #fff;
    border: 1px solid #FFFFFF4C;
    width: 320px;
}
.device-select-container {
  background-color: #000;
  color: #fff;
  padding: 20px;
  border-radius: 5px;
}
/* 自定义 ElementUI 组件的样式 */
.el-form-item__label {
  color: #fff;
}
.el-select .el-input__inner {
  background-color: #222;
  color: #fff;
  border: none;
}
.el-form--inline{
    display: flex;
    .inpotBox{
        margin-bottom: 0;
    }
}

</style>