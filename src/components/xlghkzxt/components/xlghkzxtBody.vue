<template>
  <div class="map-main">
    <div id="my-map"></div>
    <div class="tankuang zIndex50" ref="tankuang" v-show="tankuang">
      <div
        v-for="(item, index) in minlOption"
        :key="index"
        @contextmenu.prevent
        @click="clickTankuang(item)"
      >
        {{ item.label }}
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
      custom-class="my-dialog"
      append-to-body
      :before-close="handleClose"
    >
      <div class="tabChange">
        <!-- 可点击tab头 -->
        <div class="tabChangeBox">
          <ul class="nav">
            <li
              class="item"
              :class="tab === 0 ? 'active' : ''"
              @click="clickTab(0)"
            >
              干扰信息配置
            </li>
            <li
              class="item"
              :class="tab === 1 ? 'active' : ''"
              @click="clickTab(1)"
            >
              模拟信号配置
            </li>
          </ul>
        </div>
        <!-- 对应 tab 展示区域 -->
        <div class="tab-show">
          <div v-if="tab == 0">
            <div class="dialog-title-with-image">
              <img src="@/assets/img/组21_@1x.png" alt="" />
              <span>设备名称：{{ shebeiData.deviceName }}</span>
              <img src="@/assets/img/组21Right_@1x.png" alt="" />
            </div>
            <div class="dialogMainBody">
              <el-form :model="formAdd" :inline="true" label-width="120px">
                <el-form-item label="模板名称">
                  <!-- <el-input v-model="formAdd.name" placeholder="请输入模板名称"></el-input> -->
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
                <el-form-item label="生效时间(秒)">
                  <el-input
                    v-model="formAdd.time"
                    type="number"
                    placeholder="范围0~3600"
                  ></el-input>
                </el-form-item>
                <el-form-item label="干扰样式">
                  <el-select
                    v-model="formAdd.disturbDto.disturbStyle"
                    placeholder="请输入干扰样式"
                  >
                    <el-option
                      v-for="device in GRYSoption"
                      :key="device.value"
                      :label="device.label"
                      :value="device.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="干扰功率">
                  <el-input
                    v-model="formAdd.disturbDto.param.disturbPower"
                    placeholder="请输入干扰功率"
                  ></el-input>
                </el-form-item>
                <el-form-item label="干扰频率(KHZ)">
                  <el-input
                    v-model="formAdd.disturbDto.param.disturbRate"
                    type="number"
                    placeholder="范围0~3600"
                  ></el-input>
                </el-form-item>
                <el-form-item label="干扰带宽(KHZ)">
                  <el-input
                    v-model="formAdd.disturbDto.param.disturbBand"
                    type="number"
                    placeholder="范围0~3600"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialogMainFoot">
              <div class="xiafa" v-show="!xiafa">
                <el-button type="primary" @click="commentGR()">下发</el-button>
              </div>
              <div class="xiafaing" v-show="xiafa">
                <el-button type="primary" class="xifabutton"
                  >下发中...</el-button
                >
                <el-button type="primary" @click="commentGRqvxiao()"
                  >取消</el-button
                >
              </div>
            </div>
          </div>
          <div v-if="tab == 1">
            <div class="dialog-title-with-image">
              <img src="@/assets/img/组21_@1x.png" alt="" />
              <span>设备名称：{{ shebeiData.deviceName }}</span>
              <img src="@/assets/img/组21Right_@1x.png" alt="" />
            </div>
            <div class="dialogMainBody">
              <div class="XHMNinputBox">
                <el-form :inline="true">
                  <el-form-item label="模板名称">
                    <el-select
                      v-model="MNtopformAdd.name"
                      placeholder="请选择"
                      @change="changeMNMBname()"
                    >
                      <el-option
                        v-for="device in MNoption"
                        :key="device.id"
                        :label="device.name"
                        :value="device.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="生效时间">
                    <el-input
                      v-model="MNtopformAdd.time"
                      type="number"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>

                  <el-button type="primary" @click="clickMN()">下发</el-button>
                </el-form>
              </div>
              <div class="XHMNmainBox">
                <div class="XHMNmainBoxleft">
                  <div
                    class="XHMNBoxleftmain"
                    v-for="(item, index) in BoxleftList"
                    :key="index"
                    @click="BoxleftClick(item, index)"
                    :class="{ selected: selectedIndex === index }"
                  >
                    <div class="XHMNBoxleftmain-left">{{ index + 1 }}</div>
                    <div class="XHMNBoxleftmain-right">
                      <div class="XHMNBoxleftmain-right-top">
                        信号类型：{{item.signalType == 0? "定频": item.signalType == 1? "跳频": "扩频"}}
                        调制方式：{{ item.param.modStyle }}
                      </div>
                      <div class="XHMNBoxleftmain-right-bottom">
                        信号频率：{{ item.param.signalRate }}MHZ 
                        信号带宽：{{item.param.signalBand}}KHZ
                      </div>
                    </div>
                  </div>
                </div>
                <div class="XHMNmainBoxright">
                  <el-form :model="MNformAdd" :inline="true" v-if="Boxright">
                    <el-form-item label="信号类型">
                      <el-select
                        v-model="MNformAdd.signalType"
                        placeholder="请选择"
                        @change="optionSet(MNformAdd.signalType)"
                      >
                        <el-option
                          v-for="device in XHLXoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="调制方式">
                      <el-select
                        v-model="MNformAdd.param.modStyle"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in TZYSoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="信号频率(MHZ)">
                      <el-input
                        v-model.number="MNformAdd.param.signalRate"
                        type="number"
                        placeholder="1.5~3000"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="频率范围(MHZ)">
                      <el-select
                        v-model="MNformAdd.param.PLfanwei"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in MNPLFWoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="信号带宽(MHZ)">
                      <el-select
                        v-model.number="MNformAdd.param.signalBand"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in XHDKoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      label="跳频开始频率(MHz)"
                      v-if="signalType == 1"
                    >
                      <el-input
                        v-model.number="MNformAdd.param.sweepStartRate"
                        @blur="changPL()"
                        type="number"
                        placeholder="跳频开始频率"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="跳频终止频率(MHz)"
                      v-if="signalType == 1"
                    >
                      <el-input
                        v-model.number="MNformAdd.param.sweepEndRate"
                        @blur="
                          changPL();
                          changeZZPL(formAdd.param.sweepEndRate);
                        "
                        type="number"
                        placeholder="跳频终止频率"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="跳频点数(个)" v-if="signalType == 1">
                      <el-input
                        v-model.number="MNformAdd.param.sweepNum"
                        type="number"
                        @blur="
                          handleTimeInput(
                            formAdd.param.sweepNum,
                            256,
                            0,
                            'tiaodian'
                          );
                          changPL();
                        "
                        placeholder="0~256"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="跳速(H/S)" v-if="signalType == 1">
                      <el-input
                        v-model.number="MNformAdd.param.sweepSpeed"
                        type="number"
                        @blur="
                          handleTimeInput(
                            formAdd.param.sweepSpeed,
                            2000,
                            5,
                            'tiaosu'
                          )
                        "
                        placeholder="5~2000"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="码长" v-if="signalType == 2">
                      <el-select
                        v-model="MNformAdd.param.codeLength"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in KPoption.MCoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="扩频系列" v-if="signalType == 2">
                      <el-select
                        v-model="MNformAdd.param.expandSeries"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="device in KPoption.KPXLoption"
                          :key="device.value"
                          :label="device.label"
                          :value="device.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>

                  <div class="PinLvJin" v-if="Boxright && signalType == 1">
                    <div class="pinlvjiMain">
                      <div class="pinlvjiTittle">频率集（MHz）</div>
                      <div class="pinlvjiMainsmall">
                        <div
                          class="mainBox"
                          v-for="(item, index) in pinlvji"
                          :key="index"
                        >
                          {{ item }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TCesium } from "./js/TCesium";
