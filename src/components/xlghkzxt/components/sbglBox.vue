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
      width="40%"
      title="设备新增"
      :visible.sync="innerVisible"
      append-to-body>
        <el-form  :model="formAdd" :inline="true">
            <el-form-item label="设备编号">
                <el-input v-model="formAdd.deviceCode" placeholder="设备编号"></el-input>
            </el-form-item>
            <el-form-item label="设备名称">
                <el-input v-model="formAdd.deviceName" placeholder="设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备IP">
                <el-input v-model="formAdd.deviceIp" placeholder="设备IP"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审批人">
                <el-input v-model="form.name" placeholder="审批人"></el-input>
            </el-form-item> -->
            <el-form-item label="所属系统" >
                <el-select v-model="formAdd.systemType" placeholder="请选择所属系统">
                    <el-option v-for="(item,index) in SSXToption" :label="item.label" :value="item.value" :key='index'></el-option>

                </el-select>
            </el-form-item>
            <el-form-item label="装备类型" >
                <el-select v-model="formAdd.deviceType" placeholder="请选择装备类型">
                    <el-option v-for="(item,index) in SBLXoption " :label="item.label" :value="item.value" :key='index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否部署" >
                <el-radio v-model="formAdd.isDeploy" label="0" style="padding-left:20px">未部署</el-radio>
                <el-radio v-model="formAdd.isDeploy" label="1">已部署</el-radio>

                <!-- <el-input v-model="formAdd.isDeploy" placeholder="状态"></el-input> -->
            </el-form-item>
            <el-form-item label="状态">
                <el-input v-model="formAdd.state" placeholder="状态"></el-input>
            </el-form-item>
            <el-form-item label="经度">
                <el-input v-model="formAdd.longitude" placeholder="经度"></el-input>
            </el-form-item>
            <el-form-item label="纬度">
                <el-input v-model="formAdd.latitude" placeholder="纬度"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm" >确 定</el-button>
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
            radio:'1',
            
            SSXToption: [
                { value: 'TK', label: '通抗分系统' },
                { value: 'LK', label: '类抗分系统' },
                { value: 'DK', label: '电抗分系统' },
            ],
            SBLXoption:[
                { value: 'TK', label: '通抗分系统' },
                { value: 'LK', label: '类抗分系统' },
                { value: 'DK-HK', label: '红外设备' },
                { value: 'DK-106', label: '1.06激光设备' },
                { value: 'DK-15', label: '1.5激光设备' },
                { value: 'DK-GJ', label: '告警天线' },
                { value: 'DK-GR', label: '偏引干扰机' },
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
            formAdd:{
                deviceId: 78376133,
                deviceCode: 'testShebei',
                deviceName: '测试设备',
                deviceIp: '192.168.1.1',
                systemType: 'TK',
                deviceType: 'TK',
                isDeploy: '0',
                state: 78376133,
                longitude: 78376133,
                latitude: 78376133,
            },
        
        }
    
    },
    methods:{
        confirm(){
            console.log(this.formAdd,'formAddformAddformAdd');
            
        },
        addSbgl(){
            this.innerVisible=true

        },
    },
    watch(){
 
    },
    
}
</script>
<style lang="less" scoped>
.dialog-footer{
    .el-button{
        background-color: #1C735E;
        color: #fff;
        border:1px solid #FFFFFF4C;
    }
}
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
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    .inpotBox{
        margin-bottom: 0;
    }
    .el-form-item{
        width: 45%;

    }
}        
::v-deep .el-form-item__label{
        text-align: center;
        width: 70px !important;
    }
    ::v-deep .el-form-item__content{
        width: calc(100% - 70px) !important;
        .el-select{
            width: 100%;
        }
    }
::v-deep .el-input__inner{
    color: #fff;
}
</style>