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
                    <!-- <el-table-column
                        prop="disturbPower"
                        align='center'
                        label="干扰功率">
                        <template slot-scope="scope">
                            {{scope.row.disturbDto.param.disturbPower}}瓦
                        </template>
                    </el-table-column> -->
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
                            <el-button  type="text" size="small" class="buttonStyle">复制</el-button>
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
    </div>
    <el-dialog
      width="40%"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      append-to-body>
        <el-form  :model="formAdd" :inline="true">
            <el-form-item label="模板名称">
                <el-input v-model="formAdd.name" placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item label="生效时间(秒)">
                <el-input 
                v-model="formAdd.time"
                type="number"
                oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>3600)value=3600;if(value<0)value=null"
                placeholder="范围0~3600"></el-input>
            </el-form-item>
            <el-form-item label="干扰样式">
                <el-select v-model="formAdd.disturbDto.disturbStyle"  placeholder="请选择">
                    <el-option
                        v-for="device in GRYSoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="干扰频率范围">
                <!-- <el-input v-model="formAdd.disturbDto.param.rateRange" placeholder="选择干扰频率范围"></el-input> -->
                <el-select v-model="formAdd.disturbDto.param.rateRange" @change="GRPLchange"  placeholder="请选择">
                    <el-option
                        v-for="device in GRPLFWoption"
                        :key="device.value"
                        :label="device.label"
                        :value="device.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发射增益">
                <el-input 
                v-model="formAdd.disturbDto.param.gain" 
                type="number"
                oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>2000)value=100;if(value<5)value=null"
                placeholder="范围5~2000"></el-input>
            </el-form-item>
            <!-- <el-form-item label="干扰功率">
                <el-input v-model="formAdd.disturbDto.param.disturbPower" placeholder="请输入干扰功率"></el-input>
            </el-form-item> -->
            <el-form-item label="干扰频率">
                <el-input 
                v-model="formAdd.disturbDto.param.disturbRate" 
                @change="ganraoChange" 
                type="number"
                @blur="handleTimeInput(formAdd.disturbDto.param.disturbRate,maxvalueGRPL,minvalueGRPL,'grpl')"
                placeholder="请输入干扰频率"></el-input>
            </el-form-item>

            <el-form-item label="干扰带宽" v-if='formAdd.disturbDto.disturbStyle==0 || formAdd.disturbDto.disturbStyle==1'>
                <!-- <el-input v-model="formAdd.disturbDto.param.disturbBand" placeholder="请输入干扰带宽"></el-input> -->
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
                <!-- <el-input v-model="formAdd.disturbDto.param.sweepBand" placeholder="请输入扫频带宽"></el-input> -->
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
                <!-- <el-input v-model="formAdd.disturbDto.param.lineInterval" placeholder="请输入谱线间隔"></el-input> -->
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
                <!-- <el-input v-model="formAdd.disturbDto.param.lineNum" placeholder="请输入谱线数量"></el-input> -->
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





    <!-- 暂时搁置 -->
    <!-- <div class="dialogBox" v-if="zanshigezhi">
        <div class="dialogBoxMain">
            <div class="dialogBoxLeft">
                <el-form  :inline="true">
                        <el-form-item label="起始频率(MHz)" class="inpotBox">
                            <el-input v-model="grmbFrom.qspl" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox">
                            <el-input v-model="grmbFrom.zzpl" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox">
                            <el-input v-model="grmbFrom.zzpl" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox">
                            <el-input v-model="grmbFrom.zzpl" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="终止频率(MHz)" class="inpotBox">
                            <el-input v-model="grmbFrom.zzpl" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item  class="inpotBox duoxuan">
                            <el-radio-group v-model="grmbFrom.zzpl" >
                                <el-radio :label="0">未部署</el-radio>
                                <el-radio :label="1">已部署</el-radio>
                                <el-radio :label="2">已部署</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item   class="inpotBox selectBox">
                            <el-select v-model="value" placeholder="请选择" >
                                <el-option
                                v-for="item in GRYSoption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item   class="inpotBox selectBox">
                            <el-select v-model="value" placeholder="请选择" >
                                <el-option
                                v-for="item in GRYSoption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>



                </el-form>

            </div>

            <div class="dialogBoxRight">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
                </el-tabs>

            </div>


        </div>
        <div class="dialogBoxFooter">

        </div>

    </div> -->
