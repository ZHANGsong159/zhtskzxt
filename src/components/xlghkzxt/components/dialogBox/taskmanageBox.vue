<template>
<div class="taskmanageBox">
    <div class="taskmanageTittle">
        <el-form  :inline="true" >
            <el-form-item label="任务代号" class="inpotBox" style="width: 48%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="任务行动" class="inpotBox" style="width: 48%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="taskmanageBody">
        <div class="divmainBody">
            <div class="divmainTitle">任务内容</div>
            <div class="divmainContent">
                <el-input type="textarea" v-model="form.desc" placeholder="请输入内容"></el-input>
            </div>
        </div>

    </div>
    <div class="taskmanageFooter">
        <div class="taskmanageFooterRight">
            <el-button @click="handleClickClose"   class="buttonStyle">取消</el-button>
            <el-button type="primary" @click="confirm()" class="buttonStyle"> <img  style="imgbutton" src="@/assets/img/folder-open-line@1x.png">打开</el-button>
            <el-button type="primary" @click="confirm()" class="buttonStyle"> <img  style="imgbutton" src="@/assets/img/download-2-line@1x.png">导入</el-button>
            <el-button type="primary" @click="confirm()" class="buttonStyle">保存</el-button>
            <el-button type="primary" @click="confirm()" class="buttonStyle">另存为</el-button>
        </div>

    </div>

</div>
    
</template>
<script>
export default {
    data() {
        return {
            activeIndex: '1',
            form: {
                name: '',
                region: '',
            }
        }
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
            padding: 20px 20px 0px 20px;
            display: flex;
            // font-size: 18px;
            justify-content: flex-end;
            align-items: center;
            .buttonStyle{
                img{
                    width: 15px;
                    height: 15px;
                }
            }
        }
    }
}

</style>