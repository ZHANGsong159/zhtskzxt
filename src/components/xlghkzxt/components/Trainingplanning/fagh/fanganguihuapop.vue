<template>
  <div class="main">
    <div class="plandesignleft">
      <el-form
        :inline="true"
        style="flex-flow: row warp; padding: 10px 20px"
      >
        <el-form-item label="设备名称">
          <el-input
            v-model="formRight.deviceName"
            placeholder="设备名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="leftPinpu">
        <tittleBg :tittlename="'任务列表'"></tittleBg>
        <el-table :data="tableData" style="width: 100% ; hight:calc(100% - 50px);" >
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="taskName" label="名称"> </el-table-column>
          <el-table-column prop="delayedTime" label="延迟（s）" > 
            <template slot-scope="scope" >
              <!-- <el-input v-model="scope.row.delayedTime" @keyup.enter="saveRow(row)" style="border:1px solid #DCDFE6"></el-input> -->
              <span v-if="!scope.row.isEditing"    @click="handleRowClick(scope.row)">{{ scope.row.delayedTime }}</span>
              <input
              v-else
              v-model.number="scope.row.delayedTime" 
              @keyup.enter="saveRow(scope.row)"
              ref="inputField"
              class="edit-input"
              style="width: 180px;background-color: transparent;color:#fff">

            </template>
          </el-table-column>
          <el-table-column prop="executeTime" label="执行（s）"> </el-table-column>

          <el-table-column
                    label="操作"
                    align='center'
                    >
                    <template slot-scope="scope">
                        <el-button  
                        @click="openOptionclick(scope.row)" 
                        type="text" 
                        size="small" 
                        class="buttonStyle deleteStyle">查看</el-button>
                        <el-button  
                        @click="handleClickDelete(scope.row)" 
                        type="text" 
                        size="small" 
                        class="buttonStyle deleteStyle">删除</el-button>
                    </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="plandesignright">
      <div class="plandesignbox">
        <tittleBg :tittlename="'任务配置'"></tittleBg>
        <el-tabs type="border-card"  class="tabesstyle" v-model="activeName">
          <el-tab-pane label="干扰信号配置" name='GRXH'>
            <guihua-gr :Grdata='Grdata' :QRXH='ganraoQR' :changetype='GRtype' @QRXH='QRXHFUN'></guihua-gr>
          </el-tab-pane>
          <el-tab-pane label="模拟信号配置" name='MNXH'>
            <guihua-mn :Mndata='Mndata' :QRXH='muoniQR' :changetype='GRtype' @QRXH='QRXHFUN'></guihua-mn>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="buttonbox">
        <el-button @click='qvxiao'>取消</el-button>
        <el-button @click='reset'>重置</el-button>
        <el-button type="primary" @click="xiafaGuihuaShebei('updata')" >更新</el-button>
        <el-button type="primary" @click="xiafaGuihuaShebei('add')" >加入</el-button>

      </div>
    </div>
  </div>
</template>
<script>
import tittleBg from "@/components/chartBox/tittleBackground.vue";
import guihuaMn from "@/components/chartBox/guihuaMN.vue";
import guihuaGr from "@/components/chartBox/guihuaGR.vue";