</div>
    
</template>
<script>
import '@/assets/css/mbBox.less';

import {getTongKangGR,postTongKangGR,putTongKangGR,deleteTongKangGR} from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
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
        //  干扰频率范围change
        GRPLchange(key){
            switch(key){
                case 0:
                    this.minvalueGRPL=1.5
                    this.maxvalueGRPL=30
                break;
                case 1:
                    this.minvalueGRPL=30
                    this.maxvalueGRPL=512
                break;
                case 2:
                    this.minvalueGRPL=512
                    this.maxvalueGRPL=2000
                break;
                case 3:
                    this.minvalueGRPL=2000
                    this.maxvalueGRPL=3000
                break;
  

                    
            }
        },
        //输入框数字限制
        handleTimeInput(value,maxvalue,minvalue,key) {
            console.log(value,'handleTimeInputhandleTimeInputhandleTimeInput');
            let num = value.replace(/\D/g, '');
            if (num > maxvalue) num = maxvalue;
            if (num < minvalue) num = minvalue;
            switch (key) {
                case 'grpl':
                    this.formAdd.disturbDto.param.disturbRate= num;
                    break;
            }
        },

        ganraoChange(key){
            console.log(key,'ganraoChangeganraoChange');
            switch(key){
                case 0:
                    break;
                    
            }
            
        },
        // 分页
        handleCurrentChange(parame){
            this.pageNum=parame
            this.getGanRaoList()
            

        },
        handleClickUpdata(params){
            this.dialogTitle='模版更新'
            this.formAdd=params
            this.innerVisible=true
        },
        handleClickDelete(params){
            console.log(params,'paramsparamsparams');
            
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
            if(this.dialogTitle=='干扰模版新增'){
                // this.formAdd.deviceId=this.generateRandomId()
                console.log(this.formAdd,'formAddformAddformAdd新增设备');
                
     
                this.Addgairao(this.formAdd)
            }else if(this.dialogTitle=='模版更新'){
                this.Updataganrao(this.formAdd)
    
            }
            
            
        },
        // 新增
        Addgairao(foram){
            console.log(foram,'foramforamforamforam');
            
            postTongKangGR(foram).then(res=>{
                console.log(res,'resresresre')
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getGanRaoList()
                    this.$message.success('新增成功')

                }else{
                    this.$message.error('新增失败')
                }
                
            })

        },

        //更新
        Updataganrao(params){
            console.log(params,'params');
            putTongKangGR(params).then(res=>{
                console.log(res,'resresresres');
                if(res.data.code==200){
                    this.innerVisible=false
                    this.getGanRaoList()
                    this.$message.success('编辑成功')
                }else{
                    this.$message.error('编辑失败')
                }
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
                    this.tableData.forEach(item => {
                        console.log(item,'itemresresresresGR');
                    });
                }
                // else if(res.code==401){
                //     if (this.$router.currentRoute.path !== '/login') {
                //         this.$router.push('/login')
                //     }


                // }
            })
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
        width: 100px !important;
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
            // height: 100%;
            padding: 10px 20px;
            border-right: 1px solid #ffffff4c;
            // background: #222;
        }
        .dialogBoxRight{
            width: 75%;
            padding: 10px 20px;

            // height: 100%;
            // background: #fff;
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
::v-deep .el-radio__label{
    color: #fff;
}

::v-deep .el-form-item .el-form-item__content{
    width: auto !important;
}
</style>