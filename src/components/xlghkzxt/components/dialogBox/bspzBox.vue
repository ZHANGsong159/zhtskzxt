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
                        <el-form  :model="formAdd" :inline="true"   :ref="`form${index}`">
                            <el-form-item 
                            label="经度" 
                            prop="longitude"     
                            :rules="[
                            { required: true, message: '请输入经度', trigger: 'blur' },]"
                            >
                                <el-input v-model="item.longitude" placeholder="请填写"></el-input>
                            </el-form-item>
                            <el-form-item 
                            label="纬度" 
                            prop="latitude"
                             :rules="[
                            { required: true, message: '请输入经度', trigger: 'blur' },]"
                            >
                                <el-input v-model="item.latitude" placeholder="请填写"></el-input>
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


</div>
    
</template>
<script>
import moment from 'moment';

import { getShebeiList ,getDeployNote,UpdataDeployNote,saveLngLat} from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    data() {
        return {
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
        getFormattedTime() {
            return moment().format('YYYY-MM-DD HH:mm:ss');
        },
        selectDeviceChange(key){
            
            // console.log(key,now,'key');
            this.UpdataDeployNote(key)
            

        },
        closeDialogZD(){
            this.$emit('closeDialogZD')
        },

        async confirm(){
            // let arr=this.tableData.map((item, index) => {
                // console.log(`form${index}`,'tableData');
                // return this.$refs[`form${index}`][0].validate((valid)=>{
                //     console.log(valid,item,'valid');
                    
                // })

                // return this.$refs[`form${index}`][0].validate()

            // })
            // console.log(arr,'arr');
            
                // console.log(validations ,'tableData');

            // try {
            //     await Promise.all(validations)
            //     // 所有动态表单验证通过
            // } catch (error) {
            //     console.log('动态表单验证失败', error)
            // }
            // console.log(this.tableData,'saveLngLatsaveLngLat');
            this.saveLngLat(this.tableData)


        },
        generateRandomId() {
            return Math.floor(Math.random() * 90000000000) + 10000000000;
        },
        //获取列表数据
        getShebeiList(){
            getShebeiList().then(res=>{
                return res.data
            }) .then(res=>{
                console.log(res,'getShebeiListgetShebeiList');
                if(res.code==200){
                    this.tableData=res.data.list
                }
            })
        },
        //获取部署方式
        getBuShu(){
            getDeployNote('deploy').then(res=>{
                return res.data
            }).then(res=>{
                console.log(res,'getBuShugetBuShu');
                this.selectedDeviceBSFA=res.data.configValue

            })
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
                console.log(res,'UpdataDeployNoteUpdataDeployNote');
                if(res.code==200){
                    this.$message.success('部署方式修改成功')
                }
            })
        },
        //手动保存经纬度
        saveLngLat(params){
            saveLngLat(params).then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.$message.success('保存成功')
                }else if(res.code==4000){
                    this.$message.error('请先填写必要数据')
                }
            })
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
        // width: 100%;
        padding-left: 30px;
        padding-bottom: 15px;
        box-sizing: border-box;
        // border-bottom: 1px solid #1C735E;
        justify-content: left;

    }
    .PinPuPopor-content{
        width: 100%;
        height: 636px;
        box-sizing: border-box;
        padding: 0px;
        .PinPuPopor-content-right{
            width: 100%;
            height: 100%;
            padding: 0px;
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
                    // border-bottom: 1px solid #1C735E;
                    padding: 20px 20px;
                    .ListBox{
                        width: 48%;
                         display: flex;
                         justify-content: space-between;
                         align-items: center;
                         margin-bottom: 20px;
                        .listbox-title{
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
</style>