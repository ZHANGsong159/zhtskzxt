<template>
<div class="PinPuPopor">
    <div class="PinPuPopor-title flexBox">
       
        <div class="buttonBox">
            <el-button type="primary" @click="addMNMB">
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
                    prop="hdnm"
                    label="任务代号"
                    align='center'
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="任务名称"
                    align='center'
                    >
                </el-table-column>
                <el-table-column
                    prop="scenario"
                    label="任务内容"
                    align='center'
                    >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align='center'
                    >
                    <template slot-scope="scope">
                        <el-button  @click="handleClickUpdata(scope.row)" type="text" size="small" class="buttonStyle">修改</el-button>
                        <el-button  @click="handleClickDelete(scope.row)" type="text" size="small" class="buttonStyle deleteStyle">删除</el-button>
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
    :title="tittlename"
    :visible.sync="dialogVisible"
    width="90%"
    append-to-body
    :before-close="handleClose">
        <plandesignvue :updatadata='updatadata' @closeDialogZD='closeDialogZD'></plandesignvue>
    </el-dialog>
</div>
</template>
<script>
import '@/assets/css/mbBox.less';
import plandesignvue from '@/components/xlghkzxt/components/Trainingplanning/fagh/plandesignBox.vue';
import {getGuiHua,deleteGuiHua} from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components:{
        plandesignvue
    },
    data() {
        return {
            pageNum:1,
            pageSize:10,
            total:1,
            tableData: [],
            dialogVisible:false,
            tittlename:'新建规划',
            updatadata:{},
        }
    },
    methods:{
        closeDialogZD(){
            this.dialogVisible = false
            this.getGuiHua()
        },
        handleCurrentChange(){

        },
        handleClose() {
            this.dialogVisible = false
        },
        addMNMB(){
            this.dialogVisible = true
            this.tittlename = '新建规划'
        },
        handleClickUpdata(param){
            this.updatadata = param
            this.dialogVisible = true
            this.tittlename = '更新规划'
        },
        handleClickDelete(param){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteGuiHua(param.planId)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        getGuiHua(){
            getGuiHua().then(res=>{
                if(res.data.code==200){
                    this.tableData=res.data.data.list
                    this.total=res.data.total
                }
            })
        },
        deleteGuiHua(id){
            deleteGuiHua(id).then(res=>{
                if(res.data.code==200){
                    this.$message.success('删除成功');
                    this.getGuiHua()
                }
            })
        },
    },
    created(){
        this.getGuiHua()
    },
    mounted(){
        
 
    },
    
}
</script>
<style lang="less" scoped>
.buttonStyle{
    color: #FFF10D !important;
}
.deleteStyle{
    color: #FA5151 !important;
}

.PinPuPopor{
    width: 100%;
    .PinPuPopor-title{
        width: 100%;
        padding-bottom: 15px;
        border-bottom: 1px solid #1C735E;
        justify-content: left;
    }
}

.inpotBox{
    background-color: #FFFFFF26;
    color: #fff;
    border: 1px solid #FFFFFF4C;
    // width: 320px;
}

// ::v-deep .el-dialog__body{
//     padding: 0 !important;
// }
.XHMNinputBox{
    width: 100%;
    padding: 20px 20px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    .el-form--inline{
        width: 100%;
        // flex-flow: row nowrap;
    }
    ::v-deep .el-form-item__label{
        width: 90px;
    }
}
.XHMNmainBox{
    width: 100%;
    height: 648px;
    border-top:1px solid #1C735E;
    padding: 30px 20px;
    display: flex;
    .XHMNmainBoxleft{
        width: 35%;
        height: 100%;
        color: #fff;
        border-right:1px solid #ffffff4c ;
        .XHMNBoxleftmain.selected{
            background: #1C735E;
        }
        .XHMNBoxleftmain{
            width: 470px;
            height: 78px;
            color: #fff;
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            background: #FFFFFF26;
            border: 1px solid #ffffff4c;
            margin-bottom: 20px;
            position: relative;
            .XHMNBoxleftmain-left{
                width: 40px;
                height: 80%;
                font-size: 18px;
                border-right:1px solid #ffffff4c ;
                // text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                

            }
            .XHMNBoxleftmain-right{
                padding-left: 20px;
                width: calc(100% - 40px);
                font-size: 18px;
            }
            .closeButton{
                position: absolute;
                font-size: 16px;
                cursor: pointer;
                right: 10px;
                top: 10px;
            }
        }
    }
    .XHMNmainBoxright{
        width: 60%;
        height: 100%;
        display: flex;
        flex-flow: column;
        ::v-deep .el-form{
            width: 100%;
            display: flex;
            justify-content:space-between;
            align-items: flex-start;
            align-self: start;
            padding-left: 50px;

        }
        ::v-deep .el-form-item{
            width: 45%;
            background: #FFFFFF26;
            box-sizing: border-box;
        }
        .PinLvJin{
            width: 100%;
            flex-grow: 1;
            padding-left: 50px;
            max-height: 50%;
            box-sizing: border-box;
            .pinlvjiMain{
                background: #FFFFFF26;
                width: 100%;
                height: 100%;
                // height: calc(100% - 40px);
                padding: 20px 20px;
                border: 1px solid #ffffff4c;

                .pinlvjiTittle{
                    font-size: 18px;
                    color: #fff;
                    margin-bottom: 10px;
                }
                .pinlvjiMainsmall{
                    display: flex;
                    flex-flow: row wrap;
                    max-height: calc( 100% - 30px);
                    justify-content: flex-start;
                    align-items: flex-start;
                    overflow: auto;
                    .mainBox{
                        width: 80px;
                        height: 30px;
                        background: #FFFFFF26;
                        border: 1px solid #ffffff4c;
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                    }

                }

            }
        }

    }
}
::v-deep .el-form-item{
    margin: 10px 0;
}
</style>