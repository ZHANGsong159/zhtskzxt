<template>
<div class="PinPuPopor">
    <div class="PinPuPopor-title flexBox">
       
        <div class="buttonBox">
            <el-button type="primary" @click="addSbgl">
                <div class="buttonBoxImge flexBox">
                    <img src="@/assets/img/add_circle_line_@1x.png" alt="">
                    <div>新增</div>
                </div>
            </el-button> 
        </div>
    </div>
    <div class="PinPuPopor-content">
        <div class="PinPuPopor-content-right ">
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


    <el-dialog
      width="30%"
      title="设备新增"
      :visible.sync="innerVisible"

      append-to-body>
        <el-form :model="form" :inline="true">
            <el-form-item label="审批人">
                <el-input v-model="form.name" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
</div>
    
</template>
<script>
export default {
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
            innerVisible: false,
            
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
            }],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            params:{
                deviceId: 78376133,
                deviceCode: "quis Duis sunt",
                deviceName: "est ullamco pariatur do",
                deviceIp: "ut voluptate sed sunt",
                systemType: "",
                deviceType: "quis occaecat magna e",
                longitude: "tempor culpa",
                latitude: "consequat mollit",
                picUrl:"exercitation sit sunt nostrud Ut",
                isDeploy: -19807719,
                state: "dolore tempor nostrud et exercitation"
            }
        }
    
    },
    methods:{
        addSbgl(){
            this.innerVisible=true

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
        justify-content: left;
        .buttonBox{
            width: 100%;
            display: flex;
            justify-content: left;
            margin-left:30px;
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
        .PinPuPopor-content-right{
            width: 100%;
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