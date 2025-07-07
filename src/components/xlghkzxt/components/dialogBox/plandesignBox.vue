<template>
<div class="main">
    <div class="plandesignleft">
        <el-form  :inline="true" style="flex-flow:row warp;padding:10px 20px">
            <el-form-item label="任务代号">
                <el-input v-model="formAdd.hdnm" placeholder="任务代号"></el-input>
            </el-form-item>
            <el-form-item label="任务名称">
                <el-input v-model="formAdd.name" placeholder="任务名称"></el-input>
            </el-form-item>
        </el-form>
        <div class="textarea">
            <div class="textareatittle">
                <span>任务内容</span>
            </div>
            <div class="textareaBody">
                <el-input type="textarea" st v-model="formAdd.scenario"></el-input>
            </div>
        </div>
        <div class="textbotton">
            <el-button type="primary" @click="openGuihuaclick" >任务打开</el-button>
            <el-button  @click="addGuihuaclick" >方案生成</el-button>
            <el-button  @click="xiafaGuihua" >方案下发</el-button>
            <el-button  @click="qvxiao" >方案取消</el-button>
        </div>
    </div>
    <div class="plandesignright">
        <div class="plandesignbox">
            <el-collapse>
                <el-collapse-item v-for="(allListitme,index) in allList" :key="index"> 
                    <template slot="title">
                        <div class="designboxTittle">
                                <tittleBg :tittlename='allListitme.name'></tittleBg>
                        </div>
                    </template>
                    <div class="designboxContent">
                        <div class="contentData" v-for="(item, index) in getListData(allListitme.type)" :key="index">
                            <div class="custom-checkbox" >
                                <el-checkbox   v-model="item.checked"></el-checkbox>
                            </div>
                            <div class="contentName">
                                <span>{{item.deviceName}}</span>
                            </div>
                            <div class="JWd">
                                <el-form   :inline="true">
                                    <el-form-item label="经度">
                                        <el-input v-model="item.longitude" placeholder="经度"></el-input>
                                    </el-form-item>
                                    <el-form-item label="纬度">
                                        <el-input v-model="item.latitude" placeholder="纬度"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="button">
                                <el-button type="primary" size="small" @click="setting(item)" >参数设置</el-button>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
            
        </div>
    </div>


    <el-dialog
      width="90%"
      title="参数设置"
      :visible.sync="innerVisible"
      v-if="innerVisible"
      append-to-body>
      <fangan-guihua-pop :cansshudata='cansshudata' @closeDialogZD='closeDialogZD' ></fangan-guihua-pop>
    </el-dialog>

    <el-dialog title="任务列表" :visible.sync="dialogTableVisible" append-to-body>
        <el-table :data="gridData" >
            <el-table-column property="hdnm" label="任务代号"  align='center'></el-table-column>
            <el-table-column property="name" label="任务名称"   align='center'></el-table-column>
            <el-table-column property="scenario" label="任务内容"  align='center'></el-table-column>
        </el-table>
    </el-dialog>
