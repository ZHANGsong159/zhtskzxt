<template>
<!-- // 部署配置 -->
<div class="PinPuPopor">
    <div class="PinPuPopor-title flexBox">
        <el-form  :inline="true">
            <el-form-item label="部署方案" class="inpotBox" style="width: 100%;">
                <el-select v-model="selectedDeviceBSFA" placeholder="请选择" @change="selectDeviceChange">
                    <el-option
                        v-for="device in devicesBSFA"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
    <div class="PinPuPopor-content flexBox">
        <div class="PinPuPopor-content-right ">
            <div class="mndksbList-body">
                <div class="mndksbList">
                    <div class="ListBox" v-for="(item,index) in tableData" :key="index" >
                        <div class="listbox-title">
                            {{item.deviceName}}
                        <!-- 模拟对抗设备1 -->
                        </div>
                        <el-form  :model="item" :inline="true"   :ref="`form${index}`" >
                            <el-form-item 
                            label="经度" 
                            prop="longitude"     
                            :rules="[{ required: true, message: '请输入经度', trigger: 'blur' },]">
                                <el-input 
                                v-model="item.longitude" 
                                placeholder="请填写" 
                                type="number"
                                :disabled="selectedDeviceBSFA == '0'"
                                @blur="validateLongitude(item.longitude, index)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item 
                            label="纬度" 
                            prop="latitude"
                            :rules="[{ required: true, message: '请输入经度', trigger: 'blur' },]">
                                <el-input 
                                v-model="item.latitude" 
                                placeholder="请填写" 
                                type="number"
                                :disabled="selectedDeviceBSFA == '0'"
                                @blur="validateLatitude(item.latitude, index)"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

            </div>
            <div  class="mndksbList-footer">
                <el-button @click="closeDialogZD()">取 消</el-button>
                <el-button type="primary" @click="confirm" >确 定</el-button>
            </div>

        </div>
    </div>


    <page-inaiton :pageSize="pageSize" :total="total"  @currentChange="handleCurrentChange"></page-inaiton>
    


</div>
    
</template>
<script>
import moment from 'moment';

import { getShebeiList ,getDeployNote,UpdataDeployNote,saveLngLat} from '@/api/api'
import pageInaiton from '@/components/chartBox/pageInaiton.vue';
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components: {
        pageInaiton
    },
    data() {
        return {
            total:0,
            pageNum:1,
            pageSize:16,
            selectedDeviceBSFA:'0',
            devicesBSFA:[
                {value: '0', label: '自动'},
                {value: '1', label: '手动'},
            ],
            tableData: [],
            formAdd:{
                longitude:'',
                latitude:'',
            },
        }
    },
    methods:{


         // 处理数字输入
        handleNumberInput(value, field, index) {
            // 限制只能输入数字和小数点
            this.tableData[index][field] = value.replace(/[^\d.]/g, '')
            .replace(/\.{2,}/g, '.')  // 只保留一个小数点
            .replace(/^\./g, '');     // 不能以小数点开头
        },
        
        // 验证经度范围
        validateLongitude(value, index) {
            const num = parseFloat(value) || 0;
            if (num < -180 || num > 180) {
            this.$message.error('经度范围应在 -180 到 180 之间');
            this.tableData[index].longitude = '';
            }
        },
        
        // 验证纬度范围
        validateLatitude(value, index) {
            const num = parseFloat(value) || 0;
            if (num < -90 || num > 90) {
            this.$message.error('纬度范围应在 -90 到 90 之间');
            this.tableData[index].latitude = '';
            }
        },






        handleCurrentChange(val){
            this.pageNum = val
            this.getShebeiList()

        },
        getFormattedTime() {
            return moment().format('YYYY-MM-DD HH:mm:ss');
        },
        selectDeviceChange(key){
            this.UpdataDeployNote(key)
            

        },
        closeDialogZD(){
            this.$emit('closeDialogZD')
        },

        async confirm(){
            this.saveLngLat(this.tableData)
        },
        generateRandomId() {
            return Math.floor(Math.random() * 90000000000) + 10000000000;
        },
        //获取列表数据
        getShebeiList(){
            let params={
                pageNum:this.pageNum,
                pageSize:this.pageSize
            }
            getShebeiList(params).then(res=>{
                return res.data
            }) .then(res=>{
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
                }
            }).catch(err=>{ 
                console.log(err,'err');
                
            })
        },
        //获取部署方式
        getBuShu(){
            getDeployNote('deploy').then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    console.log();
                    this.selectedDeviceBSFA=res.data.configValue
                }

            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        },
        //修改部署方式
        UpdataDeployNote(){
            const timenow = this.getFormattedTime()
            let params={
                configId: 1,
                configKey: "deploy",
                configName: "部署方式",
                configValue: this.selectedDeviceBSFA,
                createTime: timenow,
                remark: "0 = 自动, 1 = 手动"
            }
            UpdataDeployNote(params).then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.$message.success('部署方式修改成功')
                }
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        },
        //手动保存经纬度
        saveLngLat(params){
            saveLngLat(params).then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.$message.success('保存成功')
                    this.$emit('saveLngLat')
                }
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        },
    },
    mounted(){
        this.getShebeiList()
        this.getBuShu()
 
    },
    
}
</script>
<style lang="less" scoped>
::v-deep .el-button{
        background-color: #1C735E;
        color: #fff;
        border:1px solid #FFFFFF4C;
}
::v-deep .el-form-item{
    margin-bottom: 0px;
    background-color:#ffffff26 ;
}
.PinPuPopor{
    width: 100%;
    .PinPuPopor-title{
        padding-left: 30px;
        padding-bottom: 15px;
        box-sizing: border-box;
        justify-content: left;
    }
    .PinPuPopor-content{
        width: 100%;
        height: 636px;
        box-sizing: border-box;
        padding: 0px;
        border-bottom: #1C735E 1px solid;
        .PinPuPopor-content-right{
            width: 100%;
            height: 100%;
            padding: 0px;
            overflow: auto;
            background: transparent;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            .mndksbList-body{
                .mndksbList{
                    width: 100%;
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    box-sizing: border-box;
                    border-top: 1px solid #1C735E;
                    padding: 20px 20px;
                    .ListBox{
                        width: 48%;
                         display: flex;
                         justify-content: space-between;
                         align-items: center;
                         margin-bottom: 20px;
                        .listbox-title{
                            width: 150px;
                            font-size: 16px;
                            color: #fff;
                        }
                    }
                }
            }
            .mndksbList-footer{
                height: 84px;
                display: flex;
                justify-content: end;
                align-items: center;
                padding-right: 20px;
                border-top: 1px solid #1C735E;
            }
        }
    }
}
.el-form--inline{
  flex-wrap: nowrap;
}
::v-deep .el-form-item__label{ 
    width: 100px;
}
::v-deep .el-form-item__content{
    width: calc(100% - 100px);
}
</style>