import geojson from "@/assets/country/china.json";
import {
  getShebeiList,
  postControlCommand,
  postControlCommandPause,
  postControlCommandStop,
  postControlCommandInterference,
  postControlCommandSimulation,
  getTongKangGR,
  getTongKangMN,
} from "@/api/api";

export default {
  name: "HomeView",
  data() {
    return {
      shebeiData: {},
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
        signalType:'',
        param:{
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
        }
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
  created() {
    this.getTongKangGR();
    this.getTongKangMN();
    this.getShebeiList();
  },
  mounted() {
    this.init();
  },
  methods: {
    optionSet(key) {
      this.signalType=key
      switch (key) {
        case 0:
          this.TZYSoption = this.DPoption.TZYSoption;
          this.XHDKoption = this.DPoption.XHDKoption;
          break;
        case 1:
          this.TZYSoption = this.TPoption.TZYSoption;
          this.XHDKoption = this.TPoption.XHDKoption;
          break;
        case 2:
          this.TZYSoption = this.KPoption.TZYSoption;
          this.XHDKoption = this.KPoption.XHDKoption;
          break;
      }
    },
    changPL() {},
    clickMN() {
      let params = {};
      console.log(this.MNformAdd, this.BoxleftList, "clickMNclickMN");
      this.BoxleftList[this.selectedIndex] = this.MNformAdd;
      switch (this.shebeiData.deviceType) {
        case "TK":
          params = {
            deviceId: this.shebeiData.deviceId,
            deviceType: this.shebeiData.deviceType,
            tkDisturbDto: this.BoxleftList,
          };
          break;
        case "LK":
          params = {
            deviceId: this.shebeiData.deviceId,
            deviceType: this.shebeiData.deviceType,
            lkDisturbDto: this.BoxleftList,
          };
      }
      this.postControlCommandSimulation(params)
      console.log(params, "clickMNclickMN");
    },
    BoxleftClick(params, index) {
      if(this.MNformAdd.no){

        this.BoxleftList[this.selectedIndex] = this.MNformAdd;
      }

      this.selectedIndex = index;
      this.MNformAdd = JSON.parse(JSON.stringify(params));
      this.optionSet(this.MNformAdd.signalType)

      this.Boxright = true;
    },
    TZFFChange(key) {
      switch (key) {
        case 0:
          return "AM";
        case 1:
          return "FM";
        case 2:
          return "FSK";
        case 3:
          return "BPSK";
        case 4:
          return "MSK";
        case 5:
          return "QPSK";
        case 6:
          return "8PSK";
        case 7:
          return "16QAM";
      }
    },
    //模拟模版name改变函数
    changeMNMBname() {
      this.MNoption.forEach((item) => {
        if (item.name == this.MNtopformAdd.name) {
          this.MNtopformAdd = JSON.parse(JSON.stringify(item));
          this.BoxleftList = JSON.parse(this.MNtopformAdd.param);
        }
      });
      this.Boxright=false
      this.MNformAdd={
        signalType:0,
        param:{
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
        }
      },
      console.log(this.MNtopformAdd, "changeMNMBname");
    },
    //干扰标签下发按钮
    commentGR() {
      let params = {};
      switch (this.shebeiData.deviceType) {
        case "TK":
          params = {
            deviceId: this.shebeiData.deviceId,
            deviceType: this.shebeiData.deviceType,
            tkDisturbDto: this.formAdd.disturbDto,
          };
          break;
        case "LK":
          params = {
            deviceId: this.shebeiData.deviceId,
            deviceType: this.shebeiData.deviceType,
            lkDisturbDto: this.formAdd.disturbDto,
          };
      }
      this.postControlCommandInterference(params);
    },

    //取消设备信号下发
    commentGRqvxiao() {
      this.xiafa = false;
    },

    //干扰模块名称改变函数
    changePL() {
      console.log(this.formAdd.name, this.GRoption, "changePL");
      this.GRoption.forEach((item) => {
        if (item.name == this.formAdd.name) {
          console.log(item, "itemresresresresGR");
          this.formAdd = JSON.parse(JSON.stringify(item));
        }
      });
    },
    //切换tab标签
    clickTab(key) {
      this.tab = key;
    },

    //弹框关闭
    handleClose() {
      this.dialogVisible = false;
    },

    //点击地图有点菜单选项
    clickTankuang(params) {
      let data = {
        deviceId: this.rightClickId,
      };
      console.log(this.shebeiData, "sheibeiDatasheibeiData");

      switch (params.label) {
        case "启动":
          this.postControlCommand(data);
          break;
        case "暂停/继续":
          if(this.runing){
            this.postControlCommandPause(data);
          }else{
            this.postControlCommand(data);
          }
          break;
        case "停止":
          this.postControlCommandStop(data);
          break;
        case "干扰命令":
          this.tab = 0;
          this.dialogVisible = true;
          // this.
          break;
        case "模拟命令":
          this.tab = 1;
          this.dialogVisible = true;
          break;
        case "侦查命令":
          break;
        case "当前工作参数":
          break;
      }
    },
    //添加设备标签
    addLabel(params) {
      let billboard = {
        image: require("@/assets/img/weizhibai.png"),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        width: 100,
        height: 100,
        scale: 0.5,
      };
      switch (params.state) {
        case "outline":
          billboard.image = require("@/assets/img/weizhihong.png");
          break;
        case "standby":
          billboard.image = require("@/assets/img/weizhilv.png");
          break;
        case "disturb":
          billboard.image = require("@/assets/img/weizhihuang.png");
          break;
        case "simulate":
          billboard.image = require("@/assets/img/weizhibai.png");
          break;
      }
      var entity = this.viewerBF.entities.add({
        name: params.deviceId,
        position: Cesium.Cartesian3.fromDegrees(
          params.longitude,
          params.latitude,
          10
        ),
        label: {
          //文字标签
          text: params.deviceName,
          font: "500 30px Helvetica", // 15pt monospace
          scale: 0.5,
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0, 0), //偏移量
          showBackground: true,
          backgroundColor: new Cesium.Color(0, 0, 0, 0),
        },
        billboard: billboard,
      });

      console.log(entity);
    },
    //获取设备列表
    getShebeiList() {
      getShebeiList()
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.data.list.length > 0) {
            this.shebeiList = res.data.list;
            this.shebeiList.forEach((item) => {
              this.addLabel(item);
              console.log(item, "getShebeiListgetShebeiList");
            });
          }
        });
    },
    //初始化地图
    init() {
      this.mapObject = new TCesium("my-map"); // 注意，这个my-map就是我们div的id
      this.viewerBF = this.mapObject.viewer; //将创建的地图资源进行赋值
      // 右键显示菜单
      new Cesium.ScreenSpaceEventHandler(
        this.viewerBF.scene.canvas
      ).setInputAction((e) => {
        console.log("点击右键", this.viewerBF.scene.pick(e.position), e);
        // e.preventDefault();
        if (this.viewerBF.scene.pick(e.position)) {
          this.tankuang = true;
          this.$refs.tankuang.style.top = e.position.y + "px";
          this.$refs.tankuang.style.left = e.position.x + "px";
          this.rightClickId = this.viewerBF.scene.pick(e.position).id._name;
          (this.formAdd = {
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
          }),
            this.shebeiList.forEach((item) => {
              if (item.deviceId == this.rightClickId) {
                this.shebeiData = item;
              }
            });
          // this.viewerBF.scene.screenSpaceCameraController.enableInputs = false;
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      // 左键隐藏菜单
      new Cesium.ScreenSpaceEventHandler(
        this.viewerBF.scene.canvas
      ).setInputAction(() => {
        console.log("点击左键");
        this.tankuang = false;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    },

    //鼠标右键事件监听
    EventListener_MouseRightClick(handler) {
      handler.setInputAction(function (evt) {
        //设置监听方法
        var scene = this.viewerBF.scene;
        let pick = scene.pick(evt.position);
        // cartesian = scene.pickPosition(evt.position);    // 获取鼠标位置
        // cameraHeight = Math.ceil(viewer.camera.positionCartographic.height);     // 获取相机高度

        if (pick == undefined) {
          console.log("空白处右键菜单");
          document.getElementById("hamburger_example").style.display = ""; //显示div
          //调用页面菜单
          // $(document).ready(function () {
          //     $("body").gizmoMenu({
          //     menu: "gizmoBurger",
          //     });
          // });
        } else {
          console.log("实体处右键菜单，实体ID为：", pick.id.id);
          document.getElementById("modelRightMenu").innerHTML =
            "XX" + pick.id.id.substring(0, 6);
          //显示模型菜单
          document.getElementById("gizmo").style.display = ""; //显示div
          //调用模型菜单
          // $(document).ready(function () {
          //     // MODEL的菜单
          //     $("body").gizmoMenu({
          //     menu: "gizmoDropDown",
          //     });
          // });
          this.viewerBF.trackedEntity = undefined;
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },

    // /**
    //  * 相机视角移动函数 - by wjw
    //  * @param lon 目标经度
    //  * @param lat 目标纬度
    //  * @param height  相机高度
    //  * @param heading  航向角
    //  * @param pitch  俯仰角
    //  * @param roll   距中心的距离，以米为单位
    //  * @param duration  飞行时间
    //  */
    flyToTarget(lon, lat, height, heading, pitch, roll, duration) {
      this.viewerBF.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height), // 经纬度以及相机离地高度
        orientation: {
          heading: Cesium.Math.toRadians(heading), // 航向角
          pitch: Cesium.Math.toRadians(pitch), // 俯仰角
          roll: roll, // 距中心的距离，以米为单位
        },
        duration: duration, // 飞行时间
      });

      // setTimeout(() => {
      //   this.addBoundaryWall();
      // }, 2000);
    },

    //获取渐变色
    getColorRamp(val) {
      if (val == null) {
        val = {
          1: "#2CE5BA",
          0.9: "#2CE5BA",
          0.8: "#2CE5BA2F",
          0.3: "#2CE5BA",
        };
      }

      var ramp = document.createElement("canvas");
      ramp.width = 1;
      ramp.height = 100;
      var ctx = ramp.getContext("2d");
      var grd = ctx.createLinearGradient(0, 0, 0, 100);

      for (var key in val) {
        grd.addColorStop(1 - Number(key), val[key]);
      }
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 1, 100);
      return ramp;
    },
    // 多维数组转一维数组
    flatten(arr) {
      return [].concat(
        ...arr.map((x) => (Array.isArray(x) ? this.flatten(x) : x))
      );
    },
    //添加curveWall立体墙
    addBoundaryWall() {
      // 绘制墙体的数据，将多维数组转成一维数组
      let coordinates = this.flatten(
        geojson.features[0].geometry.coordinates[0]
      );

      // 因为地图影像数据是贴地的，所以给个墙的高度设为负数则会有厚度的感觉
      // 墙体最高为0
      let maximumHeights = new Array(coordinates.length / 2).fill(6000);
      // 墙体最低为-1600
      let minimumHeights = new Array(coordinates.length / 2).fill(0);
      let position = Cesium.Cartesian3.fromDegreesArray(coordinates);

      const wallEntity = this.viewerBF.entities.add({
        id: "wall",
        wall: {
          positions: position,
          maximumHeights: maximumHeights,
          minimumHeights: minimumHeights,

          // material: Cesium.Color.fromCssColorString("rgba(0,255,255,0.4)")
          material: new Cesium.ImageMaterialProperty({
            transparent: true, //设置透明
            image: this.getColorRamp(), //Canvas
          }),
          outline: false, // 关闭默认边框
        },
      });
      this.viewerBF.zoomTo(wallEntity);
    },

    //干扰模块
    getTongKangGR() {
      getTongKangGR()
        .then((res) => {
          console.log(res, "resresresresGR");
          return res.data;
        })
        .then((res) => {
          this.GRoption = res.data.list;
        });
    },
    //模拟模版
    getTongKangMN() {
      getTongKangMN()
        .then((res) => {
          console.log(res, "resresresresMN");
          return res.data;
        })
        .then((res) => {
          this.MNoption = res.data.list;
        });
    },

    //下发启动命令
    postControlCommand(params) {
      postControlCommand(params).then((res) => {
        console.log(res, "res");
        this.runing=true
      });
    },
    //下发暂停命令
    postControlCommandPause(params) {
      postControlCommandPause(params).then((res) => {
        console.log(res, "res");
      });
    },
    //下发停止命令
    postControlCommandStop(params) {
      postControlCommandStop(params).then((res) => {
        console.log(res, "res");
        this.runing=false
      });
    },
    //下发干扰命令
    postControlCommandInterference(params) {
      postControlCommandInterference(params).then((res) => {
        console.log(res, "res");
        this.xiafa = false;
      });
    },
    //下发模拟命令
    postControlCommandSimulation(params) {
      postControlCommandSimulation(params).then((res) => {
        console.log(res, "res");
      });
    },
  },
};
</script>

<style lang='less' scoped>
::v-deep .el-dialog .el-dialog__header {
  border: 0;
  padding: 0;
}
.my-dialog {
  // z-index: 2001 !important;
  background: transparent;
  height: 80%;
}
.map-main {
  width: 100%;
  height: 100%;
  position: relative;
}
#my-map {
  width: 100%;
  height: 100%;
  /* background-color: black; */
  background-color: transparent;
}
.tankuang {
  width: 163px;
  height: 274px;
  position: fixed;
  background: #02292066;
  border: 1px solid #ffffff99;
  border-radius: 10px;
  /* top: 50px; */
  /* right: 50px; */
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 18px;
  div {
    width: 80%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    border-top: 1px solid #ffffff99;
    cursor: pointer;
  }
}
.tabChange {
  width: 100%;
  height: 100%;
  @include position(absolute, 10, 580px, static, static, static);
  @include flex(column, center, center);
  z-index: 8000 !important;
  .tabChangeBox {
    display: flex;
    justify-content: space-between;
  }
  .nav {
    display: flex;
    width: 600px;
    align-items: flex-end;
    .item {
      flex: 0.8;
      width: 216px;
      height: 60px;
      background: #15231e;
      border-radius: 5px 5px 0 0;
      position: relative;
      list-style: none;
      margin: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #fff;
      text-align: left;
      border-radius: 0 15px 0 0;
      cursor: pointer;
    }
    .item:before {
      content: "";
      display: block;
      width: 26px;
      height: 100%;
      background: #15231e;
      position: absolute;
      right: -13px;
      top: 0;
      z-index: 10;
      border-radius: 0 15px 0 0;
      transform: skew(20deg);
      border-bottom: 1px solid #00644c;
      border-right: 1px solid #00644c;
    }
    .active {
      flex: 1;
      height: 60px;
      background: #00644c;
      z-index: 10;
      transform: translateY(1px);
      border-radius: 0 15px 0 0;
    }
    .active::before {
      content: "";
      display: block;
      width: 26px;
      height: 100%;
      background: #00644c;
      position: absolute;
      right: -13px;
      top: 0;
      z-index: 10;
      border-radius: 0 15px 0 0;
      transform: skew(20deg);
      border-bottom: 1px solid #00644c;
      border-right: 1px solid #00644c;
    }
  }

  .tab-show {
    background-color: #15231e;
    // border-radius: 16px;
    border: 1px solid #00644c;
    width: 100%;
    height: calc(100% - 70px);
    // padding: 70px;

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
      display: flex;
      flex-flow: column;
      align-items: flex-start;
      // padding: 20px 30px;
      border-bottom: 1px solid #00644c;
      .el-form--inline {
        width: 100%;
      }
      .el-form-item {
        width: 30%;
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
        // .xiafabutton{
        //   background: transparent;
        // }
        .xifabutton {
          background: transparent !important;
          border: 1px solid #ffffff49;
        }
      }
    }
  }
}