</div>
</template>
<script>
import FanganGuihuaPop  from "./fanganguihuapop.vue";
import tittleBg from "@/components/chartBox/tittleBackground.vue"
import {getShebeiList,addGuiHua,getGuiHua,getGuiHuaxiafa} from "@/api/api";
export default {
    components: {
        FanganGuihuaPop,
        tittleBg
    },
    props: {
        updatadata:{
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            gridData:[],
            dialogTableVisible:false,
            cansshudata:{},
            innerVisible:false,
            formAdd:{
                hdnm:'',
                name:'',
                scenario:'',
            },
            allList:[
                {
                    name:'通抗对抗设备参数配置',
                    type:'TK'
                },
                {
                    name:'雷抗对抗设备参数配置',
                    type:'LK'
                },
                {
                    name:'光抗对抗设备参数配置',
                    type:'GK'
                }
            ],
            tableDataTK: [
                {
                    checked:false,
                    deviceCode:'',
                    deviceName:'111111111',
                    longitude:'',
                    latitude:'',
                },
            ],
            tableDataLK: [
                {
                    checked:false,
                    deviceCode:'',
                    deviceName:'111111111',
                    longitude:'',
                    latitude:'',
                },
            ],
            tableDataGK: [
                {
                    checked:false,
                    deviceCode:'',
                    deviceName:'111111111',
                    longitude:'',
                    latitude:'',
                },
            ],
        }
    },
    created(){
        this.getShebeiList()
    },
    watch:{ 
        updatadata(){

            if(this.updatadata.planId){
            this.formAdd=this.updatadata
            }else{
                this.formAdd={
                    hdnm:'',
                    name:'',
                    scenario:'',
                }
            }

        }
    },
    mounted() { 
        if(this.updatadata.planId){
            this.formAdd=this.updatadata
            }else{
                this.formAdd={
                    hdnm:'',
                    name:'',
                    scenario:'',
                }
            }
        
    },
    methods: { 
        closeDialogZD(){
            this.innerVisible = false
        },
        qvxiao(){
            this.$emit('closeDialogZD')
        },
        xiafaGuihua(){
            this.getGuiHuaxiafa(this.formAdd)
        },
        getGuiHuaxiafa(){
            getGuiHuaxiafa(this.formAdd.planId).then(res=>{ 
                if(res.code==200){
                    this.$message.success('成功下发')
                }
                
            })
        },
        
        addGuihuaclick(){
            if(!this.formAdd.name){
                this.$message.error('请输入任务名称');
            }else if(!this.formAdd.hdnm){
                this.$message.error('请输入任务代号');
            }
            else{
                addGuiHua(this.formAdd).then(res=>{
                    if(res.data.code==200){
                        this.$message.success('保存成功');
                        this.$emit('closeDialogZD')
                    }
                })
            }

        },
        openGuihuaclick(){
            // this.getGuiHua()
            // this.dialogTableVisible = true;
        },
        getGuiHua(){
            getGuiHua().then(res=>{
                if(res.data.code==200){
                    this.gridData = res.data.data.list;
                }
            })
        },
        getListData(type){
            switch (type){
                case 'GK':
                    return this.tableDataGK
                case 'TK':
                    return this.tableDataTK
                case 'LK':
                    return this.tableDataLK
            }
        },
        setting(param){
            this.cansshudata=param
            this.innerVisible=true

        },
        confirm(){

        },
        getShebeiList(){
            getShebeiList().then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    let listdata=res.data.list
                    listdata.forEach(item => {
                        switch (item.deviceType){
                            case 'TK':
                                this.tableDataTK.push(item)
                                break;
                            case 'LK':
                                this.tableDataLK.push(item)
                                break;
                            case 'GK':
                                this.tableDataGK.push(item)
                                break;
                        }
                    });

                }
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        }
    },
    
}
</script>
<style lang="less" scoped>
.main{
    box-sizing: border-box;
    padding:10px 20px;
    display: flex;
    flex-flow: row  nowrap;
    height: 700px;
    .plandesignleft{
        width: 30%;
        border-right:1px solid #FFFFFF4C ;
        ::v-deep .el-form-item{
            width: 100%;
            margin-right: 0px;
            text-align: left;
            background: transparent;
        }
        ::v-deep .el-form-item__label{
            width: 100px !important;
            text-align: left;
            padding: 0 10px;
        }
        .textarea{
            margin: 10px 20px;
            border: 1px solid #FFFFFF4C;
            padding: 10px 20px;
            .textareatittle{
                font-size: 18px;
                height: 40px;
                line-height: 40px;
                color: #fff;
                text-align: left;
                border-bottom: 1px solid #FFFFFF4C;
            }
            .textareaBody{
                height: 350px;
                padding: 10px 0;

                border: none;
                ::v-deep .el-textarea{
                    height: 100%;
                }
                ::v-deep .el-textarea__inner{
                    height: 100%;
                    padding: 0;
                    font-size: 16px;
                    color: #fff;
                    border: none;
                    background: transparent;    
                }
            }
        }
        .textbotton{
            width: 100%;
            padding: 0 20px;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            .el-button{
                margin-left: 0px;
                margin-bottom: 10px;
                width: 45%;
            }
        }
    }
    .plandesignright{
        width: 70%;
        height: 100%;
        overflow: auto;
        padding: 0 20px;
        .plandesignbox{
            .designboxTittle{
                width: 100%;
            }

            .designboxContent{
                width: 100%;
                .contentData{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-flow: row nowrap;
                    margin-bottom: 10px;
                    ::v-deep .el-checkbox__inner{
                        background: transparent;
                        border: 1px solid #FFFFFF4C;
                    }
                    ::v-deep .el-checkbox__inner:hover{
                        border: #1C735E 1px solid;
                    }
                    /* 修改选中状态背景 */
                    ::v-deep .custom-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {
                        background-color: #1C735E ; /* 目标背景色 */
                        border-color: #1C735E;
                    }
                    /* 修改选中图标颜色 */
                    ::v-deep .custom-checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
                        color: #333; /* 可选文本颜色 */
                    }
                    .contentName{
                        width: 50%;
                        height: 100%;
                        flex-grow: 1;
                        color: #fff;
                        font-size: 16px;
                        padding: 0px 20px;
                        text-align: left;
                    }
                    .JWd{
                        height: 100%;
                        width: 30%;
                        ::v-deep .el-form {
                            height: 100%;
                            padding: 0;
                            .el-form-item{
                                margin: 0;
                                width: 48%;
                                height: 30px;
                                text-align: left;
                                .el-form-item__label{
                                    line-height: 30px;
                                    width: 50px !important;
                                }
                                .el-form-item__content{
                                    line-height: 30px;
                                    width: calc(100% - 50px) !important;
                                    .el-input__inner{
                                        height: 30px;
                                        line-height: 30px;
                                    }
                                }
                            }
                        }
                    }
                    .button{
                        height: 30px;
                        margin-left: 10px;
                        border: 1px solid #FFFFFF4C;
                        .el-button{
                            height: 30px;
                            padding: 0px 20px;
                            font-size: 14px;
                            line-height: 30px;
                        }
                    }
                    
                }
            }

        }
    }
}
::v-deep .el-collapse-item__header{
        background: transparent;
}
</style>