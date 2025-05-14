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
                </el-table-column>
                 <el-table-column
                    prop="maxRate"
                    label="最大频率"
                    align='center'>
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
      width="80%"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      append-to-body>

      <div class="XHMNinputBox">
        <el-form :inline="true">
            <el-form-item label="模板名称">
                <el-input v-model="topForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="生效时间">
                <el-input v-model="topForm.time" type="number" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="信号类型">
                <!-- <el-input v-model="topForm.time" placeholder="请输入"></el-input> -->
                <el-select v-model="signalType" @change='ganraoChange' placeholder="请选择">
                        <el-option
                            v-for="device in XHLXoption"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发射增益">
                <el-input v-model="gain" type="number" placeholder="5-2000db" @blur="handleTimeInput(gain,2000,5,'fszy')"> </el-input>
            </el-form-item>
            <el-button type="primary"  @click="saveXinData">保存</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addXinHao">添加信号</el-button>

        </el-form>
      </div>
      <div class="XHMNmainBox">
        <div class="XHMNmainBoxleft"> 
            <div class="XHMNBoxleftmain" v-for='(item,index) in BoxleftList' :key="index" @click="BoxleftClick(item,index)"  :class="{ 'selected': selectedIndex === index }">
                <div class="XHMNBoxleftmain-left">{{index+1}}</div>
                <div class="XHMNBoxleftmain-right">
                    <div class="XHMNBoxleftmain-right-top">信号类型：{{item.signalType==0?'定频':item.signalType==1?'跳频':'扩频'}}  调制方式：{{TZFFChange(item.param.modStyle)}}</div>
                    <div class="XHMNBoxleftmain-right-bottom">信号频率：{{item.param.signalRate}}MHZ  信号带宽：{{item.param.signalBand}}KHZ</div>
                </div>
                <i class="el-icon-close closeButton" ></i>
            </div>
        </div>
        <div class="XHMNmainBoxright">
            <el-form  :model="formAdd" :inline="true" v-if="Boxright"  >
                <!-- <el-form-item label="信号类型">
                    <el-select v-model="formAdd.signalType" @change='ganraoChange' placeholder="请选择">
                        <el-option
                            v-for="device in XHLXoption"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="调制方式">
                    <!-- <el-input v-model="formAdd.param.modStyle" placeholder="调制样式"></el-input> -->
                    <el-select v-model="formAdd.param.modStyle"  placeholder="请选择">
                        <el-option
                            v-for="device in TZYSoption"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="信号频率(MHZ)">
                    <el-input v-model="formAdd.param.signalRate" type="number" placeholder="1.5~3000" @blur="handleTimeInput(formAdd.param.signalRate,3000,1.5,'shpl')"></el-input>
                </el-form-item>
                <el-form-item label="信号带宽(MHZ)">
                    <!-- <el-input v-model="formAdd.param.signalBandwidth" placeholder="信号带宽(MHZ)"></el-input> -->
                    <el-select v-model="formAdd.param.signalBand"  placeholder="请选择">
                        <el-option
                            v-for="device in XHDKoption"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="跳频开始频率(MHz)" v-if="formAdd.signalType==1">
                    <el-input v-model="formAdd.param.sweepStartRate" type="number" placeholder="跳频开始频率"></el-input>
                </el-form-item>
                <el-form-item label="跳频终止频率(MHz)" v-if="formAdd.signalType==1">
                    <el-input v-model="formAdd.param.sweepEndRate" type="number" placeholder="跳频终止频率"></el-input>
                </el-form-item>
                <el-form-item label="跳频点数(个)" v-if="formAdd.signalType==1">
                    <el-input v-model="formAdd.param.sweepNum" type="number" @blur="handleTimeInput(formAdd.param.sweepNum,256,0,'tiaodian')" placeholder="0~256"></el-input>
                </el-form-item>
                <el-form-item label="跳速(H/S)" v-if="formAdd.signalType==1">
                    <el-input v-model="formAdd.param.sweepSpeed" type="number" @blur="handleTimeInput(formAdd.param.sweepSpeed,2000,5,'tiaosu')" placeholder="5~2000"></el-input>
                </el-form-item>




                <el-form-item label="码长" v-if="formAdd.signalType==2">
                    <!-- <el-input v-model="formAdd.param.codeLength" placeholder="码长"></el-input> -->
                    <el-select v-model="formAdd.param.codeLength"  placeholder="请选择">
                        <el-option
                            v-for="device in KPoption.MCoption"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="扩频系列" v-if="formAdd.signalType==2">
                    <!-- <el-input v-model="formAdd.param.expandSeries" placeholder="扩频系列"></el-input> -->
                    <el-select v-model="formAdd.param.expandSeries"  placeholder="请选择">
                        <el-option
                            v-for="device in KPoption.KPXLoption"
                            :key="device.value"
                            :label="device.label"
                            :value="device.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
      </div>
    </el-dialog>
