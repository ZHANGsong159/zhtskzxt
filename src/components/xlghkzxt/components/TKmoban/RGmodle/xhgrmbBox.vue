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
                        max='15'
                        label="模板名称"
                        align='center'
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="生效时间(秒)"
                        align='center'
                        width="180">
                        <template slot-scope="scope">
                            {{scope.row.time}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="disturbStyle"
                        label="干扰样式"
                        align='center'
                        width="180">
                        <template slot-scope="scope">
                            <!-- {{scope.row.disturbDto.disturbStyle}} -->
                            <span v-if="scope.row.disturbDto.disturbStyle==0">窄带噪声干扰</span>
                            <span v-if="scope.row.disturbDto.disturbStyle==1">宽带噪声干扰</span>
                            <span v-if="scope.row.disturbDto.disturbStyle==2">宽带扫频干扰</span>
                            <span v-if="scope.row.disturbDto.disturbStyle==3">梳状谱干扰</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gain"
                        label="发射增益"
                        align='center'
                        width="180">
                        <template slot-scope="scope">
                            {{scope.row.disturbDto.param.gain}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="disturbRate"
                        align='center'
                        label="干扰频率">
                        <template slot-scope="scope">
                            {{scope.row.disturbDto.param.disturbRate}}MHz
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align='center'
                        width="150">
                        <template slot-scope="scope">
                            <el-button @click="handleClickCopy(scope.row)" type="text" size="small" class="buttonStyle">复制</el-button>
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
    </div>
    <el-dialog
      width="40%"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      append-to-body>
        <el-form  :model="formAdd" :inline="true" class="tankuang" style="flex-warp:wrap !important;" >
            <el-form-item label="模板名称">
                <el-input v-model="formAdd.name" maxlength="15" placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item label="生效时间(秒)">
                <el-input 
                v-model="formAdd.time"
                @blur="formAdd.time=handleTimeInput(formAdd.time,3600,0,1)"
                placeholder="范围0~3600"></el-input>
            </el-form-item>
            <el-form-item label="干扰样式">
                <el-select v-model="formAdd.disturbDto.disturbStyle" @change="GRYSChange"  placeholder="请选择">
                    <el-option
                        v-for="device in GRYSoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="干扰频率范围">
                <el-select v-model="formAdd.disturbDto.param.rateRange" @change="GRPLchange"  placeholder="请选择">
                    <el-option
                        v-for="device in GRPLFWoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="干扰频率(MHz)">
                <el-input 
                v-model="formAdd.disturbDto.param.disturbRate" 
                type="number"
                @blur="formAdd.disturbDto.param.disturbRate=handleTimeInput(formAdd.disturbDto.param.disturbRate,maxvalueGRPL,minvalueGRPL,1,'grpl')"
                placeholder="请输入干扰频率"></el-input>
            </el-form-item>
            <el-form-item label="发射增益">
                <el-input 
                v-model.number="formAdd.disturbDto.param.gain" 
                @blur="formAdd.disturbDto.param.gain=handleTimeInput(formAdd.disturbDto.param.gain,63,0,0)"
                placeholder="范围0~63"></el-input>
            </el-form-item>
            <el-form-item label="干扰带宽" v-if='formAdd.disturbDto.disturbStyle==0 || formAdd.disturbDto.disturbStyle==1'>
                <el-select v-model="formAdd.disturbDto.param.disturbBand"  placeholder="请选择">
                    <el-option
                        v-for="device in GRDKoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="扫频带宽" v-if='formAdd.disturbDto.disturbStyle==2'>
                <el-select v-model="formAdd.disturbDto.param.sweepBand" placeholder="请选择">
                    <el-option
                        v-for="device in SPDKoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
                
            </el-form-item>
            <el-form-item label="谱线间隔" v-if='formAdd.disturbDto.disturbStyle==3'>
                <el-select v-model="formAdd.disturbDto.param.lineInterval"  placeholder="请选择">
                    <el-option
                        v-for="device in PXJGoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="谱线数量" v-if='formAdd.disturbDto.disturbStyle==3'>
                <el-select v-model="formAdd.disturbDto.param.lineNum"  placeholder="请选择">
                    <el-option
                        v-for="device in PXSLoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm" >确 定</el-button>
        </div>
    </el-dialog>

</div>
    
</template>
<script>
import '@/assets/css/mbBox.less';
import pageInaiton from '@/components/chartBox/pageInaiton.vue';


import {getTongKangGR,postTongKangGR,putTongKangGR,deleteTongKangGR} from '@/api/api'
import {handleTimeInput} from '@/utils/numberUtils'

export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components: {
        pageInaiton
    },
    data() {
        return {
            minvalueGRPL:0,
            maxvalueGRPL:100,
            zanshigezhi:false,
            pageNum:1,
            pageSize:10,
            dialogTitle:'干扰模版新增',
            selectedDevice: '',
            shebeiBoxId:'dialogPinPu',
            innerVisible: false,
            radio:'1',
            total:1,
            grmbFrom: {
                zzpl:'',
                qspl:'',
            },
            GRYSoption: [
                { value: 0, label: '窄带噪声干扰' },
                { value: 1, label: '宽带噪声干扰' },
                { value: 2, label: '宽带扫频干扰' },
                { value: 3, label: '梳状谱干扰' },
            ],
            GRDKoption:[
                {  value: 0, label: '0.1MHz' },
                {  value: 1, label: '0.2MHz' },
                {  value: 2, label: '0.5MHz' },
                {  value: 3, label: '1MHz' },
                {  value: 4, label: '2MHz' },
                {  value: 5, label: '5MHz' },
                {  value: 6, label: '10MHz' },
                {  value: 7, label: '20MHz' },
                {  value: 8, label: '40MHz' },
                {  value: 9, label: '60MHz' },
            ],
            SPDKoption:[
                { value: 0, label: '1MHz' },
                { value: 1, label: '2MHz' },
                { value: 2, label: '5MHz' },
                { value: 3, label: '10MHz' },
                { value: 4, label: '20MHz' },
                { value: 5, label: '40MHz' },
            ],
            PXJGoption:[
                { value: 0, label: '0.2MHz' },
                { value: 1, label: '0.5MHz' },
                { value: 2, label: '1MHz' },

            ],
            PXSLoption:[
                { value: 0, label: '8' },
                { value: 1, label: '16' },
                { value: 2, label: '32' },
                { value: 3, label: '64' },
            ],
            GRPLFWoption:[
                { value: 0, label: '1.5-30MHZ' },
                { value: 1, label: '30-512MHZ' },
                { value: 2, label: '512-2000MHZ' },
                { value: 3, label: '2000-3000MHZ' },
            ],
            tableData: [],
            formAdd:{
                    name:'',
                    time:'',
                    disturbDto:{
                        disturbStyle:'',
                        param:{
                            rateRange:'',
                            gain:'',
                            disturbPower:'',
                            disturbRate:'',
                            disturbBand:'',
                            sweepBand:'',
                            lineInterval:'',
                            lineNum:'',
                        }
                    }
            }
        }
    },
    methods:{
        handleTimeInput,
        handleBlur(param) {
            if (isNaN(param)) {
                param = null; // 或设置为默认值
                this.$message.error('请输入有效数字！');
            }
        },
        GRYSChange(key){
            console.log(key,'GRYSChange');

            switch (key){
                case 0:
                    this.GRDKoption=[
                        {  value: 0, label: '0.1MHz' },
                        {  value: 1, label: '0.2MHz' },
                        {  value: 2, label: '0.5MHz' },
                        {  value: 3, label: '1MHz' },
                        {  value: 4, label: '2MHz' },
                    ]
                break;
                case 1:
                    this.GRDKoption=[
                        {  value: 5, label: '5MHz' },
                        {  value: 6, label: '10MHz' },
                        {  value: 7, label: '20MHz' },
                        {  value: 8, label: '40MHz' },
                        {  value: 9, label: '60MHz' },
                    ]
            }
            

        },
        //  干扰频率范围change
        GRPLchange(key){
            switch(key){
                case 0:
                    this.formAdd.disturbDto.param.disturbRate=1.5

                    this.minvalueGRPL=1.5
                    this.maxvalueGRPL=30
                break;
                case 1:
                    this.formAdd.disturbDto.param.disturbRate=30

                    this.minvalueGRPL=30
                    this.maxvalueGRPL=512
                break;
                case 2:
                    this.formAdd.disturbDto.param.disturbRate=512

                    this.minvalueGRPL=512
                    this.maxvalueGRPL=2000
                break;
                case 3:
                    this.formAdd.disturbDto.param.disturbRate=2000

                    this.minvalueGRPL=2000
                    this.maxvalueGRPL=3000
                break;
  

                    
            }
        },

        // 分页
        handleCurrentChange(parame){
            this.pageNum=parame
            this.getGanRaoList()
        },
        handleClickCopy(params){
            this.dialogTitle='模版复制'
            this.formAdd=JSON.parse(JSON.stringify(params)) 
            this.formAdd.id=''
            this.innerVisible=true

        },
        handleClickUpdata(params){
            this.dialogTitle='模版更新'
            this.formAdd=JSON.parse(JSON.stringify(params)) 
            this.innerVisible=true
        },
        handleClickDelete(params){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteTongKangGR(params.id)

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //列表删除
        handleClickClose(params){
            console.log(params);
            
        },
        confirm(){
            if(this.dialogTitle=='模版更新'){
                this.Updataganrao(this.formAdd)
            }else{
                this.Addgairao(this.formAdd)
            }
        },
        // 新增
        Addgairao(foram){
            postTongKangGR(foram).then(res=>{
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getGanRaoList()
                    this.$message.success('新增成功')
                }
            })
            .catch(error=>{
                console.log(error);
            })
        },

        //更新
        Updataganrao(params){
            putTongKangGR(params).then(res=>{
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getGanRaoList()
                    this.$message.success('编辑成功')
                }else{
                    this.$message.error('编辑失败')
                }
            })
            .catch(error=>{
                console.log(error);
            })
        },
        //删除
        deleteTongKangGR(param){
            deleteTongKangGR(param).then(res=>{
                console.log(res,'resresresres');
                if(res.data.code==200){
                    this.getGanRaoList()
                    this.$message.success('删除成功')
                }else{
                    this.$message.error('删除失败')
                }
            })
            .catch(error=>{
                console.log(error);
            })
        },
        addSbgl(){
            this.dialogTitle='干扰模版新增'

            this.formAdd={
                    // id:this.generateRandomId(),
                    name:'',
                    time:'',
                    disturbDto:{
                        disturbStyle:'',
                        param:{
                            rateRange:'',
                            gain:'',
                            disturbPower:'',
                            disturbRate:'',
                            disturbBand:'',
                            sweepBand:'',
                            lineInterval:'',
                            lineNum:'',
                        }
                    }
            }
            this.innerVisible=true
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
            getTongKangGR(params).then(res=>{
                return res.data
            }).then(res=>{
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
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

::v-deep .el-form--inline{
    flex-wrap: wrap !important;
    padding: 10px 20px;
}

 ::v-deep .el-form-item{
    width: 45%;
    background: #ffffff26;
 }
 ::v-deep .el-form-item__label{
    width: 150px !important;
 }
 ::v-deep .el-form-item__content{
    width: calc(100% - 150px) !important;
 }
</style>