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
                    prop="name"
                    label="模板名称"
                    align='center'
                    >
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="生效时间"
                    align='center'
                   >
                </el-table-column>
                <el-table-column
                    prop="wayNum"
                    label="信号路数"
                    align='center'
                    >
                </el-table-column>
                <el-table-column
                    prop="minRate"
                    label="最小频率"
                    align='center'>
                    <template scope="scope">
                        {{scope.row.minRate==null?'--':scope.row.minRate}}
                    </template>
                    
                </el-table-column>
                 <el-table-column
                    prop="maxRate"
                    label="最大频率"
                    align='center'>
                    <template scope="scope">
                        {{scope.row.maxRate==null?'--':scope.row.maxRate}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align='center'
                    >
                    <template slot-scope="scope">
                        <el-button  @click="handleClickUpdata(scope.row,'copy')" type="text" size="small" class="buttonStyle">复制</el-button>
                        <el-button  @click="handleClickUpdata(scope.row)" type="text" size="small" class="buttonStyle">修改</el-button>
                        <el-button  @click="handleClickDelete(scope.row)" type="text" size="small" class="buttonStyle deleteStyle">删除</el-button>
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
      width="80%"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      append-to-body>
      <mn-dialog-vue v-if='innerVisible' :topForm='topForm'  :caozuotype='caozuotype'  @getShebeiList='getShebeiList' ></mn-dialog-vue>
    </el-dialog>
</div>
    
</template>
<script>
import '@/assets/css/mbBox.less';
import mnDialogVue from './mnDialog.vue';
import pageInaiton from '@/components/chartBox/pageInaiton.vue';

import { getTongKangMN,deleteTongKangMN } from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components: {
        mnDialogVue,
        pageInaiton
    },
    data() {
        return {
            pageNum:1,
            pageSize:10,
            dialogTitle:'新增模版',
            caozuotype:'add',
            innerVisible: false,
            total:1,
            tableData: [],
            topForm:{
                id:'',
                name:'',
                time:'',
                signalType:'',
                gain:0,
                simulateList:[],
            },
            BoxleftList:[],
        }
    },
    methods:{
        getShebeiList(){
            console.log('getTongKangMN');
            
            this.getTongKangMN()
        },
        // 分页
        handleCurrentChange(parame){
            console.log(parame,'parameparameparame');
            this.pageNum=parame
            this.getTongKangMN()
        },

        handleClickUpdata(params,copy){
            if(copy){
                this.topForm.id=''
                this.dialogTitle='模版复制'
                this.caozuotype='copy'
            }else{
                this.topForm.id=params.id
                this.dialogTitle='模版更新'
                this.caozuotype='update'
            }
            this.topForm.name=params.name
            this.topForm.time=params.time

            if(JSON.parse(params.param)){
                this.topForm.signalType=JSON.parse(params.param)[0].signalType
                this.topForm.gain=JSON.parse(params.param)[0].gain
                this.topForm.simulateList=JSON.parse(params.param)
            }
            this.innerVisible=true
        },
        //列表删除
        handleClickDelete(params){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.deleteTongKangMN(params.id)
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
        },
        //删除
        deleteTongKangMN(id){
            deleteTongKangMN(id).then(res=>{
                console.log(res,'resresresres');
                if(res.data.code==200){
                    this.$message.success('删除成功');
                    this.getTongKangMN()
                }else{
                    this.$message.error('删除失败');
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        addMNMB(){
            this.dialogTitle='新增模版'
            this.caozuotype='add'
            this.topForm={
                id:'',
                name:'',
                time:'',
                signalType:'',
                gain:0,
                simulateList:[],
            },
            this.innerVisible=true
        },
        //获取列表数据
        getTongKangMN(){
        let params={
                pageNum:this.pageNum,
                pageSize:this.pageSize,
            }
            getTongKangMN(params).then(res=>{
                return res.data
            }) .then(res=>{
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
                }
            }).catch(err=>{
                console.log(err);
            })
        },

    },
    mounted(){
        this.getTongKangMN()
 
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
::v-deep .el-form-item{
    margin: 10px 0;
}
</style>