</div>
    
</template>
<script>
import '@/assets/css/mbBox.less';

import { getTongKangMN,postTongKangMN,deleteTongKangMN } from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    data() {
        return {
     
            dialogDataList:{},
            pageNum:1,
            pageSize:10,
            dialogTitle:'新增模版',
            selectedDevice: '',
            shebeiBoxId:'dialogPinPu',
            innerVisible: false,
            radio:'1',
            total:1,
            selectedIndex:0,
            tableData: [],
            topForm:{
                id:'',
                name:'',
                time:'',
            },
            formAdd:{
                    signalType:"",
                    param:{
                        modStyle:"",
                        signalRate:'',
                        signalBand:'',
                        sweepStartRate:'',
                        sweepEndRate:'',
                        sweepNum:'',
                        sweepSpeed:'',
                        codeLength:'',
                        expandSeries:'',
                    },
            },
            BoxleftList:[],
            Boxright:false,
            gain:5,
            signalType:'',
            XHLXoption:[
                {value:0,label:'定频'},
                {value:1,label:'跳频'},
                {value:2,label:'扩频'},
            ],




            TZYSoption:[],
            XHDKoption:[],



            DPoption:{
                TZYSoption:[
                    {value:0,label:'AM'},
                    {value:1,label:'FM'},
                    {value:2,label:'FSK'},
                    {value:3,label:'BPSK'},
                    {value:4,label:'MSK'},
                    {value:5,label:'QPSK'},
                    {value:6,label:'8PSK'},
                    {value:8,label:'16QAM'},
                ],
                XHDKoption:[
                    {value:4,label:'16KHz'},
                    {value:5,label:'32KHz'},
                    {value:6,label:'64KHz'},
                    {value:7,label:'128KHz'},
                    {value:8,label:'256KHz'},
                    {value:9,label:'512KHz'},
                    {value:10,label:'1024KHz'},
                    {value:11,label:'2048KHz'},

                ],
            },
            TPoption:{
                TZYSoption:[
                    {value:5,label:'QPSK'},
                ],
                XHDKoption:[
                    {value:4,label:'16KHz'},
                ],
            },
            KPoption:{
                TZYSoption:[
                    {value:5,label:'QPSK'},
                ],
                XHDKoption:[
                    {value:0,label:'1KHz'},
                    {value:1,label:'2KHz'},
                    {value:2,label:'4KHz'},
                    {value:3,label:'8KHz'},
                    {value:4,label:'16KHz'},
                    {value:5,label:'32KHz'},
                ],
                MCoption:[
                    {value:0,label:'63'},
                    {value:1,label:'127'},
                    {value:2,label:'255'},
                    {value:3,label:'511'},
                    {value:4,label:'1023'},
                    {value:5,label:'2047'},
                ],
                KPXLoption:[
                    {value:0,label:'m序列'},
                    {value:1,label:'gold序列'},
                    {value:2,label:'Walsh序列'},
                ],
            },
        }
    },
    methods:{
        handleTimeInput(value,maxvalue,minvalue,key) {
            let num = value.replace(/\D/g, '');
            if (num > maxvalue) num = maxvalue;
            if (num < minvalue) num = minvalue;
            switch(key){
                case 'shpl':
                    this.formAdd.param.signalRate= num;
                    break;
                case 'tiaosu':
                    this.formAdd.param.sweepSpeed= num;
                    break;
                case 'tiaodian':
                    this.formAdd.param.sweepNum= num;
                    break;
                case 'fszy':
                    this.gain=  num;
                    break;
            }
        },
        TZFFChange(key){ 
            switch(key){
                case 0:
                   return 'AM'
                case 1:
                    return 'FM'
                case 2:
                    return 'FSK'
                case 3:
                    return 'BPSK'
                case 4:
                    return 'MSK'
                case 5:
                    return 'QPSK'
                case 6:
                    return '8PSK'
                case 7:
                    return '16QAM'
            }
        },
        XHDKChange(key){
            switch(key){
                case 0:
                   return '1'
                case 1:
                    return '2'
                case 2:
                    return '4'
                case 3:
                    return '8'
                case 4:
                    return '16'
                case 5:
                    return '32'
            }
        },
        optionSet(key){
            switch(key){
                case 0:
                    this.TZYSoption=this.DPoption.TZYSoption
                    this.XHDKoption=this.DPoption.XHDKoption
                    break;
                case 1:
                    this.TZYSoption=this.TPoption.TZYSoption
                    this.XHDKoption=this.TPoption.XHDKoption
                    break;
                case 2:
                    this.TZYSoption=this.KPoption.TZYSoption
                    this.XHDKoption=this.KPoption.XHDKoption
                    break;
            }

        },
        ganraoChange(key){
            this.optionSet(key)
        },
        BoxleftClick(params,index){
            this.selectedIndex=index
            this.formAdd=params
            this.Boxright=true
            console.log(params,'BoxleftClickBoxleftClick');
            this.optionSet(params.signalType)

            // switch (params.signalType) {
            //     case 0:
            //         this.TZYSoption=this.DPoption.TZYSoption
            //         this.XHDKoption=this.DPoption.XHDKoption
            //         break;
            //     case 1:
            //         this.TZYSoption=this.TPoption.TZYSoption
            //         this.XHDKoption=this.TPoption.XHDKoption
            //         break;
            //     case 2:
            //         this.TZYSoption=this.KPoption.TZYSoption
            //         this.XHDKoption=this.KPoption.XHDKoption
            //         break;
            // }
        },
        saveXinData(){
            console.log(this.topForm,'saveXinData')
            if(this.topForm.id ==''){
                let param={
                    name:this.topForm.name,
                    time:this.topForm.time,
                }
                postTongKangMN(param).then(res=>{ 
                    return res.data
                }).then(res=>{
                    console.log(res,'saveXinDatasaveXinData'); 
                    if(res.code==200){
                        this.$message.success('保存成功')
                        this.topForm.id=res.data.id
                        this.getTongKangMN()
                    }  
                })
            }else{
                if(this.selectedIndex===''){
                    
                        this.formAdd.signalType=this.signalType
                        this.formAdd.gain=this.gain
                        this.topForm.simulateList=JSON.parse(JSON.stringify(this.formAdd) ) 
                        this.AddTongKangMN(this.topForm)
                        this.formAdd.param={
                                modStyle:"",
                                signalRate:'',
                                signalBand:'',
                        }
                        this.Boxright=false
                    
                }else{ 
                    // console.log(this.selectedIndex,'选中了');
                    // this.BoxleftList[this.selectedIndex]
                    
                    this.formAdd.signalType=this.signalType
                    this.formAdd.gain=this.gain
                    this.BoxleftList[this.selectedIndex].param=JSON.parse(JSON.stringify(this.formAdd) ) 
                    this.topForm.simulateList=null
                    this.AddTongKangMN(this.topForm)

                    console.log(this.BoxleftList[this.selectedIndex].param,'选中了');
                    

                

                }

                
                
                console.log(this.topForm,this.formAdd,this.BoxleftList,'saveXinDataelse');
                
            }
        },
        addXinHao(){

            if(this.topForm.id==''){
                this.$message.error('请先保存信息')
            }else{ 
                console.log(this.signalType,'signalType');
                
                if(this.signalType === ''){
                    this.$message.error('请选择信号类型')
                }else{ 
                    this.optionSet(this.signalType)

                    this.selectedIndex=''
                    if(this.Boxright){
                        this.formAdd.signalType=this.signalType
                        this.formAdd.gain=this.gain
                        this.topForm.simulateList=JSON.parse(JSON.stringify(this.formAdd) ) 


                        this.AddTongKangMN(this.topForm)
                        this.formAdd.param={
                                modStyle:"",
                                signalRate:'',
                                signalBand:'',
                        }
                        console.log(this.topForm,'addXinHaoaddXinHao');
                    }else{ 
                        this.Boxright=true
                    }
                }
                
            }
            
        },
        // 分页
        handleCurrentChange(parame){
            console.log(parame,'parameparameparame');
            this.pageNum=parame
            this.getTongKangMN()
            

        },
        handleClickUpdata(params){
            console.log( params,'paramsparamsparams');
            this.topForm.name=params.name
            this.topForm.time=params.time
            this.topForm.id=params.id
            if(JSON.parse(params.param)){
                this.signalType=JSON.parse(params.param)[0].signalType
            }else{
                this.signalType=''
            }
            if(params.param) this.BoxleftList=JSON.parse(params.param)
            this.dialogTitle='模版更新'
            this.innerVisible=true
        },
        //列表删除
        handleClickDelete(params){
            console.log(params.id,'paramsparamsparamsparams');
            this.deleteTongKangMN(params.id)
        },


        
     
        // 新增
        AddTongKangMN(foram){
            console.log(this.BoxleftList,'this.BoxleftListthis.BoxleftListthis.BoxleftList');
            
            // if(this.BoxleftList.length==0)
            if(foram.simulateList) this.BoxleftList.push(foram.simulateList)
            foram.simulateList=this.BoxleftList
            console.log(foram,'AddTongKangMN')
            postTongKangMN(foram).then(res=>{
                if(res.data.code==200){
                    this.getTongKangMN()
                    this.$message.success('新增成功')
                }else{
                    this.$message.error(res.data.message)
                }
                
            })

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
                
            })
        },


        addMNMB(){
            this.topForm={
                name:'',
                time:'',
                id:'',
                simulateList:[],
            }
            this.formAdd={
                signalType:"",
                param:{
                    modStyle:"",
                    signalRate:'',
                    signalBand:'',
                },
                // time:'',
            },
            this.BoxleftList=[]
            this.innerVisible=true

        },


        generateRandomId() {
            return Math.floor(Math.random() * 90000000000) + 10000000000;
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
                console.log(res,'getTongKangMNgetTongKangMN');
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total=res.data.total
                }
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
    // border: 1px solid #0B715A;
    .PinPuPopor-title{
        width: 100%;
        padding-bottom: 15px;
        border-bottom: 1px solid #1C735E;
        justify-content: left;
        .buttonBox{
            width: 100%;
            display: flex;
            justify-content: left;
            margin-left:30px;
            .el-button{
                width: 104px;
                height: 44px;
                border-radius: 0;
                background-color: #1C735E;
                border: 1px solid #FFFFFF4C;
                display: flex;
                justify-content: center;
                align-items: center;
                .buttonBoxImge{
                    img{
                        width: 24px;
                        height: 24px;
                        margin-right: 10px;
                    }

                }
            }
        }
    }
}

.inpotBox{
    background-color: #FFFFFF26;
    color: #fff;
    border: 1px solid #FFFFFF4C;
    // width: 320px;
}

::v-deep .el-dialog__body{
    padding: 0 !important;
}
.XHMNinputBox{
    width: 80%;
    padding: 20px 20px;
    // height: 84px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    .el-form--inline{
        width: 100%;
    }
    ::v-deep .el-form-item{
        margin: 0;
        width: 210px;
        background: #FFFFFF26;
         .el-form-item__content{
            width: calc(100% - 70px) !important;
        }
    }
    .el-button{
        border: 1px solid #FFFFFF4C;
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
            .el-form-item__label{
                width: 150px !important;
            }
            .el-form-item__content{
                width: calc(100% - 150px) !important;
            }
        }

    }
}
</style>