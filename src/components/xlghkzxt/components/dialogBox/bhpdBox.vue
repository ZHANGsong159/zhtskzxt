<template>
  <!-- // 部署配置 -->
  <div class="PinPuPopor">
    <div class="PinPuPopor-title flexBox">
      <el-form :inline="true">
        <el-form-item
          label="频段范围(MHz)"
          class="inpotBox"
          style="width: 100%"
        >
          <el-input
            v-model="formAdd.startRate"
            placeholder="起始频段"
          ></el-input>
          ~
          <el-input
            v-model="formAdd.endRate"
            placeholder="结束频段"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="confirm" class="btnBox"
          >添加</el-button
        >
      </el-form>
    </div>
    <div class="PinPuPopor-content flexBox">
      <div class="PinPuPopor-content-right">
        <div
          class="PinLvbox flexBox"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <div class="PinLvboxTitle">频段{{ index + 1 }}</div>
          <div class="PinLvboxMainBody">
            {{ item.startRate }}MHz ~ {{ item.endRate }}MHz
          </div>

          <div class="PinLvboxBtn">
            <i class="el-icon-close" @click="deletePL(item)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { 
    getProtectFrequency ,
    postProtectFrequency,
    deleteProtectFrequency
} from "@/api/api";
export default {
  props: {
    closeDiaLog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedDeviceBSFA: "1",
      devicesBSFA: [
        { value: "1", label: "手动" },
        { value: "2", label: "自动" },
        { value: "3", label: "部署方案3" },
      ],
      tableData: [
        {
          createTime: "2025-03-25 16:51:21",
          endRate: 72,
          rateId: 3,
          startRate: 6,
        },
        {
          createTime: "2025-03-25 16:51:21",
          endRate: 72,
          rateId: 3,
          startRate: 6,
        },
        {
          createTime: "2025-03-25 16:51:21",
          endRate: 72,
          rateId: 3,
          startRate: 6,
        },
      ],
      formAdd: {
        startRate: "",
        endRate: "",
        rateId: "",
      },
    };
  },
  methods: {
    generateRandomId() {
        return Math.floor(Math.random() * 90000000000) + 10000000000;
    },
    confirm() {
        // this.formAdd.rateId = this.generateRandomId();
        if(this.formAdd.startRate&&this.formAdd.endRate){
            if(this.formAdd.startRate<this.formAdd.endRate){
                // console.log(this.formAdd, "postProtectFrequency");
                this.postProtectFrequency(this.formAdd)
            }else{
                this.$message.error("请正确填写频段范围");
            }
        }else{
            this.$message.error("请正确填写频段范围");

        }
    },
    deletePL(param) {
      console.log(param, "deletePL");
      this.deleteProtectFrequency(param.rateId)
    },
    //获取列表数据
    getProtectFrequency() {
      let params = {
        // pageNum: 1,
        // pageSize: 10,
      };
      getProtectFrequency(params)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.list
            console.log(res.data.list, "getProtectFrequency");
          }
        });
    },
    //添加保护频段
    postProtectFrequency(params) {
        
      postProtectFrequency(params)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.code == 200) {
            // console.log(res, "postProtectFrequency");
            this.formAdd = {
              startRate: "",
              endRate: "",
              rateId: "",
            }
            this.$message.success("添加成功");
            this.getProtectFrequency()
          }
        })
    },
    //删除保护频段
    deleteProtectFrequency(params) {
      deleteProtectFrequency(params).then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getProtectFrequency()
          }
        })
    },
  },
  mounted() {
    this.getProtectFrequency();
  },
};
</script>
<style lang="less" scoped>
::v-deep .el-form--inline {
  flex-flow: nowrap;
}
::v-deep .el-button {
  background-color: #1c735e;
  color: #fff;
  border: 1px solid #ffffff4c;
}
::v-deep .el-form-item {
  margin-bottom: 0px;
  background-color: #ffffff26;
}
::v-deep .el-form-item__content .el-input {
  width: 45%;
}
.PinPuPopor {
  width: 100%;
  .PinPuPopor-title {
    padding-left: 30px;
    padding-bottom: 15px;
    box-sizing: border-box;
    justify-content: left;
    .btnBox {
      margin-left: 10px;
      border-radius: 0px;
    }
  }
  .PinPuPopor-content {
    width: 100%;
    height: 636px;
    box-sizing: border-box;
    padding: 0px;
    .PinPuPopor-content-right {
      width: 100%;
      height: 100%;
      padding: 20px 30px;
      background: transparent;
      display: flex;
      flex-flow: row wrap;
      // justify-content: space-between;
      gap: 15px;
      align-items: flex-start;
      align-content:flex-start;
      .PinLvbox {
        width: 30%;
        height: 50px;
        background: #ffffff26;
        border: 1px solid #ffffff4c;
        font-size: 18px;
        color: #fff;
        // margin: 10px 0px;
        flex: 0 0 auto;
        // justify-content: start;
        .PinLvboxTitle {
          width: 70px;
          margin-right: 10px;
          border-right: 1px solid #ffffff4c;
        }
        // .PinLvboxTitle::after{
        //     width: 2px;
        //     height: 70%;
        //     background-color: #000;
        //     z-index: 1000000;
        //     position: absolute;
        //     top: 15%;
        // }
        .PinLvboxBtn {
          align-self: flex-start;
          // justify-self: flex-end;
          text-align: right;
          padding-right: 10px;
          flex-grow: 1;
          cursor:pointer;
        }
      }
    }
  }
}
</style>