<template>
<div class="taskmanageBox">
    <div class="taskmanageTittle">
        <el-form   :inline="true"  >
            <el-form-item label="任务代号" prop="hdnm" class="inpotBox" style="width: 48%;">
                <el-input  v-model="form.hdnm" maxlength="15" placeholder="15个字符以内"></el-input>
            </el-form-item>
            <el-form-item label="任务名称" prop="name" class="inpotBox" style="width: 48%;">
                <el-input  v-model="form.name" maxlength="15" placeholder="15个字符以内"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="taskmanageBody">
        <div class="divmainBody">
            <div class="divmainTitle">任务内容</div>
            <div class="divmainContent">
                <el-input type="textarea" maxlength="100"  v-model="form.scenario" placeholder="请输入内容"></el-input>
            </div>
        </div>
    </div>
    <div class="taskmanageFooter">
        <div class="taskmanageFooterRight">

            <div class="buttonBox">
                <el-button @click="handleClickClose"   class="buttonQvxiao">取消</el-button>
                <el-button type="primary" @click="Openlist">
                    <div class="buttonBoxImge flexBox">
                        <img src="@/assets/img/folder-open-line@1x.png" alt="">
                        <div>打开</div>
                    </div>
                </el-button> 
                <el-button type="primary" @click="Daoru">
                    <div class="buttonBoxImge flexBox">
                        <img src="@/assets/img/download-2-line@1x.png" alt="">
                        <div>导入</div>
                    </div>
                </el-button> 
         
                <!-- <el-button type="primary" @click="addMNMB">
                    <div class="buttonBoxImge flexBox">
                        <div>另存为</div>
                    </div>
                </el-button>  -->

                <el-button type="primary" @click="addRenWu">
                    <div class="buttonBoxImge flexBox">
                        <div>保存</div>
                    </div>
                </el-button> 
            </div>
        </div>

    </div>
    <el-dialog title="任务列表" :visible.sync="dialogTableVisible" append-to-body>
        <el-table :data="gridData" >
            <el-table-column property="hdnm" label="任务代号"  align='center'></el-table-column>
            <el-table-column property="name" label="任务名称"   align='center'></el-table-column>
            <el-table-column property="scenario" label="任务内容"  align='center'></el-table-column>
            <el-table-column label="操作"  align='center'>
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleClickDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page-inaiton :pageSize="pageSize" :total="total"  @currentChange="handleCurrentChange"></page-inaiton>

    </el-dialog>


    <el-dialog title="导入" :visible.sync="dialogTableVisibledaoru" append-to-body>
        <div
            @dragover.prevent
            @drop.prevent="handleDrop"
            style="border: 2px dashed #ccc; padding: 20px; text-align: center"
        >
            <p>拖放 JSON 文件到这里</p>
            <input type="file" @change="handleFileUpload" accept=".json" />
        </div>
    </el-dialog>
</div>
</template>
<script>
import {addRenWu,getRenWu,deleteRenWu} from '@/api/api'
import pageInaiton from '@/components/chartBox/pageInaiton.vue';

export default {
    components: {
        pageInaiton
    },
    data() {
        return {
            activeIndex: '1',
            jsonData:'',
            dialogTableVisible:false,
            dialogTableVisibledaoru:false,
            form: {
                name: '',
                hdnm: '',
                scenario:'',
            },
            gridData:[],
            gridDatatotle:0,
            pageNum:1,
            pageSize:10,
        }
    },
    methods: { 
        handleClickClose(){
            this.$emit('closeDialogZD');
        },
        confirm(){},
        Openlist(){
            this.geRenWu()
            this.dialogTableVisible = true;
        },
        Daoru(){
            this.dialogTableVisibledaoru = true;

        },
        addRenWu(){
            if(!this.form.name){
                this.$message.error('请输入任务名称');
            }else if(!this.form.hdnm){
                this.$message.error('请输入任务代号');
            }else if(!this.form.scenario){
                this.$message.error('请选择任务内容');
            }
            else{
                addRenWu(this.form).then(res=>{
                    console.log(res,'addRenWu');
                    if(res.data.code==200){
                        this.$message.success('保存成功');
                        this.$emit('closeDialogZD')
                    }
                }).catch(error=>{
                    console.log(error);
                })
            }

        },
        geRenWu(){
            let param={
                pageNum:this.pageNum,
                pageSize:this.pageSize
            }
            getRenWu(param).then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    console.log(res.data,'getRenWu');
                    this.gridDatatotle=res.data.total
                    this.gridData = res.data.list
                }
            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });

        },
        handleClickDelete(val){
            deleteRenWu(val.taskId).then(res => { 
                return res.data
            }).then(res=>{
                if(res.code==200){
                    if(this.gridData.length==1){
                        this.pageNum=this.pageNum==1?1:this.pageNum-1
                    }
                    this.geRenWu()
                    this.$message.success('删除成功')
                }else{
                    this.$message.error('删除失败')
                }
            }).catch(error=> { 
                console.log(error);
            });


        },

        handleCurrentChange(val){
            console.log(val,'handleCurrentChange');
            this.pageNum = val
            this.geRenWu()
        },




        handleDrop(event) {
            const file = event.dataTransfer.files[0]; // 获取拖放的文件
            if (file && file.type === "application/json") {
                this.readFile(file);
            } else {
                alert("请上传有效的 JSON 文件！");
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) this.readFile(file);
        },
        readFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    if(!JSON.parse(e.target.result).hdnm){
                        this.$message.error('不符合导入格式');
                    }else{
                        this.jsonData = JSON.parse(e.target.result);
                    }
                } catch (error) {
                alert("JSON 解析失败！");
                }
            };
            reader.readAsText(file);
        },
    },
    
}
</script>
<style lang="less" scoped>
.taskmanageBox{
    
    .taskmanageTittle{
        width: 100%;
        padding: 10px 20px;
    }
    .taskmanageBody{
        padding: 20px 20px;
        .divmainBody{
            width: 100%;
            height: 400px;
            background: #FFFFFF26;
            border: 1px solid #FFFFFF4C;
            padding: 10px ;
            .divmainTitle{
                color: #FFFFFF;
                font-size: 18px;
                letter-spacing: 0px;
                text-align: left;
                padding-bottom: 10px;

                border-bottom: 1px solid #FFFFFF4C;

            }
            .divmainContent{
                width: 100%;
                height: calc(100% - 40px);
                ::v-deep .el-form{
                    height: 100%;
                    .el-form-item{
                        height: 100%;
                        .el-form-item__content{
                            height: 100%;
                        }
                        .el-form-item__content::after{
                            display: none;
                        }
                    }
                }
                ::v-deep .el-textarea{
                    height: 100% ;
                }
                ::v-deep .el-textarea__inner{
                    width: 100%;
                    height: 100% ;
                    color: #fff;
                    // background: #FFFFFF26;
                    border: none;
                    background: transparent;
                }
            }
        }
    }
    .taskmanageFooter{
        width: 100%;
        border-top: 1px solid #0B715A;
        padding: 0px 20px;
        .taskmanageFooterRight{
            padding-top: 20px;
            .buttonBox{
                justify-content: right !important;
                margin-left: 0;
            }
            // display: flex;
            // font-size: 18px;
            // justify-content: flex-end;
            // align-items: center;
        }
    }
}
.buttonStyle{
    font-size: 18px;
}

.taskmanageBox .buttonStyle .button-icon {
  width: 18px !important;
  height: 18px !important;
  display: inline-block !important; /* 关键 */
}

</style>