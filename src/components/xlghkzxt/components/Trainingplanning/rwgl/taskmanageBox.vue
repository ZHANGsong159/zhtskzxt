<template>
<div class="taskmanageBox">
    <div class="taskmanageTittle">
        <el-form  :inline="true" >
            <el-form-item label="任务代号" class="inpotBox" style="width: 48%;">
                <el-input v-model="form.hdnm"></el-input>
            </el-form-item>
            <el-form-item label="任务名称" class="inpotBox" style="width: 48%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="taskmanageBody">
        <div class="divmainBody">
            <div class="divmainTitle">任务内容</div>
            <div class="divmainContent">
                <el-input type="textarea" v-model="form.scenario" placeholder="请输入内容"></el-input>
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
        </el-table>
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
        <!-- <div v-if="jsonData">
            <h3>解析后的数据：</h3>
            <pre>{{ jsonData }}</pre>
        </div> -->
    </el-dialog>





</div>
    
</template>
<script>
import {addRenWu,getRenWu} from '@/api/api'
export default {
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
            }
            else{
                addRenWu(this.form).then(res=>{
                    console.log(res,'addRenWu');
                    if(res.code==200){
                        this.$message.success('保存成功');
                        this.$emit('closeDialogZD')
                    }
                })
            }

            

        },
        geRenWu(){
            getRenWu().then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.gridData = res.data.list
                }

            })
            .catch(error => {
                console.error('请求失败:', error); // 避免 Uncaught Error
                this.$message.error('网络错误，请求失败');
            });

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
                        this.$message.error('无效文件');
                    }else{
                        this.jsonData = JSON.parse(e.target.result);
                    }
                } catch (error) {
                alert("JSON 解析失败！");
                    // this.$message.error('无效文件');
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
        ::v-deep .el-form-item__label{
            width: 200px;
        }
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