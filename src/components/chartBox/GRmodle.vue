<template>
  <div>
    <el-form
      :model="formAdd"
      :inline="true"
      class="tankuang"
      style="flex-warp: wrap !important"
    >
      <el-form-item label="模板名称" v-if="boxtype">
        <el-select
          v-model="formAdd.name"
          placeholder="请输入模板名称"
          @change="changePL()"
        >
          <el-option
            v-for="device in GRoption"
            :key="device.id"
            :label="device.name"
            :value="device.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" v-else>
        <el-input
          v-model="formAdd.name"
          maxlength="15"
          placeholder="请输入模板名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="生效时间(秒)">
        <el-input
          v-model="formAdd.time"
          @blur="formAdd.time = handleTimeInput(formAdd.time, 3600, 0, 1)"
          placeholder="范围0~3600"
        ></el-input>
      </el-form-item>
      <el-form-item label="干扰样式">
        <el-select
          v-model="formAdd.disturbDto.disturbStyle"
          @change="GRYSChange"
          placeholder="请选择"
        >
          <el-option
            v-for="device in GRYSoption"
            :key="device.value"
            :label="device.label"
            :value="device.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="干扰频率范围">
        <el-select
          v-model="formAdd.disturbDto.param.rateRange"
          @change="GRPLchange"
          placeholder="请选择"
        >
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
          @blur="
            formAdd.disturbDto.param.disturbRate = handleTimeInput(
              formAdd.disturbDto.param.disturbRate,
              maxvalueGRPL,
              minvalueGRPL,
              1,
              'grpl'
            )
          "
          placeholder="请输入干扰频率"
        ></el-input>
      </el-form-item>
      <el-form-item label="发射增益">
        <el-input
          v-model.number="formAdd.disturbDto.param.gain"
          @blur="
            formAdd.disturbDto.param.gain = handleTimeInput(
              formAdd.disturbDto.param.gain,
              63,
              0,
              0
            )
          "
          placeholder="范围0~63"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="干扰带宽"
        v-if="
          formAdd.disturbDto.disturbStyle == 0 ||
          formAdd.disturbDto.disturbStyle == 1
        "
      >
        <el-select
          v-model="formAdd.disturbDto.param.disturbBand"
          placeholder="请选择"
        >
          <el-option
            v-for="device in GRDKoption"
            :key="device.value"
            :label="device.label"
            :value="device.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="扫频带宽"
        v-if="formAdd.disturbDto.disturbStyle == 2"
      >
        <el-select
          v-model="formAdd.disturbDto.param.sweepBand"
          placeholder="请选择"
        >
          <el-option
            v-for="device in SPDKoption"
            :key="device.value"
            :label="device.label"
            :value="device.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="谱线间隔"
        v-if="formAdd.disturbDto.disturbStyle == 3"
      >
        <el-select
          v-model="formAdd.disturbDto.param.lineInterval"
          placeholder="请选择"
        >
          <el-option
            v-for="device in PXJGoption"
            :key="device.value"
            :label="device.label"
            :value="device.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="谱线数量"
        v-if="formAdd.disturbDto.disturbStyle == 3"
      >
        <el-select
          v-model="formAdd.disturbDto.param.lineNum"
          placeholder="请选择"
        >
          <el-option
            v-for="device in PXSLoption"
            :key="device.value"
            :label="device.label"
            :value="device.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import "@/assets/css/mbBox.less";
