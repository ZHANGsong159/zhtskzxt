<template>
        <div class="plandesignright">
        <div class="plandesignbox">
            <tittleBg :tittlename='"任务配置"'></tittleBg>
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"> 干扰信号配置</span>
                    <div class="boxleft">
                        <el-form  :model="formAdd" :inline="true" style="flex-flow:row warp;padding:10px 20px">
                            <el-form-item label="模板名称">
                                <el-input v-model="formAdd.deviceCode" placeholder="模板名称"></el-input>
                            </el-form-item>
                            <el-form-item label="生效时长(s)">
                                <el-input v-model="formAdd.deviceCode" placeholder="生效时长(s)"></el-input>
                            </el-form-item>
                            <el-form-item label="侦收开关">
                                <el-input v-model="formAdd.deviceCode" placeholder="侦收开关"></el-input>
                            </el-form-item>
                            <el-form-item label="接收衰减值">
                                <el-input v-model="formAdd.deviceCode" placeholder="接收衰减值"></el-input>
                            </el-form-item>
                            <el-form-item label="射频频率上限">
                                <el-input v-model="formAdd.deviceCode" placeholder="射频频率上限"></el-input>
                            </el-form-item>
                            <el-form-item label="射频频率下限">
                                <el-input v-model="formAdd.deviceCode" placeholder="射频频率下限"></el-input>
                            </el-form-item>
                            <div class="radio-box">
                                <el-radio v-model="radio" label="1">噪声干扰</el-radio>
                                <el-radio v-model="radio" label="2">相干干扰</el-radio>
                                <el-radio v-model="radio" label="3">组合干扰</el-radio>
                            </div>
                            <div class="selectbox">
                                <el-select>
                                    <el-option label="1" value="1"></el-option>
                                </el-select>
                                <el-select>
                                    <el-option label="1" value="1"></el-option>
                                </el-select>
                            </div>
                        </el-form>
                    </div>
                    <div class="boxright">
                        <div class="boxrighttop">
                        </div>
                        <div class="boxrightbottom"> 
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="模拟信号配置">
                    模拟信号配置
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import tittleBg from "@/components/chartBox/tittleBackground.vue"

import {getShebeiList,getGuiHua} from "@/api/api";
export default {
    name:"plandesignBox",
    components:{
        tittleBg,
    },
    data() {
        return {
            tittlename:'任务列表',
            radio:'1',
            formAdd:{
                deviceCode:'',
                deviceName:'',
                deviceCounte:'',
            },
            tableData:[],
         
        }
    },
    created(){
        this.getGuiHua()
    },
    methods: { 
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
        confirm(){

        },
        //获取规划方案
        getGuiHua(){
            getGuiHua().then(res=>{
                console.log(res,'getGuiHua')
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.tableData = res.data.list
                }
            })
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
            margin-bottom: 0px;
            text-align: left;
            background: transparent;
        }

        .leftPinpu{
            width: 100%;
            padding: 0px 20px;
            ::v-deep .el-table__header{
                width: 100%;
            }

        }
   
    }
    .plandesignright{
        width: 70%;
        height: 100%;
        overflow: auto;
        padding: 0 20px;
        .plandesignbox{
            .boxleft{
                width: 40%;
                border-right: 1px solid #ffffff4c;
                .el-form--inline{
                    justify-content: center;
                }
                .radio-box{
                    margin-bottom: 20px;
                    .el-radio{
                        margin-right:10px ;
                    }
                }
                .selectbox{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .el-select{
                        width: 45%;
                        border: 1px solid #ffffff4c;
                    }
                }
            }
            .boxright{
                width: 60%;
            }   
         
        }
    }
}


/* 添加在组件的 <style> 部分 */
::v-deep .el-tabs--border-card {
  background: transparent !important;
  border: none;
  
  /* 标签页头部样式 */
  .el-tabs__header {
    background-color: transparent !important;
    border-bottom:none!important;
    
    /* 单个标签页样式 */
    .el-tabs__item {
      background: #FFFFFF26 !important;
      color: #fff !important;
      margin-right: 20px;
      font-size: 16px;
      border: 2px solid #FFFFFF4C;
      border-bottom: none;
    //   border-right: linear-gradient(180deg, #2CE5BA 0%, #2CE5BA00 100%) !important;
      
      /* 选中状态的样式 */
      &.is-active {
        background: #1C735E !important; /* 绿色背景 */
        color: white !important;
        border: 2px solid #2CE5BA;
        border-bottom-color: transparent !important;
      }
      
      /* 悬停效果 */
      &:hover {
        color: white !important;
      }
    }
  }
  
  /* 内容区域样式 */
  .el-tabs__content {
    padding: 15px;
    border: 1px solid #ffffff4c;
    height: 100%;
    background: rgba(0, 0, 0, 0.0); /* 半透明背景 */
  }
}

 ::v-deep .el-form-item{
    margin-right: 0;
 }

::v-deep .el-form-item__label{
    width: 130px ;
    text-align: left;
    padding: 0 10px;
}
::v-deep .el-form-item__content{
    width: calc(100% - 130px);
}
</style>