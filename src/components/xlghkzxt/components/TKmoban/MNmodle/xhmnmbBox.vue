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
                        <el-button  @click="handleClickCopy(scope.row)" type="text" size="small" class="buttonStyle">复制</el-button>
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
      <mn-dialog-vue :topForm='topForm' :BoxleftList='BoxleftList' :formAdd='formAdd' ></mn-dialog-vue>
    </el-dialog>
</div>
    
</template>
<script>
import '@/assets/css/mbBox.less';
import mnDialogVue from './mnDialog.vue';
import { getTongKangMN,postTongKangMN,deleteTongKangMN } from '@/api/api'
export default {
    props: {
        closeDiaLog:{
        type: Boolean,
        default: false,
        }
    },
    components: {
        mnDialogVue,
    },
    data() {
        return {
            pinlvji:[],
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
                simulateList:[],
            },
            formAdd:{
                    signalType:"",
                    param:{
                        modStyle:"",
                        signalRate:'',
                        codeRate:'',
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
                    {value:7,label:'16KHz'},
                    {value:6,label:'32KHz'},
                    {value:5,label:'64KHz'},
                    {value:4,label:'128KHz'},
                    {value:3,label:'256KHz'},
                    {value:2,label:'512KHz'},
                    {value:1,label:'1024KHz'},
                    {value:0,label:'2048KHz'},
                ],
            },
            TPoption:{
                TZYSoption:[
                    {value:5,label:'QPSK'},
                ],
                XHDKoption:[
                    {value:7,label:'16KHz'},

                ],
            },
            KPoption:{
                TZYSoption:[
                    {value:5,label:'QPSK'},
                ],
                XHDKoption:[
                    {value:7,label:'16KHz'},
                    {value:6,label:'32KHz'},
                    {value:5,label:'64KHz'},
                    {value:4,label:'128KHz'},
                    {value:3,label:'256KHz'},
                    {value:2,label:'512KHz'},
                    {value:1,label:'1024KHz'},
                    {value:0,label:'2048KHz'},
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
            MNPLFWoption:[
                { value: 0, label: '1.5-30MHZ' },
                { value: 1, label: '30-512MHZ' },
                { value: 2, label: '512-2000MHZ' },
                { value: 3, label: '2000-3000MHZ' },
            ],
        }
    },
    methods:{
        //变换码元速率
        setMYSL(key){
            let label=''
            let alldata=[
                    {value:7,label:'16KHz'},
                    {value:6,label:'32KHz'},
                    {value:5,label:'64KHz'},
                    {value:4,label:'128KHz'},
                    {value:3,label:'256KHz'},
                    {value:2,label:'512KHz'},
                    {value:1,label:'1024KHz'},
                    {value:0,label:'2048KHz'},
            ]
            
            alldata.forEach(item=>{
                if(item.value==key){
                   label=item.label
                }
            })
            return label
        },
        handleTimeInput(value, maxvalue, minvalue, key) {
            // 修改正则表达式，允许小数点
            let num = String(value).replace(/[^\d.]/g, ''); // 只保留数字和小数点
            
            // 移除多余的小数点（最多保留一个）
            num =String(num).replace(/\.{2,}/g, '.');
            num = String(num).replace(/^\./g, '');
            
            // 转换为数字并限制范围
            let floatNum = parseFloat(num) || minvalue;
            if (floatNum < minvalue) floatNum = minvalue;
            if (floatNum > maxvalue) floatNum = maxvalue;
            
            // 更新对应字段
            switch(key){
                case 'shpl':
                this.formAdd.param.signalRate = floatNum;
                break;
                // 其他情况...
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
            this.formAdd=JSON.parse(JSON.stringify(params)) 
            this.Boxright=true
            this.optionSet(params.signalType)
            if(params.signalType===1){
                this.changPL()
            }
        },
        //添加模拟数据模版
        indculdeFuntion(save){
                    if(this.selectedIndex===''){
                        this.formAdd.signalType=this.signalType
                        this.formAdd.gain=this.gain
                        this.topForm.simulateList=this.BoxleftList 
                        let param=JSON.parse(JSON.stringify(this.formAdd)) 
                        if(this.signalType==1&&this.pinlvji.length>0){
                            param.param.hopRateList=this.pinlvji
                        }
                        this.topForm.simulateList.push(param)
                    }else{ 
                        let param=JSON.parse(JSON.stringify(this.formAdd)) 
                        this.BoxleftList[this.selectedIndex].param =param.param
                        if(this.signalType==1&&this.pinlvji.length>0){
                            this.BoxleftList[this.selectedIndex].param.hopRateList=this.pinlvji
                        }
                        this.BoxleftList[this.selectedIndex].gain =this.gain
                        this.topForm.simulateList=this.BoxleftList 
                        this.selectedIndex = ''
                        console.log(this.topForm.simulateList,'this.topForm.simulateList[0].signalType');

                    }


                    console.log(this.topForm.simulateList,'this.topForm.simulateList[0].signalType');
                    
                    if(this.topForm.simulateList[0].signalType!=0){
                        if(this.topForm.simulateList.length>1){
                            this.$message.error('该信号类型不允许存在多个信号')
                            this.BoxleftList.splice(1)
                        }else{
                            this.AddTongKangMN(this.topForm,save)                    
                        }
                    }else{
                        this.AddTongKangMN(this.topForm,save)                    
                    }

        },
        //保存按钮
        saveXinData(save){
            if(this.topForm.id ==''){
                if(this.dialogTitle=='新增模版'){
                    let param={
                        name:this.topForm.name,
                        time:this.topForm.time,
                        gain:this.gain
                    }
                    postTongKangMN(param).then(res=>{ 
                        return res.data
                    }).then(res=>{
                        if(res.code==200){
                            this.$message.success('保存成功')
                            this.topForm.id=res.data.id
                            this.getTongKangMN()
                        }  
                    })
                    .catch(error => {
                        console.error('请求失败:', error); // 避免 Uncaught Error
                        this.$message.error('网络错误，请求失败');
                    });
                }else{
                    this.indculdeFuntion(save)
                }
            }else{
                if(this.signalType === ''){
                    this.$message.error('请选择信号类型')
                }else{ 
                    this.indculdeFuntion(save)
                }
            }
        },
        async addXinHao(){
            if(this.topForm.id==''){
                this.$message.error('请先保存信息')
            }else{ 
                this.optionSet(this.signalType)
                if(this.Boxright){
                    await this.saveXinData('add')
                    if(this.signalType===0){
                        this.formAdd.param={
                            modStyle:"",
                            signalRate:'',
                            codeRate:'',
                            sweepStartRate:'',
                            sweepEndRate:'',
                            sweepNum:'',
                            sweepSpeed:'',
                            codeLength:'',
                            expandSeries:'',
                        }
                    }
                }else{ 
                    if(this.signalType===''){ 
                        this.$message.error('请选择信号类型')
                    }else{
                        this.Boxright=true;
                        this.selectedIndex=''
                    }
                }
            }
        },

        //删除数据条数
        deleteDataBoxright(key,index){
            this.BoxleftList.splice(index,1)
            this.topForm.simulateList=this.BoxleftList
            this.AddTongKangMN(this.topForm,'delete') 
        },
        // 分页
        handleCurrentChange(parame){
            console.log(parame,'parameparameparame');
            this.pageNum=parame
            this.getTongKangMN()
            

        },

         handleClickCopy(params){
            let gaindata
            if(params.param){
                gaindata=params.param
                if(gaindata.length>0){
                    this.gain=JSON.parse(gaindata)[0].gain
                }
            }
            this.topForm.name=params.name
            this.topForm.time=params.time
            this.topForm.id ==''
            this.Boxright=false
            if(JSON.parse(params.param)){
                this.signalType=JSON.parse(params.param)[0].signalType
            }else{
                this.signalType=''
            }
            if(params.param) this.BoxleftList=JSON.parse(params.param)
            this.dialogTitle='模版复制'
            this.selectedIndex=''
            this.innerVisible=true
        },
        handleClickUpdata(params){
            let gaindata
            if(params.param){
                gaindata=params.param
                if(gaindata.length>0){
                    this.gain=JSON.parse(gaindata)[0].gain
                }
            }
            this.topForm.name=params.name
            this.topForm.time=params.time
            this.topForm.id=params.id
            this.Boxright=false

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
        AddTongKangMN(foram,save){
            postTongKangMN(foram).then(res=>{
                if(res.data.code==200){
                    this.getTongKangMN()
                    switch (save) { 
                        case 'add':
                            this.$message.success('新增成功')
                            break;
                        case 'save':
                            this.Boxright=false
                            this.$message.success('保存成功')
                            break;
                        case 'delete':
                            this.Boxright=false
                            this.$message.success('删除成功')
                            break;
                    }
                }else{
                    this.BoxleftList.splice(1)
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
            this.dialogTitle='新增模版'
            this.topForm={
                id:'',
                name:'',
                time:'',
                simulateList:[],
            }
            this.formAdd={
                signalType:"",
                param:{
                    modStyle:"",
                    signalRate:'',
                    codeRate:'',
                },
            },
            this.BoxleftList=[]
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
            })
        },

        changPL(){
            let min=this.formAdd.param.sweepStartRate
            let max=this.formAdd.param.sweepEndRate
            let step=this.formAdd.param.sweepNum
            this.generateAndSortNumbers(min,max,step)
        },
        changeZZPL(value){
            console.log(value,this.formAdd.param.sweepStartRate,'changeZZPLchangeZZPL');
            if(this.formAdd.param.sweepStartRate){
                let minnumber=value - this.formAdd.param.sweepStartRate
                if(minnumber>20){
                    this.formAdd.param.sweepEndRate = this.formAdd.param.sweepStartRate+20
                    this.$message.error('开始频率差值大于20MHz')
                }
                this.changPL()
            }else{
                this.$message.error('请先填写开始频率')
            }
                
        

            

        },
        // 生成随机数
        generateRandomNumbers(minvalue,maxvalue,allstep) {
            const result = [];
            const min = minvalue;
            const max = maxvalue;
            const step = 0.025; // 设置步长为0.025
            // 计算可能的数值范围
            const minSteps = Math.ceil(min / step);
            const maxSteps = Math.floor(max / step);
            
            for (let i = 0; i < allstep; i++) {
            // 生成随机步数
            const randomSteps = Math.floor(Math.random() * (maxSteps - minSteps + 1)) + minSteps;
            
            // 计算对应的数值
            const randomNum = randomSteps * step;
            
            result.push(parseFloat(randomNum.toFixed(3))); // 保留3位小数避免浮点数精度问题
            }
            
            return result;
        },
        generateAndSortNumbers(min,max,step) {
            // 生成随机数
            const randomNumbers = this.generateRandomNumbers(min,max,step);
            // 排序（升序）
            this.sortedRandomNumbers = randomNumbers.sort((a, b) => a - b);
            this.pinlvji=this.sortedRandomNumbers
            
        }

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