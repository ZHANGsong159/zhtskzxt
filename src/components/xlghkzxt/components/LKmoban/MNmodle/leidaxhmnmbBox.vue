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
                    label="射频频率下限"
                    align='center'>
                    <template scope="scope">
                        {{scope.row.paramsnew.minRfFreq==null?'--':scope.row.paramsnew.minRfFreq}}
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="maxRate"
                    label="射频频率上限"
                    align='center'>
                    <template scope="scope">
                        {{scope.row.paramsnew.maxRfFreq==null?'--':scope.row.paramsnew.maxRfFreq}}
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
import mnDialogVue from './leikangPop.vue';
import pageInaiton from '@/components/chartBox/pageInaiton.vue';

import { getLeiKangMN,deleteLeiKangMN } from '@/api/api'
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
                param:{
                minRfFreq:'',
                maxRfFreq:'',
                paramBody:{
                    freqType:'',
                    signalType:'',
                    cwFreq:'',
                    cwLevel:'',
                    pulseSafeDelay:'',
                    signalCollection:[]
                }
                },
            },
            BoxleftList:[],
        }
    },
    methods:{
        getShebeiList(){
            
            this.getLeiKangMN()
            this.innerVisible=false
        },
        // 分页
        handleCurrentChange(parame){
            console.log(parame,'parameparameparame');
            this.pageNum=parame
            this.getLeiKangMN()
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
            this.topForm.param=params.paramsnew
            this.topForm.wayNum=params.wayNum
            this.topForm.createTime=params.createTime

            // this.topForm.param.paramBody.freqType=this.topForm.param.paramBody.freqType.toString()
            // this.topForm.param.paramBody.signalType=this.topForm.param.paramBody.signalType.toString()
            console.log(this.topForm,JSON.parse(params.param) ,'paramsparamsparams');


            this.innerVisible=true
        },
        //列表删除
        handleClickDelete(params){
            this.deleteLeiKangMN(params.id)
        },
        //删除
        deleteLeiKangMN(id){
            deleteLeiKangMN(id).then(res=>{
                console.log(res,'resresresres');
                if(res.data.code==200){
                    this.$message.success('删除成功');
                    this.getLeiKangMN()
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
                param:{
                minRfFreq:'',
                maxRfFreq:'',
                paramBody:{
                    freqType:'',
                    signalType:'',
                    cwFreq:'',
                    cwLevel:'',
                    pulseSafeDelay:'',
                    signalCollection:[]
                }
                },
            },
            this.innerVisible=true
        },
        //获取列表数据
        getLeiKangMN(){
        let params={
                pageNum:this.pageNum,
                pageSize:this.pageSize,
            }
            getLeiKangMN(params).then(res=>{
                return res.data
            }) .then(res=>{
                if(res.code==200){
                    this.tableData=res.data.list

                    this.tableData.forEach(item=>{
                        item.paramsnew=JSON.parse(item.param)
                    })
                    this.total=res.data.total
                }
            }).catch(err=>{
                console.log(err);
            })
        },

    },
    mounted(){
        this.getLeiKangMN()
 
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