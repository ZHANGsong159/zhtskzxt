<template>
<div class="PinPuPopor">
    <div class="listMain" >
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
                        prop="name"
                        label="模板名称"
                        align='center'
                        >
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="生效时间(秒)"
                        align='center'
                        >
                        <template slot-scope="scope">
                            {{scope.row.time}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="rxAtt"
                        align='center'
                        label="接收衰减值">
                        <template slot-scope="scope">
                            {{scope.row.paramVo.rxAtt}}MHz
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="maxRfFreq"
                        align='center'
                        label="射频频率上限">
                        <template slot-scope="scope">
                            {{scope.row.paramVo.maxRfFreq}}MHz
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="minRfFreq"
                        align='center'
                        label="射频频率下限">
                        <template slot-scope="scope">
                            {{scope.row.paramVo.minRfFreq}}MHz
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align='center'
                        >
                        <template slot-scope="scope">
                            <el-button  type="text" size="small" class="buttonStyle">复制</el-button>
                            <el-button  @click="handleClickUpdata(scope.row)" type="text" size="small" class="buttonStyle">修改</el-button>
                            <el-button  @click="handleClickDelete(scope.row)" type="text" size="small" class="buttonStyle deleteStyle">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>


                </template>

                <page-inaiton :pageSize="pageSize" :total="total"  @currentChange="handleCurrentChange"></page-inaiton>


            </div>
        </div>
    </div>
    <el-dialog
      width="80%"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      append-to-body>
      <gradd-pop v-if='innerVisible' :formAdddata='formAdd' :changetype='changeType' @changeList='changeList'></gradd-pop>

    </el-dialog>
</div>
    
</template>
<script>
import '@/assets/css/mbBox.less';
import graddPop from './graddPop.vue';
import pageInaiton from '@/components/chartBox/pageInaiton.vue';

import {getLeiKangGR,deleteLeiKangGR} from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components: {
        graddPop,
        pageInaiton
    },
    data() {
        return {
            changeType:'add',
            minvalueGRPL:0,
            maxvalueGRPL:100,
            pageNum:1,
            pageSize:10,
            dialogTitle:'干扰模版新增',
            innerVisible: false,
            total:1,
            tableData: [],
            formAdd:{
                name:'',
                time:'',
                param:{
                    pdwReport:'',
                    rxAtt:'',
                    maxRfFreq:'',
                    minRfFreq:'',
                    radio:'1',
                    leftselect:'',
                    rightselect:'',
                    paramBody:{},
                },

            }
        }
    
    },
    methods:{
        changeList(){
            this.getGanRaoList()
            this.innerVisible=false
        },

        // 分页
        handleCurrentChange(parame){
            this.pageNum=parame
            this.getGanRaoList()
        },
        handleClickUpdata(params){
            this.dialogTitle='模版更新'
            this.changeType='update'
            let coherentType= params.paramVo.paramBody.coherentType
            let noiseType= params.paramVo.paramBody.noiseType

            params.paramVo.pdwReport=params.paramVo.pdwReport.toString()


            if(coherentType==0){
                params.paramVo.radio='1'
            }else{
                if(noiseType==0){
                    params.paramVo.radio='2'
                }else{
                    params.paramVo.radio='3'
                }
            }
            
            this.formAdd={
                name:params.name,
                time:params.time,
                param:JSON.parse(JSON.stringify(params.paramVo)),
                id:params.id
            }
            this.innerVisible=true
        },
        handleClickDelete(params){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteLeiKangGR(params.id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },
        //删除
        deleteLeiKangGR(param){
            deleteLeiKangGR(param).then(res=>{
                console.log(res,'resresresres');
                if(res.data.code==200){
                    this.getGanRaoList()
                    this.$message.success('删除成功')
                }else{
                    this.$message.error('删除失败')
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        addSbgl(){
            this.dialogTitle = '干扰模版新增';
            this.changeType='add'

            this.formAdd = {
                name:'',
                time:'',
                param:{
                    pdwReport:'',
                    rxAtt:'',
                    maxRfFreq:'',
                    minRfFreq:'',
                    radio:'1',
                    leftselect:'',
                    rightselect:'',
                    paramBody:{},
                },
            };
            this.innerVisible = true;
        },
        generateRandomId() {
            return Math.floor(Math.random() * 90000000000) + 10000000000;
        },
        //获取列表数据
        getGanRaoList(){
        let params={
                pageNum:this.pageNum,
                pageSize:this.pageSize,
            }
            console.log(params,'params');
            getLeiKangGR(params).then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
                    console.log(this.tableData,'listlistlist');
                    
                    // this.tableData.forEach(item => {
                        // console.log(item,'itemresresresresGR');
                    // });
                }
               
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });
        },
    },
    mounted(){
        this.getGanRaoList()
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

.inpotBox{
    width: 100% !important;
}
.selectBox{
    width: 45% !important;
    ::v-deep .el-form-item__content::after{
        width: 0px;
    }
}
/* 自定义 ElementUI 组件的样式 */
.el-form--inline{
    .inpotBox{
        margin-bottom: 15px;
    }
}        
::v-deep .el-form-item__label{
        // width: 100px !important;
}
 ::v-deep .el-form-item{
    width: 45%;
    background: #ffffff26;
 }
.dialogBox{
    .dialogBoxMain{
        height: 500px;
        display: flex;
        flex-flow: row;
        .dialogBoxLeft{
            width: 25%;
            padding: 10px 20px;
            border-right: 1px solid #ffffff4c;
        }
        .dialogBoxRight{
            width: 75%;
            padding: 10px 20px;
        }
    }
    .dialogBoxFooter{
        height: 80px;
    }
}
.duoxuan{
    ::v-deep .el-form-item__content::after{
        width: 0px;
    }
}
::v-deep .el-form-item .el-form-item__content{
    width: auto !important;
}
</style>