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
                    prop="deviceName"
                    label="设备名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="deviceCode"
                    label="设备编号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="deviceIp"
                    label="设备IP"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="systemType"
                    label="所属系统">
                </el-table-column>
                 <el-table-column
                    prop="deviceType"
                    label="装备类型">
                </el-table-column>
                 <el-table-column
                    prop="state"
                    label="状态">
                </el-table-column>
                <el-table-column
                    prop="longitude"
                    label="经度">
                </el-table-column>
                <el-table-column
                    prop="latitude"
                    label="纬度">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClickUpdata(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="handleClickClose(scope.row)" type="text" size="small">删除</el-button>

                    </template>
                </el-table-column>
                </el-table>


            </template>
            <el-pagination
            style="margin-top: 20px;"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="total">
            </el-pagination>
        </div>
    </div>


    <el-dialog
      width="40%"
      :title="dialogTitle"
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

                <el-radio-group v-model="formAdd.isDeploy" style="padding-left:15px;">
                    <el-radio :label="0">未部署</el-radio>
                    <el-radio :label="1">已部署</el-radio>
                </el-radio-group>


                <!-- <el-radio v-model="formAdd.isDeploy" label="0" style="padding-left:20px">未部署</el-radio>
                <el-radio v-model="formAdd.isDeploy" label="1">已部署</el-radio>
                {{formAdd.isDeploy}} -->

                <!-- <el-input v-model="formAdd.isDeploy" placeholder="状态"></el-input> -->
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formAdd.state" placeholder="请选择设备状态">
                    <el-option v-for="(item,index) in SBZToption" :label="item.label" :value="item.value" :key='index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="经度">
                <el-input v-model="formAdd.longitude" placeholder="经度"></el-input>
            </el-form-item>
            <el-form-item label="纬度">
                <el-input v-model="formAdd.latitude" placeholder="纬度"></el-input>
            </el-form-item>



        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm" >确 定</el-button>
        </div>
    </el-dialog>
</div>
    
</template>
<script>
import { postAddShebei,getShebeiList,deleteShebeiById,putShebeiUpdata } from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    data() {
        return {
            pageNum:1,
            pageSize:10,
            dialogTitle:'新增设备',
            selectedDevice: '',
            shebeiBoxId:'dialogPinPu',
            innerVisible: false,
            radio:'1',
            total:'1',
            
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
            SBZToption:[
                { value: 'outline', label: '离线' },
                { value: 'standby', label: '待机' },
                { value: 'disturb', label: '干扰中' },
                { value: 'simulate', label: '模拟中' },
            ],
            tableData: [],
            formAdd:{
                deviceId: 1,
                deviceCode: '01',
                deviceName: '测试设备',
                deviceIp: '192.168.1.1',
                systemType: 'TK',
                deviceType: 'TK',
                isDeploy: '0',
                state:'outline',
                longitude: '122',
                latitude: '21',
            },
        
        }
    
    },
    methods:{
        // 分页
        handleCurrentChange(parame){
            console.log(parame,'parameparameparame');
            this.pageNum=parame
            this.getShebeiList()
            

        },
        handleClickUpdata(params){
            console.log(params,'paramsparamsparams');
            this.dialogTitle='设备更新'
            this.formAdd=params
            this.innerVisible=true
        },
        //列表删除
        handleClickClose(params){
            deleteShebeiById(params.deviceId).then(res=>{
                if(res.data.code==200){
                    this.$message.success('删除成功');
                    this.getShebeiList()
                }else{
                    this.$message.error('删除失败');
                }
            })
        },


        
        confirm(){
            if(this.dialogTitle=='新增设备'){
                this.formAdd.deviceId=this.generateRandomId()
                console.log(this.formAdd,'formAddformAddformAdd新增设备');

                this.Addshebei(this.formAdd)
            }else if(this.dialogTitle=='设备更新'){
                console.log(this.formAdd,'formAddformAddformAdd设备更新');
                this.UpdataShebei(this.formAdd)
    
            }
            
            
        },
        // 新增设备按钮
        Addshebei(foram){
            postAddShebei(foram).then(res=>{
                console.log(res,'resresresre')
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getShebeiList()
                    this.$message.success('新增成功')

                }else{
                    this.$message.error('新增失败')
                }
                
            })

        },

        //更新设备
        UpdataShebei(params){
            putShebeiUpdata(params).then(res=>{
                console.log(res,'resresresres');
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getShebeiList()
                    this.$message.success('编辑成功')

                }else{
                    this.$message.error('编辑失败')
                }

            })
        },
        addSbgl(){
            this.formAdd={
                deviceId: 1,
                deviceCode: '01',
                deviceName: '测试设备',
                deviceIp: '192.168.1.1',
                systemType: 'TK',
                deviceType: 'TK',
                isDeploy: '0',
                state:'outline',
                longitude: '122',
                latitude: '21',
            }
            this.innerVisible=true

        },
        generateRandomId() {
            return Math.floor(Math.random() * 90000000000) + 10000000000;
        },
        //获取列表数据
        getShebeiList(){
        let params={
                pageNum:this.pageNum,
                pageSize:this.pageSize,
            }
            getShebeiList(params).then(res=>{
                return res.data
            }) .then(res=>{
                console.log(res,'getShebeiListgetShebeiList');
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
                }
                

            })
        },

    },
    mounted(){
        this.getShebeiList()
 
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
        padding: 10px 10px;
        .PinPuPopor-content-right{
            width: 100%;
            height: 100%;
            padding: 0px 20px;
            background: transparent;
            display: flex;
            flex-flow: column;
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