import { handleTimeInput } from "@/utils/numberUtils";
export default {
  props: {
    formAddNEW: {
      type: Object,
      default: function () {
        return {};
      },
    },
    closeDiaLog: {
      type: Boolean,
      default: false,
    },
    boxtype: {
      type: Boolean,
      default: false,
    },
    GRoption: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 添加一个控制表单项宽度的 prop
    formItemWidth: {
        type: String,
        default: '45%'
    }
  },
  data() {
    return {
      minvalueGRPL: 0,
      maxvalueGRPL: 100,
      GRYSoption: [
        { value: 0, label: "窄带噪声干扰" },
        { value: 1, label: "宽带噪声干扰" },
        { value: 2, label: "宽带扫频干扰" },
        { value: 3, label: "梳状谱干扰" },
      ],
      GRDKoption: [
        { value: 0, label: "0.1MHz" },
        { value: 1, label: "0.2MHz" },
        { value: 2, label: "0.5MHz" },
        { value: 3, label: "1MHz" },
        { value: 4, label: "2MHz" },
        { value: 5, label: "5MHz" },
        { value: 6, label: "10MHz" },
        { value: 7, label: "20MHz" },
        { value: 8, label: "40MHz" },
        { value: 9, label: "60MHz" },
      ],
      SPDKoption: [
        { value: 0, label: "1MHz" },
        { value: 1, label: "2MHz" },
        { value: 2, label: "5MHz" },
        { value: 3, label: "10MHz" },
        { value: 4, label: "20MHz" },
        { value: 5, label: "40MHz" },
      ],
      PXJGoption: [
        { value: 0, label: "0.2MHz" },
        { value: 1, label: "0.5MHz" },
        { value: 2, label: "1MHz" },
      ],
      PXSLoption: [
        { value: 0, label: "8" },
        { value: 1, label: "16" },
        { value: 2, label: "32" },
        { value: 3, label: "64" },
      ],
      GRPLFWoption: [
        { value: 0, label: "1.5-30MHZ" },
        { value: 1, label: "30-512MHZ" },
        { value: 2, label: "512-2000MHZ" },
        { value: 3, label: "2000-3000MHZ" },
      ],
      formAdd: this.formAddNEW,
    };
  },
  methods: {
    handleTimeInput,
    GRYSChange(key) {
      switch (key) {
        case 0:
          this.GRDKoption = [
            { value: 0, label: "0.1MHz" },
            { value: 1, label: "0.2MHz" },
            { value: 2, label: "0.5MHz" },
            { value: 3, label: "1MHz" },
            { value: 4, label: "2MHz" },
          ];
          break;
        case 1:
          this.GRDKoption = [
            { value: 5, label: "5MHz" },
            { value: 6, label: "10MHz" },
            { value: 7, label: "20MHz" },
            { value: 8, label: "40MHz" },
            { value: 9, label: "60MHz" },
          ];
      }
    },
    //干扰模块名称改变函数
    changePL() {
        this.GRoption.forEach((item) => {
            if (item.name == this.formAdd.name) {
            console.log(item, "itemresresresresGR");
            this.formAdd = JSON.parse(JSON.stringify(item));
            }
        });
    },
    //  干扰频率范围change
    GRPLchange(key) {
      switch (key) {
        case 0:
          this.formAdd.disturbDto.param.disturbRate = 1.5;

          this.minvalueGRPL = 1.5;
          this.maxvalueGRPL = 30;
          break;
        case 1:
          this.formAdd.disturbDto.param.disturbRate = 30;

          this.minvalueGRPL = 30;
          this.maxvalueGRPL = 512;
          break;
        case 2:
          this.formAdd.disturbDto.param.disturbRate = 512;

          this.minvalueGRPL = 512;
          this.maxvalueGRPL = 2000;
          break;
        case 3:
          this.formAdd.disturbDto.param.disturbRate = 2000;

          this.minvalueGRPL = 2000;
          this.maxvalueGRPL = 3000;
          break;
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.tankuang{

}
.buttonStyle {
  color: #fff10d !important;
}
.deleteStyle {
  color: #fa5151 !important;
}

.inpotBox {
  width: 100% !important;
}
.selectBox {
  width: 45% !important;
  ::v-deep .el-form-item__content::after {
    width: 0px;
  }
}
/* 自定义 ElementUI 组件的样式 */
.el-form--inline {
  .inpotBox {
    margin-bottom: 15px;
  }
}

.dialogBox {
  .dialogBoxMain {
    height: 500px;
    display: flex;
    flex-flow: row;
    .dialogBoxLeft {
      width: 25%;
      padding: 10px 20px;
      border-right: 1px solid #ffffff4c;
    }
    .dialogBoxRight {
      width: 75%;
      padding: 10px 20px;
    }
  }
  .dialogBoxFooter {
    height: 80px;
  }
}
.duoxuan {
  ::v-deep .el-form-item__content::after {
    width: 0px;
  }
}

::v-deep .el-form--inline {
  flex-wrap: wrap !important;
  padding: 10px 20px;
}

::v-deep .el-form-item {
  width: v-bind(formItemWidth);
  background: #ffffff26;
}
::v-deep .el-form-item__label {
  width: 150px !important;
}
::v-deep .el-form-item__content {
  width: calc(100% - 150px) !important;
}
</style>