import { 
  getShebeiList,
  getGuiHuaListShebei,
  getGuiHuaListShebeiByid,
  addGuiHuaShebei,
  deleteGuiHuaShebei,
  putGuihuaYStime,


  getTongKangMN,
  putGuihuaYSRenWu,
} from "@/api/api";
export default {
  name: "plandesignBox",
  components: {
    tittleBg,
    guihuaMn,
    guihuaGr
  },
  props: {
    cansshudata: {
      type: Object,
      default: function () {
        return {};
      },
    },
    planId:{
      type: Number,
      default: null
    }
  },
  data() {
    return {
      GRtype:'add',
      Mndata:{
        name: "",
        time: "",
        disturbDto: {},
      },
      Grdata:{
        disturbStyle: "",
        param: {
            rateRange: "",
            gain: "",
            disturbPower: "",
            disturbRate: "",
            disturbBand: "",
            sweepBand: "",
            lineInterval: "",
            lineNum: "",
        },
      },
      ganraoQR:false,
      muoniQR:false,
      activeName:'GRXH',
      tittlename: "任务列表",
      radio: "1",
      tableData: [],
      shebeiData: {},
      formRight:{
        deviceCode:'',
        deviceName:this.cansshudata.deviceName,
        deviceCounte:'',

      },
      tab: 0,
      Boxright: false,
      xiafa: false,
      viewer: null,
      signalType: 0,
      shebeiList: [],
      tankuang: false,
      rightClickId: 0,
      selectedIndex: 0,
      dialogVisible: false,
      minlOption: [
        { value: 0, label: "启动" },
        { value: 1, label: "暂停" },
        { value: 2, label: "继续" },
        { value: 3, label: "停止" },
        { value: 4, label: "干扰命令" },
        { value: 5, label: "模拟命令" },
        { value: 6, label: "侦察命令" },
        { value: 7, label: "当前工作参数" },
      ],
      formAdd: {
        name: "",
        time: "",
        disturbDto: {
          disturbStyle: "",
          param: {
            rateRange: "",
            gain: "",
            disturbPower: "",
            disturbRate: "",
            disturbBand: "",
            sweepBand: "",
            lineInterval: "",
            lineNum: "",
          },
        },
      },
      MNtopformAdd: {
        name: "",
        time: "",
        disturbDto: {
          param: {},
        },
      },
      MNformAdd: {
        signalType: "",
        param: {
          modStyle: "",
          signalRate: "",
          PLfanwei: "",
          signalBand: "",
          sweepStartRate: "",
          sweepEndRate: "",
          sweepNum: "",
          sweepSpeed: "",
          codeLength: "",
          expandSeries: "",
        },
      },
      XHLXoption: [
        { value: 0, label: "定频" },
        { value: 1, label: "跳频" },
        { value: 2, label: "扩频" },
      ],
      BoxleftList: [],
      GRoption: [],
      MNoption: [],
      GRYSoption: [
        { value: 0, label: "窄带噪声干扰" },
        { value: 1, label: "宽带噪声干扰" },
        { value: 2, label: "宽带扫频干扰" },
        { value: 3, label: "梳状谱干扰" },
      ],
      MNPLFWoption: [
        { value: 0, label: "1.5-30MHZ" },
        { value: 1, label: "30-512MHZ" },
        { value: 2, label: "512-2000MHZ" },
        { value: 3, label: "2000-3000MHZ" },
      ],
      TZYSoption: [],
      XHDKoption: [],
      DPoption: {
        TZYSoption: [
          { value: 0, label: "AM" },
          { value: 1, label: "FM" },
          { value: 2, label: "FSK" },
          { value: 3, label: "BPSK" },
          { value: 4, label: "MSK" },
          { value: 5, label: "QPSK" },
          { value: 6, label: "8PSK" },
          { value: 8, label: "16QAM" },
        ],
        XHDKoption: [
          { value: 4, label: "16KHz" },
          { value: 5, label: "32KHz" },
          { value: 6, label: "64KHz" },
          { value: 7, label: "128KHz" },
          { value: 8, label: "256KHz" },
          { value: 9, label: "512KHz" },
          { value: 10, label: "1024KHz" },
          { value: 11, label: "2048KHz" },
        ],
      },
      TPoption: {
        TZYSoption: [{ value: 5, label: "QPSK" }],
        XHDKoption: [{ value: 4, label: "16KHz" }],
      },
      KPoption: {
        TZYSoption: [{ value: 5, label: "QPSK" }],
        XHDKoption: [
          { value: 0, label: "1KHz" },
          { value: 1, label: "2KHz" },
          { value: 2, label: "4KHz" },
          { value: 3, label: "8KHz" },
          { value: 4, label: "16KHz" },
          { value: 5, label: "32KHz" },
        ],
        MCoption: [
          { value: 0, label: "63" },
          { value: 1, label: "127" },
          { value: 2, label: "255" },
          { value: 3, label: "511" },
          { value: 4, label: "1023" },
          { value: 5, label: "2047" },
        ],
        KPXLoption: [
          { value: 0, label: "m序列" },
          { value: 1, label: "gold序列" },
          { value: 2, label: "Walsh序列" },
        ],
      },
      runing: false,
    };
  },
  watch: { 
    cansshudata(){
      console.log(this.cansshudata,'cansshudata');
      
      this.formRight.deviceName=this.cansshudata.deviceName
      this.getGuiHuaListShebei()
    },
  },
  created() {
    this.getTongKangMN();
  },
  mounted() {
    this.getGuiHuaListShebei()
  },

  methods: {
    qvxiao(){
      this.$emit('closeDialogZD')
    },
    reset(){
      this.Mndata={
        name: "",
        time: "",
        disturbDto: {},
      },
      this.Grdata={
        disturbStyle:"",
        param: {
            rateRange: "",
            gain: "",
            disturbPower: "",
            disturbRate: "",
            disturbBand: "",
            sweepBand: "",
            lineInterval: "",
            lineNum: "",
        },
      }

    },
    handleRowClick(row) {
      // 确保isEditing属性存在
      if (row.isEditing === undefined) {
        this.$set(row, 'isEditing', true)
      } else {
        row.isEditing = true
      }
      
      // 下一个tick自动聚焦
      this.$nextTick(() => {
        if (this.$refs.inputField) {
          this.$refs.inputField.focus()
        }
      })
    },
    saveRow(row) {
      console.log("保存数据:", row);
      row.isEditing = false
      console.log(row,'messagesdata');
      
      this.putGuihuaYStime(row)
      // 这里添加实际保存逻辑，例如：
    },
    putGuihuaYStime(row){
      console.log(row,'addGuiHuaShebei');
      
      let param = {
        id:row.id,
        delayedTime:row.delayedTime,
        planId:row.planId,
        deviceId:row.deviceId
      }
      putGuihuaYStime(param).then(res=>{ 
        if(res.data.code==200){
          this.$message.success('保存成功')
          this.getGuiHuaListShebei()

        }
      })
      .catch(error=>{
                console.log(error);
            })
    },
    deleteGuiHuaShebei(id){
      deleteGuiHuaShebei(id).then(res=>{
        console.log(res,'deleteGuiHuaShebei');
        if(res.data.code==200){
          this.$message.success('删除成功')
          this.getGuiHuaListShebei()
        }
      })
      .catch(error=>{
                console.log(error);
            })

    },
    openOptionclick(row){
      console.log(row,'openOptionclick');
      this.GRtype='updata'
      this.getGuiHuaListShebeiByid(row.id)
    },
    handleClickDelete(row){

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteGuiHuaShebei(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    QRXHFUN(row){
      let params={
        taskType:'disturb',
        deviceId:this.cansshudata.deviceId,
        planId:this.planId,
        taskName:row.name,
        delayedTime:row.time,
        executeTime:row.time,
        expandDto:{
          deviceId:this.cansshudata.deviceId,
          deviceType:this.cansshudata.deviceType,
        }
      }
      
      if(this.activeName=='GRXH'){
        params.taskType='disturb'
        params.expandDto.tkDisturbDto=row.disturbDto
      }else{
        params.taskType='simulate'
        console.log(row,'row.param');
        if(row.param){
          params.expandDto.tkSimulateDTOList=JSON.parse(row.param)
        }else{
          params.expandDto.tkSimulateDTOList=row.disturbDto
        }
      }
      // if(params.id){
      //   this.updataShebei(params)
      // }else{
      //   this.addGuiHuaShebei(params)
      // }

      if(this.GRtype=='add'){
        params.id=''
        this.addGuiHuaShebei(params)
      }else{
        params.id=row.id
        this.updataShebei(params)
      }
    },
    xiafaGuihuaShebei(type){
      this.GRtype=type
      if(this.activeName=='GRXH'){
        this.ganraoQR=!this.ganraoQR
      }else{
        this.muoniQR=!this.muoniQR
      }
    },
    updataShebei(param){
      console.log(param,'updataShebei');
      
      this.putGuihuaYSRenWu(param)
    },
    putGuihuaYSRenWu(param){
      putGuihuaYSRenWu(param).then(res=>{
        if(res.data.code==200){
          this.$message.success('添加成功')
          this.getGuiHuaListShebei()
        }
      }).catch(err=>{
        console.log(err,'err');
      })
    },
    getListData(type) {
      switch (type) {
        case "DK":
          return this.tableDataGK;
        case "TK":
          return this.tableDataTK;
        case "LK":
          return this.tableDataLK;
      }
    },
    confirm() {},

    addGuiHuaShebei(param){
      addGuiHuaShebei(param).then(res=>{
        if(res.data.code==200){
          this.$message.success('添加成功')
          this.getGuiHuaListShebei()
        }
      })
      .catch(error=>{
        console.log(error);
      })
    },
    getGuiHuaListShebeiByid(id){
      getGuiHuaListShebeiByid(id).then(res=>{
        return res.data
      }).then(res=>{
        if(res.code==200){
          let data=res.data
          
          console.log(data,'getGuiHuaListShebeiByid');
          switch (data.expandDto.deviceType){
            case 'TK':{
              if(data.taskType=='disturb'){
                this.activeName='GRXH'
                let formAdd={
                  id:id,
                  name:data.taskName,
                  time: data.executeTime,
                  disturbDto: data.expandDto.tkDisturbDto
                }
                this.Grdata=formAdd
              }else{
                this.activeName='MNXH'
                let MNtopformAdd={
                  id:id,
                  name: data.taskName,
                  time: data.executeTime,
                  disturbDto: data.expandDto.tkSimulateDTOList
                }
                this.Mndata=MNtopformAdd
                console.log(this.Mndata,'MndataMndata');
              }
              break;
            }
            case 'LK':{
              this.Grdata=data.lkDisturbDto
              this.Mndata=data.lkSimulateDTOList
              break;
            }
          }
        }
      })
      .catch(error => {
        console.error('请求失败:', error); // 避免 Uncaught Error
        this.$message.error('网络错误，请求失败');
      });
    },
    //获取规划方案
    getGuiHuaListShebei() {
      getGuiHuaListShebei(this.cansshudata.deviceId,1,1000,this.planId)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if(res.code==200){
            this.tableData = res.data.list.map(item => ({
              ...item,
              isEditing: false // 初始化编辑状态
            }));
          }
        });
    },
    getShebeiList() {
      getShebeiList()
        .then((res) => {
          console.log(res);
          return res.data;
        })
        .then((res) => {
          let listdata = res.data.list;
          listdata.forEach((item) => {
            switch (item.deviceType) {
              case "TK":
                this.tableDataTK.push(item);
                break;
              case "LK":
                this.tableDataLK.push(item);
                break;
              case "DK":
                this.tableDataGK.push(item);
                break;
            }
          });
        });
    },


    //模拟模版
    getTongKangMN() {
      console.log(this.planId,'getTongKangMN');
      
      let param={
        planId:this.planId
      }
      getTongKangMN(param)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.code == 200) {
            this.MNoption = res.data.list;
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  flex-flow: row nowrap;
  height: 700px;
  .plandesignleft {
    width: 30%;
    border-right: 1px solid #ffffff4c;
    ::v-deep .el-form-item {
      width: 100%;
      margin-right: 0px;
      margin-bottom: 0px;
      text-align: left;
      background: transparent;
    }

    .leftPinpu {
      width: 100%;
      height: calc(100% - 50px);
      padding: 0px 20px;
      overflow: auto;
      ::v-deep .el-table__header {
        width: 100%;
      }
    }
  }
  .plandesignright {
    width: 70%;
    height: 100%;
    overflow: auto;
    padding: 0 20px;
    display: flex;
    flex-flow: column ;
    .plandesignbox {
        height: calc(100% - 50px);
        flex-grow: 1;
        .tabesstyle{
            height: calc(100% - 50px);
        }
        .boxleft {
            width: 40%;
            border-right: 1px solid #ffffff4c;
            .el-form--inline {
            justify-content: center;
            }
            .radio-box {
            margin-bottom: 20px;
            .el-radio {
                margin-right: 10px;
            }
            }
            .selectbox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-select {
                width: 45%;
                border: 1px solid #ffffff4c;
            }
            }
        }
        .boxright {
            width: 60%;
        }
    }
    .buttonbox{
      margin-top: 10px;
      display: flex;
      justify-content: right;
      align-items: flex-end;
    }
  }
}

.dialogMainBody {
  height: calc(100% - 72px);
  padding: 0px 20px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  border-bottom: 1px solid #00644c;
  .el-form {
    width: 100%;
  }
  .el-form--inline {
    width: 100%;
  }
  ::v-deep .el-form-item {
    width: 48%;
    margin: 11px 0px;
  }
}

////////

.dialog-title-with-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  border-bottom: 1px solid #00644c;
  span {
    color: #fff;
    font-size: 24px;
  }
}
.dialogMainBody {
  height: calc(100% - 72px);
  padding: 0px 20px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  border-bottom: 1px solid #00644c;
  .el-form {
    width: 100%;
  }
  .el-form--inline {
    width: 100%;
  }
}
.dialogMainFoot {
  display: flex;
  justify-content: flex-end;
  padding: 30px;
  .el-button {
    border: #ffffff46;
    border-radius: 0px;
  }
  .xiafaing {
    .xifabutton {
      background: transparent !important;
      border: 1px solid #ffffff49;
    }
  }
}