.XHMNinputBox {
  width: 60%;
  padding: 0px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  // height: 84px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  .el-form--inline {
    width: 100%;
  }
  ::v-deep .el-form-item {
    margin: 0;
    width: 210px;
    background: #ffffff26;
    .el-form-item__content {
      width: calc(100% - 70px) !important;
    }
  }
  .el-button {
    border: 1px solid #ffffff4c;
  }
}
.XHMNmainBox {
  width: 100%;
  height: 548px;
  border-top: 1px solid #1c735e;
  padding: 30px 20px;
  display: flex;
  .XHMNmainBoxleft {
    width: 35%;
    height: 100%;
    color: #fff;
    overflow: auto;
    border-right: 1px solid #ffffff4c;
    .XHMNBoxleftmain.selected {
      background: #1c735e;
    }
    .XHMNBoxleftmain {
      width: 470px;
      height: 78px;
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
        // text-align: center;
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
      padding-left: 50px;
    }

    ::v-deep .el-form-item {
      width: 45% !important;
      background: #ffffff26;
      box-sizing: border-box;
      .el-form-item__label {
        width: 150px !important;
      }
      .el-form-item__content {
        width: calc(100% - 150px) !important;
      }
    }
    .PinLvJin {
      width: 100%;
      flex-grow: 1;
      padding-left: 50px;
      max-height: 50%;
      box-sizing: border-box;
      .pinlvjiMain {
        background: #ffffff26;
        width: 100%;
        height: 100%;
        // height: calc(100% - 40px);
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
::v-deep .el-dialog {
  background: transparent !important;
  border: none;
}
::v-deep .el-form-item {
  background: #ffffff26;
}
::v-deep .el-form-item__content {
  width: calc(100% - 120px);
}
</style>

