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
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="deviceCode"
                    label="设备编号"
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="deviceIp"
                    label="设备IP"
                    align='center'
                    width="180">
                    
                </el-table-column>
                <el-table-column
                    prop="systemType"
                    align='center'
                    label="所属系统">
                    <template slot-scope="scope">
                        <!-- TK = 通抗分系统, LK = 类抗分系统, DK = 电抗分系统 -->
                        {{scope.row.systemType=='TK'?'通抗分系统':scope.row.systemType=='LK'?'雷抗分系统':scope.row.systemType=='DK'?'光抗分系统':''}}
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="deviceType"
                    align='center'
                    label="装备类型">
                    <template slot-scope="scope">
                        {{scope.row.deviceType=='TK'?'通抗设备'
                        :scope.row.deviceType=='LK'?'雷抗设备'
                        :scope.row.deviceType=='DK-HW'?'红外设备'
                        :scope.row.deviceType=='DK-106'?'1.06激光设备'
                        :scope.row.deviceType=='DK-15'?'1.5激光设备'
                        :scope.row.deviceType=='DK-GJ'?'告警天线'
                        :scope.row.deviceType=='DK-GR'?'偏引干扰机':''}}
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="state"
                    align='center'
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.state=='outline'?'离线':scope.row.state=='standby'?'待机':scope.row.state=='disturb'?'干扰中':scope.row.state=='simulate'?'模拟中':''}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="longitude"
                    align='center'
                    label="经度">
                </el-table-column>
                <el-table-column
                    prop="latitude"
                    align='center'
                    label="纬度">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align='center'
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClickUpdata(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="handleClickClose(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </template>
            <!-- <el-pagination
            style="margin-top: 20px;"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="total">
            </el-pagination> -->
            <page-inaiton :pageSize="pageSize" :total="total"  @currentChange="handleCurrentChange"></page-inaiton>

        </div>
    </div>


    <el-dialog
      width="40%"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      v-if="innerVisible"
      append-to-body>
        <el-form  :model="formAdd"   :rules="rulesAdd"  ref="addFormRef" :inline="true" style="flex-flow:row warp;padding:10px 20px">
            <el-form-item label="设备编号" prop="deviceCode">
                <el-input v-model="formAdd.deviceCode" maxlength="15" placeholder="设备编号"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="formAdd.deviceName" maxlength="15" placeholder="设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备IP" prop="deviceIp">
                <ip-inputbox v-model="formAdd.deviceIp"></ip-inputbox>
            </el-form-item>
            <el-form-item label="所属系统" prop='systemType'>
                <el-select v-model="formAdd.systemType" placeholder="请选择所属系统">
                    <el-option v-for="(item,index) in SSXToption" :label="item.label" :value="item.value" :key='index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="装备类型" prop='deviceType'>
                <el-select v-model="formAdd.deviceType" @change="ZBLXchange" placeholder="请选择装备类型">
                    <el-option v-for="(item,index) in SBLXoption " :label="item.label" :value="item.value" :key='index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="频谱IP" prop="rateIp">
                <ip-inputbox v-model="formAdd.rateIp"></ip-inputbox>
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
import '@/assets/css/mbBox.less';
import pageInaiton from '@/components/chartBox/pageInaiton.vue';

import IpInputbox from '@/components/chartBox/IPinputbox.vue'
import { postAddShebei,getShebeiList,deleteShebeiById,putShebeiUpdata } from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components: {
        IpInputbox,
        pageInaiton
    },
    data() {
        // IP地址验证函数
        const validateIp = (rule, value, callback) => {
            const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (!value || !ipPattern.test(value)) {
            callback(new Error("请输入有效的IP地址"));
            } else {
            // 验证每个数字段是否在0-255之间
            const segments = value.split('.');
            const isValid = segments.every(seg => {
                const num = parseInt(seg);
                return num >= 0 && num <= 255;
            });
            isValid ? callback() : callback(new Error("IP地址无效"));
            }
        };


        return {
            pageNum:1,
            pageSize:10,
            dialogTitle:'新增设备',
            selectedDevice: '',
            shebeiBoxId:'dialogPinPu',
            innerVisible: false,
            radio:'1',
            total:0,
            rulesAdd: {
                deviceCode: [
                    { required: true, message: '设备编号不能为空', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在1到15个字符', trigger: 'blur' }
                ],
                deviceName: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在1到15个字符', trigger: 'blur' }
                ],
                deviceIp: [
                    { required: true, message: '设备IP不能为空', trigger: 'blur' },
                    { validator: validateIp, trigger: 'blur' }
                ],
                systemType: [
                    { required: true, message: '请选择所属系统', trigger: 'change' }
                ],
                deviceType: [
                    { required: true, message: '请选择装备类型', trigger: 'change' }
                ],
                rateIp: [
                    { required: true, message: '频谱IP不能为空', trigger: 'blur' },
                    { validator: validateIp, trigger: 'blur' }
                ]
            },
            
            SSXToption: [
                { value: 'TK', label: '通抗分系统' },
                { value: 'LK', label: '雷抗分系统' },
                { value: 'DK', label: '光抗分系统' },
            ],
            SBLXoption:[
                { value: 'TK', label: '通抗分系统' },
                { value: 'LK', label: '雷抗分系统' },
                { value: 'DK-HW', label: '红外设备' },
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
                deviceCode: '',
                deviceName: '',
                deviceIp: '',
                systemType: '',
                deviceType: '',
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
            this.dialogTitle='设备更新'
            this.formAdd=JSON.parse(JSON.stringify(params))
            this.innerVisible=true
        },
        //列表删除
        handleClickClose(params){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteShebeiById(params.deviceId).then(res=>{
                    if(res.data.code==200){
                        this.$message.success('删除成功');
                        if(this.tableData.length==1 && this.pageNum>1){
                            this.pageNum=this.pageNum-1                      
                        }
                        this.changeSheBei()
                        this.getShebeiList()
                    }else{
                        this.$message.error('删除失败');
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        
        confirm(){
            this.$refs.addFormRef.validate(valid => {
                 if (valid) {
                    if(this.dialogTitle=='新增设备'){
                    // this.formAdd.deviceId=this.generateRandomId()
                    this.Addshebei(this.formAdd)
                    }else if(this.dialogTitle=='设备更新'){
                        console.log(this.formAdd,'formAddformAddformAdd设备更新');
                        this.UpdataShebei(this.formAdd)
                    }
                 }else{
                    this.$message.error('请检查输入内容')
                    return false

                 }
                
            })
        },
        // 新增设备按钮
        Addshebei(foram){
            postAddShebei(foram).then(res=>{
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getShebeiList()
                    this.changeSheBei()
                    this.$message.success('新增成功')
                }
            }).catch(error=>{
                console.log(error);
            })

        },

        //更新设备
        UpdataShebei(params){
            putShebeiUpdata(params).then(res=>{
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getShebeiList()
                    this.changeSheBei()

                    this.$message.success('编辑成功')
                }

            }).catch(error=>{
                console.log(error);
            })
        },
        changeSheBei(){
            this.$emit('saveLngLat')
        },



        addSbgl(){
            this.formAdd={
                deviceId: '',
                deviceCode: '',
                deviceName: '',
                deviceIp: '',
                systemType: '',
                deviceType: '',
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
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        ZBLXchange(val){
            console.log(val,'ZBLXchange');

            switch (val) {
                case 'TK':
                    this.formAdd.systemType='TK'
                break;
                case 'LK':
                    this.formAdd.systemType='LK'
                break;
                default:
                    if(this.formAdd.systemType == ''){
                        this.formAdd.systemType = 'TK';
                    }
                break;
            }
        },
    },
    mounted(){
        this.getShebeiList()
    },
    
}
</script>

<style lang="less" scoped>
.PinPuPopor{
    ::v-deep .el-table{
        overflow: auto;
    }
    .el-table::-webkit-scrollbar{
        width: 0;
    }
}
.el-dialog__body{
    padding:10px 20px;
}
::v-deep .el-form--inline{
    flex-wrap: wrap !important;
}
 ::v-deep .el-form-item{
    width: 45%;
 }
 ::v-deep .el-form-item__label{
    width: 100px;
 }
 ::v-deep .el-form-item__content{
    width: calc(100% - 100px);
 }
 .radioBox{
    padding-left:15px;
 }
</style>