.dialogMainBody {
  height: calc(100% - 72px);
  padding: 0px 20px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  // padding: 20px 30px;
  border-bottom: 1px solid #00644c;
  .el-form {
    width: 100%;
  }
  .el-form--inline {
    width: 100%;
  }
}

.XHMNmainBox {
  width: 100%;
  height: 548px;
  border-top: 1px solid #1c735e;
  padding: 30px 20px;
  display: flex;
  .XHMNmainBoxleft {
    width: 40%;
    height: 100%;
    color: #fff;
    // overflow: auto;
    border-right: 1px solid #ffffff4c;
    .XHMNBoxleftmain.selected {
      background: #1c735e;
    }
    .XHMNBoxleftmain {
      width: 330px;
      // height: 78px;
      color: #fff;
      display: flex;
      flex-flow: row;
      justify-content: center;
      align-items: center;
      background: #ffffff26;
      border: 1px solid #ffffff4c;
      margin-bottom: 20px;
      position: relative;
      .XHMNBoxleftmain-left {
        width: 40px;
        height: 80%;
        font-size: 18px;
        border-right: 1px solid #ffffff4c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .XHMNBoxleftmain-right {
        padding-left: 20px;
        width: calc(100% - 40px);
        font-size: 18px;
      }
      .closeButton {
        position: absolute;
        font-size: 16px;
        cursor: pointer;
        right: 10px;
        top: 10px;
      }
    }
  }
  .XHMNmainBoxright {
    width: 60%;
    height: 100%;
    display: flex;

    flex-flow: column;
    ::v-deep .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      align-self: start;
      padding-left: 20px;
    }
    .PinLvJin {
      width: 100%;
      flex-grow: 1;
      padding-left: 20px;
      max-height: 50%;
      box-sizing: border-box;
      .pinlvjiMain {
        background: #ffffff26;
        width: 100%;
        height: 100%;
        padding: 20px 20px;
        border: 1px solid #ffffff4c;
        .pinlvjiTittle {
          font-size: 18px;
          color: #fff;
          margin-bottom: 10px;
        }
        .pinlvjiMainsmall {
          display: flex;
          flex-flow: row wrap;
          max-height: calc(100% - 30px);
          justify-content: flex-start;
          align-items: flex-start;
          overflow: auto;
          .mainBox {
            width: 80px;
            height: 30px;
            background: #ffffff26;
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

///////////

/* 添加在组件的 <style> 部分 */
::v-deep .el-tabs--border-card {
  background: transparent !important;
  border: none;

  /* 标签页头部样式 */
  .el-tabs__header {
    background-color: transparent !important;
    border-bottom: none !important;

    /* 单个标签页样式 */
    .el-tabs__item {
      background: #ffffff26 !important;
      color: #fff !important;
      margin-right: 20px;
      font-size: 16px;
      border: 2px solid #ffffff4c;
      border-bottom: none;
      //   border-right: linear-gradient(180deg, #2CE5BA 0%, #2CE5BA00 100%) !important;

      /* 选中状态的样式 */
      &.is-active {
        background: #1c735e !important; /* 绿色背景 */
        color: white !important;
        border: 2px solid #2ce5ba;
        border-bottom-color: transparent !important;
      }

      /* 悬停效果 */
      &:hover {
        color: white !important;
      }
    }
  }

  /* 内容区域样式 */
  .el-tabs__content {
    padding: 15px;
    border: 1px solid #ffffff4c;
    height: calc(100% - 40px);
    overflow: auto;
    background: rgba(0, 0, 0, 0); /* 半透明背景 */
    .el-tab-pane{
      height: 100%;
    }
  }
}

::v-deep .el-form-item {
  margin-right: 0;
}

::v-deep .el-form-item__label {
//   width: 135px;
  text-align: center;
  padding: 0px;
}
::v-deep .el-form-item__content {
//   width: calc(100% - 135px) !important;
  .el-input__inner {
    color: #fff;
    padding: 0 0 0 5px;
  }
}
</style>